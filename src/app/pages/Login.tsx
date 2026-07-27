import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        await signUp(email, password, name);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F24] flex overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00E5FF]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#007BFF]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(#00E5FF 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
      </div>

      {/* Left Side: Visual/Branding (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 border-r border-[#00E5FF]/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#00E5FF]/20 rounded-full blur-3xl" />
          <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.3)]">
            <BookOpen className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mt-12 z-10"
        >
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            Learn<span className="text-[#00E5FF]">Streak</span>
          </h1>
          <p className="text-xl text-[#E6F7FF]/60 max-w-md leading-relaxed">
            The world's first AI-driven learning ecosystem that turns consistency into expertise.
          </p>

          {/*<div className="mt-12 flex items-center gap-8 justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#00E5FF]">50K+</p>
              <p className="text-sm text-[#E6F7FF]/40 uppercase tracking-widest">Learners</p>
            </div>
            <div className="w-px h-10 bg-[#00E5FF]/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-[#00E5FF]">200+</p>
              <p className="text-sm text-[#E6F7FF]/40 uppercase tracking-widest">Courses</p>
            </div>
          </div>*/}
        </motion.div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo (Mobile Only) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-2xl mb-4 shadow-lg shadow-[#00E5FF]/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Edusense AI</h2>
          </div>

          <div className="bg-[#1a2341]/40 backdrop-blur-xl border border-[#00E5FF]/20 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-[#E6F7FF]/60 leading-relaxed">
                {isLogin ? 'Start your journey and build your learning streak today.' : 'Join the community and start building your skills today.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E6F7FF]/40 group-focus-within:text-[#00E5FF] transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#0A0F24]/60 text-[#E6F7FF] border border-[#00E5FF]/10 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 rounded-2xl pl-12 pr-4 py-4 transition-all outline-none"
                        placeholder="Full Name"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E6F7FF]/40 group-focus-within:text-[#00E5FF] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0F24]/60 text-[#E6F7FF] border border-[#00E5FF]/10 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 rounded-2xl pl-12 pr-4 py-4 transition-all outline-none"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E6F7FF]/40 group-focus-within:text-[#00E5FF] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0F24]/60 text-[#E6F7FF] border border-[#00E5FF]/10 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 rounded-2xl pl-12 pr-12 py-4 transition-all outline-none"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E6F7FF]/40 hover:text-[#00E5FF] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-[#00E5FF]/30 rounded-md peer-checked:bg-[#00E5FF] peer-checked:border-[#00E5FF] transition-all" />
                    <svg className="absolute inset-0 w-5 h-5 p-1 text-[#0A0F24] opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-[#E6F7FF]/60 text-sm group-hover:text-[#E6F7FF] transition-colors">Remember me</span>
                </label>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-[#0A0F24] py-4 rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </form>

            <p className="text-center text-[#E6F7FF]/60 text-sm mt-10">
              {isLogin ? "New to Edusense AI? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#00E5FF] font-bold hover:underline"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
