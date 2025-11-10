import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { TextPressure } from './TextPressure';

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void;
  selectedLanguage: string;
}

export function LanguageSelector({ onLanguageSelect, selectedLanguage }: LanguageSelectorProps) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];

  return (
    <Card className="mb-6 bg-card/80 backdrop-blur-xl border-border/50 shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground mb-2 block">
              {"Select Language".split('').map((char, index) => (
                <TextPressure
                  key={index}
                  text={char === ' ' ? '\u00A0' : char}
                  flex={true}
                  weight={true}
                  width={true}
                  italic={false}
                  alpha={false}
                  stroke={false}
                  textColor="hsl(var(--foreground))"
                  minFontSize={12}
                  maxFontSize={16}
                  className="inline-block"
                  neighborEffect={true}
                  neighborStrength={0.5}
                />
              ))}
            </div>
            <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
              <SelectTrigger className="bg-input/50 border-border/50 hover:bg-input/70 transition-colors">
                <SelectValue placeholder="Choose your language" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-md border-border/50 max-h-60">
                {languages.map((language) => (
                  <SelectItem 
                    key={language.code} 
                    value={language.code}
                    className="hover:bg-accent/10 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}