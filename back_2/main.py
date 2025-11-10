import os
import uuid
import shutil
import subprocess
from typing import List, Dict, Any

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import logging, traceback
logging.getLogger("uvicorn.error").setLevel(logging.DEBUG)
logging.getLogger("uvicorn.access").setLevel(logging.DEBUG)


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("versemotion")


# ====== CONFIG ======
FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
]
TMP_DIR = "/tmp/versemotion"
os.makedirs(TMP_DIR, exist_ok=True)

# WhisperModel: tiny/base/small/medium/large-v3
MODEL_SIZE = os.environ.get("WHISPER_MODEL", "small")

# Detect device (defaults to CPU if no GPU)
DEVICE = os.environ.get("WHISPER_DEVICE", "cpu")

# ====== APP ======
app = FastAPI(title="VerseMotion Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy-load model on first request
_model: WhisperModel | None = None
def get_model() -> WhisperModel:
    global _model
    if _model is None:
        print(f"[VerseMotion] Loading Whisper model: {MODEL_SIZE} on {DEVICE}")
        _model = WhisperModel(
            MODEL_SIZE,
            device=DEVICE,
            compute_type="int8" if DEVICE == "cpu" else "float16"
        )
    return _model


@app.get("/health")
def health():
    return {"ok": True}


def _to_wav_16k_mono(in_path: str, out_path: str) -> None:
    """
    Convert any audio input into 16kHz mono WAV using ffmpeg.
    This ensures stable transcription.
    """
    cmd = [
        "ffmpeg",
        "-y",
        "-i", in_path,
        "-ar", "16000",
        "-ac", "1",
        out_path
    ]
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=400, detail=f"ffmpeg failed to convert file: {e}")


def _merge_tiny_words(words: List[Dict[str, Any]], min_dur: float = 0.09) -> List[Dict[str, Any]]:
    """
    Merge ultra-short words (< ~90ms) with the previous word.
    Prevents 'blinking' words that disappear instantly.
    """
    if not words:
        return words
    merged = [words[0]]
    for w in words[1:]:
        prev = merged[-1]
        dur = (w["e"] - w["s"]) if (w["e"] and w["s"]) else 0
        if dur < min_dur and (w["s"] - prev["e"]) < 0.06:
            prev["t"] = (prev["t"] + " " + w["t"]).strip()
            prev["e"] = max(prev["e"], w["e"])
        else:
            merged.append(w)
    return merged


