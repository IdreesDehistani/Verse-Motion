import { useEffect, useState, useCallback } from 'react';
import { X, Upload, Play, Settings, ArrowRight, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: any;
  targetElement?: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Upload Your Song",
    description: "Choose an audio file to begin your journey",
    icon: Upload,
    targetElement: "song-uploader",
  },
  {
    id: 2,
    title: "Watch It Sync",
    description: "Your lyrics automatically follow the beat",
    icon: Play,
    targetElement: "lyric-display",
  },
  {
    id: 3,
    title: "Customize Everything",
    description: "Fonts, colors, glow — your style, your rules",
    icon: Settings,
    targetElement: "lyric-customizer",
  },
];

interface GuidedHintsProps {
  onComplete: () => void;
  currentPage: "landing" | "upload";
}

export function GuidedHints({ onComplete, currentPage }: GuidedHintsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Prevent running during SSR
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeen = localStorage.getItem("hasSeenGuidedHints") === "true";

    if (!hasSeen) setIsVisible(true);
    else setIsVisible(false);
  }, []);

  const saveCompletion = useCallback(() => {
    localStorage.setItem("hasSeenGuidedHints", "true");
    setIsVisible(false);
    onComplete();
  }, [onComplete]);

  const handleNext = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      saveCompletion();
    }
  };

  const handlePrevious = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    saveCompletion();
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isVisible) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") saveCompletion();
      if (e.key === "ArrowRight") handleNext(e as any);
      if (e.key === "ArrowLeft") handlePrevious(e as any);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isVisible, currentStep]);

  if (!isVisible) return null;

  const stepData = steps[currentStep];
  const IconComponent = stepData?.icon || Music2;

  return (
    <>
      {/* Dimmed Background */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" />

      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in relative overflow-hidden">

          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl pointer-events-none" />

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse-gentle">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">
              Welcome to VerseMotion
            </h2>
            <p className="text-muted-foreground text-sm">
              A quick tour before you start
            </p>
          </div>

          {/* Step Text */}
          <div className="text-center mb-8 relative z-10">
            <h3 className="font-display font-semibold text-lg text-foreground mb-3">
              {stepData.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {stepData.description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-8 relative z-10">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-primary w-8"
                    : "bg-muted w-2"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center relative z-10">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              className="bg-gradient-primary text-white px-6 shadow-glow hover:shadow-lg transition-all duration-300 group"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Music2 className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>

          {/* Skip */}
          <div className="text-center mt-4 relative z-10">
            <button
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
