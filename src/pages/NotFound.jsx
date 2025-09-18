import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🏠 Go Home
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm">
            <Link to="/chat" className="text-indigo-600 hover:text-indigo-800">
              💬 Start Chatting
            </Link>
            <Link to="/avatars" className="text-indigo-600 hover:text-indigo-800">
              👥 Manage Avatars
            </Link>
            <Link to="/settings" className="text-indigo-600 hover:text-indigo-800">
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;