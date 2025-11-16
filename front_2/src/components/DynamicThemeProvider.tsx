import { createContext, useContext, useState, ReactNode } from "react";

/*
  This provider no longer modifies global CSS variables.
  It ONLY extracts colors and stores them in React state.
  The Upload page will decide how to apply them.
*/

interface DynamicThemeContextType {
  dominantColors: string[];   // extracted colors
  isDynamic: boolean;         // dynamic mode on/off
  setAlbumCover: (url: string | null) => void;
  toggleDynamic: () => void;
}

const DynamicThemeContext = createContext<DynamicThemeContextType>({
  dominantColors: [],
  isDynamic: false,
  setAlbumCover: () => {},
  toggleDynamic: () => {},
});

export const useDynamicTheme = () => useContext(DynamicThemeContext);

// A simple fallback palette if extraction fails
const FALLBACK_COLORS = [
  "220 70% 55%",
  "280 65% 60%",
  "190 60% 45%",
];

// Very lightweight color extraction (local use only)
async function extractColors(url: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return resolve(FALLBACK_COLORS);

        canvas.width = 60;
        canvas.height = 60;
        ctx.drawImage(img, 0, 0, 60, 60);

        const { data } = ctx.getImageData(0, 0, 60, 60);
        const map = new Map<string, number>();

        // Loop through pixels, take one every few for simplicity
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Skip overly bright or dark pixels
          if (r + g + b < 70 || r + g + b > 700) continue;

          const key = `${r},${g},${b}`;
          map.set(key, (map.get(key) || 0) + 1);
        }

        const top = [...map.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([rgb]) => {
            const [r, g, b] = rgb.split(",").map(Number);
            return rgbToHsl(r, g, b);
          });

        resolve(top.length ? top : FALLBACK_COLORS);
      } catch {
        resolve(FALLBACK_COLORS);
      }
    };

    img.onerror = () => resolve(FALLBACK_COLORS);
    img.src = url;
  });
}

// Helper: convert RGB → HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function DynamicThemeProvider({ children }: { children: ReactNode }) {
  const [dominantColors, setDominantColors] = useState<string[]>(FALLBACK_COLORS);
  const [isDynamic, setIsDynamic] = useState(true);

  const setAlbumCover = async (url: string | null) => {
    if (!url) return;

    // Extract colors and save locally
    const colors = await extractColors(url);
    setDominantColors(colors);
  };

  const toggleDynamic = () => {
    setIsDynamic((v) => !v);
  };

  return (
    <DynamicThemeContext.Provider
      value={{
        dominantColors,
        isDynamic,
        setAlbumCover,
        toggleDynamic,
      }}
    >
      {children}
    </DynamicThemeContext.Provider>
  );
}
