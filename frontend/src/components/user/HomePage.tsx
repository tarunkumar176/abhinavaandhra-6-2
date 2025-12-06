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

  const handleNavigateToPaper = () => {
    if (todaysPaper) {
      navigate(`/paper/${todaysPaper.date}`);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Today's Paper Card */}
        {todaysPaper ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-12">
            <div className="grid md:grid-cols-2 gap-8 p-8 sm:p-12">
              {/* Left: Paper Preview - Clickable */}
              <div 
                className="flex items-center justify-center cursor-pointer group"
                onClick={handleNavigateToPaper}
              >
                {todaysPaper.thumbnailUrl ? (
                  <img 
                    src={todaysPaper.thumbnailUrl} 
                    alt={todaysPaper.title}
                    className="w-full h-auto object-contain shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 w-full bg-gray-100 rounded-lg">
                    <FileText className="h-24 w-24 text-gray-400 mb-4" />
                    <p className="text-gray-500 font-medium">Today's Edition</p>
                  </div>
                )}
              </div>

              {/* Right: Paper Details */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-semibold text-sm uppercase tracking-wide">Available Now</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {todaysPaper.title}
                </h2>
                
                <p className="text-xl text-gray-600 mb-8">
                  {formatDisplayDate(todaysPaper.date)}
                </p>

                <button
                  onClick={handleNavigateToPaper}
                  className="w-full inline-flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-5 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <FileText className="h-6 w-6" />
                  <span>Read Today's Paper</span>
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 sm:p-12 mb-12 text-center">
            <div className="max-w-md mx-auto">
              <FileText className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Today's Paper Not Yet Available
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Our team is preparing today's edition. New papers are typically published by 6:00 AM each morning.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span>Check back soon</span>
              </div>
              
              <Link
                to="/archive"
                className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-semibold text-base border-b-2 border-gray-900 hover:border-gray-700 transition-colors pb-1"
              >
                <span>Browse Previous Editions</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-gray-900 font-bold text-lg mb-2">📱 Multi-Device</div>
            <p className="text-gray-600 text-sm">Access on phone, tablet, or computer</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-gray-900 font-bold text-lg mb-2">🗂️ Full Archive</div>
            <p className="text-gray-600 text-sm">Browse and read past editions anytime</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-gray-900 font-bold text-lg mb-2">⚡ Daily Updates</div>
            <p className="text-gray-600 text-sm">Fresh content every morning by 6 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;