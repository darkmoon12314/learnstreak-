import { useState } from 'react';
import { Download, Award, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { coursesData } from '../data/coursesData';
import { generateCertificate } from '../utils/certificates';

export const Certificates = () => {
  const { userData, updateUserData } = useAuth();
  const [generatingCert, setGeneratingCert] = useState<string | null>(null);

  const completedCourses = coursesData.filter(course => 
    userData?.coursesCompleted?.includes(course.id)
  );

  const handleGenerateCertificate = async (courseId: string, courseTitle: string) => {
    if (!userData) return;
    
    setGeneratingCert(courseId);
    
    try {
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const pdfUrl = generateCertificate(userData.name, courseTitle, today);
      
      // Download the certificate
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Edusense_AI_Certificate_${courseTitle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Save certificate record
      const newCertificates = [...(userData.certificates || [])];
      if (!newCertificates.includes(courseId)) {
        newCertificates.push(courseId);
        await updateUserData({ certificates: newCertificates });
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setGeneratingCert(null);
    }
  };

  // Mock certificate for demo if no courses completed
  const mockCertificate = (completedCourses.length === 0 && (!userData?.certificates || userData.certificates.length === 0)) ? {
    id: 'demo',
    title: 'Python Basics',
    date: 'March 15, 2026'
  } : null;

  return (
    <div className="min-h-screen bg-[#0A0F24] pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-2">
            <Award className="w-8 h-8 text-[#00E5FF] mr-3" />
            <h1 className="text-4xl font-bold text-[#E6F7FF]">My Certificates</h1>
          </div>
          <p className="text-[#E6F7FF]/60">Your learning achievements and credentials</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#00E5FF]/20 to-[#007BFF]/20 border-2 border-[#00E5FF] rounded-2xl p-6"
          >
            <Award className="w-10 h-10 text-[#00E5FF] mb-3" />
            <h3 className="text-3xl font-bold text-[#E6F7FF] mb-1">
              {completedCourses.length}
            </h3>
            <p className="text-[#E6F7FF]/60">Certificates Earned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500 rounded-2xl p-6"
          >
            <Award className="w-10 h-10 text-green-500 mb-3" />
            <h3 className="text-3xl font-bold text-[#E6F7FF] mb-1">
              {completedCourses.length}
            </h3>
            <p className="text-[#E6F7FF]/60">Courses Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500 rounded-2xl p-6"
          >
            <Award className="w-10 h-10 text-purple-500 mb-3" />
            <h3 className="text-3xl font-bold text-[#E6F7FF] mb-1">
              {coursesData.length - completedCourses.length}
            </h3>
            <p className="text-[#E6F7FF]/60">Available to Complete</p>
          </motion.div>
        </div>

        {/* Certificates Grid */}
        {completedCourses.length === 0 && !mockCertificate ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Award className="w-20 h-20 text-[#E6F7FF]/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#E6F7FF] mb-2">No Certificates Yet</h3>
            <p className="text-[#E6F7FF]/60 mb-6">
              Complete courses to earn certificates and showcase your achievements
            </p>
            <a
              href="/courses"
              className="inline-block bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all"
            >
              Browse Courses
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mock certificate for demo */}
            {mockCertificate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl overflow-hidden group hover:border-[#00E5FF] transition-all"
              >
                {/* Certificate Preview */}
                <div className="relative h-64 bg-gradient-to-br from-[#0A0F24] to-[#1a2341] border-b-2 border-[#00E5FF]/30 p-8 flex flex-col items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#00E5FF]/20 m-4 rounded-lg"></div>
                  <Award className="w-16 h-16 text-[#00E5FF] mb-4 relative z-10" />
                  <h3 className="text-2xl font-bold text-[#00E5FF] text-center relative z-10">
                    Certificate of Completion
                  </h3>
                  <p className="text-[#E6F7FF]/60 text-center mt-2 relative z-10">
                    {mockCertificate.title}
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-[#E6F7FF]/60 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{mockCertificate.date}</span>
                  </div>
                  <button
                    onClick={() => handleGenerateCertificate(mockCertificate.id, mockCertificate.title)}
                    disabled={generatingCert === mockCertificate.id}
                    className="w-full bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {generatingCert === mockCertificate.id ? 'Generating...' : 'Download Certificate'}
                  </button>
                </div>
              </motion.div>
            )}

            {completedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl overflow-hidden group hover:border-[#00E5FF] transition-all"
              >
                {/* Certificate Preview */}
                <div className="relative h-64 bg-gradient-to-br from-[#0A0F24] to-[#1a2341] border-b-2 border-[#00E5FF]/30 p-8 flex flex-col items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#00E5FF]/20 m-4 rounded-lg"></div>
                  <Award className="w-16 h-16 text-[#00E5FF] mb-4 relative z-10" />
                  <h3 className="text-2xl font-bold text-[#00E5FF] text-center relative z-10">
                    Certificate of Completion
                  </h3>
                  <p className="text-[#E6F7FF]/60 text-center mt-2 relative z-10">
                    {course.title}
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-[#E6F7FF]/60 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">Completed on {new Date().toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleGenerateCertificate(course.id, course.title)}
                    disabled={generatingCert === course.id}
                    className="w-full bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {generatingCert === course.id ? 'Generating...' : 'Download Certificate'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-[#1a2341] border-2 border-[#00E5FF]/30 rounded-2xl p-6"
        >
          <h3 className="text-[#E6F7FF] font-semibold mb-2">📜 About Your Certificates</h3>
          <p className="text-[#E6F7FF]/60 text-sm">
            Each certificate includes your name, course title, completion date, and a unique verification ID. 
            Share your achievements on LinkedIn and showcase your learning journey!
          </p>
        </motion.div>
      </div>
    </div>
  );
};
