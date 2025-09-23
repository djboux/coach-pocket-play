import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockApi, type ParentSummaryOut as ParentSummaryType } from "@/services/mockApi";
import { ArrowLeft, TrendingUp, Target, BarChart3, Clock, Trophy } from "lucide-react";

const ParentSummary = () => {
  const [summary, setSummary] = useState<ParentSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const childId = localStorage.getItem("childId") || "demo";

  useEffect(() => {
    loadSummary();
  }, [childId]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const summaryData = await mockApi.getParentSummary(childId);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalFeedback = () => {
    if (!summary) return 0;
    return summary.effort_mix.could_not_do + summary.effort_mix.challenging + summary.effort_mix.easy;
  };

  const getEngagementScore = () => {
    if (!summary) return 0;
    const total = getTotalFeedback();
    if (total === 0) return 0;
    
    // Calculate engagement based on feedback distribution
    const { could_not_do, challenging, easy } = summary.effort_mix;
    const balanceScore = Math.min(challenging / total * 100, 70); // Up to 70% for balanced ratings
    const progressScore = Math.min(easy / total * 100 * 0.5, 20); // Up to 20% for progression
    const streakBonus = Math.min(summary.sessions_this_week * 2, 10); // Up to 10% for consistency
    
    return Math.round(balanceScore + progressScore + streakBonus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading parent summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          </div>
          <p className="text-muted-foreground ml-9">{childId}'s weekly progress snapshot</p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Sessions */}
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{summary?.sessions_this_week || 0}</div>
              <div className="text-sm opacity-90">Sessions This Week</div>
            </CardContent>
          </Card>

          {/* Engagement Score */}
          <Card className="bg-gradient-success text-success-foreground">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{getEngagementScore()}%</div>
              <div className="text-sm opacity-90">Engagement Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Training Effort Mix
            </CardTitle>
            <CardDescription>
              How {childId} is finding the difficulty of drills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary && (
              <>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{summary.effort_mix.challenging}</div>
                    <div className="text-sm text-green-700">Challenging</div>
                    <div className="text-xs text-green-600 mt-1">Perfect challenge level</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{summary.effort_mix.easy}</div>
                    <div className="text-sm text-blue-700">Easy</div>
                    <div className="text-xs text-blue-600 mt-1">Ready for harder drills</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">{summary.effort_mix.could_not_do}</div>
                    <div className="text-sm text-red-700">Couldn't Do</div>
                    <div className="text-xs text-red-600 mt-1">Needs more practice</div>
                  </div>
                </div>

                {getTotalFeedback() > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Effort Distribution</div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                      {summary.effort_mix.challenging > 0 && (
                        <div 
                          className="bg-green-500" 
                          style={{ width: `${(summary.effort_mix.challenging / getTotalFeedback()) * 100}%` }}
                        />
                      )}
                      {summary.effort_mix.easy > 0 && (
                        <div 
                          className="bg-blue-500" 
                          style={{ width: `${(summary.effort_mix.easy / getTotalFeedback()) * 100}%` }}
                        />
                      )}
                      {summary.effort_mix.could_not_do > 0 && (
                        <div 
                          className="bg-red-500" 
                          style={{ width: `${(summary.effort_mix.could_not_do / getTotalFeedback()) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Skill Development
            </CardTitle>
            <CardDescription>
              Progress in different football skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary && summary.progress.length > 0 ? (
              summary.progress.map((prog) => (
                <div key={prog.family_id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {prog.family_id}
                    </span>
                    <Badge 
                      variant={prog.delta === 'up' ? 'default' : prog.delta === 'down' ? 'destructive' : 'secondary'}
                    >
                      {prog.delta === 'up' ? '↑ Improved' : prog.delta === 'down' ? '↓ Needs work' : '→ Steady'}
                    </Badge>
                  </div>
                  <Progress 
                    value={prog.delta === 'up' ? 75 : prog.delta === 'same' ? 50 : 25} 
                    className="h-2"
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No skill progression data yet. Complete more training sessions to see development!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stuck Signals */}
        {summary && summary.stuck_signals.length > 0 && (
          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="text-warning">Areas Needing Attention</CardTitle>
              <CardDescription>
                Skills that may need easier practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.stuck_signals.map((signal) => (
                  <div key={signal.family_id} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div>
                      <div className="font-medium">{signal.family_id}</div>
                      <div className="text-sm text-muted-foreground">
                        {signal.consecutive_could_not_do} consecutive sessions struggling
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Suggest easier level
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Showcase */}
        {summary && summary.showcase.length > 0 && (
          <Card className="border-success">
            <CardHeader>
              <CardTitle className="text-success">Showcase Highlights</CardTitle>
              <CardDescription>
                Skills ready to show off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.showcase.map((item) => (
                  <div key={item.family_id} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-lg">⭐</div>
                      <div>
                        <div className="font-medium">{item.family_id}</div>
                        <div className="text-sm text-muted-foreground">Level {item.level}</div>
                      </div>
                      {item.ready_to_demo && (
                        <Badge className="bg-success text-success-foreground">
                          Ready to demo
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Show video
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="default"
            onClick={() => navigate("/")}
            className="flex-1"
          >
            New Training Session
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/showcase")}
            className="flex-1"
          >
            View Showcase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParentSummary;