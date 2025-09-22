import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SessionGuardProps {
  hasCompletedSessionToday: boolean;
  canStartNewSession: boolean;
  onStartBonus: () => void;
  onViewParentSummary: () => void;
  children: ReactNode;
}

export const SessionGuard = ({ 
  hasCompletedSessionToday, 
  canStartNewSession, 
  onStartBonus, 
  onViewParentSummary,
  children 
}: SessionGuardProps) => {
  // If session is complete, show guard with bonus access
  if (hasCompletedSessionToday && !canStartNewSession) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-glow">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-foreground">
              Amazing work today!
            </h1>
            <p className="text-muted-foreground">
              You've completed today's session 🎉. Bonus drills are open; come back tomorrow for a new session.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={onStartBonus}
                className="w-full bg-gradient-secondary text-secondary-foreground hover:opacity-90"
                size="lg"
              >
                ⚽ Bonus Drills
              </Button>
              
              <Button 
                onClick={onViewParentSummary}
                variant="outline"
                className="w-full"
                size="lg"
              >
                📊 See Parent Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Otherwise render children (normal session flow)
  return <>{children}</>;
};
