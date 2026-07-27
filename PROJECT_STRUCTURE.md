# Edusense AI - Project Structure

## 📁 Directory Structure

```
/src
├── /app
│   ├── App.tsx                    # Main app component with router
│   ├── routes.tsx                 # Route configuration
│   │
│   ├── /components
│   │   ├── Navbar.tsx            # Navigation bar with user stats
│   │   ├── AITutor.tsx           # Floating AI chat assistant
│   │   └── Layout.tsx            # Layout wrapper with auth check
│   │
│   ├── /config
│   │   ├── firebase.ts           # Firebase configuration
│   │   └── groq.ts               # Groq AI configuration
│   │
│   ├── /contexts
│   │   └── AuthContext.tsx       # Authentication & user data context
│   │
│   ├── /data
│   │   └── coursesData.ts        # Course content and structure
│   │
│   ├── /pages
│   │   ├── Login.tsx             # Login/Signup page
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── Courses.tsx           # Course listing
│   │   ├── CourseDetail.tsx      # Course overview
│   │   ├── LessonViewer.tsx      # Lesson content & quiz
│   │   ├── Leaderboard.tsx       # User rankings
│   │   ├── Certificates.tsx      # Certificate management
│   │   └── Profile.tsx           # User profile
│   │
│   ├── /types
│   │   └── index.ts              # TypeScript type definitions
│   │
│   └── /utils
│       ├── badges.ts             # Badge system logic
│       └── certificates.ts       # PDF certificate generator
│
└── /styles
    ├── fonts.css                 # Custom font imports
    └── theme.css                 # Tailwind theme configuration
```

## 🔑 Key Files Explained

### Core Configuration

**`/src/app/config/firebase.ts`**
- Firebase initialization
- Realtime Database setup
- Authentication setup

**`/src/app/config/groq.ts`**
- Groq AI client configuration
- API key setup

### Authentication & State

**`/src/app/contexts/AuthContext.tsx`**
- User authentication state
- Firebase auth integration
- User data management
- Streak tracking logic
- Auto-update on login

### Data & Content

**`/src/app/data/coursesData.ts`**
- Course structure (5 courses)
- Module organization
- Lesson content
- Quiz questions with answers

**`/src/app/utils/badges.ts`**
- Badge definitions
- Achievement requirements
- Badge award logic

### Pages

**Dashboard** - Landing page after login
- Stats overview (streak, XP, courses, badges)
- Quick actions
- Course progress
- Recommendations

**Courses** - Browse all courses
- Search functionality
- Filter by difficulty
- Course cards with images

**Course Detail** - Individual course view
- Module breakdown
- Lesson list
- Progress tracking

**Lesson Viewer** - Learning interface
- Lesson content display
- Interactive quiz
- Progress updates
- XP rewards

**Leaderboard** - Competitive rankings
- Sort by XP, streak, or courses
- User rank highlighting
- Top performers

**Certificates** - Achievement showcase
- PDF generation
- Download functionality
- Certificate preview

**Profile** - User information
- Personal stats
- Badge collection
- Progress metrics

### Components

**Navbar** - Site navigation
- Streak counter
- XP display
- User menu
- Sign out

**AITutor** - Floating chat
- Groq AI integration
- Context-aware responses
- Course assistance
- Motivational support

**Layout** - Route wrapper
- Authentication check
- Navigation inclusion
- Toast notifications
- AI Tutor integration

## 🎯 Data Flow

1. **Authentication**
   - User signs up/in via Firebase Auth
   - User data created/loaded from Realtime DB
   - AuthContext provides user state globally

2. **Learning Flow**
   - User browses courses → Course listing
   - Selects course → Course detail
   - Starts lesson → Lesson viewer
   - Completes quiz → XP awarded
   - Progress saved → Firebase DB

3. **Gamification**
   - Daily login → Streak check/update
   - Lesson complete → +10 XP
   - Quiz passed → +20 XP
   - Achievements → Badge unlock
   - All updates → Firebase sync

4. **AI Interaction**
   - User asks question → Groq API
   - AI processes → Llama 3.3 response
   - Chat history maintained
   - Context preserved

## 🔐 Security Considerations

**Current Setup (Demo)**
- API keys in client code
- Firebase config exposed
- Suitable for learning/demo

**Production Requirements**
- Move API calls to backend
- Use environment variables
- Implement API key rotation
- Add rate limiting
- Secure Firebase rules

## 🎨 Styling Approach

- **Tailwind CSS v4** for utility classes
- **Custom theme** in theme.css
- **Neon blue palette** (#00E5FF, #007BFF)
- **Dark background** (#0A0F24)
- **Motion animations** for interactions
- **Responsive design** mobile-first

## 📊 Database Schema

```
users/
  {userId}/
    uid: string
    email: string
    name: string
    streakCount: number
    maxStreak: number
    xpPoints: number
    coursesCompleted: string[]
    certificates: string[]
    badges: string[]
    lastLoginDate: string
```

## 🚀 Key Features Implementation

### Streak Tracking
- Checks last login date
- Increments if consecutive
- Resets if skipped
- Awards badges at milestones

### AI Tutor
- Uses Groq SDK
- Llama 3.3 70B model
- System prompt for context
- Maintains conversation history

### Certificate Generation
- jsPDF library
- Custom design
- Unique IDs
- Downloadable PDFs

### Progress Tracking
- Quiz scoring (70% pass)
- XP accumulation
- Badge unlocking
- Course completion

## 🔄 Update Flow

**When user completes lesson:**
1. Quiz score calculated
2. If ≥70%: proceed
3. Update streak (if today)
4. Award XP points
5. Check for new badges
6. Save to Firebase
7. Show notifications
8. Redirect to course

## 💡 Best Practices Used

- TypeScript for type safety
- React Context for state
- Custom hooks potential
- Component composition
- Separation of concerns
- Responsive design patterns
- Optimistic UI updates
- Error boundaries ready
- Loading states
- Accessibility considerations

---

Built with modern web technologies for an engaging learning experience! 🎓✨
