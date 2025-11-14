import { useState, useRef, useEffect } from 'react';

interface TextPressureProps {
  text: string;
  flex?: boolean;
  alpha?: boolean;
  stroke?: boolean;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  textColor?: string;
  strokeColor?: string;
  minFontSize?: number;
  maxFontSize?: number;
  className?: string;
  style?: React.CSSProperties;
  neighborEffect?: boolean;
  neighborStrength?: number;
}

export function TextPressure({
  text,
  flex = true,
  alpha = false,
  stroke = false,
  width = true,
  weight = true,
  italic = true,
  textColor = '#ffffff',
  strokeColor = '#ff0000',
  minFontSize = 36,
  maxFontSize = 72,
  className = '',
  style = {},
  neighborEffect = false,
  neighborStrength = 0.6
}: TextPressureProps) {
  const [pressure, setPressure] = useState(0);
  const [neighborPressure, setNeighborPressure] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      const maxDistance = Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) / 2;
      const normalizedDistance = Math.max(0, 1 - distance / maxDistance);
      
      setPressure(normalizedDistance);

      // Neighbor effect - check nearby elements
      if (neighborEffect && element.parentElement) {
        const siblings = Array.from(element.parentElement.children) as HTMLElement[];
        const currentIndex = siblings.indexOf(element);
        
        siblings.forEach((sibling, index) => {
          if (sibling !== element && Math.abs(index - currentIndex) <= 2) {
            const neighborDistance = Math.abs(index - currentIndex);
            const neighborIntensity = Math.max(0, normalizedDistance * neighborStrength * (1 - neighborDistance * 0.3));
            
            // Trigger neighbor effect
            const event = new CustomEvent('neighborPressure', { 
              detail: { pressure: neighborIntensity } 
            });
            sibling.dispatchEvent(event);
          }
        });
      }
    };

    const handleMouseLeave = () => {
      setPressure(0);
      setNeighborPressure(0);
      
      // Clear neighbor effects
      if (neighborEffect && element.parentElement) {
        const siblings = Array.from(element.parentElement.children) as HTMLElement[];
        siblings.forEach((sibling) => {
          if (sibling !== element) {
            const event = new CustomEvent('neighborPressure', { 
              detail: { pressure: 0 } 
            });
            sibling.dispatchEvent(event);
          }
        });
      }
    };

    const handleNeighborPressure = (e: CustomEvent) => {
      setNeighborPressure(e.detail.pressure);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('neighborPressure', handleNeighborPressure as EventListener);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('neighborPressure', handleNeighborPressure as EventListener);
    };
  }, [neighborEffect, neighborStrength]);

  const getFontVariationSettings = () => {
    const settings = [];
    const totalPressure = Math.max(pressure, neighborPressure);
    
    if (weight) {
      const fontWeight = 400 + (totalPressure * 500); // 400 to 900
      settings.push(`'wght' ${fontWeight}`);
    }
    
    if (width) {
      const fontWidth = 75 + (totalPressure * 50); // 75 to 125
      settings.push(`'wdth' ${fontWidth}`);
    }
    
    if (italic) {
      const fontItalic = totalPressure * 15; // 0 to 15 degrees
      settings.push(`'ital' ${fontItalic}`);
    }

    return settings.join(', ');
  };

  const totalPressure = Math.max(pressure, neighborPressure);
  
  const dynamicStyle: React.CSSProperties = {
    ...style,
    color: textColor,
    fontSize: flex ? `${minFontSize + (totalPressure * (maxFontSize - minFontSize))}px` : undefined,
    fontVariationSettings: getFontVariationSettings(),
    opacity: alpha ? 0.3 + (totalPressure * 0.7) : 1,
    WebkitTextStroke: stroke ? `${totalPressure * 2}px ${strokeColor}` : undefined,
    transition: 'all 0.15s ease-out',
    cursor: 'default',
    display: 'inline-block',
    userSelect: 'none',
    transformOrigin: 'center',
    transform: `scale(${1 + totalPressure * 0.08}) translateY(${-totalPressure * 1}px)`,

    filter:undefined,
  };

  return (
    <span
      ref={elementRef}
      className={className}
      style={dynamicStyle}
    >
      {text}
    </span>
  );
}