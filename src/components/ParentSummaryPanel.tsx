import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ParentSummaryOut } from '@/services/api';
import { ArrowUp, ArrowDown, Minus, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

interface ParentSummaryPanelProps {
  summary: ParentSummaryOut;
  onShowDrill?: (familyId: string) => void;
}

export const ParentSummaryPanel = ({ summary, onShowDrill }: ParentSummaryPanelProps) => {
  const getProgressIcon = (delta: string) => {
    switch (delta) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-success" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getProgressColor = (delta: string) => {
    switch (delta) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTotalFeedback = () => {
    return summary.effort_mix.could_not_do + summary.effort_mix.challenging + summary.effort_mix.easy;
  };

  const getEngagementPercentage = () => {
    const total = getTotalFeedback();
    if (total === 0) return 0;
    
    // Calculate engagement: tough and easy attempts show engagement
    const engaged = summary.effort_mix.challenging + summary.effort_mix.easy;
    return Math.round((engaged / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{summary.sessions_this_week}</p>
                <p className="text-xs text-muted-foreground">Sessions this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">{getEngagementPercentage()}%</p>
                <p className="text-xs text-muted-foreground">Engagement score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-secondary rounded text-xs flex items-center justify-center text-secondary-foreground font-bold">
                ⭐
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.showcase.length}</p>
                <p className="text-xs text-muted-foreground">Showcase drills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Dates */}
      {summary.session_dates.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Recent Training Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {summary.session_dates.map((date) => (
                <Badge key={date} variant="outline">
                  {new Date(date).toLocaleDateString()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Tracking */}
      {summary.progress.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Skill Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.progress.map((prog) => (
                <div key={prog.family_id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{prog.family_id}</span>
                  <div className="flex items-center gap-2">
                    {getProgressIcon(prog.delta)}
                    <span className={`text-sm ${getProgressColor(prog.delta)}`}>
                      {prog.delta === 'up' ? 'Improved' : prog.delta === 'down' ? 'Needs work' : 'Steady'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Effort Distribution */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Training Effort Mix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl mb-1">😣</div>
              <p className="text-lg font-semibold">{summary.effort_mix.could_not_do}</p>
              <p className="text-xs text-muted-foreground">Couldn't do yet</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💪</div>
              <p className="text-lg font-semibold">{summary.effort_mix.challenging}</p>
              <p className="text-xs text-muted-foreground">Tough but did it</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">😎</div>
              <p className="text-lg font-semibold">{summary.effort_mix.easy}</p>
              <p className="text-xs text-muted-foreground">Smashed it</p>
            </div>
          </div>

          {getTotalFeedback() > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Engagement Level</span>
                <span>{getEngagementPercentage()}%</span>
              </div>
              <Progress value={getEngagementPercentage()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on attempts and successful completions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stuck Signals */}
      {summary.stuck_signals.length > 0 && (
        <Card className="shadow-soft border-warning/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Areas Needing Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.stuck_signals.map((signal) => (
                <div 
                  key={signal.family_id}
                  className="flex items-center justify-between p-3 bg-warning/10 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{signal.family_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {signal.consecutive_could_not_do} consecutive "couldn't do it" responses
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShowDrill?.(signal.family_id)}
                  >
                    Suggest easier level
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Showcase Preview */}
      {summary.showcase.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Showcase Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.showcase.map((item) => (
                <div 
                  key={item.family_id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg">⭐</div>
                    <div>
                      <p className="font-medium">{item.family_id}</p>
                      <p className="text-sm text-muted-foreground">Level {item.level}</p>
                    </div>
                    {item.ready_to_demo && (
                      <Badge className="bg-gradient-success text-success-foreground">
                        Ready to demo
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShowDrill?.(item.family_id)}
                  >
                    Show cue sheet/video
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};