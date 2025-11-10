import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TextPressure } from '@/components/TextPressure';
import { SpotlightEffect } from '@/components/SpotlightEffect';
import { GuidedHints } from '@/components/GuidedHints';
import { DynamicThemeProvider } from '@/components/DynamicThemeProvider';
import { DynamicThemeToggle } from '@/components/DynamicThemeToggle';
import { Music, Palette, Sparkles, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [showHints, setShowHints] = useState(false);

  const handleHintsComplete = () => {
    setShowHints(false);
  };

  return (
    <DynamicThemeProvider>
      <div className="min-h-screen bg-gradient-background font-display relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl shadow-glow group-hover:shadow-lg group-hover:scale-105 transition-all duration-300" />
          <div className="font-display font-extrabold text-2xl">
            {"VerseMotion".split('').map((char, index) => (
              <TextPressure
                key={index}
                text={char}
                flex={true}
                weight={true}
                width={true}
                italic={false}
                alpha={false}
                stroke={false}
                textColor="hsl(var(--foreground))"
                minFontSize={24}
                maxFontSize={32}
                className="inline-block"
                neighborEffect={true}
                neighborStrength={0.7}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DynamicThemeToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center space-y-12 p-8">
        {/* Hero Section */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="font-display font-black text-6xl md:text-8xl lg:text-9xl leading-none bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
            {"Experience Music".split('').map((char, index) => (
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
                minFontSize={60}
                maxFontSize={90}
                className="inline-block"
                neighborEffect={true}
                neighborStrength={0.8}
              />
            ))}
            <br />
            {"Differently".split('').map((char, index) => (
              <TextPressure
                key={`second-${index}`}
                text={char === ' ' ? '\u00A0' : char}
                flex={true}
                weight={true}
                width={true}
                italic={false}
                alpha={false}
                stroke={false}
                textColor="hsl(var(--primary))"
                minFontSize={60}
                maxFontSize={90}
                className="inline-block"
                neighborEffect={true}
                neighborStrength={0.8}
              />
            ))}
          </div>
          
          {/* Description */}
          <p className="font-sans text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto font-medium">
            {"Interactive lyrics that sync with your beats".split('').map((char, index) => (
              <TextPressure
                key={index}
                text={char === ' ' ? '\u00A0' : char}
                flex={true}
                weight={false}
                width={true}
                italic={false}
                alpha={false}
                stroke={false}
                textColor="hsl(var(--foreground) / 0.8)"
                minFontSize={20}
                maxFontSize={28}
                className="inline-block"
                neighborEffect={true}
                neighborStrength={0.5}
              />
            ))}
          </p>

          {/* Creative Button */}
          <div className="pt-8">
            <button
              onClick={() => navigate('/upload')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white font-sans font-semibold text-lg rounded-2xl shadow-glow hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Play className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Start Your Journey</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-16">
          <SpotlightEffect className="text-center space-y-4 p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/40 hover:scale-105 transition-all duration-500 hover:bg-card/50 group">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
              <Music className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">Beat Reactive</h3>
            <p className="font-sans text-foreground/70 text-lg leading-relaxed">Visuals that pulse and dance with your music's rhythm in real-time</p>
          </SpotlightEffect>
          
          <SpotlightEffect className="text-center space-y-4 p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/40 hover:scale-105 transition-all duration-500 hover:bg-card/50 group">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
              <Palette className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">Fully Customizable</h3>
            <p className="font-sans text-foreground/70 text-lg leading-relaxed">Personalize colors, fonts, and effects to create your unique style</p>
          </SpotlightEffect>
          
          <SpotlightEffect className="text-center space-y-4 p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/40 hover:scale-105 transition-all duration-500 hover:bg-card/50 group">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow group-hover:shadow-xl transition-all duration-300">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">Interactive Magic</h3>
            <p className="font-sans text-foreground/70 text-lg leading-relaxed">Dynamic text pressure effects respond to your every movement</p>
          </SpotlightEffect>
        </div>
      </main>

      {/* Guided Hints */}
      <GuidedHints onComplete={handleHintsComplete} currentPage="landing" />
    </div>
    </DynamicThemeProvider>
  );
};

export default Index;
