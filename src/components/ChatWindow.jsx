import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';

const ChatWindow = ({ messages, isLoading }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-white/50 to-sky-50/30">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-100 to-violet-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Start Your Conversation</h3>
          <p className="text-slate-600 max-w-md">
            Type a message or use the microphone to start practicing your English with AI assistance.
          </p>
        </div>
      )}
      
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex items-start gap-4 my-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 flex items-center justify-center animate-pulse">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex flex-col items-start max-w-lg">
            <div className="glass-card px-5 py-4 rounded-2xl rounded-tl-sm">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 ml-1">AI is thinking...</p>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
