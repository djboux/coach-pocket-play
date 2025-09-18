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
    rating: "easy" | "right" | "hard";
  }>;
}

const History = () => {
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const childId = localStorage.getItem("currentChild") || "demo";

  useEffect(() => {
    loadHistory();
  }, [childId]);

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

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case "easy":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "right":
        return <Target className="h-4 w-4 text-green-500" />;
      case "hard":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getRatingBadge = (rating: string) => {
    const variants = {
      easy: "bg-blue-100 text-blue-800 border-blue-200",
      right: "bg-green-100 text-green-800 border-green-200",
      hard: "bg-red-100 text-red-800 border-red-200"
    };
    
    return variants[rating as keyof typeof variants] || "bg-gray-100 text-gray-800";
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
              <h1 className="text-2xl font-bold">Training History</h1>
              <p className="text-muted-foreground">{childId}'s progress</p>
            </div>
          </div>
          <Calendar className="h-6 w-6 text-muted-foreground" />
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
                    {session.drills.map((drill, drillIndex) => (
                      <div key={drillIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getRatingIcon(drill.rating)}
                          <span className="font-medium">{drill.title}</span>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={getRatingBadge(drill.rating)}
                        >
                          {drill.rating === "right" ? "Just right" : drill.rating}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Session Summary */}
                  <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {session.drills.filter(d => d.rating === "right").length} Just right
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {session.drills.filter(d => d.rating === "easy").length} Too easy
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {session.drills.filter(d => d.rating === "hard").length} Too hard
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