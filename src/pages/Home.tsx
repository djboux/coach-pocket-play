import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Target, 
  Users, 
  Trophy, 
  Calendar,
  ChevronRight,
  Star,
  Clock,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, ParentSummaryOut } from "@/services/api";
import { mockApi } from "@/services/mockApi";
import heroImage from "@/assets/hero-football-training.jpg";

const Home = () => {
  const [childId, setChildId] = useState(() => localStorage.getItem('childId') || '');
  const [equipment, setEquipment] = useState<"ball_only" | "ball_cones">("ball_only");
  const [useMockApi, setUseMockApi] = useState(() => localStorage.getItem('useMockApi') !== 'false');
  const [parentSummary, setParentSummary] = useState<ParentSummaryOut | null>(null);
  const [sessionStatus, setSessionStatus] = useState<'none' | 'in_progress' | 'complete'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('childId', childId);
    localStorage.setItem('useMockApi', useMockApi.toString());
  }, [childId, useMockApi]);

  useEffect(() => {
    if (childId) {
      loadDashboardData();
    }
  }, [childId, useMockApi]);

  const loadDashboardData = async () => {
    if (!childId) return;
    
    try {
      setIsLoading(true);
      
      if (useMockApi) {
        // Mock data
        const mockSummary = await mockApi.getParentSummary(childId);
        setParentSummary({
          child_id: childId,
          sessions_this_week: 3,
          session_dates: [],
          progress: [],
          effort_mix: {
            could_not_do: mockSummary.effort_mix.could_not_do,
            challenging: mockSummary.effort_mix.challenging,
            easy: mockSummary.effort_mix.easy
          },
          stuck_signals: [],
          showcase: []
        });
      } else {
        // Real API
        const summary = await api.getParentSummary(childId);
        setParentSummary(summary);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSession = () => {
    if (!childId.trim()) {
      toast({
        title: "Please enter a name",
        description: "We need to know who we're training today!",
        variant: "destructive",
      });
      return;
    }

    // Store selections in localStorage
    localStorage.setItem("childId", childId);
    localStorage.setItem("equipment", equipment);
    localStorage.setItem("useMockApi", useMockApi.toString());
    
    navigate("/session");
  };

  const getTotalEffort = () => {
    if (!parentSummary) return 0;
    return parentSummary.effort_mix.could_not_do + 
           parentSummary.effort_mix.challenging + 
           parentSummary.effort_mix.easy;
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
              <RadioGroup value={equipment} onValueChange={(value: "ball_only" | "ball_cones") => setEquipment(value)}>
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
                    <RadioGroupItem value="ball_cones" id="ball-cones" />
                    <Label htmlFor="ball-cones" className="flex-1 cursor-pointer">
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
            onClick={() => navigate("/showcase")}
            className="w-full justify-between text-left h-auto p-4"
          >
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5" />
              <div>
                <div className="font-semibold">My Showcase</div>
                <div className="text-sm opacity-75">Skills I've mastered</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>

          <Button
            variant="drill"
            onClick={() => navigate("/history")}
            className="w-full justify-between text-left h-auto p-4"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              <div>
                <div className="font-semibold">Training History</div>
                <div className="text-sm opacity-75">Past sessions</div>
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
        </div>

        {/* Debug Section */}
        <Card className="max-w-md mx-auto border-0 bg-black/20 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Debug Mode
              </CardTitle>
              <CardDescription className="text-white/70">
                Development tools and data management
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {/* API Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                <div className="text-white">
                  <div className="font-medium">API Mode</div>
                  <div className="text-xs text-white/70">
                    {useMockApi ? "Using demo data" : "Using real backend"}
                  </div>
                </div>
                <Switch
                  checked={useMockApi}
                  onCheckedChange={setUseMockApi}
                />
              </div>

              {/* Reset Database */}
              <Button
                variant="outline"
                onClick={() => {
                  mockApi.resetDatabase();
                  loadDashboardData();
                  toast({
                    title: "Database Reset",
                    description: "All training data has been cleared",
                  });
                }}
                className="w-full bg-white/5 text-white border-white/20 hover:bg-white/10"
              >
                Reset Database
              </Button>
            </CardContent>
          </Card>

        {/* Quick Stats */}
        {parentSummary && (
          <Card className="max-w-md mx-auto border-0 bg-white/10 backdrop-blur-sm text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{parentSummary.sessions_this_week}</div>
                  <div className="text-xs text-white/80">Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{getTotalEffort()}</div>
                  <div className="text-xs text-white/80">Total Drills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{parentSummary.showcase.length}</div>
                  <div className="text-xs text-white/80">Showcased</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;