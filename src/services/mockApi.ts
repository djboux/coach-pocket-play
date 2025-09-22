// Mock API service that simulates the FastAPI backend
// This matches the exact API contract specified in the requirements

export interface Drill {
  id: number;
  title: string;
  family: string; // Drill family name (e.g., "Toe Taps", "Inside-Outside Touches")
  skill: string;
  level: number;
  requirements: "ball_only" | "cones";
  instructions: string;
  youtube_url: string;
  why_it_matters: string;
}

export interface SessionResponse {
  child_id: string;
  drills: Drill[];
  note: string;
}

export interface FeedbackRequest {
  child_id: string;
  drill_id: number;
  rating: "easy" | "right" | "hard";
}

export interface ParentSummary {
  child_id: string;
  feedback_counts: {
    easy: number;
    right: number;
    hard: number;
  };
  streak_days: number;
  levels_progressed: Record<string, number>;
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
    requirements: "cones",
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
    requirements: "cones",
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
    requirements: "cones",
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
let feedbackHistory: Array<FeedbackRequest & { timestamp: Date }> = [];
let recentDrills: Record<string, number[]> = {}; // child_id -> drill IDs from last session
let streakData: Record<string, { lastSession: Date; streakDays: number }> = {};

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

  switch (latestFeedback.rating) {
    case "easy":
      return Math.min(7, currentLevel + 1);
    case "hard":
      return Math.max(1, currentLevel - 1);
    case "right":
      // Stay same level once more, then bump next time
      const rightCount = feedbackHistory
        .filter(f => f.child_id === childId)
        .filter(f => drillFamily.some(d => d.id === f.drill_id))
        .filter(f => f.rating === "right")
        .length;
      return rightCount >= 2 ? Math.min(7, currentLevel + 1) : currentLevel;
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
  async getTodaySession(childId: string, equipment: "ball_only" | "cones", ignoreRecent = false): Promise<SessionResponse> {
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

    return {
      child_id: childId,
      drills: selectedDrills,
      note: ignoreRecent ? "Variety + progression swap active (ignore recent enabled)" : "Variety + progression swap active"
    };
  },

  // POST /feedback
  async submitFeedback(feedback: FeedbackRequest) {
    feedbackHistory.push({
      ...feedback,
      timestamp: new Date()
    });

    // Update streak
    const today = new Date().toDateString();
    const streak = streakData[feedback.child_id] || { lastSession: new Date(0), streakDays: 0 };
    
    if (streak.lastSession.toDateString() === today) {
      // Already trained today, don't increment
    } else if (new Date(streak.lastSession.getTime() + 24 * 60 * 60 * 1000).toDateString() === today) {
      // Consecutive day
      streak.streakDays += 1;
      streak.lastSession = new Date();
    } else {
      // Streak broken, restart
      streak.streakDays = 1;
      streak.lastSession = new Date();
    }
    
    streakData[feedback.child_id] = streak;

    return { ok: true };
  },

  // GET /parent/summary
  async getParentSummary(childId: string): Promise<ParentSummary> {
    const history = getChildHistory(childId);
    const feedbackCounts = {
      easy: history.filter(f => f.rating === "easy").length,
      right: history.filter(f => f.rating === "right").length,
      hard: history.filter(f => f.rating === "hard").length
    };

    const streakDays = streakData[childId]?.streakDays || 0;

    // Calculate levels progressed by skill
    const levelsProgressed: Record<string, number> = {};
    const skills = [...new Set(DRILL_LIBRARY.map(d => d.skill))];
    
    for (const skill of skills) {
      const skillDrills = DRILL_LIBRARY.filter(d => d.skill === skill);
      const skillFeedback = history.filter(f => 
        skillDrills.some(d => d.id === f.drill_id)
      );
      
      // Count level-ups from "easy" feedback
      levelsProgressed[skill] = skillFeedback.filter(f => f.rating === "easy").length;
    }

    return {
      child_id: childId,
      feedback_counts: feedbackCounts,
      streak_days: streakDays,
      levels_progressed: levelsProgressed
    };
  },

  // GET /debug/feedback - for testing
  async getDebugFeedback(childId?: string, drillId?: number) {
    let filtered = feedbackHistory;
    
    if (childId) {
      filtered = filtered.filter(f => f.child_id === childId);
    }
    
    if (drillId) {
      filtered = filtered.filter(f => f.drill_id === drillId);
    }
    
    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Last 10
  },

  // Helper to get current streak
  getStreak(childId: string): number {
    return streakData[childId]?.streakDays || 0;
  },

  // Helper to get session history for display
  getSessionHistory(childId: string) {
    // Return actual feedback history if available, otherwise mock data
    const history = getChildHistory(childId);
    
    if (history.length > 0) {
      const sessionDates = [...new Set(history.map(f => f.timestamp.toDateString()))];
      
      return sessionDates.slice(0, 7).map(date => {
        const dayFeedback = history.filter(f => f.timestamp.toDateString() === date);
        const drills = dayFeedback.map(f => {
          const drill = DRILL_LIBRARY.find(d => d.id === f.drill_id);
          return {
            title: drill?.title || "Unknown",
            rating: f.rating,
            level: drill?.level || 1,
            instructions: drill?.instructions || ""
          };
        });
        
        return { date, drills };
      });
    }
    
    // Mock training history data with completed drills for demo
    const mockHistory = [
      {
        date: new Date().toISOString(),
        drills: [
          { title: "Toe Taps", rating: "right" as const, level: 2, instructions: "Alternate taps with both feet. Goal: 30 in 30s." },
          { title: "Figure-8 Dribble", rating: "easy" as const, level: 1, instructions: "Dribble in a figure-8 around two objects (use shoes). 3 laps." },
          { title: "Wall Passes", rating: "right" as const, level: 3, instructions: "40 alternating-foot passes." }
        ]
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        drills: [
          { title: "Cone Slalom", rating: "hard" as const, level: 2, instructions: "Slalom down and back twice in 30s." },
          { title: "Juggling Practice", rating: "right" as const, level: 1, instructions: "Keep the ball up using feet only. Goal: 5 touches." },
          { title: "Inside–Outside Touches", rating: "right" as const, level: 2, instructions: "30 cycles at faster pace." }
        ]
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        drills: [
          { title: "Step Over Practice", rating: "easy" as const, level: 1, instructions: "Step over the ball with each foot. 10 each side." },
          { title: "Wall Passes", rating: "right" as const, level: 1, instructions: "20 passes with right foot against a wall." }
        ]
      }
    ];
    
    return mockHistory;
  }
};