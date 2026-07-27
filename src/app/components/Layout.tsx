import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from './Navbar';
import { AITutor } from './AITutor';
import { Toaster } from 'sonner';

export const Layout = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F24] flex items-center justify-center">
        <div className="text-[#00E5FF] text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0F24]">
      <Navbar />
      <Outlet />
      <AITutor />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2341',
            color: '#E6F7FF',
            border: '2px solid #00E5FF',
          },
        }}
      />
    </div>
  );
};
