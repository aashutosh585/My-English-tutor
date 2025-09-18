import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useChat } from '../contexts/ChatContext.jsx';
import { useVoice } from '../contexts/VoiceContext.jsx';
import { useAvatar } from '../contexts/AvatarContext.jsx';
import Avatar from '../components/Avatar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import ChatInput from '../components/ChatInput.jsx';
import Footer from '../components/Footer.jsx';
import Github from '../components/GIthub.jsx';
import { ROLES } from '../constants.js';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    messages,
    isLoading,
    input,
    isListening,
    micError,
    selectedRole,
    isSpeechRecognitionSupported,
    handleSendMessage,
    startConversation,
    startNewChat,
    loadLastSession,
    toggleListening,
    sendAudioFile,
    updateInput,
    getPlaceholder,
    setSelectedRole
  } = useChat();

  const {
    isTtsEnabled,
    voices,
    selectedVoiceURI,
    toggleTts,
    updateVoiceSettings
  } = useVoice();

  const {
    getActiveAvatar,
    setActiveAvatar,
    clearActiveAvatar
  } = useAvatar();

  // Initialize chat on component mount
  useEffect(() => {
    const shouldContinue = searchParams.get('continue') === 'true';
    
    if (shouldContinue) {
      // Try to load last session
      const loaded = loadLastSession();
      if (!loaded) {
        // If no session to continue, start new conversation
        startConversation(selectedRole);
      }
    } else {
      // Start new conversation
      const activeAvatar = getActiveAvatar();
      if (activeAvatar) {
        startConversation(activeAvatar.role, activeAvatar.id);
      } else {
        startConversation(selectedRole);
      }
    }
  }, []);

  const handleFormSubmit = (textInput) => {
    updateInput('');
    handleSendMessage(textInput);
  };

  const handleToggleListening = () => {
    toggleListening();
  };

  const handleToggleTts = () => {
    toggleTts();
  };

  const handleVoiceChange = (uri) => {
    updateVoiceSettings({ voiceURI: uri });
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    // Clear active avatar when manually changing role
    clearActiveAvatar();
    startConversation(role);
  };

  const handleInputChange = (value) => {
    updateInput(value);
  };

  const handleNewChat = () => {
    startNewChat();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const activeAvatar = getActiveAvatar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 flex justify-center items-center p-4">
      <Github />
      
      <div className="flex flex-col w-full max-w-4xl h-[95vh] glass-card overflow-hidden">
        {/* Header with navigation */}
        <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleGoHome}
            className="flex items-center space-x-2 text-slate-600 hover:text-sky-600 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Home</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {activeAvatar && (
              <div className="flex items-center space-x-3 bg-sky-50 px-3 py-2 rounded-lg">
                {activeAvatar.imageUrl && (
                  <img 
                    src={activeAvatar.imageUrl} 
                    alt={activeAvatar.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-200"
                  />
                )}
                <div>
                  <span className="text-sm font-semibold text-slate-800">{activeAvatar.name}</span>
                  <p className="text-xs text-sky-600">{activeAvatar.role}</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleNewChat}
            className="btn-primary text-sm px-4 py-2 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        <Avatar 
          isLoading={isLoading} 
          isTtsEnabled={isTtsEnabled} 
          onToggleTts={handleToggleTts}
          voices={voices.filter(v => v.lang.startsWith('en-'))}
          selectedVoiceURI={selectedVoiceURI}
          onVoiceChange={handleVoiceChange}
          roles={ROLES}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
          activeAvatar={activeAvatar}
        />
        
        <ChatWindow messages={messages} isLoading={isLoading} />
        
        <ChatInput
          input={input}
          setInput={handleInputChange}
          onSendMessage={handleFormSubmit}
          isLoading={isLoading}
          isListening={isListening}
          onToggleListening={handleToggleListening}
          isSpeechRecognitionSupported={isSpeechRecognitionSupported}
          placeholder={getPlaceholder()}
          hasMicError={!!micError}
          onSendAudioFile={sendAudioFile}
        />
        
        <Footer />
      </div>
    </div>
  );
};

export default Chat;