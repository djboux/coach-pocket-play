// Mock API service that simulates the FastAPI backend
// This matches the exact API contract specified in the requirements

export interface Drill {
  id: number;
  title: string;
  family: string; // Drill family name (e.g., "Toe Taps", "Inside-Outside Touches")
  skill: string;
  level: number;
  requirements: "ball_only" | "ball_cones";
  instructions: string;
  youtube_url: string;
  why_it_matters: string;
}

export interface SessionTodayOut {
  session_id: number;
  child_id: string;
  drills: DrillRow[];
}

export interface DrillRow {
  id: number;
  family_id: string;
  title: string;
  level: number;
  skill: string;
  requirements: "ball_only" | "ball_cones";
  instructions: string;
  youtube_url?: string;
  why_it_matters?: string;
}

export interface FeedbackIn {
  child_id: string;
  session_id: number;
  drill_id: number;
  attempted: boolean;
  difficulty_rating?: "could_not_do" | "challenging" | "easy";
  next_action?: "repeat_same" | "make_easier" | "tiny_challenge" | "level_up" | "repeat_for_fun" | "add_to_showcase";
  session_mode: "core" | "bonus";
}

export interface ParentSummaryOut {
  child_id: string;
  sessions_this_week: number;
  session_dates: string[];
  progress: Array<{ family_id: string; delta: "up" | "same" | "down" }>;
  effort_mix: { could_not_do: number; challenging: number; easy: number };
  stuck_signals: Array<{ family_id: string; consecutive_could_not_do: number }>;
  showcase: Array<{ family_id: string; level: number; ready_to_demo: boolean }>;
}

