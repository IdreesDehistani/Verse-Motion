import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

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

interface DynamicThemeProviderProps {
  children: ReactNode;
}

// Color extraction utility using Canvas API
const extractDominantColors = (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    // Try without crossOrigin first for local/uploaded files
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.warn('Could not get canvas context');
          resolve([]);
          return;
        }

        // Scale down for performance
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        
        ctx.drawImage(img, 0, 0, size, size);
        
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Sample colors from the image
        const colorMap = new Map<string, number>();
        
        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Skip transparent and very dark/light pixels
          if (a < 128 || (r + g + b) < 50 || (r + g + b) > 700) continue;
          
          // Quantize colors to reduce noise
          const qR = Math.floor(r / 32) * 32;
          const qG = Math.floor(g / 32) * 32;
          const qB = Math.floor(b / 32) * 32;
          
          const color = `${qR},${qG},${qB}`;
          colorMap.set(color, (colorMap.get(color) || 0) + 1);
        }
        
        // Get most frequent colors
        const sortedColors = Array.from(colorMap.entries())
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            // Convert to HSL for better theme integration
            const hsl = rgbToHsl(r, g, b);
            return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;
          });
        
        console.log('Successfully extracted colors:', sortedColors);
        resolve(sortedColors);
      } catch (error) {
        console.warn('Could not extract colors from image:', error);
        resolve([]);
      }
    };
    
    img.onerror = (e) => {
      console.warn('Image failed to load:', e);
      resolve([]);
    };
    
    // Set src after setting up event handlers
    img.src = imageUrl;
  });
};

// RGB to HSL conversion
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
};

export function DynamicThemeProvider({ children }: DynamicThemeProviderProps) {
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [isDynamic, setIsDynamic] = useState(true); // Enable by default
  const [albumCover, setAlbumCover] = useState<string | null>(null);

  // Extract colors when album cover changes
  useEffect(() => {
    if (albumCover && isDynamic) {
      console.log('Extracting colors from:', albumCover);
      extractDominantColors(albumCover).then(colors => {
        console.log('Extracted colors:', colors);
        setDominantColors(colors);
        applyDynamicTheme(colors);
      }).catch(error => {
        console.warn('Failed to extract colors:', error);
      });
    } else if (!isDynamic) {
      // Reset to original theme
      resetTheme();
    }
  }, [albumCover, isDynamic]);

  const applyDynamicTheme = (colors: string[]) => {
    if (colors.length === 0) {
      console.warn('No colors to apply');
      return;
    }
    
    console.log('Applying dynamic theme with colors:', colors);
    const root = document.documentElement;
    
    // Use extracted colors for theme variables
    if (colors[0]) {
      root.style.setProperty('--primary', colors[0]);
    }
    if (colors[1]) {
      root.style.setProperty('--accent', colors[1]);
    }
    if (colors[2]) {
      root.style.setProperty('--secondary', colors[2]);
    }
    
    // Create gradient backgrounds
    if (colors.length >= 2) {
      const gradient = `linear-gradient(135deg, hsl(${colors[0]}) 0%, hsl(${colors[1]}) 50%, hsl(${colors[2] || colors[0]}) 100%)`;
      root.style.setProperty('--gradient-primary', gradient);
      root.style.setProperty('--gradient-background', gradient);
    }
    
    // Add dynamic glow effects
    root.style.setProperty('--shadow-glow', `0 10px 30px -10px hsl(${colors[0]} / 0.4)`);
  };

  const resetTheme = () => {
    const root = document.documentElement;
    
    // Reset to original CSS custom properties
    root.style.removeProperty('--primary');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--secondary');
    root.style.removeProperty('--gradient-primary');
    root.style.removeProperty('--shadow-glow');
  };

  const toggleDynamic = () => {
    setIsDynamic(!isDynamic);
  };

  const contextValue: DynamicThemeContextType = {
    dominantColors,
    isDynamic,
    setAlbumCover: (url) => setAlbumCover(url),
    toggleDynamic
  };

  return (
    <DynamicThemeContext.Provider value={contextValue}>
      {children}
    </DynamicThemeContext.Provider>
  );
}