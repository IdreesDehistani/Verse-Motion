import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Palette, Type, Sparkles, Music, Volume2, Eye } from 'lucide-react';
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

  const fontOptions = [
    { value: 'Space Grotesk', label: 'Space Grotesk', category: 'Modern' },
    { value: 'Epilogue', label: 'Epilogue', category: 'Headline' },
    { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', category: 'Clean' },
    { value: 'Manrope', label: 'Manrope', category: 'Modern' },
    { value: 'DM Sans', label: 'DM Sans', category: 'Clean' },
    { value: 'Instrument Sans', label: 'Instrument Sans', category: 'Tech' },
    { value: 'Playfair Display', label: 'Playfair Display', category: 'Elegant' },
    { value: 'Montserrat', label: 'Montserrat', category: 'Classic' },
    { value: 'Inter', label: 'Inter', category: 'Default' }
  ];

  const colorOptions = [
    { value: 'hsl(var(--foreground))', label: 'Default', color: 'hsl(var(--foreground))' },
    { value: 'hsl(220, 91%, 60%)', label: 'Ocean Blue', color: 'hsl(220, 91%, 60%)' },
    { value: 'hsl(271, 91%, 65%)', label: 'Electric Purple', color: 'hsl(271, 91%, 65%)' },
    { value: 'hsl(348, 83%, 47%)', label: 'Ruby Red', color: 'hsl(348, 83%, 47%)' },
    { value: 'hsl(168, 76%, 36%)', label: 'Emerald Green', color: 'hsl(168, 76%, 36%)' },
    { value: 'hsl(31, 81%, 56%)', label: 'Sunset Orange', color: 'hsl(31, 81%, 56%)' },
    { value: 'hsl(280, 100%, 70%)', label: 'Hot Pink', color: 'hsl(280, 100%, 70%)' },
    { value: 'hsl(193, 95%, 68%)', label: 'Neon Cyan', color: 'hsl(193, 95%, 68%)' },
    { value: 'hsl(49, 100%, 50%)', label: 'Electric Yellow', color: 'hsl(49, 100%, 50%)' },
    { value: 'hsl(14, 100%, 57%)', label: 'Coral Reef', color: 'hsl(14, 100%, 57%)' },
    { value: 'hsl(251, 91%, 73%)', label: 'Lavender Dream', color: 'hsl(251, 91%, 73%)' },
    { value: 'hsl(158, 64%, 52%)', label: 'Mint Fresh', color: 'hsl(158, 64%, 52%)' },
    { value: 'hsl(45, 93%, 47%)', label: 'Golden Hour', color: 'hsl(45, 93%, 47%)' },
    { value: 'hsl(322, 100%, 75%)', label: 'Bubblegum', color: 'hsl(322, 100%, 75%)' },
    { value: 'hsl(195, 100%, 85%)', label: 'Sky Blue', color: 'hsl(195, 100%, 85%)' },
    { value: 'hsl(124, 100%, 75%)', label: 'Lime Green', color: 'hsl(124, 100%, 75%)' }
  ];

  const highlightOptions = [
    { value: 'hsl(var(--lyric-highlight))', label: 'Default', color: 'hsl(var(--lyric-highlight))' },
    { value: 'hsl(220, 91%, 60%)', label: 'Ocean Glow', color: 'hsl(220, 91%, 60%)' },
    { value: 'hsl(271, 91%, 65%)', label: 'Cosmic Glow', color: 'hsl(271, 91%, 65%)' },
    { value: 'hsl(348, 83%, 47%)', label: 'Fire Glow', color: 'hsl(348, 83%, 47%)' },
    { value: 'hsl(168, 76%, 36%)', label: 'Forest Glow', color: 'hsl(168, 76%, 36%)' },
    { value: 'hsl(31, 81%, 56%)', label: 'Sunset Glow', color: 'hsl(31, 81%, 56%)' },
    { value: 'hsl(280, 100%, 70%)', label: 'Neon Glow', color: 'hsl(280, 100%, 70%)' },
    { value: 'hsl(193, 95%, 68%)', label: 'Ice Glow', color: 'hsl(193, 95%, 68%)' },
    { value: 'hsl(49, 100%, 50%)', label: 'Lightning Glow', color: 'hsl(49, 100%, 50%)' },
    { value: 'hsl(14, 100%, 57%)', label: 'Ember Glow', color: 'hsl(14, 100%, 57%)' },
    { value: 'hsl(251, 91%, 73%)', label: 'Dream Glow', color: 'hsl(251, 91%, 73%)' },
    { value: 'hsl(158, 64%, 52%)', label: 'Aurora Glow', color: 'hsl(158, 64%, 52%)' },
    { value: 'hsl(45, 93%, 47%)', label: 'Golden Glow', color: 'hsl(45, 93%, 47%)' },
    { value: 'hsl(322, 100%, 75%)', label: 'Plasma Glow', color: 'hsl(322, 100%, 75%)' },
    { value: 'hsl(195, 100%, 85%)', label: 'Crystal Glow', color: 'hsl(195, 100%, 85%)' },
    { value: 'hsl(124, 100%, 75%)', label: 'Toxic Glow', color: 'hsl(124, 100%, 75%)' }
  ];

  const updateSetting = <K extends keyof LyricSettings>(key: K, value: LyricSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="backdrop-blur-sm bg-card/80 border-border/50 hover:bg-card/90 transition-all duration-300 shadow-lg"
          >
            <Settings className="mr-2 h-4 w-4" />
            Customize Lyrics
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-96 p-0 backdrop-blur-xl bg-card/95 border-border/50 shadow-2xl" 
          align="end"
        >
          <ScrollArea className="h-96">
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 pb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-headline font-semibold text-lg">Lyric Style</h3>
              </div>

              {/* Typography Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Typography</label>
                </div>
                
                <div className="space-y-3 pl-6">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Font Family</label>
                    <Select value={settings.fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
                      <SelectTrigger className="w-full bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center justify-between w-full">
                              <span style={{ fontFamily: font.value }}>{font.label}</span>
                              <span className="text-xs text-muted-foreground ml-2">{font.category}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Font Size: {settings.fontSize}%
                    </label>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={(value) => updateSetting('fontSize', value[0])}
                      min={50}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Line Spacing: {settings.lineSpacing || 1.5}
                    </label>
                    <Slider
                      value={[settings.lineSpacing || 1.5]}
                      onValueChange={(value) => updateSetting('lineSpacing', value[0])}
                      min={1}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Letter Spacing: {settings.letterSpacing || 0}px
                    </label>
                    <Slider
                      value={[settings.letterSpacing || 0]}
                      onValueChange={(value) => updateSetting('letterSpacing', value[0])}
                      min={-2}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Colors Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Colors</label>
                </div>
                
                <div className="space-y-4 pl-6">
                  <div>
                    <label className="text-xs text-muted-foreground mb-3 block">Text Color</label>
                    <ScrollArea className="h-20">
                      <div className="grid grid-cols-8 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => updateSetting('textColor', color.value)}
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                              settings.textColor === color.value ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                            }`}
                            style={{ backgroundColor: color.color }}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-3 block">Highlight Glow</label>
                    <ScrollArea className="h-20">
                      <div className="grid grid-cols-8 gap-2">
                        {highlightOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => updateSetting('highlightColor', color.value)}
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                              settings.highlightColor === color.value ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                            }`}
                            style={{ 
                              backgroundColor: color.color,
                              boxShadow: `0 0 10px ${color.color}40`
                            }}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Effects Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Effects</label>
                </div>
                
                <div className="space-y-3 pl-6">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Glow Intensity: {settings.glowIntensity}%
                    </label>
                    <Slider
                      value={[settings.glowIntensity]}
                      onValueChange={(value) => updateSetting('glowIntensity', value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Text Shadow: {settings.textShadow || 0}px
                    </label>
                    <Slider
                      value={[settings.textShadow || 0]}
                      onValueChange={(value) => updateSetting('textShadow', value[0])}
                      min={0}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Animation Speed: {settings.animationSpeed || 1}x
                    </label>
                    <Slider
                      value={[settings.animationSpeed || 1]}
                      onValueChange={(value) => updateSetting('animationSpeed', value[0])}
                      min={0.5}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Blur Effect: {settings.blurEffect || 0}px
                    </label>
                    <Slider
                      value={[settings.blurEffect || 0]}
                      onValueChange={(value) => updateSetting('blurEffect', value[0])}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setIsOpen(false)} 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-300"
                >
                  Apply Settings
                </Button>
              </div>
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}