const DRILL_LIBRARY: Drill[] = [
  {
    id: 1,
    title: "Toe Taps",
    family: "Toe Taps",
    skill: "ball_control",
    level: 1,
    requirements: "ball_only",
    instructions: "Stand over the ball. Alternate feet tapping the top. Goal: 20 in 30s.",
    youtube_url: "https://www.youtube.com/watch?v=dummy1",
    why_it_matters: "Improves rhythm and close control."
  },
  {
    id: 2,
    title: "Toe Taps",
    family: "Toe Taps",
    skill: "ball_control",
    level: 2,
    requirements: "ball_only",
    instructions: "Alternate taps with both feet. Goal: 30 in 30s.",
    youtube_url: "https://www.youtube.com/watch?v=dummy1",
    why_it_matters: "Improves rhythm and close control."
  },
  {
    id: 3,
    title: "Toe Taps",
    family: "Toe Taps",
    skill: "ball_control",
    level: 3,
    requirements: "ball_only",
    instructions: "Increase speed. Goal: 40 in 30s with head up.",
    youtube_url: "https://www.youtube.com/watch?v=dummy1",
    why_it_matters: "Improves rhythm and close control."
  },
  {
    id: 4,
    title: "Inside–Outside Touches",
    family: "Inside-Outside Touches",
    skill: "ball_control",
    level: 1,
    requirements: "ball_only",
    instructions: "Alternate inside/outside touches with each foot. 20 cycles.",
    youtube_url: "https://www.youtube.com/watch?v=dummy2",
    why_it_matters: "Teaches ball manipulation with both sides of the foot."
  },
  {
    id: 5,
    title: "Inside–Outside Touches",
    family: "Inside-Outside Touches",
    skill: "ball_control",
    level: 2,
    requirements: "ball_only",
    instructions: "30 cycles at faster pace.",
    youtube_url: "https://www.youtube.com/watch?v=dummy2",
    why_it_matters: "Teaches ball manipulation with both sides of the foot."
  },
  {
    id: 6,
    title: "Inside–Outside Touches",
    family: "Inside-Outside Touches",
    skill: "ball_control",
    level: 3,
    requirements: "ball_only",
    instructions: "40 cycles with head up.",
    youtube_url: "https://www.youtube.com/watch?v=dummy2",
    why_it_matters: "Teaches ball manipulation with both sides of the foot."
  },
  {
    id: 7,
    title: "Figure-8 Dribble",
    family: "Figure-8 Dribble",
    skill: "dribbling",
    level: 1,
    requirements: "ball_only",
    instructions: "Dribble in a figure-8 around two objects (use shoes). 3 laps.",
    youtube_url: "https://www.youtube.com/watch?v=dummy6",
    why_it_matters: "Teaches control in tight turns."
  },
  {
    id: 8,
    title: "Figure-8 Dribble",
    family: "Figure-8 Dribble",
    skill: "dribbling",
    level: 2,
    requirements: "ball_only",
    instructions: "Figure-8 faster. 4 laps.",
    youtube_url: "https://www.youtube.com/watch?v=dummy6",
    why_it_matters: "Teaches control in tight turns."
  },
  {
    id: 9,
    title: "Figure-8 Dribble",
    family: "Figure-8 Dribble",
    skill: "dribbling",
    level: 3,
    requirements: "ball_only",
    instructions: "Figure-8 with head up. 5 laps.",
    youtube_url: "https://www.youtube.com/watch?v=dummy6",
    why_it_matters: "Teaches control in tight turns."
  },
  {
    id: 10,
    title: "Wall Passes",
    family: "Wall Passes",
    skill: "passing",
    level: 1,
    requirements: "ball_only",
    instructions: "20 passes with right foot against a wall.",
    youtube_url: "https://www.youtube.com/watch?v=dummy7",
    why_it_matters: "Builds accuracy and confidence with stronger foot."
  },
  {
    id: 11,
    title: "Wall Passes",
    family: "Wall Passes",
    skill: "passing",
    level: 2,
    requirements: "ball_only",
    instructions: "20 passes with left foot.",
    youtube_url: "https://www.youtube.com/watch?v=dummy7",
    why_it_matters: "Develops weaker foot accuracy."
  },
  {
    id: 12,
    title: "Wall Passes",
    family: "Wall Passes",
    skill: "passing",
    level: 3,
    requirements: "ball_only",
    instructions: "40 alternating-foot passes.",
    youtube_url: "https://www.youtube.com/watch?v=dummy7",
    why_it_matters: "Builds accuracy and two-footed passing."
  },
  {
    id: 13,
    title: "Cone Slalom",
    family: "Cone Slalom",
    skill: "dribbling",
    level: 1,
    requirements: "ball_cones",
    instructions: "5 cones 1m apart. Slalom down and back once.",
    youtube_url: "https://www.youtube.com/watch?v=dummy11",
    why_it_matters: "Builds close control and agility."
  },
  {
    id: 14,
    title: "Cone Slalom",
    family: "Cone Slalom",
    skill: "dribbling",
    level: 2,
    requirements: "ball_cones",
    instructions: "Slalom down and back twice in 30s.",
    youtube_url: "https://www.youtube.com/watch?v=dummy11",
    why_it_matters: "Builds close control and agility."
  },
  {
    id: 15,
    title: "Cone Slalom",
    family: "Cone Slalom",
    skill: "dribbling",
    level: 3,
    requirements: "ball_cones",
    instructions: "Slalom down/back with weak foot only, twice.",
    youtube_url: "https://www.youtube.com/watch?v=dummy11",
    why_it_matters: "Builds weak foot and tight dribbling."
  },
  // Additional drills for more variety
  {
    id: 16,
    title: "Juggling Practice",
    family: "Juggling Practice",
    skill: "ball_control",
    level: 1,
    requirements: "ball_only",
    instructions: "Keep the ball up using feet only. Goal: 5 touches.",
    youtube_url: "https://www.youtube.com/watch?v=dummy3",
    why_it_matters: "Develops touch, balance, and concentration."
  },
  {
    id: 17,
    title: "Juggling Practice",
    family: "Juggling Practice",
    skill: "ball_control",
    level: 2,
    requirements: "ball_only",
    instructions: "Keep the ball up using feet only. Goal: 10 touches.",
    youtube_url: "https://www.youtube.com/watch?v=dummy3",
    why_it_matters: "Develops touch, balance, and concentration."
  },
  {
    id: 18,
    title: "Step Over Practice",
    family: "Step Over Practice",
    skill: "dribbling",
    level: 1,
    requirements: "ball_only",
    instructions: "Step over the ball with each foot. 10 each side.",
    youtube_url: "https://www.youtube.com/watch?v=dummy8",
    why_it_matters: "Learns basic deception and body movement."
  }
];

// Mock storage for persistence  
let feedbackHistory: Array<FeedbackIn & { timestamp: Date }> = [];
let recentDrills: Record<string, number[]> = {}; // child_id -> drill IDs from last session
let sessionIdCounter = 1;

// Helper functions
function getChildHistory(childId: string) {
  return feedbackHistory.filter(f => f.child_id === childId);
}

function getDrillFamilies(drill: Drill) {
  return DRILL_LIBRARY.filter(d => 
    d.title === drill.title && 
    d.skill === drill.skill && 
    d.requirements === drill.requirements
  );
}

function getNextLevel(childId: string, drillFamily: Drill[], currentLevel: number): number {
  const latestFeedback = feedbackHistory
    .filter(f => f.child_id === childId)
    .filter(f => drillFamily.some(d => d.id === f.drill_id))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

  if (!latestFeedback) return currentLevel;

  switch (latestFeedback.difficulty_rating) {
    case "easy":
      return Math.min(7, currentLevel + 1);
    case "could_not_do":
      return Math.max(1, currentLevel - 1);
    case "challenging":
      // Stay same level once more, then bump next time
      const challengingCount = feedbackHistory
        .filter(f => f.child_id === childId)
        .filter(f => drillFamily.some(d => d.id === f.drill_id))
        .filter(f => f.difficulty_rating === "challenging")
        .length;
      return challengingCount >= 2 ? Math.min(7, currentLevel + 1) : currentLevel;
    default:
      return currentLevel;
  }
}

