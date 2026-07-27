import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { coursesData } from '../data/coursesData';
import { useAuth } from '../contexts/AuthContext';
import { checkNewBadges } from '../utils/badges';
import { generateCertificate } from '../utils/certificates';
import { toast } from 'sonner';

export const LessonViewer = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const { userData, updateUserData } = useAuth();
  const navigate = useNavigate();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  const course = coursesData.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);

  if (!course || !module || !lesson) {
    return (
      <div className="min-h-screen bg-[#0A0F24] flex items-center justify-center">
        <p className="text-[#E6F7FF]">Lesson not found</p>
      </div>
    );
  }

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (currentQuestion < lesson.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      const correctAnswers = lesson.quiz.filter((q, i) => newAnswers[i] === q.correctAnswer).length;
      const finalScore = Math.round((correctAnswers / lesson.quiz.length) * 100);
      setScore(finalScore);
      setQuizComplete(true);
      
      if (finalScore >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        handleLessonComplete();
      }
    }
  };

  const handleLessonComplete = async () => {
    if (!userData || !courseId) return;

    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userData.lastLoginDate || '';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = userData.streakCount || 0;
    
    // Update streak based on login dates
    if (lastLogin === yesterdayStr) {
      // Logged in yesterday, increment streak
      newStreak = (userData.streakCount || 0) + 1;
    } else if (lastLogin !== today) {
      // Haven't logged in today yet, start new streak
      newStreak = 1;
    } else if (lastLogin === today && (userData.streakCount || 0) === 0) {
      // First lesson on first day (new user), start streak at 1
      newStreak = 1;
    }

    const newXP = (userData.xpPoints || 0) + 30; // 10 XP for lesson + 20 XP for quiz
    const maxStreak = Math.max(newStreak, userData.maxStreak || 0);

    // Track completed lesson
    const completedLessons = { ...userData.completedLessons };
    if (!completedLessons[courseId]) {
      completedLessons[courseId] = [];
    }
    if (lessonId && !completedLessons[courseId].includes(lessonId)) {
      completedLessons[courseId].push(lessonId);
    }

    // Check if entire course is completed
    const course = coursesData.find(c => c.id === courseId);
    let allLessons: string[] = [];
    if (course) {
      course.modules.forEach(module => {
        module.lessons.forEach(lesson => {
          allLessons.push(lesson.id);
        });
      });
    }

    console.log('🎯 Course Completion Check:', {
      courseId,
      courseName: course?.title,
      totalLessonsInCourse: allLessons.length,
      completedLessonsCount: completedLessons[courseId]?.length || 0,
      completedLessonsIds: completedLessons[courseId]
    });

    const previousData = { ...userData };
    const newUserData: any = {
      streakCount: newStreak,
      maxStreak: maxStreak,
      xpPoints: newXP,
      lastLoginDate: today,
      completedLessons: completedLessons,
      quizzesPassed: (userData.quizzesPassed || 0) + 1,  // Increment quiz count
      coursesCompleted: userData.coursesCompleted || [],  // Ensure array exists
      certificates: userData.certificates || []  // Ensure array exists
    };

    // If all lessons completed, generate certificate
    if (allLessons.length > 0 && completedLessons[courseId].length === allLessons.length) {
      const coursesCompleted = userData.coursesCompleted || [];
      const certificates = userData.certificates || [];
      
      if (!coursesCompleted.includes(courseId)) {
        const certificateId = `cert_${courseId}_${Date.now()}`;
        newUserData.coursesCompleted = [...coursesCompleted, courseId];
        newUserData.certificates = [...certificates, certificateId];
        
        console.log('✅ Course Completed! Adding to coursesCompleted:', courseId);
        
        // Generate certificate PDF
        const certificatePDF = generateCertificate(userData.name, course?.title || 'Unknown Course', today);
        
        toast.success(`🎓 Certificate Generated for ${course?.title}!`);
      }
    }

    try {
      await updateUserData(newUserData);
      toast.success(`✅ Lesson completed! +30 XP | Streak: ${newStreak} 🔥`);
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to save lesson completion. Please try again.');
      return;
    }

    // Check for new badges
    const newBadges = checkNewBadges({ ...userData, ...newUserData }, previousData);
    if (newBadges.length > 0) {
      const updatedBadges = [...(userData.badges || []), ...newBadges.map(b => b.id)];
      await updateUserData({ badges: updatedBadges });
      
      newBadges.forEach(badge => {
        toast.success(`🎉 New Badge Unlocked: ${badge.name}!`);
      });
    }
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuizComplete(false);
    setScore(0);
  };

  const currentQuiz = lesson.quiz[currentQuestion];

  return (
    <div className="min-h-screen bg-[#0A0F24] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to={`/course/${courseId}`} className="inline-flex items-center text-[#00E5FF] hover:text-[#007BFF] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Course
        </Link>

        {!showQuiz ? (
          // Lesson Content
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl p-8"
          >
            <h1 className="text-3xl font-bold text-[#E6F7FF] mb-6">{lesson.title}</h1>
            
            <div className="prose prose-invert max-w-none mb-8">
              <div className="text-[#E6F7FF]/80 whitespace-pre-line leading-relaxed">
                {lesson.content}
              </div>
            </div>

            <button
              onClick={() => setShowQuiz(true)}
              className="w-full bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all"
            >
              Start Quiz
            </button>
          </motion.div>
        ) : !quizComplete ? (
          // Quiz
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl p-8"
          >
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#00E5FF] font-semibold">
                  Question {currentQuestion + 1} of {lesson.quiz.length}
                </span>
                <span className="text-[#E6F7FF]/60">
                  {Math.round(((currentQuestion) / lesson.quiz.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-[#0A0F24] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#00E5FF] to-[#007BFF] h-2 rounded-full transition-all" 
                  style={{ width: `${((currentQuestion) / lesson.quiz.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#E6F7FF] mb-6">{currentQuiz.question}</h2>

            <div className="space-y-3 mb-8">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === index
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#E6F7FF]'
                      : 'bg-[#0A0F24] border-[#00E5FF]/30 text-[#E6F7FF]/80 hover:border-[#00E5FF]/50'
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion < lesson.quiz.length - 1 ? 'Next Question' : 'Submit Quiz'}
            </button>
          </motion.div>
        ) : (
          // Quiz Results
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl p-8 text-center"
          >
            {score >= 70 ? (
              <>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-[#E6F7FF] mb-2">Congratulations! 🎉</h2>
                <p className="text-[#E6F7FF]/80 mb-6">You passed the quiz!</p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-[#E6F7FF] mb-2">Keep Trying!</h2>
                <p className="text-[#E6F7FF]/80 mb-6">You need 70% to pass</p>
              </>
            )}

            <div className="bg-[#0A0F24] border-2 border-[#00E5FF]/30 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-[#00E5FF] mb-2">{score}%</div>
              <p className="text-[#E6F7FF]/60">
                {answers.filter((a, i) => a === lesson.quiz[i].correctAnswer).length} / {lesson.quiz.length} correct
              </p>
            </div>

            <div className="flex gap-4">
              {score >= 70 ? (
                <button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="flex-1 bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all"
                >
                  Back to Course
                </button>
              ) : (
                <>
                  <button
                    onClick={retryQuiz}
                    className="flex-1 bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all"
                  >
                    Retry Quiz
                  </button>
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="flex-1 bg-[#0A0F24] border-2 border-[#00E5FF]/30 text-[#E6F7FF] py-4 rounded-xl font-semibold hover:border-[#00E5FF] transition-all"
                  >
                    Review Lesson
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
