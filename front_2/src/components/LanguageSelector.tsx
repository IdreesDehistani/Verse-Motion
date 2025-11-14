import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void;
  selectedLanguage: string;
}

export function LanguageSelector({ onLanguageSelect, selectedLanguage }: LanguageSelectorProps) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    // Add more languages if needed
  ];

  return (
    <Card className="mb-6 bg-card/80 backdrop-blur-xl border-border/50 shadow-card">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center space-x-3">
          
          {/* Icon */}
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Globe className="w-5 h-5 text-white" />
          </div>

          {/* Selector */}
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-2">
              Select Language
            </p>

            <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
              <SelectTrigger className="bg-card/60 border-border/50 hover:bg-card/70 transition-colors">
                <SelectValue placeholder="Choose your language" />
              </SelectTrigger>

              <SelectContent className="bg-card/95 backdrop-blur-md border-border/50 max-h-60">
                {languages.map((lang) => (
                  <SelectItem 
                    key={lang.code} 
                    value={lang.code}
                    className="hover:bg-accent/10 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
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