// Mock API endpoints
export const mockApi = {
  // GET /health
  async getHealth() {
    return { status: "ok" };
  },

  // GET /session/today
  async getTodaySession(childId: string, equipment: "ball_only" | "ball_cones", ignoreRecent = false): Promise<SessionTodayOut> {
    // Filter drills by equipment
    const availableDrills = DRILL_LIBRARY.filter(d => d.requirements === equipment);
    
    // Get recent drills to avoid repetition
    const recentIds = ignoreRecent ? [] : (recentDrills[childId] || []);
    const nonRecentDrills = availableDrills.filter(d => !recentIds.includes(d.id));
    
    // Group by drill family (title + skill + requirements)
    const drillFamilies = new Map<string, Drill[]>();
    nonRecentDrills.forEach(drill => {
      const key = `${drill.title}-${drill.skill}-${drill.requirements}`;
      if (!drillFamilies.has(key)) {
        drillFamilies.set(key, []);
      }
      drillFamilies.get(key)!.push(drill);
    });

    // Select 3 different families, apply progression logic
    const selectedDrills: Drill[] = [];
    const familyKeys = Array.from(drillFamilies.keys()).slice(0, 3);
    
    for (const familyKey of familyKeys) {
      const family = drillFamilies.get(familyKey)!;
      const baseLevel = family[0].level;
      const targetLevel = getNextLevel(childId, family, baseLevel);
      
      // Find drill at target level or closest
      const targetDrill = family.find(d => d.level === targetLevel) || family[0];
      selectedDrills.push(targetDrill);
    }

    // If we don't have enough non-recent drills, fill with any available
    while (selectedDrills.length < 3 && selectedDrills.length < availableDrills.length) {
      const remaining = availableDrills.filter(d => !selectedDrills.some(s => s.id === d.id));
      if (remaining.length > 0) {
        selectedDrills.push(remaining[0]);
      } else {
        break;
      }
    }

    // Update recent drills
    recentDrills[childId] = selectedDrills.map(d => d.id);

    // Convert Drill[] to DrillRow[]
    const drillRows: DrillRow[] = selectedDrills.map(drill => ({
      id: drill.id,
      family_id: drill.family,
      title: drill.title,
      level: drill.level,
      skill: drill.skill,
      requirements: drill.requirements,
      instructions: drill.instructions,
      youtube_url: drill.youtube_url,
      why_it_matters: drill.why_it_matters
    }));

    return {
      session_id: sessionIdCounter++,
      child_id: childId,
      drills: drillRows
    };
  },

  // POST /feedback
  async submitFeedback(feedback: FeedbackIn) {
    feedbackHistory.push({
      ...feedback,
      timestamp: new Date()
    });

    return { ok: true };
  },

  // GET /parent/summary
  async getParentSummary(childId: string): Promise<ParentSummaryOut> {
    const history = getChildHistory(childId);
    const effortMix = {
      could_not_do: history.filter(f => f.difficulty_rating === "could_not_do").length,
      challenging: history.filter(f => f.difficulty_rating === "challenging").length,
      easy: history.filter(f => f.difficulty_rating === "easy").length
    };

    // Mock data for other fields
    const sessionsThisWeek = Math.floor(Math.random() * 7) + 1;
    const sessionDates = Array.from({ length: sessionsThisWeek }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const progress = [
      { family_id: "Toe Taps", delta: "up" as const },
      { family_id: "Figure-8 Dribble", delta: "same" as const },
      { family_id: "Wall Passes", delta: "down" as const }
    ];

    const stuckSignals = [
      { family_id: "Cone Slalom", consecutive_could_not_do: 2 }
    ];

    const showcase = [
      { family_id: "Juggling Practice", level: 2, ready_to_demo: true },
      { family_id: "Step Over Practice", level: 1, ready_to_demo: false }
    ];

    return {
      child_id: childId,
      sessions_this_week: sessionsThisWeek,
      session_dates: sessionDates,
      progress: progress,
      effort_mix: effortMix,
      stuck_signals: stuckSignals,
      showcase: showcase
    };
  },

  // Remove remaining mock code that references old fields
  resetDatabase() {
    feedbackHistory = [];
    recentDrills = {};
    console.log("Database reset - all data cleared");
  },

  // Helper to get session history for display (mock implementation)
  getSessionHistory(childId: string) {
    return [];
  }
};