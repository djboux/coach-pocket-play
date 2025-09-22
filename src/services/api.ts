// Real API service for football training app
// Uses same-origin relative paths to connect to FastAPI backend

export type DrillRow = {
  id: number;
  family_id: string;
  title: string;
  level: number;
  skill: string;
  requirements: "ball_only" | "ball_cones";
  instructions: string;
  youtube_url?: string;
  why_it_matters?: string;
};

export type SessionTodayOut = {
  session_id: number;
  child_id: string;
  drills: DrillRow[];
};

export type FeedbackIn = {
  child_id: string;
  session_id: number;
  drill_id: number;
  attempted: boolean;
  difficulty_rating?: "could_not_do" | "challenging" | "easy";
  next_action?: "repeat_same" | "make_easier" | "tiny_challenge" | "level_up" | "repeat_for_fun" | "add_to_showcase";
  session_mode: "core" | "bonus";
};

export type ParentSummaryOut = {
  child_id: string;
  sessions_this_week: number;
  session_dates: string[];
  progress: Array<{ family_id: string; delta: "up" | "same" | "down" }>;
  effort_mix: { could_not_do: number; challenging: number; easy: number };
  stuck_signals: Array<{ family_id: string; consecutive_could_not_do: number }>;
  showcase: Array<{ family_id: string; level: number; ready_to_demo: boolean }>;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  // Get today's session drills
  async getSessionToday(childId: string, equipment: string, ignoreRecent = false): Promise<SessionTodayOut> {
    const params = new URLSearchParams({
      child_id: childId,
      equipment,
      ignore_recent: ignoreRecent.toString()
    });
    
    const response = await fetch(`/session/today?${params}`);
    return handleResponse(response);
  },

  // Submit drill feedback
  async submitFeedback(feedback: FeedbackIn): Promise<{ ok: boolean }> {
    const response = await fetch('/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
    return handleResponse(response);
  },

  // Get parent summary
  async getParentSummary(childId: string): Promise<ParentSummaryOut> {
    const params = new URLSearchParams({ child_id: childId });
    const response = await fetch(`/parent/summary?${params}`);
    return handleResponse(response);
  },

  // Get available bonus drills
  async getBonusDrills(childId: string, equipment: string): Promise<DrillRow[]> {
    const params = new URLSearchParams({
      child_id: childId,
      equipment,
    });
    
    const response = await fetch(`/bonus/drills?${params}`);
    return handleResponse(response);
  },

  // Get showcase drills
  async getShowcase(childId: string): Promise<Array<{ family_id: string; level: number; ready_to_demo: boolean; drill: DrillRow }>> {
    const params = new URLSearchParams({ child_id: childId });
    const response = await fetch(`/showcase?${params}`);
    return handleResponse(response);
  },

  // Remove from showcase
  async removeFromShowcase(childId: string, familyId: string): Promise<{ ok: boolean }> {
    const response = await fetch('/showcase/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        child_id: childId,
        family_id: familyId,
      }),
    });
    return handleResponse(response);
  },

  // Swap drill (once per session)
  async swapDrill(childId: string, drillId: number): Promise<DrillRow> {
    const response = await fetch('/session/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        child_id: childId,
        drill_id: drillId,
      }),
    });
    return handleResponse(response);
  },

  // Undo last action (within 5 seconds)
  async undoLastAction(childId: string): Promise<{ ok: boolean }> {
    const response = await fetch('/undo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        child_id: childId,
      }),
    });
    return handleResponse(response);
  },
};