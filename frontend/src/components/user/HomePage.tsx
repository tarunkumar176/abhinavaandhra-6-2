import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { Paper } from '../../../types';
import { paperAPI } from '../../services/api';
import { formatDisplayDate, getTodayDate } from '../../utils/dateUtils';

const HomePage: React.FC = () => {
  const [todaysPaper, setTodaysPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysPaper();
  }, []);

  const navigate = useNavigate();

  const fetchTodaysPaper = async () => {
    try {
      setLoading(true);
      const todayDate = getTodayDate();
      const response = await paperAPI.getByDate(todayDate);
      if (response.success && response.data) {
        setTodaysPaper(response.data);
      }
    } catch (error) {
      // No paper for today is fine, don't show error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telugu-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section - Today's Edition */}
      <div 
        className="relative rounded-lg overflow-hidden text-white"
        style={{
          backgroundImage: todaysPaper?.thumbnailUrl 
            ? `url('${todaysPaper.thumbnailUrl}')`
            : 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              తెలుగు ఈ-పేపర్
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
              Today's Digital Edition
            </p>

            {todaysPaper ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{todaysPaper.title}</h2>
                  <p className="text-lg sm:text-xl md:text-2xl opacity-90 mb-3 sm:mb-4">
                    {formatDisplayDate(todaysPaper.date)}
                  </p>
                  <div className="flex justify-center items-center flex-wrap gap-4 text-xs sm:text-sm md:text-base opacity-80">
                    <span>📄 {todaysPaper.pageCount} Pages</span>
                    <span>📁 {(todaysPaper.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/paper/${todaysPaper.date}`)}
                  className="inline-flex items-center gap-2 sm:gap-3 bg-white text-telugu-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl active:scale-95"
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Read Today's Paper</span>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 sm:p-8 md:p-10">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-60" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Today's Paper</h2>
                <p className="text-base sm:text-lg opacity-90 mb-4 sm:mb-6">
                  Today's edition is not available yet. Please check back later.
                </p>
                <p className="text-xs sm:text-sm opacity-75 mb-4 sm:mb-6">
                  Papers are usually uploaded by 6:00 AM daily
                </p>
                <div className="text-center">
                  <button
                    onClick={() => navigate(`/paper/${getTodayDate()}`)}
                    className="inline-flex items-center gap-2 bg-white/90 text-telugu-primary px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-100 transition-colors shadow hover:shadow-md active:scale-95"
                  >
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Open Today's Paper</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="text-center py-8 sm:py-12 md:py-16 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Welcome to Telugu Digital Newspaper
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest Telugu news, delivered digitally.
          Access today's edition and browse through previous days with ease.
        </p>
      </div>
    </div>
  );
};

export default HomePage;