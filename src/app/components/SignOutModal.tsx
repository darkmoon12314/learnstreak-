import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignOutModal = ({ isOpen, onClose, onConfirm }: SignOutModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0A0F24] border-2 border-[#00E5FF]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[#00E5FF]/20"
          >
            {/* Header Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_20px_#00E5FF]" />

            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00E5FF]/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-full flex items-center justify-center">
                    <LogOut className="w-10 h-10 text-[#00E5FF]" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Leave?</h3>
                <p className="text-[#E6F7FF]/60">
                  Are you sure you want to sign out? Your current learning progress and streak will be safely saved.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onConfirm}
                  className="w-full bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-[#0A0F24] py-4 rounded-2xl font-bold hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                  <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  Sign Out Now
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-[#1a2341] border-2 border-[#00E5FF]/10 text-[#E6F7FF] py-4 rounded-2xl font-bold hover:bg-[#00E5FF]/10 hover:border-[#00E5FF]/30 transition-all"
                >
                  Keep Learning
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#E6F7FF]/40 hover:text-[#E6F7FF] hover:bg-white/5 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
