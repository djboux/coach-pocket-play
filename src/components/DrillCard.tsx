import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DrillRow, FeedbackIn } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Play, ChevronDown, ChevronRight } from 'lucide-react';

interface DrillCardProps {
  drill: DrillRow;
  childId: string;
  mode: 'core' | 'bonus';
  onFeedbackSubmit: (feedback: FeedbackIn) => Promise<void>;
  onNext: () => void;
  canSwap?: boolean;
  onSwapDrill?: () => void;
  drillNumber?: number;
  isExpanded?: boolean;
  isCompleted?: boolean;
  onToggleExpanded?: () => void;
}

type Step = 'attempt' | 'feeling' | 'choice' | 'complete' | 'swap';
type Feeling = 'could_not_do' | 'challenging' | 'easy';
type NextChoice = 'repeat_same' | 'make_easier' | 'tiny_challenge' | 'level_up' | 'repeat_for_fun' | 'add_to_showcase';

export const DrillCard = ({ 
  drill, 
  childId, 
  mode, 
  onFeedbackSubmit, 
  onNext,
  canSwap = false,
  onSwapDrill,
  drillNumber,
  isExpanded = true,
  isCompleted = false,
  onToggleExpanded
}: DrillCardProps) => {
  const [step, setStep] = useState<Step>('attempt');
  const [attempted, setAttempted] = useState<boolean | null>(null);
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [nextChoice, setNextChoice] = useState<NextChoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset state when drill changes
  useEffect(() => {
    setStep('attempt');
    setAttempted(null);
    setFeeling(null);
    setNextChoice(null);
  }, [drill.id]);

  const handleAttemptResponse = (didAttempt: boolean) => {
    setAttempted(didAttempt);
    if (didAttempt) {
      setStep('feeling');
    } else {
      // Skipped - submit immediately
      submitFeedback(false);
    }
  };

  const handleFeelingResponse = (selectedFeeling: Feeling) => {
    setFeeling(selectedFeeling);
    setStep('choice');
  };

  const handleNextChoice = async (choice: NextChoice) => {
    setNextChoice(choice);
    await submitFeedback(true, feeling!, choice);
  };

  const submitFeedback = async (didAttempt: boolean, selectedFeeling?: Feeling, choice?: NextChoice) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const feedback: FeedbackIn = {
      child_id: childId,
      drill_id: drill.id,
      attempted: didAttempt,
      difficulty_rating: selectedFeeling,
      next_action: choice,
      session_mode: mode,
      session_id: 1, // Mock session ID
    };

    try {
      await onFeedbackSubmit(feedback);
      
      // Show success toast only for level up
      if (choice === 'level_up') {
        toast({
          title: `Level ${drill.level + 1} and in your Showcase! 🌟`,
          description: "Undo?",
          duration: 5000,
        });
      }
      
      setStep('complete');
      // Auto-advance after a moment
      setTimeout(() => {
        onNext();
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSkillColor = (skill: string) => {
    const colors: Record<string, string> = {
      'Dribbling': 'bg-primary text-primary-foreground',
      'Shooting': 'bg-secondary text-secondary-foreground', 
      'Passing': 'bg-accent text-accent-foreground',
      'Ball Control': 'bg-success text-success-foreground',
      'default': 'bg-muted text-muted-foreground'
    };
    return colors[skill] || colors.default;
  };

  const renderAttemptStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Completed?</h3>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={() => handleAttemptResponse(true)}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
          size="lg"
        >
          ✅ Yes, I completed it
        </Button>
        
        <button 
          onClick={() => {
            if (canSwap && onSwapDrill) {
              setStep('swap');
            } else {
              handleAttemptResponse(false);
            }
          }}
          className="w-full text-muted-foreground hover:text-foreground transition-colors text-sm underline"
        >
          Skip this drill
        </button>
      </div>
    </div>
  );

  const renderSwapStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Do you want to swap this drill?</h3>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onSwapDrill}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            size="lg"
          >
            🔄 Swap this drill
          </Button>
          
          <Button 
            onClick={() => setStep('attempt')}
            className="bg-gradient-secondary text-secondary-foreground hover:opacity-90"
            size="lg"
          >
            ↩️ Do the drill
          </Button>
        </div>
        
        <button 
          onClick={() => handleAttemptResponse(false)}
          className="w-full text-muted-foreground hover:text-foreground transition-colors text-sm underline"
        >
          Skip without swapping
        </button>
      </div>
    </div>
  );

  const renderFeelingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">How did it go?</h3>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={() => handleFeelingResponse('could_not_do')}
          variant="outline"
          className="w-full text-left justify-start"
          size="lg"
        >
          <span className="text-2xl mr-3">😣</span>
          <span>Couldn't do it yet</span>
        </Button>
        
        <Button 
          onClick={() => handleFeelingResponse('challenging')}
          variant="outline"
          className="w-full text-left justify-start"
          size="lg"
        >
          <span className="text-2xl mr-3">💪</span>
          <span>Tough but I did it</span>
        </Button>
        
        <Button 
          onClick={() => handleFeelingResponse('easy')}
          variant="outline"
          className="w-full text-left justify-start"
          size="lg"
        >
          <span className="text-2xl mr-3">😎</span>
          <span>Smashed it</span>
        </Button>
      </div>
    </div>
  );

  const renderChoiceStep = () => {
    if (!feeling) return null;

    if (feeling === 'could_not_do') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-warning">Great effort — this one's tricky!</h3>
            <p className="text-sm text-muted-foreground">What should we do next time?</p>
            <div className="w-12 h-0.5 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleNextChoice('repeat_same')}
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              size="lg"
              disabled={isSubmitting}
            >
              🔄 Keep practicing
            </Button>
            
            {drill.level > 1 && (
              <button 
                onClick={() => handleNextChoice('make_easier')}
                className="w-full text-muted-foreground hover:text-foreground transition-colors text-sm underline"
                disabled={isSubmitting}
              >
                ⬇️ Make it easier next time
              </button>
            )}
          </div>
        </div>
      );
    }

    if (feeling === 'challenging') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-success">Perfect practice zone 💪</h3>
            <p className="text-sm text-muted-foreground">What should we do next time?</p>
            <div className="w-12 h-0.5 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleNextChoice('repeat_same')}
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              size="lg"
              disabled={isSubmitting}
            >
              🎯 Same again
            </Button>
            
            <button 
              onClick={() => handleNextChoice('tiny_challenge')}
              className="w-full text-muted-foreground hover:text-foreground transition-colors text-sm underline"
              disabled={isSubmitting}
            >
              ⚡ Tiny challenge (+5s / +3 reps) next time
            </button>
          </div>
        </div>
      );
    }

    if (feeling === 'easy') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-secondary">You smashed it! 🎉</h3>
            <p className="text-sm text-muted-foreground">What should we do next time?</p>
            <div className="w-12 h-0.5 bg-gradient-secondary mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleNextChoice('level_up')}
              className="w-full bg-gradient-secondary text-secondary-foreground hover:opacity-90"
              size="lg"
              disabled={isSubmitting}
            >
              ⬆️ Level up now + added to your Showcase ⭐
            </Button>
            
            <button 
              onClick={() => handleNextChoice('repeat_for_fun')}
              className="w-full text-muted-foreground hover:text-foreground transition-colors text-sm underline"
              disabled={isSubmitting}
            >
              🔄 Repeat for fun next time
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderCompleteStep = () => (
    <div className="text-center space-y-4">
      <div className="text-4xl">✅</div>
      <h3 className="text-xl font-semibold text-success">Feedback captured!</h3>
      <p className="text-muted-foreground">Moving to the next drill...</p>
    </div>
  );

  return (
    <Card className={`w-full max-w-2xl mx-auto shadow-glow transition-all duration-300 ${
      !isExpanded ? 'opacity-60' : ''
    }`}>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Drill Number */}
            {drillNumber && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isCompleted ? 'bg-success text-success-foreground' : 'bg-primary/10 text-primary'
              }`}>
                {drillNumber}
              </div>
            )}
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl cursor-pointer flex items-center gap-2" onClick={onToggleExpanded}>
                  {drill.title}
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getSkillColor(drill.skill)}>
                  {drill.skill}
                </Badge>
                <Badge variant="outline">
                  Level {drill.level}
                </Badge>
                {mode === 'bonus' && (
                  <Badge className="bg-gradient-secondary text-secondary-foreground">
                    Bonus
                  </Badge>
                )}
                {isCompleted && (
                  <Badge className="bg-success text-success-foreground">
                    ✓ Complete
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <>
            {drill.why_it_matters && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Why it matters:</strong> {drill.why_it_matters}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium">Instructions:</h4>
              <p className="text-muted-foreground">{drill.instructions}</p>
            </div>

            {drill.youtube_url && (
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => window.open(drill.youtube_url, '_blank')}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Video
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            )}
          </>
        )}
      </CardHeader>

      {isExpanded && !isCompleted && (
        <CardContent className="space-y-6">
          {step === 'attempt' && renderAttemptStep()}
          {step === 'swap' && renderSwapStep()}
          {step === 'feeling' && renderFeelingStep()}
          {step === 'choice' && renderChoiceStep()}
          {step === 'complete' && renderCompleteStep()}
        </CardContent>
      )}
    </Card>
  );
};