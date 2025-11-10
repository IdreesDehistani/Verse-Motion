import { useState, useEffect } from 'react';
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
    description: "Choose an audio file to get started with your musical journey",
    icon: Upload,
    targetElement: "song-uploader"
  },
  {
    id: 2,
    title: "Watch It Match",
    description: "See your lyrics sync perfectly with the beat and rhythm",
    icon: Play,
    targetElement: "lyric-display"
  },
  {
    id: 3,
    title: "Customize Everything",
    description: "Personalize fonts, colors, and effects to create your unique style",
    icon: Settings,
    targetElement: "lyric-customizer"
  }
];

interface GuidedHintsProps {
  onComplete: () => void;
  currentPage: 'landing' | 'upload';
}

export function GuidedHints({ onComplete, currentPage }: GuidedHintsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenHints, setHasSeenHints] = useState(false);

  useEffect(() => {
    const hasSeenHintsBefore = localStorage.getItem('hasSeenGuidedHints');
    if (!hasSeenHintsBefore) {
      setIsVisible(true);
      setHasSeenHints(false);
    } else {
      setHasSeenHints(true);
      setIsVisible(false);
    }
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenGuidedHints', 'true');
    setIsVisible(false);
    setHasSeenHints(true);
    onComplete();
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleComplete();
  };

  if (!isVisible || hasSeenHints) return null;

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData?.icon || Music2;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" />
      
      {/* Hint Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl pointer-events-none z-0" />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-foreground relative z-10"
            type="button"
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
              Let's get you started with interactive music experiences
            </p>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8 relative z-10">
            <h3 className="font-display font-semibold text-lg text-foreground mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-8 relative z-10">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-primary w-8'
                    : index < currentStep
                    ? 'bg-primary/60'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center relative z-10">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              type="button"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              className="bg-gradient-primary text-white px-6 shadow-glow hover:shadow-lg transition-all duration-300 group"
              type="button"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Music2 className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </Button>
          </div>

          {/* Skip Link */}
          <div className="text-center mt-4 relative z-10">
            <button
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
              type="button"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>
    </>
  );
}