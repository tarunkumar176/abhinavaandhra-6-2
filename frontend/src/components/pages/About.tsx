import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/" className="text-telugu-primary hover:text-telugu-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
      </div>

      <div className="card p-8">
        <h2 className="text-2xl font-bold text-telugu-primary mb-4">తెలుగు ఈ-పేపర్</h2>
        <p className="text-gray-600 mb-6">
          Content will be added here about the newspaper's history, mission, and vision.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-sm text-gray-500">
            📝 This page is under construction. Content will be added soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;