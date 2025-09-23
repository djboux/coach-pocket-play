import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SessionGuard } from "@/components/SessionGuard";
import { DrillCard } from "@/components/DrillCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api, SessionTodayOut, FeedbackIn } from "@/services/api";
import { mockApi } from "@/services/mockApi";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-football-training.jpg";

const Session = () => {
  const [session, setSession] = useState<SessionTodayOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedDrills, setCompletedDrills] = useState<Set<number>>(new Set());
  const [swapUsed, setSwapUsed] = useState(false);
  const [expandedDrill, setExpandedDrill] = useState<number>(0); // First drill expanded by default
  const navigate = useNavigate();
  const { toast } = useToast();

  const childId = localStorage.getItem("childId") || "";
  const equipment = (localStorage.getItem("equipment") as "ball_only" | "ball_cones") || "ball_only";
  const useMockApi = localStorage.getItem("useMockApi") !== "false";

  useEffect(() => {
    if (childId) {
      loadSession();
    } else {
      navigate('/');
    }
  }, [childId, equipment, navigate]);

  const loadSession = async () => {
    try {
      setLoading(true);
      setCompletedDrills(new Set());
      setSwapUsed(false);
      
      if (useMockApi) {
        const mockSession = await mockApi.getTodaySession(childId, equipment);
        setSession({
          session_id: mockSession.session_id,
          child_id: childId,
          drills: mockSession.drills.slice(0, 3)
        });
      } else {
        const sessionData = await api.getSessionToday(childId, equipment);
        setSession(sessionData);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: "Error loading session",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrillComplete = async (feedback: FeedbackIn) => {
    try {
      if (useMockApi) {
        await mockApi.submitFeedback({
          ...feedback,
          session_id: session?.session_id || 1
        });
      } else {
        await api.submitFeedback(feedback);
      }

      setCompletedDrills(prev => new Set([...prev, feedback.drill_id]));

      // Auto-expand next drill
      const currentIndex = session?.drills.findIndex(d => d.id === feedback.drill_id) || 0;
      if (currentIndex < 2) {
        setExpandedDrill(currentIndex + 1);
      }

      // Check if session is complete
      if (completedDrills.size + 1 >= 3) {
        toast({
          title: "Session Complete! 🎉",
          description: "Amazing work! You can now try bonus drills or start fresh tomorrow.",
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error saving feedback",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSwapDrill = async (drillId: number) => {
    if (swapUsed) return;
    
    try {
      if (useMockApi) {
        // Mock swap - just reload session
        await loadSession();
        setSwapUsed(true);
        toast({
          title: "Drill Swapped",
          description: "Here's a new drill for you!",
        });
      } else {
        const newDrill = await api.swapDrill(childId, drillId);
        if (session) {
          const updatedDrills = session.drills.map(drill => 
            drill.id === drillId ? newDrill : drill
          );
          setSession({ ...session, drills: updatedDrills });
        }
        setSwapUsed(true);
        toast({
          title: "Drill Swapped",
          description: "Here's a new drill for you!",
        });
      }
    } catch (error) {
      console.error('Error swapping drill:', error);
      toast({
        title: "Error swapping drill",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const isSessionComplete = completedDrills.size >= 3;

  if (!childId) {
    return (
    <div className="min-h-screen relative overflow-hidden p-4 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/90"></div>
        </div>
        <Card className="max-w-md mx-auto relative z-10">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Please Set Your Name</h2>
            <p className="text-muted-foreground mb-4">
              Go back to the home page to enter your name and start training.
            </p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden p-4 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/90"></div>
        </div>
        <Card className="max-w-md mx-auto relative z-10">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Loading your training session...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-4">
      {/* Use same background as homepage */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero/90"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          
          <div className="text-white">
            <h1 className="text-2xl font-bold">Today's Training</h1>
            <p className="text-white/80">
              {childId} • {equipment === "ball_only" ? "Ball Only" : "Ball + Markers"}
            </p>
          </div>
        </div>

        {/* Session Guard */}
        <SessionGuard
          hasCompletedSessionToday={isSessionComplete}
          canStartNewSession={!isSessionComplete}
          onStartBonus={() => navigate('/bonus')}
          onViewParentSummary={() => navigate('/parent-summary')}
        >
          {/* Drill Cards */}
          {session && (
            <div className="space-y-6">
              {session.drills.map((drill, index) => (
                <DrillCard
                  key={drill.id}
                  drill={drill}
                  childId={childId}
                  mode="core"
                  drillNumber={index + 1}
                  isExpanded={expandedDrill === index}
                  isCompleted={completedDrills.has(drill.id)}
                  onToggleExpanded={() => setExpandedDrill(expandedDrill === index ? -1 : index)}
                  onFeedbackSubmit={handleDrillComplete}
                  onNext={() => {}}
                  canSwap={!swapUsed && !completedDrills.has(drill.id)}
                  onSwapDrill={() => handleSwapDrill(drill.id)}
                />
              ))}
            </div>
          )}
        </SessionGuard>

        {/* Session Complete Actions */}
        {isSessionComplete && (
          <Card className="mt-8 shadow-glow border-success/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <div>
                <h3 className="text-xl font-bold text-success">Session Complete!</h3>
                <p className="text-muted-foreground">
                  Amazing work! You've completed all 3 core drills for today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate('/bonus')}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  🌟 Try Bonus Drills
                </Button>
                <Button
                  onClick={() => navigate('/showcase')}
                  variant="outline"
                >
                  ⭐ View My Showcase
                </Button>
                <Button
                  onClick={() => navigate('/parent-summary')}
                  variant="outline"
                >
                  📊 Parent Summary
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