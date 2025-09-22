import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, DrillRow, FeedbackIn } from '@/services/api';
import { mockApi } from '@/services/mockApi';
import { BonusPicker } from '@/components/BonusPicker';
import { DrillCard } from '@/components/DrillCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Home } from 'lucide-react';

const Bonus = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [childId, setChildId] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('ball_only');
  const [useMockApi, setUseMockApi] = useState(true);
  const [bonusDrills, setBonusDrills] = useState<DrillRow[]>([]);
  const [selectedDrill, setSelectedDrill] = useState<DrillRow | null>(null);
  const [completedBonusDrills, setCompletedBonusDrills] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeBonus();
  }, []);

  const initializeBonus = async () => {
    // Get stored data
    const storedChildId = localStorage.getItem('childId') || '';
    const storedEquipment = localStorage.getItem('equipment') || 'ball_only';
    const storedUseMockApi = localStorage.getItem('useMockApi') === 'true';

    setChildId(storedChildId);
    setEquipment(storedEquipment);
    setUseMockApi(storedUseMockApi);

    if (!storedChildId) {
      navigate('/');
      return;
    }

    try {
      setIsLoading(true);
      
      if (storedUseMockApi) {
        // Use mock API - get some additional drills
        const mockSession = await mockApi.getTodaySession(storedChildId, storedEquipment as "ball_only" | "ball_cones");
        const mockBonusDrills: DrillRow[] = mockSession.drills.slice(3, 8).map(drill => ({
          id: drill.id + 1000, // Offset to avoid conflicts
          family_id: `bonus_${drill.id}`,
          title: `${drill.title} (Bonus)`,
          level: drill.level,
          skill: drill.skill,
            requirements: storedEquipment as "ball_only" | "ball_cones",
            instructions: drill.instructions,
            youtube_url: drill.youtube_url || undefined,
            why_it_matters: drill.why_it_matters || undefined
        }));
        setBonusDrills(mockBonusDrills);
      } else {
        // Use real API
        const drills = await api.getBonusDrills(storedChildId, storedEquipment);
        setBonusDrills(drills);
      }

    } catch (error) {
      console.error('Error loading bonus drills:', error);
      toast({
        title: "Connection Error",
        description: "Could not load bonus drills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDrill = (drill: DrillRow) => {
    setSelectedDrill(drill);
  };

  const handleFeedbackSubmit = async (feedback: FeedbackIn) => {
    try {
      if (useMockApi) {
        // Mock API call
        await mockApi.submitFeedback({
          ...feedback,
          session_id: 1 // Mock session ID
        });

        // Show special bonus message for level ups
        if (feedback.next_action === 'level_up') {
          toast({
            title: "Great work! 🌟",
            description: "Bonus progress will count tomorrow!",
          });
        }
      } else {
        // Real API call
        await api.submitFeedback(feedback);
      }

      // Mark drill as completed
      if (!completedBonusDrills.includes(feedback.drill_id)) {
        setCompletedBonusDrills(prev => [...prev, feedback.drill_id]);
      }

    } catch (error) {
      console.error('Error submitting bonus feedback:', error);
      throw error;
    }
  };

  const handleNextDrill = () => {
    // Return to bonus picker
    setSelectedDrill(null);
    
    toast({
      title: "Bonus drill complete! 🎉",
      description: "Choose another drill or head back home.",
    });
  };

  const handleBack = () => {
    if (selectedDrill) {
      setSelectedDrill(null);
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <BonusPicker
        drills={[]}
        onSelectDrill={() => {}}
        onBack={() => navigate('/')}
        isLoading={true}
      />
    );
  }

  // Show drill card if drill is selected
  if (selectedDrill) {
    return (
      <div className="min-h-screen bg-gradient-primary p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-primary-foreground hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bonus Drills
            </Button>
            
            <div className="text-primary-foreground">
              <h1 className="text-2xl font-bold">Bonus Mode</h1>
              <p className="text-primary-foreground/80">Extra practice for tomorrow!</p>
            </div>
          </div>

          <DrillCard
            drill={selectedDrill}
            childId={childId}
            mode="bonus"
            onFeedbackSubmit={handleFeedbackSubmit}
            onNext={handleNextDrill}
          />

          {/* Bonus complete message */}
          {completedBonusDrills.includes(selectedDrill.id) && (
            <Card className="mt-6 shadow-glow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl">⭐</div>
                <div>
                  <h3 className="text-lg font-semibold text-success">Bonus Drill Complete!</h3>
                  <p className="text-muted-foreground">
                    Great extra practice! Choose another drill or head home.
                  </p>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setSelectedDrill(null)}
                    className="bg-gradient-secondary text-secondary-foreground hover:opacity-90"
                  >
                    More Bonus Drills
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show bonus drill picker
  return (
    <BonusPicker
      drills={bonusDrills}
      onSelectDrill={handleSelectDrill}
      onBack={handleBack}
      isLoading={isLoading}
    />
  );
};

export default Bonus;