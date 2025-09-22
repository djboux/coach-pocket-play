import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, DrillRow } from '@/services/api';
import { mockApi } from '@/services/mockApi';
import { ShowcaseGrid } from '@/components/ShowcaseGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface ShowcaseItem {
  family_id: string;
  level: number;
  ready_to_demo: boolean;
  drill: DrillRow;
}

const Showcase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [childId, setChildId] = useState<string>('');
  const [useMockApi, setUseMockApi] = useState(true);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeShowcase();
  }, []);

  const initializeShowcase = async () => {
    const storedChildId = localStorage.getItem('childId') || '';
    const storedUseMockApi = localStorage.getItem('useMockApi') === 'true';

    setChildId(storedChildId);
    setUseMockApi(storedUseMockApi);

    if (!storedChildId) {
      navigate('/');
      return;
    }

    try {
      setIsLoading(true);
      
      if (storedUseMockApi) {
        // Mock showcase data
        const mockSession = await mockApi.getTodaySession(storedChildId, 'ball_only');
        const mockShowcaseItems: ShowcaseItem[] = mockSession.drills.slice(0, 3).map((drill, index) => ({
          family_id: `showcase_${drill.id}`,
          level: drill.level,
          ready_to_demo: index === 0, // First item is ready to demo
          drill: {
            id: drill.id,
            family_id: `showcase_${drill.id}`,
            title: drill.title,
            level: drill.level,
            skill: drill.skill,
            requirements: 'ball_only',
            instructions: drill.instructions,
            youtube_url: drill.youtube_url || undefined,
            why_it_matters: drill.why_it_matters || undefined
          }
        }));
        setShowcaseItems(mockShowcaseItems);
      } else {
        // Real API
        const showcaseData = await api.getShowcase(storedChildId);
        setShowcaseItems(showcaseData);
      }

    } catch (error) {
      console.error('Error loading showcase:', error);
      toast({
        title: "Connection Error",
        description: "Could not load showcase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (familyId: string) => {
    try {
      if (useMockApi) {
        // Mock removal
        setShowcaseItems(prev => prev.filter(item => item.family_id !== familyId));
        toast({
          title: "Removed from Showcase",
          description: "Drill removed successfully.",
        });
      } else {
        // Real API
        await api.removeFromShowcase(childId, familyId);
        setShowcaseItems(prev => prev.filter(item => item.family_id !== familyId));
        toast({
          title: "Removed from Showcase",
          description: "Drill removed successfully.",
        });
      }
    } catch (error) {
      console.error('Error removing from showcase:', error);
      toast({
        title: "Remove Failed",
        description: "Could not remove drill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShowVideo = (drill: DrillRow) => {
    if (drill.youtube_url) {
      window.open(drill.youtube_url, '_blank');
    } else {
      toast({
        title: "No Video Available",
        description: "This drill doesn't have a video link.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your showcase...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-primary-foreground hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          
          <div className="text-primary-foreground">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="text-4xl">⭐</span>
              Your Showcase
            </h1>
            <p className="text-primary-foreground/80">
              Skills you've mastered • {childId}'s achievements
            </p>
          </div>
        </div>

        {/* Showcase Info */}
        {showcaseItems.length > 0 && (
          <Card className="mb-6 shadow-glow">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{showcaseItems.length}</div>
                  <div className="text-sm text-muted-foreground">Skills mastered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {showcaseItems.filter(item => item.ready_to_demo).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Ready to demo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {Math.max(...showcaseItems.map(item => item.level))}
                  </div>
                  <div className="text-sm text-muted-foreground">Highest level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Showcase Grid */}
        <ShowcaseGrid
          items={showcaseItems}
          onRemove={handleRemove}
          onShowVideo={handleShowVideo}
          isParentView={false}
        />

        {/* Ready to Demo Call-to-Action */}
        {showcaseItems.some(item => item.ready_to_demo) && (
          <Card className="mt-6 shadow-glow border-success/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <div>
                <h3 className="text-xl font-bold text-success">Ready to Show Off!</h3>
                <p className="text-muted-foreground">
                  You have skills that are ready to demonstrate. Show your parents or coach!
                </p>
              </div>
              
              <Button
                onClick={() => navigate('/parent-summary')}
                className="bg-gradient-success text-success-foreground hover:opacity-90"
                size="lg"
              >
                📊 Share with Parents
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Back to Training */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
          >
            Back to Training
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Showcase;