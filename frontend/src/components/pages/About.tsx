import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="card p-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-telugu-primary mb-6">Every NEWS - Factual NEWS</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Abhinava Andhra ePaper is the digital edition of one of trusted Telugu news Daily, delivering accurate, timely, and comprehensive news coverage to readers across the Telugu States. Designed for modern digital readers, our ePaper provides the complete newspaper experience in an easy-to-read online format accessible on mobile, tablet, and desktop.
          </p>
        </div>

        <div className="bg-telugu-primary/5 p-6 rounded-lg border-l-4 border-telugu-primary">
          <h3 className="text-xl font-bold text-telugu-primary mb-4">Our Coverage</h3>
          <p className="text-gray-700 leading-relaxed">
            We cover a wide spectrum of topics including breaking news, local and state updates, national and international affairs, politics, business, finance, sports, lifestyle, cinema, technology, and trending stories from across India.
          </p>
        </div>

        <div className="bg-gradient-to-r from-telugu-primary to-telugu-secondary p-8 rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
          <p className="text-lg leading-relaxed">
            With a strong commitment to credible journalism, Abhinava Andhra ePaper ensures you stay informed—anytime, anywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-telugu-primary mb-2">📱</div>
            <h4 className="font-semibold text-gray-800 mb-2">Multi-Platform</h4>
            <p className="text-sm text-gray-600">Accessible on mobile, tablet, and desktop</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-telugu-primary mb-2">📰</div>
            <h4 className="font-semibold text-gray-800 mb-2">Comprehensive</h4>
            <p className="text-sm text-gray-600">Complete newspaper experience online</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-telugu-primary mb-2">✓</div>
            <h4 className="font-semibold text-gray-800 mb-2">Trusted News</h4>
            <p className="text-sm text-gray-600">Accurate and timely journalism</p>
          </div>
        </div>
      </div>
  );
};

export default About;