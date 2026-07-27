import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardUser {
  uid: string;
  name: string;
  xpPoints: number;
  streakCount: number;
  coursesCompleted: string[];
}

export const Leaderboard = () => {
  const { userData } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [tab, setTab] = useState<'xp' | 'streak' | 'courses'>('xp');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersArray: LeaderboardUser[] = Object.values(usersData);
          setUsers(usersArray);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getSortedUsers = () => {
    const sorted = [...users];
    switch (tab) {
      case 'xp':
        return sorted.sort((a, b) => (b.xpPoints || 0) - (a.xpPoints || 0));
      case 'streak':
        return sorted.sort((a, b) => (b.streakCount || 0) - (a.streakCount || 0));
      case 'courses':
        return sorted.sort((a, b) => (b.coursesCompleted?.length || 0) - (a.coursesCompleted?.length || 0));
      default:
        return sorted;
    }
  };

  const sortedUsers = getSortedUsers();
  const userRank = sortedUsers.findIndex(u => u.uid === userData?.uid) + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />;
      default:
        return <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[#E6F7FF]/60 font-bold text-sm sm:text-base">#{rank}</div>;
    }
  };

  const getValue = (user: LeaderboardUser) => {
    switch (tab) {
      case 'xp':
        return `${user.xpPoints || 0} XP`;
      case 'streak':
        return `${user.streakCount || 0} d`;
      case 'courses':
        return `${user.coursesCompleted?.length || 0} c`;
      default:
        return '';
    }
  };

  const getFullValue = (user: LeaderboardUser) => {
    switch (tab) {
      case 'xp':
        return `${user.xpPoints || 0} XP`;
      case 'streak':
        return `${user.streakCount || 0} days`;
      case 'courses':
        return `${user.coursesCompleted?.length || 0} courses`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F24] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-2">
            <TrendingUp className="w-8 h-8 text-[#00E5FF] mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#E6F7FF]">Leaderboard</h1>
          </div>
          <p className="text-[#E6F7FF]/60 text-sm sm:text-base">See how you rank against other learners</p>
        </motion.div>

        {/* Your Rank Card */}
        {userData && userRank > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#00E5FF]/20 to-[#007BFF]/20 border-2 border-[#00E5FF] rounded-2xl p-4 sm:p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-base">
                  #{userRank}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-[#E6F7FF] font-semibold truncate">Your Rank</h3>
                  <p className="text-[#E6F7FF]/60 text-xs sm:text-sm truncate">{userData.name}</p>
                </div>
              </div>
              <div className="text-right ml-2">
                <p className="text-lg sm:text-2xl font-bold text-[#00E5FF] whitespace-nowrap">{getFullValue(userData as any)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setTab('xp')}
            className={`flex-1 min-w-[100px] py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
              tab === 'xp'
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white shadow-lg shadow-[#00E5FF]/30'
                : 'bg-[#1a2341] text-[#E6F7FF]/60 border-2 border-[#00E5FF]/20 hover:border-[#00E5FF]/50'
            }`}
          >
            🏆 XP
          </button>
          <button
            onClick={() => setTab('streak')}
            className={`flex-1 min-w-[100px] py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
              tab === 'streak'
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white shadow-lg shadow-[#00E5FF]/30'
                : 'bg-[#1a2341] text-[#E6F7FF]/60 border-2 border-[#00E5FF]/20 hover:border-[#00E5FF]/50'
            }`}
          >
            🔥 Streak
          </button>
          <button
            onClick={() => setTab('courses')}
            className={`flex-1 min-w-[100px] py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
              tab === 'courses'
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white shadow-lg shadow-[#00E5FF]/30'
                : 'bg-[#1a2341] text-[#E6F7FF]/60 border-2 border-[#00E5FF]/20 hover:border-[#00E5FF]/50'
            }`}
          >
            📚 Courses
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-[#E6F7FF]/60">Loading leaderboard...</p>
            </div>
          ) : sortedUsers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#E6F7FF]/60">No users found</p>
            </div>
          ) : (
            sortedUsers.slice(0, 50).map((user, index) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-2 rounded-xl p-3 sm:p-4 transition-all ${
                  user.uid === userData?.uid
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF]'
                    : index < 3
                    ? 'bg-[#1a2341] border-[#00E5FF]/50'
                    : 'bg-[#1a2341] border-[#00E5FF]/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 overflow-hidden">
                    <div className="flex-shrink-0">
                      {getRankIcon(index + 1)}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-[#E6F7FF] font-semibold text-sm sm:text-base truncate">
                        {user.name}
                        {user.uid === userData?.uid && (
                          <span className="ml-2 text-[#00E5FF] text-xs sm:text-sm">(You)</span>
                        )}
                      </h3>
                      <p className="text-[#E6F7FF]/60 text-xs sm:text-sm">Rank #{index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-base sm:text-xl font-bold text-[#00E5FF] whitespace-nowrap">{getValue(user)}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
