import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockApi, type ParentSummary as ParentSummaryType } from "@/services/mockApi";
import { ArrowLeft, TrendingUp, Flame, Target, BarChart3, Clock, Trophy } from "lucide-react";

const ParentSummary = () => {
  const [summary, setSummary] = useState<ParentSummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const childId = localStorage.getItem("currentChild") || "demo";

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
    return summary.feedback_counts.easy + summary.feedback_counts.right + summary.feedback_counts.hard;
  };

  const getSkillProgress = (skill: string, levels: number) => {
    // Convert levels progressed to a percentage (assuming max 7 levels per skill)
    return Math.min((levels / 7) * 100, 100);
  };

  const getEngagementScore = () => {
    if (!summary) return 0;
    const total = getTotalFeedback();
    if (total === 0) return 0;
    
    // Calculate engagement based on feedback distribution
    // "right" ratings show good engagement, "easy" shows progress, "hard" shows challenge
    const { easy, right, hard } = summary.feedback_counts;
    const balanceScore = Math.min(right / total * 100, 70); // Up to 70% for balanced ratings
    const progressScore = Math.min(easy / total * 100 * 0.5, 20); // Up to 20% for progression
    const streakBonus = Math.min(summary.streak_days * 2, 10); // Up to 10% for consistency
    
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
              <p className="text-muted-foreground">{childId}'s weekly progress snapshot</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Sessions */}
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">{getTotalFeedback()}</div>
              <div className="text-sm opacity-90">Total Drills Completed</div>
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
              Training Feedback
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
                    <div className="text-2xl font-bold text-green-600">{summary.feedback_counts.right}</div>
                    <div className="text-sm text-green-700">Just Right</div>
                    <div className="text-xs text-green-600 mt-1">Perfect challenge level</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{summary.feedback_counts.easy}</div>
                    <div className="text-sm text-blue-700">Too Easy</div>
                    <div className="text-xs text-blue-600 mt-1">Ready for harder drills</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">{summary.feedback_counts.hard}</div>
                    <div className="text-sm text-red-700">Too Hard</div>
                    <div className="text-xs text-red-600 mt-1">Needs more practice</div>
                  </div>
                </div>

                {getTotalFeedback() > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Feedback Distribution</div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                      {summary.feedback_counts.right > 0 && (
                        <div 
                          className="bg-green-500" 
                          style={{ width: `${(summary.feedback_counts.right / getTotalFeedback()) * 100}%` }}
                        />
                      )}
                      {summary.feedback_counts.easy > 0 && (
                        <div 
                          className="bg-blue-500" 
                          style={{ width: `${(summary.feedback_counts.easy / getTotalFeedback()) * 100}%` }}
                        />
                      )}
                      {summary.feedback_counts.hard > 0 && (
                        <div 
                          className="bg-red-500" 
                          style={{ width: `${(summary.feedback_counts.hard / getTotalFeedback()) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Skill Progression */}
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
            {summary && Object.keys(summary.levels_progressed).length > 0 ? (
              Object.entries(summary.levels_progressed).map(([skill, levels]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">
                      {skill.replace("_", " ")}
                    </span>
                    <Badge variant="secondary">
                      +{levels} level{levels !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <Progress 
                    value={getSkillProgress(skill, levels)} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {levels > 0 ? `Progressed ${levels} level${levels !== 1 ? 's' : ''} this week` : 'Working on fundamentals'}
                  </div>
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

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Training Recommendations</CardTitle>
            <CardDescription>
              Suggestions based on {childId}'s progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary && (
                <>
                  {summary.streak_days === 0 && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Get Started!</div>
                        <div className="text-sm text-muted-foreground">
                          Begin with regular training sessions to build habits and track progress.
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {summary.streak_days > 0 && summary.streak_days < 7 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Building Momentum!</div>
                        <div className="text-sm text-muted-foreground">
                          Great start! Try to maintain daily training to build a solid foundation.
                        </div>
                      </div>
                    </div>
                  )}

                  {summary.feedback_counts.easy > summary.feedback_counts.right && (
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Ready for More Challenge</div>
                        <div className="text-sm text-muted-foreground">
                          {childId} is finding drills too easy. The app will automatically increase difficulty.
                        </div>
                      </div>
                    </div>
                  )}

                  {summary.feedback_counts.hard > summary.feedback_counts.right && (
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Focus on Fundamentals</div>
                        <div className="text-sm text-muted-foreground">
                          Some drills are challenging. The app will adjust to build confidence gradually.
                        </div>
                      </div>
                    </div>
                  )}

                  {summary.streak_days >= 7 && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium">Amazing Consistency!</div>
                        <div className="text-sm text-muted-foreground">
                          {childId} has built a great training habit. Consider adding equipment for variety.
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

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
            onClick={() => navigate("/history")}
            className="flex-1"
          >
            View Full History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParentSummary;