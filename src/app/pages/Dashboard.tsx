import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Flame, Trophy, Award, BookOpen, TrendingUp, Target, Zap, ChevronRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { coursesData } from '../data/coursesData';
import { badges } from '../utils/badges';
import { WelcomeModal } from '../components/WelcomeModal';

const Dashboard = () => {
  const { userData, showWelcome } = useAuth();
  const userBadges = badges.filter(badge => userData?.badges?.includes(badge.id));

  // Real tracking logic: Show any course the user has interacted with (started or finished)
  const myCourses = coursesData.filter(course => {
    const completedInCourse = userData?.completedLessons?.[course.id] || [];
    return completedInCourse.length > 0 || userData?.coursesCompleted?.includes(course.id);
  });

  // Sort: Put "In Progress" first, then "Completed"
  myCourses.sort((a, b) => {
    const aDone = userData?.coursesCompleted?.includes(a.id);
    const bDone = userData?.coursesCompleted?.includes(b.id);
    if (aDone && !bDone) return 1;
    if (!aDone && bDone) return -1;
    return 0;
  });

  // If the user has started/finished courses, show those.
  // If they have fewer than 3, pad with the first 3 default ones for a full UI.
  const coursesToShow = myCourses.length >= 3
    ? myCourses
    : [...myCourses, ...coursesData.filter(c => !myCourses.find(mc => mc.id === c.id))].slice(0, 3);

  const recommendedCourses = coursesData.filter(course =>
    !userData?.coursesCompleted?.includes(course.id) &&
    !(userData?.completedLessons?.[course.id]?.length > 0)
  ).slice(0, 3);

  const calculateProgress = (courseId: string) => {
    if (userData?.coursesCompleted?.includes(courseId)) return 100;
    if (!userData?.completedLessons?.[courseId]) return 0;

    const course = coursesData.find(c => c.id === courseId);
    if (!course) return 0;

    const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const completedCount = userData.completedLessons[courseId].length;

    return Math.round((completedCount / totalLessons) * 100);
  };

  return (
    <div className="min-h-screen bg-[#0A0F24] pb-20">
      {/* Welcome Modal for new users */}
      {userData && (
        <WelcomeModal 
          userName={userData.name} 
          isNewUser={showWelcome}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {userData?.name}!</h1>
            <p className="text-[#E6F7FF]/60 text-sm mt-1">Ready to continue your learning journey?</p>
          </div>
          <div className="flex items-center space-x-2">
            {userBadges.slice(0, 3).map(badge => (
              <div key={badge.id} className="w-10 h-10 rounded-lg bg-[#1a2341] border border-[#00E5FF]/30 flex items-center justify-center text-xl" title={badge.name}>
                {badge.icon}
              </div>
            ))}
            {userBadges.length > 3 && (
              <Link to="/profile" className="text-xs text-[#00E5FF] hover:underline ml-2">+{userBadges.length - 3} more</Link>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500 rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-orange-400 text-xs sm:text-sm font-semibold truncate">Streak</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 truncate">{userData?.streakCount || 0}</h3>
              </div>
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 opacity-80 flex-shrink-0" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500 rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-yellow-400 text-xs sm:text-sm font-semibold truncate">XP Points</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 truncate">{userData?.xpPoints || 0}</h3>
              </div>
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 opacity-80 flex-shrink-0" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500 rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-green-400 text-xs sm:text-sm font-semibold truncate">Courses</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 truncate">{userData?.coursesCompleted?.length || 0}</h3>
              </div>
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 opacity-80 flex-shrink-0" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500 rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-purple-400 text-xs sm:text-sm font-semibold truncate">Badges</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1 truncate">{userData?.badges?.length || 0}</h3>
              </div>
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 opacity-80 flex-shrink-0" />
            </div>
          </motion.div>
        </div>
        
        {/* My Courses Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {myCourses.length > 0 ? 'My Learning Journey' : 'Start Your Journey'}
            </h2>
            <Link to="/courses" className="text-[#00E5FF] text-sm font-semibold flex items-center hover:underline">
              Explore All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coursesToShow.map((course, index) => {
              const progress = calculateProgress(course.id);
              const isCompleted = progress === 100;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-[#1a2341] rounded-2xl shadow-xl overflow-hidden border-2 transition-all group ${
                    isCompleted ? 'border-green-500/30 hover:border-green-500/50' : 'border-[#00E5FF]/20 hover:border-[#00E5FF]/50'
                  }`}
                >
                  <div className="h-40 overflow-hidden relative">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2341] to-transparent opacity-60"></div>
                    <div className="absolute bottom-3 left-4">
                      {isCompleted ? (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className={`${progress > 0 ? 'bg-[#00E5FF]' : 'bg-gray-500'} text-[#0A0F24] text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>
                          {progress > 0 ? 'In Progress' : 'New Course'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#00E5FF] transition-colors">{course.title}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="w-full bg-[#0A0F24] rounded-full h-2">
                          <div
                            className={`${isCompleted ? 'bg-green-500' : 'bg-[#00E5FF]'} h-2 rounded-full transition-all duration-1000`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`${isCompleted ? 'text-green-400' : 'text-[#E6F7FF]/60'} text-xs font-medium`}>{progress}%</span>
                    </div>

                    {isCompleted ? (
                      <Link
                        to={`/certificates`}
                        className="mt-5 w-full bg-green-500/10 border border-green-500/30 text-green-400 py-3 px-4 rounded-xl text-sm font-semibold hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" /> View Certificate
                      </Link>
                    ) : (
                      <Link
                        to={`/course/${course.id}`}
                        className="mt-5 w-full bg-[#0A0F24] border border-[#00E5FF]/30 text-[#E6F7FF] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#00E5FF] hover:text-[#0A0F24] transition-all flex items-center justify-center gap-2"
                      >
                        {progress > 0 ? 'Resume Lesson' : 'Start Learning'}
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Recommended Courses Section */}
        {recommendedCourses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-[#1a2341] rounded-2xl shadow-xl overflow-hidden hover:border-[#00E5FF]/50 border-2 border-transparent transition-all group"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#0A0F24]/80 backdrop-blur-md text-[#E6F7FF] text-[10px] px-2 py-1 rounded-lg border border-[#00E5FF]/20 capitalize">
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#00E5FF] transition-colors">{course.title}</h3>
                    <p className="text-sm text-[#E6F7FF]/50 mt-1 line-clamp-2">{course.description}</p>
                    <Link
                      to={`/course/${course.id}`}
                      className="mt-4 inline-flex items-center text-[#00E5FF] text-sm font-semibold hover:gap-2 transition-all"
                    >
                      Start Course <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Dashboard };
