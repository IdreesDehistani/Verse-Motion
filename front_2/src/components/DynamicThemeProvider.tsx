import { useEffect, useState, createContext, useContext, ReactNode, useRef } from 'react';

interface DynamicThemeContextType {
  dominantColors: string[];
  isDynamic: boolean;
  setAlbumCover: (url: string | null) => void;
  toggleDynamic: () => void;
}

const DynamicThemeContext = createContext<DynamicThemeContextType>({
  dominantColors: [],
  isDynamic: false,
  setAlbumCover: () => {},
  toggleDynamic: () => {}
});

export const useDynamicTheme = () => useContext(DynamicThemeContext);

// Fallback colors if extraction fails
const FALLBACK_COLORS = [
  "220 80% 50%",
  "280 70% 60%",
  "180 60% 45%",
];

interface ProviderProps {
  children: ReactNode;
}

// --- COLOR EXTRACTION ---------------------------------------------------

const extractDominantColors = (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Prevent canvas CORS errors

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(FALLBACK_COLORS);
          return;
        }

        const size = 80;
        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        const map = new Map<string, number>();

        for (let i = 0; i < data.length; i += 20) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 120) continue;
          if (r + g + b < 60) continue;
          if (r + g + b > 700) continue;

          const qR = Math.floor(r / 32) * 32;
          const qG = Math.floor(g / 32) * 32;
          const qB = Math.floor(b / 32) * 32;

          const key = `${qR},${qG},${qB}`;
          map.set(key, (map.get(key) || 0) + 1);
        }

        const colors = Array.from(map.entries())
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([c]) => {
            const [r, g, b] = c.split(",").map(Number);
            const hsl = rgbToHsl(r, g, b);
            return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;
          });

        resolve(colors.length > 0 ? colors : FALLBACK_COLORS);
      } catch {
        resolve(FALLBACK_COLORS);
      }
    };

    img.onerror = () => resolve(FALLBACK_COLORS);
    img.src = imageUrl;
  });
};

// RGB → HSL
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
  return { h, s: s * 100, l: l * 100 };
}

// --- PROVIDER -----------------------------------------------------------

export function DynamicThemeProvider({ children }: ProviderProps) {
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [albumCover, setAlbumCover] = useState<string | null>(null);
  const [isDynamic, setIsDynamic] = useState(false);

  // Save original Tailwind theme
  const originalTheme = useRef<Record<string, string>>({});

  const saveOriginalTheme = () => {
    const root = document.documentElement;
    originalTheme.current = {
      primary: getComputedStyle(root).getPropertyValue("--primary"),
      accent: getComputedStyle(root).getPropertyValue("--accent"),
      secondary: getComputedStyle(root).getPropertyValue("--secondary"),
      gradient: getComputedStyle(root).getPropertyValue("--gradient-primary")
    };
  };

  useEffect(() => {
    if (!albumCover) return;

    extractDominantColors(albumCover).then((colors) => {
      setDominantColors(colors);

      if (isDynamic) {
        saveOriginalTheme();
        applyTheme(colors);
      }
    });
  }, [albumCover]);

  const applyTheme = (colors: string[]) => {
    const root = document.documentElement;

    const [c1, c2, c3] = [
      colors[0] || FALLBACK_COLORS[0],
      colors[1] || FALLBACK_COLORS[1],
      colors[2] || colors[0] || FALLBACK_COLORS[2],
    ];

    root.style.setProperty("--primary", c1);
    root.style.setProperty("--accent", c2);
    root.style.setProperty("--secondary", c3);

    const gradient = `linear-gradient(135deg, hsl(${c1}) 0%, hsl(${c2}) 50%, hsl(${c3}) 100%)`;
    root.style.setProperty("--gradient-primary", gradient);
    root.style.setProperty("--gradient-background", gradient);

    root.style.setProperty("--shadow-glow", `0 10px 30px -10px hsl(${c1} / 0.4)`);
  };

  const resetTheme = () => {
    const root = document.documentElement;
    Object.entries(originalTheme.current).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const toggleDynamic = () => {
    setIsDynamic((prev) => {
      const next = !prev;

      if (next && albumCover) applyTheme(dominantColors);
      else resetTheme();

      return next;
    });
  };

  return (
    <DynamicThemeContext.Provider
      value={{
        dominantColors,
        isDynamic,
        setAlbumCover,
        toggleDynamic
      }}
    >
      {children}
    </DynamicThemeContext.Provider>
  );
}
