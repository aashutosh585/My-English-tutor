import React, { useRef } from 'react';
import SendIcon from './icons/SendIcon.jsx';
import MicrophoneIcon from './icons/MicrophoneIcon.jsx';

const ChatInput = ({
  input,
  setInput,
  onSendMessage,
  isLoading,
  isListening,
  onToggleListening,
  isSpeechRecognitionSupported,
  placeholder,
  hasMicError,
  onSendAudioFile,
}) => {
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file && onSendAudioFile) {
      onSendAudioFile(file);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-200/60">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className={`w-full px-4 py-3 pr-12 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none transition-all ${
              hasMicError ? 'placeholder-red-500 border-red-300' : 'placeholder-slate-400'
            }`}
            disabled={isLoading || isListening}
            aria-label="Chat input"
          />
          
          {/* Voice indicator */}
          {isListening && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-500 font-medium">Listening...</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          {/* Audio Upload Button */}
          {onSendAudioFile && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
                aria-label="Upload audio file"
              />
              <button
                type="button"
                onClick={handleFileButtonClick}
                disabled={isLoading}
                className="p-3 rounded-xl bg-violet-100 text-violet-600 hover:bg-violet-200 transition-all disabled:bg-slate-100 disabled:text-slate-400 transform hover:scale-105"
                aria-label="Upload audio file"
                title="Upload audio file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 7.464a5 5 0 010 7.072m-2.829-2.829a2 2 0 010 2.828M9 12a1 1 0 102 0V8a1 1 0 10-2 0v4zm-2 4a1 1 0 102 0 1 1 0 00-2 0zm8-8a1 1 0 10-2 0 1 1 0 002 0z" />
                </svg>
              </button>
            </>
          )}

          {/* Microphone Button */}
          {isSpeechRecognitionSupported && (
            <button
              type="button"
              onClick={onToggleListening}
              disabled={isLoading}
              className={`p-3 rounded-xl transition-all transform hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
                  : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
              }`}
              aria-label={isListening ? "Stop listening" : "Start listening"}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          )}
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim() || isListening}
            className="btn-primary p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105 transition-all"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      {/* Error message */}
      {hasMicError && (
        <div className="mt-2 text-sm text-red-500 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Microphone error. Please check permissions and try again.</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;