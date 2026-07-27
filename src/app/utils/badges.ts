export interface Badge {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'streak' | 'xp' | 'course' | 'quiz';
  icon: string;
}

export const badges: Badge[] = [
  {
    id: 'bronze-streak',
    name: 'Bronze Streak',
    description: '3-day learning streak',
    requirement: 3,
    type: 'streak',
    icon: '🥉'
  },
  {
    id: 'silver-streak',
    name: 'Silver Streak',
    description: '7-day learning streak',
    requirement: 7,
    type: 'streak',
    icon: '🥈'
  },
  {
    id: 'gold-streak',
    name: 'Gold Streak',
    description: '30-day learning streak',
    requirement: 30,
    type: 'streak',
    icon: '🥇'
  },
  {
    id: 'legend-streak',
    name: 'Legend Streak',
    description: '100-day learning streak',
    requirement: 100,
    type: 'streak',
    icon: '👑'
  },
  {
    id: 'fast-learner',
    name: 'Fast Learner',
    description: 'Complete 5 courses',
    requirement: 5,
    type: 'course',
    icon: '⚡'
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Pass 20 quizzes',
    requirement: 20,
    type: 'quiz',
    icon: '🎯'
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Reach 500 XP',
    requirement: 500,
    type: 'xp',
    icon: '💎'
  },
  {
    id: 'ai-explorer',
    name: 'AI Explorer',
    description: 'Complete AI course',
    requirement: 1,
    type: 'course',
    icon: '🤖'
  }
];

export const checkNewBadges = (userData: any, previousData: any): Badge[] => {
  const newBadges: Badge[] = [];
  
  badges.forEach(badge => {
    const hasAlready = previousData?.badges?.includes(badge.id);
    if (hasAlready) return;
    
    let shouldAward = false;
    
    switch (badge.type) {
      case 'streak':
        shouldAward = userData.streakCount >= badge.requirement;
        break;
      case 'xp':
        shouldAward = userData.xpPoints >= badge.requirement;
        break;
      case 'course':
        shouldAward = userData.coursesCompleted?.length >= badge.requirement;
        break;
      case 'quiz':
        shouldAward = userData.quizzesPassed >= badge.requirement;
        break;
    }
    
    if (shouldAward) {
      newBadges.push(badge);
    }
  });
  
  return newBadges;
};
