import React, { useRef, useEffect } from 'react';
import { Message, Language } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';
import { getTranslation } from '../utils/translations';
import { TypingIndicator } from './TypingIndicator';

interface ChatHistoryProps {
    messages: Message[];
    isLoading: boolean;
    onReplay: () => void;
    language: Language;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading, onReplay, language }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const lastAiMessageId = messages.filter(m => m.sender === 'ai').pop()?.id;

    return (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-4 animate-fade-in-up ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {message.sender === 'ai' && (
                           <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                               <BotIcon />
                           </div>
                       )}

                        <div className={`relative max-w-md p-4 rounded-2xl shadow-md ${
                            message.sender === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-700 text-gray-200 rounded-bl-none'
                        }`}>
                            <p>{message.text}</p>
                            {message.recognisedText && (
                                <p className="text-xs italic text-gray-400 mt-2 opacity-70">{getTranslation('heard', language, { text: message.recognisedText })}</p>
                            )}

                             {message.sender === 'ai' && message.id === lastAiMessageId && !isLoading && (
                                <button onClick={onReplay} className="absolute -right-11 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <PlayIcon />
                                </button>
                            )}
                        </div>
                        
                        {message.sender === 'user' && (
                           <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
                               <UserIcon />
                           </div>
                       )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 justify-start animate-fade-in-up">
                         <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                               <BotIcon />
                           </div>
                        <div className="bg-gray-700 p-4 rounded-2xl rounded-bl-none flex items-center space-x-2 shadow-md">
                           <TypingIndicator />
                        </div>
                    </div>
                )}
            </div>
            <div ref={endOfMessagesRef} />
        </div>
    );
};