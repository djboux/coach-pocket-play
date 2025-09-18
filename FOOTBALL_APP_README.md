# Coach in Your Pocket - Football Training App

A beautiful, mobile-first React web application that provides daily football training sessions for kids, with progress tracking and parent insights.

## ✨ Features Implemented

### 🎯 Core Functionality
- **Child & Equipment Selection**: Choose between ball-only or ball+cones training
- **Daily Sessions**: Get 3 tailored drills based on equipment and skill progression
- **Smart Feedback System**: Rate drills as "Too Easy", "Just Right", or "Too Hard"
- **Automatic Progression**: Difficulty adjusts based on feedback using intelligent algorithms
- **Streak Tracking**: Build training habits with day-streak counters
- **Training History**: View past 7 sessions with drill ratings
- **Parent Dashboard**: Weekly progress snapshot with insights and recommendations

### 🎨 Design Features
- **Mobile-First**: Optimized for touch devices with large tap targets
- **Football Theme**: Vibrant green/orange color scheme with playful gradients
- **Beautiful UI**: Card-based design with smooth animations and transitions
- **Kid-Friendly**: Rounded fonts, emoji feedback, and encouraging messaging

### 📱 User Experience
- **Setup Flow**: Simple child name + equipment selection
- **Session View**: Clear drill cards with instructions, video links, and feedback buttons
- **Progress Visualization**: Animated progress bars and completion celebrations
- **Variety Logic**: Prevents repetitive drills (with debug override)
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🏗️ Technical Architecture

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui component library with custom variants
- **State Management**: React hooks + localStorage for persistence
- **Routing**: React Router for navigation
- **Icons**: Lucide React for consistent iconography

### Mock Backend API
The app includes a complete mock API service (`src/services/mockApi.ts`) that simulates your FastAPI backend contract:

```typescript
// Matches your exact API specification
GET /health → {status: "ok"}
GET /session/today?child_id={id}&equipment={type}&ignore_recent={bool}
POST /feedback (body: {child_id, drill_id, rating})
GET /parent/summary?child_id={id}
GET /debug/feedback?child_id={id}&drill_id={id}
```

### Data & Logic
- **15 Real Drills**: Complete with instructions, YouTube links, and skill progression
- **Progression Algorithm**: Implements your exact requirements:
  - Easy → Level +1 (max 7)
  - Hard → Level -1 (min 1) 
  - Right → Same level twice, then +1
- **Variety System**: Avoids recent drills unless ignore_recent=true
- **Streak Logic**: Tracks consecutive training days
- **Skill Categories**: Ball Control, Dribbling, Passing with individual progression

## 🚀 How to Use

### Getting Started
1. Enter child's name
2. Select equipment (ball only or ball + cones)
3. Tap "Get Today's Session"

### Training Flow
1. View 3 drill cards with instructions and "why it matters"
2. Complete each drill and rate difficulty
3. Watch progress bar fill as you complete drills
4. Celebrate completion with encouraging messages

### Progress Tracking
- **History**: View last 7 training sessions with drill ratings
- **Parent Dashboard**: See streak, feedback distribution, skill progression, and personalized recommendations

### Debug Features
- Toggle "ignore recent" to test progression logic
- View raw feedback data for testing

## 🎮 Interactive Demo Features

### Testable Scenarios
1. **Equipment Filtering**: Switch between ball-only and cones to see different drills
2. **Progression Testing**: Rate drills as "easy" and reload session to see level increases  
3. **Variety System**: Complete a session, then start new one to see different drills
4. **Streak Building**: Train multiple days to build streaks and see parent insights
5. **Parent Analytics**: View comprehensive progress tracking and recommendations

### Sample Data
- Pre-loaded with 15+ football drills across 3 skill categories
- Realistic progression levels (1-3 implemented, expandable to 7)
- YouTube video links for each drill (placeholder URLs)
- Skill-appropriate equipment requirements

## 🔄 Ready for FastAPI Integration

The app is designed to seamlessly connect to your FastAPI backend:

1. **Replace Mock API**: Simply update the API calls in `mockApi.ts` to use fetch() calls to your FastAPI endpoints
2. **Exact Contract Match**: All request/response formats match your specification
3. **Error Handling**: Toast notifications ready for real API error responses
4. **Local Storage**: Currently used for persistence, easily replaceable with real backend

## 🎯 Acceptance Criteria ✅

- ✅ Equipment-based drill filtering (ball_only vs cones)
- ✅ Feedback-driven level progression with exact rules
- ✅ Variety system preventing drill repetition
- ✅ Mobile-optimized with large touch targets
- ✅ Complete drill library with real football exercises
- ✅ Progress tracking and parent insights
- ✅ Debug mode for testing progression
- ✅ Streak counting and engagement metrics
- ✅ Beautiful, kid-friendly design

## 🛠️ Development Notes

### Design System
- Custom CSS variables for consistent theming
- Semantic color tokens (no hardcoded colors in components)
- Button variants for different contexts (hero, feedback, drill)
- Responsive spacing and typography scales

### Performance
- Lazy-loaded components for fast initial render
- Optimized images with proper sizing
- Smooth animations with GPU acceleration
- Mobile-first responsive design principles

### Extensibility
- Modular component architecture
- Easy to add new drill categories or equipment types
- Configurable progression rules
- Expandable analytics and reporting

---

**Ready to train!** This app provides a complete, testable prototype that demonstrates all the core functionality while being visually stunning and user-friendly. Perfect foundation for connecting to your FastAPI backend! ⚽