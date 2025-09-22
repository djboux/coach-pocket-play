import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DrillRow } from '@/services/api';
import { ExternalLink, Play, Trash2, Star } from 'lucide-react';

interface ShowcaseItem {
  family_id: string;
  level: number;
  ready_to_demo: boolean;
  drill: DrillRow;
}

interface ShowcaseGridProps {
  items: ShowcaseItem[];
  onRemove?: (familyId: string) => void;
  onShowVideo?: (drill: DrillRow) => void;
  isParentView?: boolean;
}

export const ShowcaseGrid = ({ 
  items, 
  onRemove, 
  onShowVideo,
  isParentView = false 
}: ShowcaseGridProps) => {
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

  if (items.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">⭐</div>
          <h2 className="text-lg font-semibold mb-2">
            {isParentView ? "No showcase items yet" : "Your Showcase is empty"}
          </h2>
          <p className="text-muted-foreground">
            {isParentView 
              ? "Drills will appear here when your child masters them!" 
              : "Master drills to add them to your showcase!"
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card 
          key={item.family_id}
          className="shadow-soft hover:shadow-glow transition-all duration-300"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg leading-tight">
                {item.drill.title}
              </CardTitle>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Badge className="bg-gradient-secondary text-secondary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Showcase
                </Badge>
                {item.ready_to_demo && (
                  <Badge className="bg-gradient-success text-success-foreground">
                    Ready to demo
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getSkillColor(item.drill.skill)}>
                {item.drill.skill}
              </Badge>
              <Badge variant="outline">
                Level {item.level}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {item.drill.why_it_matters && (
              <div className="bg-muted/50 p-2 rounded text-xs">
                <strong>Why it matters:</strong> {item.drill.why_it_matters}
              </div>
            )}
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.drill.instructions}
            </p>
            
            <div className="flex gap-2">
              {item.drill.youtube_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onShowVideo?.(item.drill)}
                >
                  <Play className="w-3 h-3 mr-1" />
                  {isParentView ? "Show cue sheet/video" : "Watch"}
                </Button>
              )}
              
              {!isParentView && onRemove && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(item.family_id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>

            {isParentView && item.ready_to_demo && (
              <div className="bg-success/10 border border-success/20 p-2 rounded text-xs text-success">
                🎉 Your child is ready to demonstrate this skill to you!
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};