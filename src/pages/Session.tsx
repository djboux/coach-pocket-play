import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockApi, type Drill, type SessionResponse } from "@/services/mockApi";
import { ArrowLeft, ExternalLink, Flame, TrendingUp, TrendingDown, Target, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Session = () => {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<number>>(new Set());
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const childId = localStorage.getItem("currentChild") || "demo";
  const equipment = (localStorage.getItem("currentEquipment") as "ball_only" | "cones") || "ball_only";

  useEffect(() => {
    loadSession();
    setStreak(mockApi.getStreak(childId));
  }, [childId, equipment]);

  const loadSession = async (ignoreRecent = false) => {
    try {
      setLoading(true);
      const sessionData = await mockApi.getTodaySession(childId, equipment, ignoreRecent);
      setSession(sessionData);
    } catch (error) {
      toast({
        title: "Error loading session",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (drillId: number, rating: "easy" | "right" | "hard") => {
    try {
      await mockApi.submitFeedback({
        child_id: childId,
        drill_id: drillId,
        rating
      });

      setFeedbackGiven(prev => new Set([...prev, drillId]));
      setStreak(mockApi.getStreak(childId));

      const messages = {
        easy: "Great job! 🎉 We'll make it harder next time!",
        right: "Perfect! 💪 Keep up the good work!",
        hard: "No worries! 🤗 We'll adjust the difficulty!"
      };

      toast({
        title: "Feedback recorded!",
        description: messages[rating],
      });
    } catch (error) {
      toast({
        title: "Error saving feedback",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getSkillColor = (skill: string) => {
    const colors = {
      ball_control: "bg-accent text-accent-foreground",
      dribbling: "bg-secondary text-secondary-foreground",
      passing: "bg-success text-success-foreground",
    };
    return colors[skill as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const getFeedbackIcon = (rating: string) => {
    switch (rating) {
      case "easy": return <TrendingUp className="h-4 w-4" />;
      case "hard": return <TrendingDown className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const completedDrills = Array.from(feedbackGiven).length;
  const progressPercentage = session ? (completedDrills / session.drills.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading your training session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Debug Mode</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadSession(true)}
            >
              Reload (Ignore Recent)
            </Button>
          </div>
        </div>

        {/* Progress Header */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Today's Training</h2>
              <p className="text-muted-foreground">
                {childId} • {equipment === "ball_only" ? "Ball Only" : "Ball + Cones"}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completedDrills}/{session?.drills.length || 0} drills</span>
              </div>
              
              {/* Custom Progress with Drill Indicators */}
              <div className="relative">
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                {/* Drill Progress Dots */}
                <div className="flex justify-between mt-2">
                  {session?.drills.map((drill, index) => (
                    <div key={drill.id} className="flex flex-col items-center">
                      <div 
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          feedbackGiven.has(drill.id) 
                            ? 'bg-primary shadow-sm' 
                            : 'bg-muted-foreground/30 border-2 border-muted-foreground/20'
                        }`}
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        {index + 1}
                      </span>
                    </div>
                  )) || []}
                </div>
              </div>

              {/* Next Session Button - Top */}
              <Button
                variant={completedDrills === session?.drills.length && session?.drills.length > 0 ? "default" : "secondary"}
                disabled={completedDrills !== session?.drills.length || !session?.drills.length}
                onClick={() => loadSession(true)}
                className="w-full"
                size="sm"
              >
                Next Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Note */}
        {session?.note && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {session.note}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Drill Cards */}
        <div className="space-y-4">
          {session?.drills.map((drill, index) => (
            <Card key={drill.id} className="shadow-soft">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      {drill.title}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge className={getSkillColor(drill.skill)}>
                        {drill.skill.replace("_", " ")}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < drill.level 
                                  ? 'bg-primary' 
                                  : 'bg-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          Level {drill.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Why it matters */}
                <div className="bg-primary/15 border border-primary/20 p-4 rounded-xl">
                  <h4 className="font-semibold text-sm mb-2 text-primary">
                    💡 Why this drill matters
                  </h4>
                  <p className="text-sm text-foreground">
                    {drill.why_it_matters}
                  </p>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="font-semibold mb-2">How to do it:</h4>
                  <p className="text-sm leading-relaxed">
                    {drill.instructions}
                  </p>
                </div>

                {/* YouTube Link */}
                {drill.youtube_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(drill.youtube_url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Watch Video Guide
                  </Button>
                )}

                {/* Feedback Buttons */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">How did it feel?</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { rating: "hard" as const, label: "Too Hard", variant: "outline" as const, color: "text-red-600" },
                      { rating: "right" as const, label: "Just Right", variant: "success" as const, color: "text-green-600" },
                      { rating: "easy" as const, label: "Too Easy", variant: "secondary" as const, color: "text-blue-600" }
                    ].map(({ rating, label, variant, color }) => (
                      <Button
                        key={rating}
                        variant={feedbackGiven.has(drill.id) ? "success" : "feedback"}
                        size="feedback"
                        onClick={() => handleFeedback(drill.id, rating)}
                        disabled={feedbackGiven.has(drill.id)}
                        className={feedbackGiven.has(drill.id) ? "" : `hover:${color.replace('text-', 'border-')}`}
                      >
                        {getFeedbackIcon(rating)}
                        <span className="text-xs font-medium">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Session Button - Bottom */}
        <div className="flex justify-center">
          <Button
            variant={completedDrills === session?.drills.length && session?.drills.length > 0 ? "default" : "secondary"}
            disabled={completedDrills !== session?.drills.length || !session?.drills.length}
            onClick={() => loadSession(true)}
            className="w-full max-w-xs"
          >
            Next Session
          </Button>
        </div>

        {/* Completion Message */}
        {completedDrills === session?.drills.length && session?.drills.length > 0 && (
          <Card className="bg-gradient-success text-success-foreground text-center">
            <CardContent className="p-6">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold mb-2">Amazing Work!</h3>
              <p className="mb-4">You've completed all today's drills!</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/history")}
                  className="flex-1 bg-white/20 border-white/40 text-white hover:bg-white/30"
                >
                  View Your Progress
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1 bg-white/20 border-white/40 text-white hover:bg-white/30"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Session;