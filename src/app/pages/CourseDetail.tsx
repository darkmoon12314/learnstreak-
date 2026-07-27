import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle, Lock, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { coursesData } from '../data/coursesData';
import { useAuth } from '../contexts/AuthContext';

export const CourseDetail = () => {
  const { courseId } = useParams();
  const { userData } = useAuth();
  
  const course = coursesData.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-[#0A0F24] flex items-center justify-center">
        <p className="text-[#E6F7FF]">Course not found</p>
      </div>
    );
  }

  const isCompleted = userData?.coursesCompleted?.includes(course.id);
  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessonsForCourse = userData?.completedLessons?.[course.id] || [];
  const completedCount = completedLessonsForCourse.length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-[#0A0F24] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/courses" className="inline-flex items-center text-[#00E5FF] hover:text-[#007BFF] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold text-[#E6F7FF] mb-4">{course.title}</h1>
              <p className="text-[#E6F7FF]/80 text-lg mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <span className={`px-4 py-2 rounded-xl font-semibold ${
                  course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border-2 border-green-500' :
                  course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500' :
                  'bg-red-500/20 text-red-400 border-2 border-red-500'
                }`}>
                  {course.difficulty}
                </span>
                
                <div className="flex items-center bg-[#1a2341] border-2 border-[#00E5FF]/30 px-4 py-2 rounded-xl">
                  <BookOpen className="w-5 h-5 text-[#00E5FF] mr-2" />
                  <span className="text-[#E6F7FF]">{totalLessons} Lessons</span>
                </div>

                {isCompleted && (
                  <div className="flex items-center bg-green-500/20 border-2 border-green-500 px-4 py-2 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-green-400 font-semibold">Completed</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl overflow-hidden sticky top-20"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-[#E6F7FF] font-semibold mb-4">Course Progress</h3>
                <div className="w-full bg-[#0A0F24] rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-[#00E5FF] to-[#007BFF] h-3 rounded-full transition-all" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-[#E6F7FF]/60 text-sm">{progressPercentage}% Complete ({completedCount}/{totalLessons} lessons)</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#E6F7FF]">Course Content</h2>
          
          {course.modules.map((module, moduleIndex) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: moduleIndex * 0.1 }}
              className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#00E5FF]/20 to-[#007BFF]/20 border-b-2 border-[#00E5FF]/30 p-6">
                <h3 className="text-xl font-bold text-[#E6F7FF]">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <p className="text-[#E6F7FF]/60 text-sm mt-1">{module.lessons.length} lessons</p>
              </div>

              <div className="divide-y divide-[#00E5FF]/20">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isLessonCompleted = completedLessonsForCourse.includes(lesson.id);
                  const isFirstLesson = moduleIndex === 0 && lessonIndex === 0;
                  const canAccess = isFirstLesson || completedCount > 0; // Allow access if first lesson or some lessons completed
                  
                  return (
                    <Link
                      key={lesson.id}
                      to={canAccess ? `/course/${course.id}/lesson/${module.id}/${lesson.id}` : '#'}
                      className={`block p-6 transition-colors group ${canAccess ? 'hover:bg-[#00E5FF]/5 cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform ${
                            isLessonCompleted 
                              ? 'bg-green-500/20' 
                              : 'bg-gradient-to-br from-[#00E5FF] to-[#007BFF]'
                          }`}>
                            {isLessonCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <Play className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className={`font-semibold group-hover:text-[#00E5FF] transition-colors ${
                              isLessonCompleted ? 'text-[#00E5FF]' : 'text-[#E6F7FF]'
                            }`}>
                              {lesson.title}
                            </h4>
                            <p className="text-[#E6F7FF]/60 text-sm">
                              {lesson.quiz.length} quiz questions {isLessonCompleted && '✓'}
                            </p>
                          </div>
                        </div>
                        {isLessonCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : canAccess ? (
                          <Play className="w-6 h-6 text-[#00E5FF]" />
                        ) : (
                          <Lock className="w-6 h-6 text-[#E6F7FF]/40" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
