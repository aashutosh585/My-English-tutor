import React from 'react';
import { Link } from 'react-router';
import { storageService } from '../utils/storageService.js';
import { useAvatar } from '../contexts/AvatarContext.jsx';

const Landing = () => {
  const { getActiveAvatar } = useAvatar();
  
  // Check if there's a previous session
  const hasLastSession = () => {
    const lastSession = storageService.getLastSession();
    return lastSession && lastSession.messages.length > 0;
  };

  const activeAvatar = getActiveAvatar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-slate-200/60 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold text-slate-800">Gossips</h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link 
                to="/avatars" 
                className="text-slate-600 hover:text-sky-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Avatars
              </Link>
              <Link 
                to="/settings" 
                className="text-slate-600 hover:text-sky-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full text-center">
          <div className="fade-in">
            {/* Main Hero Content */}
            <div className="mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-sky-100 px-4 py-2 rounded-full text-emerald-700 font-medium text-sm mb-6">
                🌍 AI for Social Good • Breaking Language Barriers
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
                Empowering Everyone with
                <span className="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent"> AI English Tutoring</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                Breaking down communication barriers through AI-powered English learning. 
                Whether you're an introvert, non-native speaker, or seeking career advancement - 
                our personalized AI tutor adapts to your unique learning style.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link
                  to="/chat"
                  className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 transform transition-all hover:scale-105 shadow-lg"
                >
                  <span>🚀</span>
                  <span>Start Your Journey</span>
                </Link>
                
                {hasLastSession() && (
                  <Link
                    to="/chat?continue=true"
                    className="btn-secondary text-lg px-8 py-4 rounded-xl font-semibold flex items-center space-x-2"
                  >
                    <span>📚</span>
                    <span>Continue Learning</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Active Avatar Display */}
            {activeAvatar && (
              <div className="glass-card p-8 max-w-md mx-auto mb-16 slide-up border border-sky-100/50">
                <div className="flex items-center justify-center mb-4">
                  {activeAvatar.imageUrl && (
                    <img 
                      src={activeAvatar.imageUrl} 
                      alt={activeAvatar.name}
                      className="w-20 h-20 rounded-full object-cover mr-4 ring-4 ring-sky-100"
                    />
                  )}
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-slate-800">{activeAvatar.name}</h3>
                    <p className="text-sky-600 font-medium">{activeAvatar.role}</p>
                  </div>
                </div>
                <p className="text-slate-500">Your current conversation partner</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI for Social Good Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              How Our AI Creates Social Impact
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Democratizing English education through personalized AI tutoring that adapts to every individual's needs
            </p>
          </div>

          {/* Social Impact Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* For Introverts */}
            <div className="glass-card p-8 text-center hover:transform hover:scale-105 transition-all duration-300 border border-purple-100/50">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤗</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Perfect for Introverts</h3>
              <p className="text-slate-600 leading-relaxed">
                Practice English in a judgment-free environment. No social anxiety, no embarrassment - 
                just comfortable learning at your own pace with AI that understands your personality.
              </p>
            </div>

            {/* Career Advancement */}
            <div className="glass-card p-8 text-center hover:transform hover:scale-105 transition-all duration-300 border border-emerald-100/50">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Career Advancement</h3>
              <p className="text-slate-600 leading-relaxed">
                Boost your professional opportunities with confident English communication. 
                Practice job interviews, presentations, and business conversations with specialized AI tutors.
              </p>
            </div>

            {/* Global Communication */}
            <div className="glass-card p-8 text-center hover:transform hover:scale-105 transition-all duration-300 border border-blue-100/50">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Breaking Language Barriers</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect with the global community confidently. Our AI helps non-native speakers 
                overcome language barriers and participate fully in international conversations.
              </p>
            </div>

            {/* Accessible Learning */}
            <div className="glass-card p-8 text-center hover:transform hover:scale-105 transition-all duration-300 border border-orange-100/50">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">♿</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Accessible Education</h3>
              <p className="text-slate-600 leading-relaxed">
                24/7 availability makes quality English education accessible to everyone, 
                regardless of location, schedule, or economic background. Learn anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Advanced AI Technology
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience personalized English learning with cutting-edge AI technology
            </p>
          </div>

          {/* Main Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Voice Recognition */}
            <div className="glass-card p-8 text-center hover:transform hover:scale-105 transition-all duration-300 border border-sky-100/50">
              <div className="w-16 h-16 bg-gradient-to-r from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Advanced Voice Recognition</h3>
              <p className="text-slate-600 leading-relaxed">
                Speak naturally and get instant feedback on your pronunciation, grammar, and fluency. 
                Our AI understands accents and helps you sound more natural.
              </p>
            </div>

            {/* Real-time Corrections */}
            <div className="glass-card p-8 text-center hover:transform hover:scale-105 transition-all duration-300 border border-emerald-100/50">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Smart Corrections</h3>
              <p className="text-slate-600 leading-relaxed">
                Get immediate corrections and detailed explanations to improve your grammar, 
                vocabulary, and sentence structure in real-time.
              </p>
            </div>

            {/* Personalized Learning */}
            <div className="glass-card p-8 text-center hover:transform hover:scale-105 transition-all duration-300 border border-violet-100/50">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Personalized Experience</h3>
              <p className="text-slate-600 leading-relaxed">
                Choose from different AI personalities and conversation styles. 
                Practice with tutors, friends, or family members to build confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Scenarios Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Perfect For Every Learner
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whether you're a beginner or advanced, our AI adapts to your learning style and personality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Beginners */}
            <div className="glass-card p-8 border border-green-100/50">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">New to English?</h3>
              <p className="text-slate-600 mb-4">
                Start with basic conversations and build your confidence step by step. 
                Our AI is patient and encouraging.
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>• Basic vocabulary building</li>
                <li>• Simple sentence structures</li>
                <li>• Pronunciation practice</li>
              </ul>
            </div>

            {/* Conversation Practice */}
            <div className="glass-card p-8 border border-blue-100/50">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Need Speaking Practice?</h3>
              <p className="text-slate-600 mb-4">
                Have natural conversations about topics you love. 
                Improve fluency and learn idioms naturally.
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>• Daily conversation topics</li>
                <li>• Business English practice</li>
                <li>• Cultural expressions</li>
              </ul>
            </div>

            {/* Family Conversations */}
            <div className="glass-card p-8 border border-pink-100/50">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Family-Style Learning</h3>
              <p className="text-slate-600 mb-4">
                Practice with AI that acts like family members - sister, mom, friend. 
                Feel comfortable and natural.
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>• Casual family conversations</li>
                <li>• Emotional support</li>
                <li>• Cultural understanding</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-8">
              <div className="text-4xl font-bold text-sky-600 mb-2">24/7</div>
              <div className="text-slate-600">Available Anytime</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-emerald-600 mb-2">∞</div>
              <div className="text-slate-600">Unlimited Practice</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-violet-600 mb-2">8+</div>
              <div className="text-slate-600">AI Personalities</div>
            </div>
            <div className="p-8">
              <div className="text-4xl font-bold text-orange-600 mb-2">0</div>
              <div className="text-slate-600">Judgment Zone</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-sky-600 to-violet-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your English?
          </h2>
          <p className="text-xl mb-12 text-sky-100">
            Join thousands of learners who've already improved their English with our AI tutor. 
            Start your journey today - completely free!
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sky-50 transition-colors shadow-lg"
          >
            <span>🎯</span>
            <span className="ml-2">Start Learning Now</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h3 className="text-xl font-bold">Gossips AI</h3>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Empowering everyone to communicate confidently in English through AI-powered personalized tutoring.
              </p>
              <div className="text-slate-400 text-sm">
                <p>🌍 AI for Social Good Initiative</p>
                <p>Breaking language barriers worldwide</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Voice Recognition</li>
                <li>Real-time Corrections</li>
                <li>AI Personalities</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Help Center</li>
                <li>Community</li>
                <li>Feedback</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Gossips AI. Made with ❤️ for language learners by @Rishi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;