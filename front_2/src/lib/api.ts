// Minimal client for VerseMotion backend.
// Maps backend payload to LyricDisplay-friendly structure.

export type BackendWord = { t: string; s: number; e: number };
export type BackendLine = {
  id: string;
  start: number;
  end: number;
  text: string;
  words: BackendWord[];
};
export type UploadResp = { duration: number; lines: BackendLine[] };

// Read base URL from env for flexibility (dev/prod).
const BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

/**
 * Upload an audio file to FastAPI /upload.
 * Returns duration and lines with word timestamps.
 */
export async function uploadAudioToBackend(file: File): Promise<UploadResp> {
  const fd = new FormData();
  fd.append("file", file);

  const r = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
  if (!r.ok) {
    // Surface backend error body for easier debugging.
    const msg = await r.text();
    throw new Error(`Upload failed: ${msg}`);
  }
  return r.json();
}

/**
 * Map backend "lines" to LyricDisplay props:
 * - text           (same)
 * - startTime/endTime (from start/end)
 * - words[].text/s/e (from t/s/e)
 */
export function mapToLyricDisplay(lines: BackendLine[]) {
  return lines.map((l) => ({
    text: l.text,
    startTime: l.start,
    endTime: l.end,
    words:
      l.words?.map((w) => ({
        text: w.t,
        startTime: w.s,
        endTime: w.e,
      })) ?? [],
  }));
}
