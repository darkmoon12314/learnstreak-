import { useState, useEffect } from 'react';
import { X, Sparkles, Flame, Trophy, Award, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WelcomeModalProps {
  userName: string;
  isNewUser: boolean;
}

export const WelcomeModal = ({ userName, isNewUser }: WelcomeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isNewUser) {
      setIsOpen(true);
    }
  }, [isNewUser]);

  if (!isNewUser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#0A0F24] border-2 border-[#00E5FF] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00E5FF] to-[#007BFF] p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white text-center mb-2">
                Welcome to Edusense AI, {userName}! 🎉
              </h2>
              <p className="text-white/90 text-center">
                Your AI-powered learning journey starts now
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#E6F7FF] mb-4">🚀 Quick Start Guide</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-[#E6F7FF] font-semibold mb-1">Browse Courses</h4>
                      <p className="text-[#E6F7FF]/60 text-sm">
                        Explore our library of tech courses - Python, Cybersecurity, AI, Web Dev, and Networking
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-[#E6F7FF] font-semibold mb-1">Complete Lessons & Quizzes</h4>
                      <p className="text-[#E6F7FF]/60 text-sm">
                        Learn at your own pace and test your knowledge with interactive quizzes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-[#E6F7FF] font-semibold mb-1">Build Your Streak</h4>
                      <p className="text-[#E6F7FF]/60 text-sm">
                        Learn daily to maintain your streak and unlock special badges
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="text-[#E6F7FF] font-semibold mb-1">Chat with AI Tutor</h4>
                      <p className="text-[#E6F7FF]/60 text-sm">
                        Click the AI button (bottom right) anytime you need help or explanation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#00E5FF]/30 pt-6">
                <h3 className="text-xl font-bold text-[#E6F7FF] mb-4">🏆 Gamification Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1a2341] border-2 border-orange-500/30 rounded-xl p-4">
                    <Flame className="w-8 h-8 text-orange-500 mb-2" />
                    <h4 className="text-[#E6F7FF] font-semibold text-sm mb-1">Daily Streaks</h4>
                    <p className="text-[#E6F7FF]/60 text-xs">Learn daily to keep your streak alive</p>
                  </div>

                  <div className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-xl p-4">
                    <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                    <h4 className="text-[#E6F7FF] font-semibold text-sm mb-1">XP Points</h4>
                    <p className="text-[#E6F7FF]/60 text-xs">Earn points for every lesson and quiz</p>
                  </div>

                  <div className="bg-[#1a2341] border-2 border-purple-500/30 rounded-xl p-4">
                    <Award className="w-8 h-8 text-purple-500 mb-2" />
                    <h4 className="text-[#E6F7FF] font-semibold text-sm mb-1">Badges</h4>
                    <p className="text-[#E6F7FF]/60 text-xs">Unlock achievements as you progress</p>
                  </div>

                  <div className="bg-[#1a2341] border-2 border-green-500/30 rounded-xl p-4">
                    <BookOpen className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="text-[#E6F7FF] font-semibold text-sm mb-1">Certificates</h4>
                    <p className="text-[#E6F7FF]/60 text-xs">Download certificates upon completion</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all"
              >
                Let's Start Learning! 🚀
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
