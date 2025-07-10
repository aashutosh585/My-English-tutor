import React from 'react';
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
}) => {
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

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className={`flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${hasMicError ? 'placeholder-red-500' : 'placeholder-gray-500'}`}
          disabled={isLoading || isListening}
          aria-label="Chat input"
        />
        {isSpeechRecognitionSupported && (
          <button
            type="button"
            onClick={onToggleListening}
            disabled={isLoading}
            className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !input.trim() || isListening}
          className="p-3 rounded-full bg-blue-600 text-white disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
