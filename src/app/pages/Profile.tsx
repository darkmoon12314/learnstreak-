import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Flame, Trophy, Award, BookOpen, Calendar } from 'lucide-react';
import { badges } from '../utils/badges';

export const Profile = () => {
  const { userData } = useAuth();

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0A0F24] flex items-center justify-center">
        <p className="text-[#E6F7FF]">Loading profile...</p>
      </div>
    );
  }

  const userBadges = badges.filter(badge => userData.badges?.includes(badge.id));
  const joinDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0A0F24] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#00E5FF]/20 to-[#007BFF]/20 border-2 border-[#00E5FF] rounded-2xl p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg shadow-[#00E5FF]/50 flex-shrink-0">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#E6F7FF] mb-2 truncate">{userData.name}</h1>
              <div className="flex items-center justify-center sm:justify-start text-[#E6F7FF]/60 mb-2">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{userData.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start text-[#E6F7FF]/60">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a2341] border-2 border-orange-500/50 rounded-2xl p-4 sm:p-6 text-center"
          >
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mx-auto mb-3" />
            <h3 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1 truncate">{userData.streakCount}</h3>
            <p className="text-[#E6F7FF]/60 text-xs sm:text-sm">Current Streak</p>
            <p className="text-[#E6F7FF]/40 text-[10px] sm:text-xs mt-1 truncate">Max: {userData.maxStreak} d</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a2341] border-2 border-[#00E5FF]/50 rounded-2xl p-4 sm:p-6 text-center"
          >
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-2xl sm:text-3xl font-bold text-[#00E5FF] mb-1 truncate">{userData.xpPoints}</h3>
            <p className="text-[#E6F7FF]/60 text-xs sm:text-sm">Total XP</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a2341] border-2 border-green-500/50 rounded-2xl p-4 sm:p-6 text-center"
          >
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl sm:text-3xl font-bold text-green-500 mb-1 truncate">{userData.coursesCompleted?.length || 0}</h3>
            <p className="text-[#E6F7FF]/60 text-xs sm:text-sm">Courses Done</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1a2341] border-2 border-purple-500/50 rounded-2xl p-4 sm:p-6 text-center"
          >
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-500 mb-1 truncate">{userBadges.length}</h3>
            <p className="text-[#E6F7FF]/60 text-xs sm:text-sm">Badges Earned</p>
          </motion.div>
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#E6F7FF] mb-6">Your Badges</h2>
          
          {userBadges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-[#0A0F24] border-2 border-[#00E5FF]/30 rounded-xl p-4 text-center hover:border-[#00E5FF] transition-all"
                >
                  <div className="text-4xl sm:text-5xl mb-3">{badge.icon}</div>
                  <h3 className="text-[#E6F7FF] font-semibold text-sm sm:text-base mb-1 truncate">{badge.name}</h3>
                  <p className="text-[#E6F7FF]/60 text-[10px] sm:text-xs line-clamp-2">{badge.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Award className="w-12 sm:w-16 h-12 sm:h-16 text-[#E6F7FF]/20 mx-auto mb-4" />
              <p className="text-[#E6F7FF]/60 text-sm">No badges earned yet. Keep learning to unlock achievements!</p>
            </div>
          )}
        </motion.div>

        {/* Available Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#E6F7FF] mb-6">Available Badges</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges
              .filter(badge => !userData.badges?.includes(badge.id))
              .map((badge) => (
                <div
                  key={badge.id}
                  className="bg-[#0A0F24] border-2 border-[#E6F7FF]/20 rounded-xl p-4 text-center opacity-60"
                >
                  <div className="text-3xl sm:text-4xl mb-2 filter grayscale">{badge.icon}</div>
                  <h3 className="text-[#E6F7FF] font-semibold text-xs sm:text-sm mb-1 truncate">{badge.name}</h3>
                  <p className="text-[#E6F7FF]/60 text-[10px] sm:text-xs line-clamp-1">{badge.description}</p>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Learning Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#E6F7FF] mb-6">Learning Progress</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm sm:text-base">
                <span className="text-[#E6F7FF]">XP to Next Level</span>
                <span className="text-[#00E5FF]">{userData.xpPoints} / 500</span>
              </div>
              <div className="w-full bg-[#0A0F24] rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-[#00E5FF] to-[#007BFF] h-3 rounded-full transition-all" 
                  style={{ width: `${Math.min((userData.xpPoints / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2 text-sm sm:text-base">
                <span className="text-[#E6F7FF]">Days to Legend Streak</span>
                <span className="text-orange-500">{userData.streakCount} / 100</span>
              </div>
              <div className="w-full bg-[#0A0F24] rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all" 
                  style={{ width: `${Math.min((userData.streakCount / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
