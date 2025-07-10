import React from 'react';
import { MessageRole } from '../constants.js';
import BotIcon from './icons/BotIcon.jsx';
import UserIcon from './icons/UserIcon.jsx';


const ChatMessage = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  const renderIcon = () => {
    const iconClass = "w-8 h-8 p-1.5 rounded-full";
    if (isUser) {
        return <UserIcon className={`${iconClass} bg-blue-500 text-white`} />;
    }
    return <BotIcon className={`${iconClass} bg-purple-500 text-white`} />;
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && renderIcon()}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-lg`}>
        <div className={`px-4 py-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.correction && message.explanation && (
          <div className="mt-2 p-3 bg-green-100 border-l-4 border-green-500 rounded-r-lg w-full">
            <p className="font-bold text-sm text-green-800">Correction:</p>
            <p className="italic text-green-700">"{message.correction}"</p>
            <p className="mt-2 font-bold text-sm text-green-800">Explanation:</p>
            <p className="text-sm text-green-700">{message.explanation}</p>
          </div>
        )}
      </div>
      {isUser && renderIcon()}
    </div>
  );
};

export default ChatMessage;