def _group_words_into_lines(
    words: List[Dict[str, Any]],
    max_gap: float = 0.8,     # more relaxed gap (was 0.55)
    max_chars: int = 64       # allow longer lines (was 48)
) -> List[Dict[str, Any]]:
    """
    Group words into 'lines' based on gaps and max length.
    This produces karaoke-style chunks.
    """
    lines = []
    if not words:
        return lines

    cur = [words[0]]
    for prev, w in zip(words, words[1:]):
        gap = max(0.0, w["s"] - prev["e"])
        length_soft_limit = sum(len(x["t"]) + 1 for x in cur) > max_chars
        if gap > max_gap or length_soft_limit:
            lines.append(cur)
            cur = [w]
        else:
            cur.append(w)
    if cur:
        lines.append(cur)

    shaped = []
    for i, line_words in enumerate(lines, 1):
        text = " ".join(w["t"] for w in line_words).strip()
        shaped.append({
            "id": f"l{i}",
            "start": float(line_words[0]["s"]),
            "end": float(line_words[-1]["e"]),
            "text": text,
            "words": line_words
        })
    return shaped


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    try:
        if not file.filename:
            logger.warning("Upload failed: no filename provided")
            raise HTTPException(status_code=400, detail="No file name provided.")
        if not any(file.filename.lower().endswith(ext) for ext in (".mp3", ".wav", ".m4a", ".ogg")):
            logger.warning(f"Upload failed: unsupported file type {file.filename}")
            raise HTTPException(status_code=415, detail="Unsupported file type. Use MP3/WAV/M4A/OGG.")

        logger.info(f"Received file: {file.filename}")

        jid = str(uuid.uuid4())
        raw_path = os.path.join(TMP_DIR, f"{jid}_{file.filename}")
        wav_path = os.path.join(TMP_DIR, f"{jid}.wav")

        data = await file.read()
        with open(raw_path, "wb") as f:
            f.write(data)
        logger.info(f"Saved raw file → {raw_path}")

        # Convert input → 16kHz mono wav
        logger.info(f"Converting {raw_path} → {wav_path} using ffmpeg")
        _to_wav_16k_mono(raw_path, wav_path)

        # ===== Transcribe =====
        model = get_model()
        logger.info("Starting transcription...")
        segments, info = model.transcribe(
            wav_path,
            vad_filter=False,
            word_timestamps=True,
            condition_on_previous_text=False,
            temperature=[0.0, 0.2, 0.4],
            compression_ratio_threshold=2.4,
        )
        logger.info(f"Transcription finished. Language={info.language}, Duration={info.duration:.2f}s")

        words: List[Dict[str, Any]] = []
        for seg in segments:
            if seg.words:
                for w in seg.words:
                    token = (w.word or "").strip()
                    if token:
                        words.append({"t": token, "s": float(w.start), "e": float(w.end)})

        logger.info(f"Collected {len(words)} words")

        if not words:
            raise HTTPException(status_code=422, detail="No speech detected or transcription failed.")

        words = _merge_tiny_words(words)
        lines = _group_words_into_lines(words)
        duration = float(info.duration) if info and info.duration else float(lines[-1]["end"])

        # Clean temp files
        try:
            os.remove(raw_path)
            os.remove(wav_path)
        except Exception as e:
            logger.warning(f"Could not remove temp files: {e}")

        logger.info(f"Returning {len(lines)} lines, duration={duration:.2f}s")
        return {"duration": duration, "lines": lines}

    except Exception as e:
        logger.error(f"Transcription error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")

    # Convert input → 16kHz mono wav
    logger.info(f"Converting {raw_path} → {wav_path} using ffmpeg")
    _to_wav_16k_mono(raw_path, wav_path)

    # ===== Transcribe =====
    model = get_model()
    logger.info("Starting transcription...")
    segments, info = model.transcribe(
        wav_path,
        vad_filter=False,
        word_timestamps=True,
        condition_on_previous_text=False,
        temperature=[0.0, 0.2, 0.4],
        compression_ratio_threshold=2.4,
    )
    logger.info(f"Transcription finished. Language={info.language}, Duration={info.duration:.2f}s")

    words: List[Dict[str, Any]] = []
    for seg in segments:
        logger.debug(f"Segment {seg.start:.2f}-{seg.end:.2f}: {seg.text}")
        if seg.words:
            for w in seg.words:
                token = (w.word or "").strip()
                if not token:
                    continue
                words.append({"t": token, "s": float(w.start), "e": float(w.end)})

    logger.info(f"Collected {len(words)} words from transcription")

    # Merge ultra-short words
    words = _merge_tiny_words(words)
    logger.info(f"Words after merging: {len(words)}")

    if not words:
        logger.error("No speech detected or transcription failed")
        try:
            os.remove(raw_path); os.remove(wav_path)
        except Exception:
            pass
        raise HTTPException(status_code=422, detail="No speech detected or transcription failed.")

    # Group into karaoke lines
    lines = _group_words_into_lines(words)
    logger.info(f"Generated {len(lines)} lyric lines")

    # Duration fallback
    duration = float(info.duration) if info and info.duration else float(lines[-1]["end"])
    logger.info(f"Final duration used: {duration:.2f}s")

    # Clean temp files
    try:
        os.remove(raw_path); os.remove(wav_path)
        logger.debug("Temporary files cleaned up")
    except Exception as e:
        logger.warning(f"Could not remove temp files: {e}")

    logger.info("Returning response to client")
    return {
        "duration": duration,
        "lines": lines
    }

