import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Palette, Type, Sparkles, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface LyricSettings {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  glowIntensity: number;
  highlightColor: string;
  lineSpacing?: number;
  letterSpacing?: number;
  textShadow?: number;
  animationSpeed?: number;
  blurEffect?: number;
}

interface LyricCustomizerProps {
  settings: LyricSettings;
  onSettingsChange: (settings: LyricSettings) => void;
}

export function LyricCustomizer({ settings, onSettingsChange }: LyricCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // ----------------------------------------------------
  // PREVENT RERENDERS — memoized lists
  // ----------------------------------------------------
  const fontOptions = useMemo(() => [
    { value: 'Space Grotesk', label: 'Space Grotesk', category: 'Modern' },
    { value: 'Epilogue', label: 'Epilogue', category: 'Headline' },
    { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', category: 'Clean' },
    { value: 'Manrope', label: 'Manrope', category: 'Modern' },
    { value: 'DM Sans', label: 'DM Sans', category: 'Clean' },
    { value: 'Instrument Sans', label: 'Instrument Sans', category: 'Tech' },
    { value: 'Playfair Display', label: 'Playfair Display', category: 'Elegant' },
    { value: 'Montserrat', label: 'Montserrat', category: 'Classic' },
    { value: 'Inter', label: 'Inter', category: 'Default' }
  ], []);

  const colorOptions = useMemo(() => [
    { value: 'hsl(var(--foreground))', label: 'Default' },
    { value: 'hsl(220 91% 60%)', label: 'Ocean Blue' },
    { value: 'hsl(271 91% 65%)', label: 'Electric Purple' },
    { value: 'hsl(348 83% 47%)', label: 'Ruby Red' },
    { value: 'hsl(168 76% 36%)', label: 'Emerald Green' },
    { value: 'hsl(31 81% 56%)', label: 'Sunset Orange' },
    { value: 'hsl(280 100% 70%)', label: 'Hot Pink' },
    { value: 'hsl(193 95% 68%)', label: 'Neon Cyan' },
    { value: 'hsl(49 100% 50%)', label: 'Electric Yellow' }
  ], []);

  const highlightOptions = useMemo(() => [
    { value: 'hsl(var(--lyric-highlight))', label: 'Default' },
    { value: 'hsl(220 91% 60%)', label: 'Ocean Glow' },
    { value: 'hsl(281 91% 65%)', label: 'Cosmic Glow' },
    { value: 'hsl(348 83% 47%)', label: 'Fire Glow' },
    { value: 'hsl(168 76% 36%)', label: 'Forest Glow' }
  ], []);

  // ----------------------------------------------------
  // Update handler — memoized for performance
  // ----------------------------------------------------
  const updateSetting = useCallback(<K extends keyof LyricSettings>(key: K, value: LyricSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  }, [settings, onSettingsChange]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="backdrop-blur-sm bg-card/80 border-border/50 hover:bg-card/90 transition-all duration-300 shadow-md"
          >
            <Settings className="mr-2 h-4 w-4" />
            Customize Lyrics
          </Button>
        </PopoverTrigger>

        <PopoverContent 
          className="w-96 p-0 backdrop-blur-xl bg-card/95 border-border/50 shadow-2xl animate-in fade-in slide-in-from-right-4"
          align="end"
        >
          <ScrollArea className="h-96">
            <div className="p-6 space-y-6">

              {/* TITLE */}
              <div className="flex items-center space-x-2 pb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Lyric Style</h3>
              </div>

              {/* TYPOGRAPHY */}
              <div className="space-y-5">

                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Typography</label>
                </div>

                <div className="pl-6 space-y-4">

                  {/* FONT FAMILY */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Font Family
                    </label>
                    <Select value={settings.fontFamily} onValueChange={(v) => updateSetting('fontFamily', v)}>
                      <SelectTrigger className="w-full bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {fontOptions.map((font) => (
                          <SelectItem key={font.label} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* FONT SIZE */}
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(v) => updateSetting('fontSize', v[0])}
                    min={60}
                    max={150}
                    step={5}
                  />

                  {/* LINE SPACING */}
                  <Slider
                    value={[settings.lineSpacing || 1.5]}
                    onValueChange={(v) => updateSetting('lineSpacing', v[0])}
                    min={1}
                    max={2.5}
                    step={0.05}
                  />

                  {/* LETTER SPACING */}
                  <Slider
                    value={[settings.letterSpacing || 0]}
                    onValueChange={(v) => updateSetting('letterSpacing', v[0])}
                    min={-1}
                    max={3}
                    step={0.25}
                  />

                </div>
              </div>

              <Separator />

              {/* COLORS */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Colors</label>
                </div>

                <div className="pl-6 space-y-4">

                  {/* TEXT COLOR */}
                  <ScrollArea className="h-20">
                    <div className="grid grid-cols-8 gap-2">
                      {colorOptions.map((c) => (
                        <button
                          key={c.value}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            settings.textColor === c.value
                              ? 'border-primary ring-2 ring-primary/40'
                              : 'border-border'
                          }`}
                          style={{ backgroundColor: c.value }}
                          onClick={() => updateSetting('textColor', c.value)}
                        />
                      ))}
                    </div>
                  </ScrollArea>

                  {/* HIGHLIGHT COLOR */}
                  <ScrollArea className="h-20">
                    <div className="grid grid-cols-8 gap-2">
                      {highlightOptions.map((c) => (
                        <button
                          key={c.value}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            settings.highlightColor === c.value
                              ? 'border-primary ring-2 ring-primary/40'
                              : 'border-border'
                          }`}
                          style={{ 
                            backgroundColor: c.value,
                            boxShadow: `0 0 10px ${c.value}80`
                          }}
                          onClick={() => updateSetting('highlightColor', c.value)}
                        />
                      ))}
                    </div>
                  </ScrollArea>

                </div>
              </div>

              <Separator />

              {/* EFFECTS */}
              <div className="space-y-5">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Effects</label>
                </div>

                <div className="pl-6 space-y-4">

                  {/* GLOW */}
                  <Slider
                    value={[settings.glowIntensity]}
                    onValueChange={(v) => updateSetting('glowIntensity', v[0])}
                    min={0}
                    max={60}
                    step={5}
                  />

                  {/* TEXT SHADOW */}
                  <Slider
                    value={[settings.textShadow || 0]}
                    onValueChange={(v) => updateSetting('textShadow', v[0])}
                    min={0}
                    max={12}
                    step={1}
                  />

                  {/* ANIMATION SPEED */}
                  <Slider
                    value={[settings.animationSpeed || 1]}
                    onValueChange={(v) => updateSetting('animationSpeed', v[0])}
                    min={0.6}
                    max={2}
                    step={0.1}
                  />

                  {/* BLUR */}
                  <Slider
                    value={[settings.blurEffect || 0]}
                    onValueChange={(v) => updateSetting('blurEffect', v[0])}
                    min={0}
                    max={4}
                    step={0.2}
                  />

                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gradient-primary"
                >
                  Apply
                </Button>
              </div>

            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
