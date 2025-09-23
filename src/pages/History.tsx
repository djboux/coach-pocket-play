import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockApi } from "@/services/mockApi";
import { ArrowLeft, Calendar, CheckCircle, AlertCircle, Target } from "lucide-react";

interface SessionHistory {
  date: string;
  drills: Array<{
    title: string;
    difficulty_rating?: "too_easy" | "just_right" | "too_hard";
    effort_rating?: "could_not_do" | "challenging" | "easy";
    rating?: "easy" | "right" | "hard"; // Keep for backward compatibility
    next_action?: string; // Made flexible for backward compatibility
    level?: number;
    instructions?: string;
    attempted?: boolean;
    skipped?: boolean;
    session_mode?: "core" | "bonus";
  }>;
}

const History = () => {
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const childId = localStorage.getItem("childId") || "demo";

  useEffect(() => {
    loadHistory();
  }, [childId]);

  // Add effect to reload history when navigated to
  useEffect(() => {
    const handleFocus = () => loadHistory();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const sessionHistory = mockApi.getSessionHistory(childId);
      setHistory(sessionHistory);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingIcon = (drill: any) => {
    if (drill.skipped) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
    if (!drill.attempted) {
      return <div className="h-4 w-4 rounded border-2 border-gray-300" />;
    }
    
    switch (drill.difficulty_rating || drill.effort_rating) {
      case "too_easy":
      case "easy":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "just_right":
      case "challenging":
        return <Target className="h-4 w-4 text-green-500" />;
      case "too_hard":
      case "could_not_do":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getRatingBadge = (drill: any) => {
    if (drill.skipped) {
      return { variant: "bg-orange-100 text-orange-800 border-orange-200", text: "Skipped" };
    }
    if (!drill.attempted) {
      return { variant: "bg-gray-100 text-gray-800 border-gray-200", text: "Not Attempted" };
    }

    const rating = drill.difficulty_rating || drill.effort_rating;
    const variants = {
      too_easy: { variant: "bg-blue-100 text-blue-800 border-blue-200", text: "Too Easy" },
      easy: { variant: "bg-blue-100 text-blue-800 border-blue-200", text: "Easy" },
      just_right: { variant: "bg-green-100 text-green-800 border-green-200", text: "Just Right" },
      challenging: { variant: "bg-green-100 text-green-800 border-green-200", text: "Challenging" },
      too_hard: { variant: "bg-red-100 text-red-800 border-red-200", text: "Too Hard" },
      could_not_do: { variant: "bg-red-100 text-red-800 border-red-200", text: "Could Not Do" }
    };
    
    return variants[rating as keyof typeof variants] || { variant: "bg-gray-100 text-gray-800", text: "Unknown" };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading your training history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold">Training History</h1>
          </div>
          <p className="text-muted-foreground ml-9">{childId}'s progress</p>
        </div>

        {/* History Cards */}
        {history.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No training history yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your first training session to see your progress here!
              </p>
              <Button onClick={() => navigate("/")}>
                Start Training
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((session, index) => (
              <Card key={session.date} className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    {formatDate(session.date)}
                    <Badge variant="outline">
                      {session.drills.length} drill{session.drills.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {session.drills.map((drill, drillIndex) => {
                      const badgeInfo = getRatingBadge(drill);
                      return (
                        <div key={drillIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getRatingIcon(drill)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{drill.title}</span>
                                {drill.session_mode === 'bonus' && (
                                  <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                                    Bonus
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                <span>Level {drill.level || 1}</span>
                                {drill.instructions && (
                                  <span className="ml-2">
                                    {drill.instructions.substring(0, 50)}...
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              variant="secondary"
                              className={badgeInfo.variant}
                            >
                              {badgeInfo.text}
                            </Badge>
                            {drill.next_action && (
                              <span className="text-xs text-muted-foreground capitalize">
                                Next: {drill.next_action.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Session Summary */}
                  <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {session.drills.filter(d => d.difficulty_rating === "just_right" || d.effort_rating === "challenging").length} Just Right
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {session.drills.filter(d => d.difficulty_rating === "too_easy" || d.effort_rating === "easy").length} Too Easy
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {session.drills.filter(d => d.difficulty_rating === "too_hard" || d.effort_rating === "could_not_do").length} Too Hard
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        {session.drills.filter(d => d.skipped).length} Skipped
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="default"
            onClick={() => navigate("/")}
            className="flex-1"
          >
            New Session
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/parent-summary")}
            className="flex-1"
          >
            Parent Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default History;