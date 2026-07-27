import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { coursesData } from '../data/coursesData';

export const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || course.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0A0F24] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-[#00E5FF]/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#E6F7FF]">Explore Courses</h1>
          </div>
          <p className="text-[#E6F7FF]/60 text-sm sm:text-base">Discover your next learning adventure with Edusense AI</p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#E6F7FF]/40 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or topic..."
              className="w-full bg-[#1a2341] text-[#E6F7FF] border-2 border-[#00E5FF]/20 focus:border-[#00E5FF] rounded-2xl pl-12 pr-4 py-3 sm:py-4 transition-all outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
                  filter === level
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#007BFF] text-white shadow-lg shadow-[#00E5FF]/30'
                    : 'bg-[#1a2341] text-[#E6F7FF]/60 border-2 border-[#00E5FF]/10 hover:border-[#00E5FF]/40'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/course/${course.id}`}
                className="block bg-[#1a2341] border-2 border-[#00E5FF]/10 hover:border-[#00E5FF] rounded-2xl overflow-hidden transition-all group h-full shadow-lg hover:shadow-[#00E5FF]/10"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      course.difficulty === 'Beginner' ? 'bg-green-500 text-white' :
                      course.difficulty === 'Intermediate' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2341] to-transparent opacity-40"></div>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#E6F7FF] mb-2 group-hover:text-[#00E5FF] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-[#E6F7FF]/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#00E5FF]/10">
                    <div className="flex items-center text-[#00E5FF] text-xs font-semibold">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.modules.length} Modules
                    </div>
                    <div className="text-[#E6F7FF]/40 text-xs">
                      {course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} Lessons
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-[#1a2341]/50 rounded-2xl border-2 border-dashed border-[#00E5FF]/20">
            <Search className="w-12 h-12 text-[#E6F7FF]/20 mx-auto mb-4" />
            <p className="text-[#E6F7FF]/60 text-lg">No courses found matching your criteria</p>
            <button
              onClick={() => {setSearchTerm(''); setFilter('All');}}
              className="mt-4 text-[#00E5FF] hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
