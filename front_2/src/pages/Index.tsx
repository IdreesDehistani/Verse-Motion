import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TextPressure } from "@/components/TextPressure";
import { SpotlightEffect } from "@/components/SpotlightEffect";
import { GuidedHints } from "@/components/GuidedHints";
import { DynamicThemeProvider } from "@/components/DynamicThemeProvider";
import { DynamicThemeToggle } from "@/components/DynamicThemeToggle";
import { Music, Palette, Sparkles, ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
            <div className="w-10 h-10 bg-gradient-primary rounded-xl shadow-glow group-hover:scale-105 transition-all" />
            <div className="font-display font-extrabold text-2xl">
              {"VerseMotion".split("").map((char, index) => (
                <TextPressure
                  key={index}
                  text={char}
                  flex
                  weight
                  width
                  italic={false}
                  alpha={false}
                  stroke={false}
                  textColor="hsl(var(--foreground))"
                  minFontSize={22}
                  maxFontSize={28}
                  className="inline-block"
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
        <main className="relative z-10 flex flex-col items-center justify-center min-h-[58vh] text-center space-y-6 p-6">

          {/* Hero Section */}
          <div className="space-y-6 max-w-4xl mx-auto">

            {/* Title */}
            <div className="overflow-hidden font-display font-black text-6xl md:text-7xl lg:text-8xl leading-none bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
              {"Experience Music".split("").map((char, index) => (
                <TextPressure
                  key={index}
                  text={char === " " ? "\u00A0" : char}
                  flex
                  weight
                  width
                  italic={false}
                  alpha={false}
                  textColor="hsl(var(--foreground))"
                  minFontSize={45}
                  maxFontSize={70}
                  className="inline-block"
                />
              ))}

              <br />

              {"Differently".split("").map((char, index) => (
                <TextPressure
                  key={`second-${index}`}
                  text={char === " " ? "\u00A0" : char}
                  flex
                  weight
                  width
                  italic={false}
                  alpha={false}
                  textColor="hsl(var(--primary))"
                  minFontSize={55}
                  maxFontSize={85}
                  className="inline-block"
                />
              ))}
            </div>

            {/* Description */}
            <p className="font-sans text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-medium tracking-wide">
              Interactive lyrics that sync with your beats
            </p>

            {/* Button */}
            <div className="pt-4">
              <button
                onClick={() => navigate("/upload")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white text-lg rounded-2xl shadow-glow hover:scale-105 transition-all"
              >
                <Play className="h-6 w-6" />
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-2">
            <SpotlightEffect className="text-center space-y-4 p-8 rounded-3xl bg-card/40 backdrop-blur-md border">
              <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground">Beat Reactive</h3>
              <p className="font-sans text-foreground/70 text-lg">Visuals that pulse with your music</p>
            </SpotlightEffect>

            <SpotlightEffect className="text-center space-y-4 p-8 rounded-3xl bg-card/40 backdrop-blur-md border">
              <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow">
                <Palette className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground">Fully Customizable</h3>
              <p className="font-sans text-foreground/70 text-lg">Adjust colors, fonts, and styles</p>
            </SpotlightEffect>

            <SpotlightEffect className="text-center space-y-4 p-8 rounded-3xl bg-card/40 backdrop-blur-md border">
              <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground">Interactive Magic</h3>
              <p className="font-sans text-foreground/70 text-lg">Dynamic text effects that follow movement</p>
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
