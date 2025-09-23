import { DrillRow } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface BonusPickerProps {
  drills: DrillRow[];
  onSelectDrill: (drill: DrillRow) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const BonusPicker = ({ drills, onSelectDrill, onBack, isLoading }: BonusPickerProps) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading bonus drills...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="text-primary-foreground">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={onBack}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold">Bonus Drills</h1>
            </div>
            <p className="text-primary-foreground/90 ml-9">Extra practice to level up tomorrow!</p>
          </div>
        </div>

        {/* Drills Grid */}
        {drills.length === 0 ? (
          <Card className="shadow-glow">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">⚽</div>
              <h2 className="text-lg font-semibold mb-2">No bonus drills available</h2>
              <p className="text-muted-foreground">
                Great job today! Come back tomorrow for new challenges.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {drills.map((drill) => (
              <Card 
                key={drill.id}
                className="shadow-soft hover:shadow-glow transition-all duration-300 cursor-pointer"
                onClick={() => onSelectDrill(drill)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">
                      {drill.title}
                    </CardTitle>
                    <Badge className="bg-gradient-secondary text-secondary-foreground shrink-0 ml-2">
                      Bonus
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getSkillColor(drill.skill)} variant="secondary">
                      {drill.skill}
                    </Badge>
                    <Badge variant="outline">
                      Level {drill.level}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {drill.why_it_matters && (
                    <div className="bg-muted/50 p-2 rounded text-xs">
                      <strong>Why it matters:</strong> {drill.why_it_matters}
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {drill.instructions}
                  </p>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    Start Drill
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};