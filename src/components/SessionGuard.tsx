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
  // Always render children - let the parent handle the success state
  return <>{children}</>;
};
