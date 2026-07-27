import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Flame, Trophy, BookOpen, LogOut, User, Award, BarChart3, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SignOutModal } from './SignOutModal';

export const Navbar = () => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOutConfirm = async () => {
    await signOut();
    setShowSignOutModal(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: BookOpen },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { to: '/certificates', label: 'Certificates', icon: Award },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <nav className="bg-[#0A0F24] border-b-2 border-[#00E5FF] sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Mobile Menu Button */}
            {userData && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-3 text-[#00E5FF] hover:bg-[#00E5FF]/10 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#00E5FF] hidden sm:inline">Edusense AI</span>
            </Link>

            {/* Desktop Navigation Links */}
            {userData && (
              <div className="hidden md:flex items-center gap-2">
                {navLinks.slice(0, 4).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-3 py-2 rounded-lg text-[#E6F7FF] hover:bg-[#00E5FF]/20 transition-all text-sm flex items-center space-x-1"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Right Side - Stats & User Menu */}
            {userData && (
              <div className="flex items-center gap-2 ml-auto">
                {/* Streak */}
                <div className="flex items-center gap-1 bg-[#1a2341] px-2 sm:px-3 py-2 rounded-lg border border-[#00E5FF]/30">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-[#E6F7FF] font-semibold text-sm">{userData.streakCount}</span>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1 bg-[#1a2341] px-2 sm:px-3 py-2 rounded-lg border border-[#00E5FF]/30">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-[#E6F7FF] font-semibold text-sm hidden sm:inline">{userData.xpPoints} XP</span>
                </div>

                {/* Desktop User Menu */}
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-2 bg-[#1a2341] px-3 py-2 rounded-lg border border-[#00E5FF]/30 hover:border-[#00E5FF] transition-all">
                    <User className="w-4 h-4 text-[#00E5FF]" />
                    <span className="text-[#E6F7FF] text-sm hidden lg:inline">{userData.name}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-[#1a2341] border-2 border-[#00E5FF] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-[#E6F7FF] hover:bg-[#00E5FF]/20 transition-colors">
                      Profile
                    </Link>
                    <button
                      onClick={() => setShowSignOutModal(true)}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && userData && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-[#0A0F24] border-r-2 border-[#00E5FF] z-50 md:hidden p-6 flex flex-col"
              >
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-[#00E5FF]">Edusense AI</span>
                </div>

                <div className="space-y-2 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[#E6F7FF] hover:bg-[#00E5FF]/20 transition-all border border-transparent hover:border-[#00E5FF]/30"
                    >
                      <link.icon className="w-5 h-5 text-[#00E5FF]" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#00E5FF]/20">
                  <div className="flex items-center space-x-3 px-4 py-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#1a2341] border border-[#00E5FF]/30 flex items-center justify-center">
                      <User className="w-6 h-6 text-[#00E5FF]" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[#E6F7FF] font-bold truncate">{userData.name}</p>
                      <p className="text-[#E6F7FF]/50 text-xs truncate">{userData.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowSignOutModal(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/30"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOutConfirm}
      />
    </>
  );
};
