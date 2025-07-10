import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';

const ChatWindow = ({ messages, isLoading }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex items-start gap-3 my-4">
            <div className="w-8 h-8 p-1.5 rounded-full bg-purple-500 text-white animate-pulse"></div>
            <div className="flex flex-col items-start max-w-lg">
                <div className="px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
