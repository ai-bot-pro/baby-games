import React, { useEffect } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const isUser = message.role === 'user';
  
  // Auto-speak for Diandian teacher's messages if it's the latest one
  useEffect(() => {
    if (!isUser && isLatest && 'speechSynthesis' in window) {
      // Cancel previous speech to avoid overlap
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9; // Slightly slower for kids
      utterance.pitch = 1.2; // Slightly higher pitch for "teacher" persona
      
      // Find a Chinese voice if possible
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang.includes('zh'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [isUser, isLatest, message.text]);

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl shadow-md border-2 border-white
          ${isUser ? 'bg-blue-400' : 'bg-orange-400'}`}>
          {isUser ? '👶' : '👩‍🏫'}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-5 py-3 md:px-6 md:py-4 text-lg md:text-xl rounded-2xl shadow-sm leading-relaxed
          ${isUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none border border-orange-100'
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
