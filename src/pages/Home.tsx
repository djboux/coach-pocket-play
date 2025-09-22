import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Target, 
  Users, 
  Trophy, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Star,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/services/mockApi";
import heroImage from "@/assets/hero-football-training.jpg";

const Home = () => {
  const [childId, setChildId] = useState("demo");
  const [equipment, setEquipment] = useState<"ball_only" | "cones">("ball_only");
  
  const [parentSummary, setParentSummary] = useState<{
    child_id: string;
    feedback_counts: { easy: number; right: number; hard: number };
    streak_days: number;
    levels_progressed: Record<string, number>;
  } | null>(null);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user data on component mount and when returning to page
  useEffect(() => {
    const loadData = () => {
      if (childId) {
        mockApi.getParentSummary(childId).then(summary => {
          setParentSummary(summary);
        });
        
        const history = mockApi.getSessionHistory(childId);
        setSessionHistory(history);
      }
    };

    loadData();

    // Refresh data when user returns to this page
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [childId]);

  const handleStartSession = () => {
    if (!childId.trim()) {
      toast({
        title: "Please enter a name",
        description: "We need to know who we're training today!",
        variant: "destructive",
      });
      return;
    }

    // Store selections in localStorage for the session
    localStorage.setItem("currentChild", childId);
    localStorage.setItem("currentEquipment", equipment);
    
    navigate("/session");
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case "easy": return "🟢";
      case "right": return "🟡";
      case "hard": return "🔴";
      default: return "⚪";
    }
  };

  const getProgressPercentage = () => {
    if (!parentSummary) return 0;
    const total = parentSummary.feedback_counts.easy + 
                  parentSummary.feedback_counts.right + 
                  parentSummary.feedback_counts.hard;
    return Math.min((total / 20) * 100, 100); // Assume 20 drills = 100%
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero/90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-4 space-y-6">
        {/* Header */}
        <div className="text-center text-white space-y-3 pt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-full p-4">
              <Target className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Coach in Your Pocket</h1>
          <p className="text-white/90">
            Your personal football training companion
          </p>
        </div>


        {/* Main Action Card */}
        <Card className="max-w-md mx-auto shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Ready to Train?
            </CardTitle>
            <CardDescription>
              Set up today's session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Child Name Input */}
            <div className="space-y-2">
              <Label htmlFor="child-name" className="text-sm font-semibold">
                Your Name
              </Label>
              <Input
                id="child-name"
                type="text"
                placeholder="Enter your name"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            {/* Equipment Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                Equipment Available
              </Label>
              <RadioGroup value={equipment} onValueChange={(value: "ball_only" | "cones") => setEquipment(value)}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary transition-colors">
                    <RadioGroupItem value="ball_only" id="ball-only" />
                    <Label htmlFor="ball-only" className="flex-1 cursor-pointer">
                      <div className="font-medium">Ball Only</div>
                      <div className="text-sm text-muted-foreground">
                        Ball control & basic skills
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary transition-colors">
                    <RadioGroupItem value="cones" id="cones" />
                    <Label htmlFor="cones" className="flex-1 cursor-pointer">
                      <div className="font-medium">Ball + Markers</div>
                      <div className="text-sm text-muted-foreground">
                        Agility & advanced drills
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Start Button */}
            <Button 
              onClick={handleStartSession}
              variant="hero"
              size="xl"
              className="w-full"
            >
              <Zap className="h-5 w-5" />
              Start Today's Training
            </Button>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <div className="max-w-md mx-auto space-y-3">
          <Button
            variant="drill"
            onClick={() => navigate("/history")}
            className="w-full justify-between text-left h-auto p-4"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              <div>
                <div className="font-semibold">Training History</div>
                <div className="text-sm opacity-75">
                  {sessionHistory.length > 0 ? `${sessionHistory.length} recent sessions` : 'No sessions yet'}
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>

          <Button
            variant="drill"
            onClick={() => navigate("/parent-summary")}
            className="w-full justify-between text-left h-auto p-4"
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <div>
                <div className="font-semibold">Parent Dashboard</div>
                <div className="text-sm opacity-75">Weekly progress overview</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Reset Database Button */}
          <Button
            variant="outline"
            onClick={() => {
              mockApi.resetDatabase();
              // Refresh the data
              if (childId) {
                mockApi.getParentSummary(childId).then(summary => {
                  setParentSummary(summary);
                });
                const history = mockApi.getSessionHistory(childId);
                setSessionHistory(history);
              }
              toast({
                title: "Database Reset",
                description: "All training data has been cleared",
              });
            }}
            className="w-full h-auto p-4 text-muted-foreground hover:text-foreground"
          >
            Reset Database
          </Button>
        </div>

        {/* Recent Activity Preview */}
        {sessionHistory.length > 0 && (
          <Card className="max-w-md mx-auto border-0 bg-white/10 backdrop-blur-sm text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Training
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {sessionHistory.slice(0, 3).map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-white/5">
                    <div className="text-sm">
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1">
                      {session.drills.slice(0, 3).map((drill: any, idx: number) => (
                        <span key={idx} className="text-xs">
                          {getRatingIcon(drill.rating)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;