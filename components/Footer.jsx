import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center justify-center space-x-6">
        {/* GitHub Button */}
        <a
          href="https://github.com/coder-writes"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          aria-label="Visit our GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="text-sm font-medium">GitHub</span>
        </a>

        {/* LinkedIn Button */}
        <a
          href="https://www.linkedin.com/in/rishi-verma-sde/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          aria-label="Visit our LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span className="text-sm font-medium">LinkedIn</span>
        </a>

        {/* Support Us Button */}
        <button
          onClick={() => {
            window.open('https://github.com/sponsors/coder-writes', '_blank');
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          aria-label="Support us"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-sm font-medium">Support Us</span>
        </button>
      </div>
      
      {/* Copyright */}
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500">
          © 2025 English Tutor AI. Made with ❤️ for language learners by @Rishi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;