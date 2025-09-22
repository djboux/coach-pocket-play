import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DrillRow, FeedbackIn } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Play } from 'lucide-react';

interface DrillCardProps {
  drill: DrillRow;
  childId: string;
  mode: 'core' | 'bonus';
  onFeedbackSubmit: (feedback: FeedbackIn) => Promise<void>;
  onNext: () => void;
  canSwap?: boolean;
  onSwapDrill?: () => void;
}

type Step = 'attempt' | 'feeling' | 'choice' | 'complete';
type Feeling = 'couldnt' | 'tough' | 'easy';
type NextChoice = 'keep' | 'easier' | 'same' | 'tiny_challenge' | 'level_up' | 'repeat' | 'showcase';

export const DrillCard = ({ 
  drill, 
  childId, 
  mode, 
  onFeedbackSubmit, 
  onNext,
  canSwap = false,
  onSwapDrill
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
      felt: selectedFeeling,
      next_choice: choice,
      mode,
    };

    try {
      await onFeedbackSubmit(feedback);
      
      // Show success toast based on choice
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
        <h3 className="text-xl font-semibold mb-2">Did you try it?</h3>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={() => handleAttemptResponse(true)}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
          size="lg"
        >
          ✅ Yes
        </Button>
        
        <Button 
          onClick={() => handleAttemptResponse(false)}
          variant="outline"
          className="w-full"
          size="lg"
        >
          ⏭️ Skip
        </Button>
      </div>

      {canSwap && onSwapDrill && (
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Skipped. Want to swap this drill?
          </p>
          <Button
            onClick={onSwapDrill}
            variant="ghost"
            size="sm"
          >
            🔄 Swap this drill
          </Button>
        </div>
      )}
    </div>
  );

  const renderFeelingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">How did it go?</h3>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={() => handleFeelingResponse('couldnt')}
          variant="outline"
          className="w-full text-left justify-start"
          size="lg"
        >
          <span className="text-2xl mr-3">😣</span>
          <span>Couldn't do it yet</span>
        </Button>
        
        <Button 
          onClick={() => handleFeelingResponse('tough')}
          className="w-full text-left justify-start bg-gradient-primary text-primary-foreground hover:opacity-90"
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

    if (feeling === 'couldnt') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-warning">Great effort — this one's tricky!</h3>
            <p className="text-sm text-muted-foreground">We'll get there with practice.</p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleNextChoice('keep')}
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              size="lg"
              disabled={isSubmitting}
            >
              🔄 Keep practicing
            </Button>
            
            {drill.level > 1 && (
              <Button 
                onClick={() => handleNextChoice('easier')}
                variant="outline"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                ⬇️ Make it easier
              </Button>
            )}
          </div>
        </div>
      );
    }

    if (feeling === 'tough') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-success">Perfect practice zone 💪</h3>
            <p className="text-sm text-muted-foreground">Lock it in; you'll level up soon.</p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleNextChoice('same')}
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              size="lg"
              disabled={isSubmitting}
            >
              🎯 Same again
            </Button>
            
            <Button 
              onClick={() => handleNextChoice('tiny_challenge')}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              ⚡ Tiny challenge (+5s / +3 reps)
            </Button>
          </div>
        </div>
      );
    }

    if (feeling === 'easy') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-secondary">You smashed it! 🎉</h3>
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
            
            <Button 
              onClick={() => handleNextChoice('repeat')}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              🔄 Repeat for fun
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderCompleteStep = () => (
    <div className="text-center space-y-4">
      <div className="text-4xl">✅</div>
      <h3 className="text-xl font-semibold text-success">Great job!</h3>
      <p className="text-muted-foreground">Moving to the next drill...</p>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-glow">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{drill.title}</CardTitle>
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
            </div>
          </div>
        </div>

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
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 'attempt' && renderAttemptStep()}
        {step === 'feeling' && renderFeelingStep()}
        {step === 'choice' && renderChoiceStep()}
        {step === 'complete' && renderCompleteStep()}
      </CardContent>
    </Card>
  );
};