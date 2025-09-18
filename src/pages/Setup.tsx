import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Zap, Target, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-football-training.jpg";

const Setup = () => {
  const [childId, setChildId] = useState("demo");
  const [equipment, setEquipment] = useState<"ball_only" | "cones">("ball_only");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartSession = () => {
    if (!childId.trim()) {
      toast({
        title: "Please enter a child name",
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
      <div className="relative z-10 p-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md space-y-6">
          {/* Hero Section */}
          <div className="text-center text-white space-y-4">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 rounded-full p-6">
                <Target className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Coach in Your Pocket</h1>
            <p className="text-white/90 text-lg">
              Daily football training designed just for you!
            </p>
          </div>

          {/* Setup Form */}
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Let's Get Started
              </CardTitle>
              <CardDescription>
                Set up today's training session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Child Name Input */}
              <div className="space-y-2">
                <Label htmlFor="child-name" className="text-sm font-semibold">
                  What's your name?
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
                  What equipment do you have today?
                </Label>
                <RadioGroup value={equipment} onValueChange={(value: "ball_only" | "cones") => setEquipment(value)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-colors">
                      <RadioGroupItem value="ball_only" id="ball-only" />
                      <Label htmlFor="ball-only" className="flex-1 cursor-pointer">
                        <div className="font-medium">Just a ball</div>
                        <div className="text-sm text-muted-foreground">
                          Perfect for ball control and basic skills
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-colors">
                      <RadioGroupItem value="cones" id="cones" />
                      <Label htmlFor="cones" className="flex-1 cursor-pointer">
                        <div className="font-medium">Ball + Cones/Markers</div>
                        <div className="text-sm text-muted-foreground">
                          Great for agility and advanced drills
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
                Get Today's Session
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/history")}
              className="flex-1 text-white hover:bg-white/20"
            >
              View History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/parent-summary")}
              className="flex-1 text-white hover:bg-white/20"
            >
              Parent Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;