import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Upload, LogOut, Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getRecentDates, formatDisplayDate } from '../../utils/dateUtils';
import BreakingNews from '../BreakingNews';

interface LayoutProps {
  children?: ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    navigate(`/paper/${date}`);
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get recent dates (today + previous 6 days)
  const recentDates = getRecentDates(7);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        {/* Top Logo Section */}
        <div className="bg-white py-6">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center">
              <Link to="/" className="flex flex-col items-center">
                <img
                  src="/logo.jpg"
                  alt="Telugu E-Paper Logo"
                  className="h-25 w-auto object-contain hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              {/* Left Navigation */}
              <nav className="flex items-center space-x-1">
                {!isAdmin ? (
                  <>
                    {/* Date Selector with Dropdown */}
                    <div className="relative" ref={datePickerRef}>
                      <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(selectedDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit'
                        })}</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>

                      {/* Date Picker Dropdown */}
                      {showDatePicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                          <div className="p-2">
                            <div className="text-xs text-gray-500 mb-2 px-2">Select Date (Last 7 days)</div>
                            {recentDates.map((date) => (
                              <button
                                key={date}
                                onClick={() => handleDateSelect(date)}
                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${date === selectedDate
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-700'
                                  }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{formatDisplayDate(date)}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(date).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: 'short'
                                    })}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                      ANDHRA PRADESH
                    </div>

                    {/* Home */}
                    <Link
                      to="/"
                      className="flex items-center space-x-1 px-3 py-1 text-gray-700 hover:text-telugu-primary hover:bg-gray-100 rounded text-sm"
                    >
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-1 px-3 py-1 text-gray-700 hover:text-telugu-primary hover:bg-gray-100 rounded text-sm"
                    >
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/admin/upload"
                      className="flex items-center space-x-1 px-3 py-1 text-gray-700 hover:text-telugu-primary hover:bg-gray-100 rounded text-sm"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </Link>
                  </>
                )}
              </nav>

              {/* Right Navigation */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {isAuthenticated && (
                  <>
                    <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] sm:max-w-none">
                      {user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-2 sm:px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded text-xs sm:text-sm whitespace-nowrap"
                    >
                      <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breaking News Ticker */}
      <BreakingNews />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/logo.jpg"
                  alt=" Logo"
                  className="h-10 w-auto object-contain"
                />
                
              </div>
              <p className="text-gray-300 mb-4">
                The largest circulated Telugu daily newspaper, now available digitally.
                Stay connected with authentic Telugu news and updates.
              </p>
              <p className="text-sm text-gray-400">
                Bringing you trusted news since decades, now in digital format.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/archive" className="hover:text-white transition-colors">Archive</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                <li><Link to="/copyright" className="hover:text-white transition-colors">Copyright</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <div className="text-sm text-gray-400">
                <p>&copy; 2025 Abhinavaandhra. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;