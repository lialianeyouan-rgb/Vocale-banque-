
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';

interface ChatHistoryProps {
    messages: Message[];
    isLoading: boolean;
    onReplay: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading, onReplay }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const lastAiMessageId = messages.filter(m => m.sender === 'ai').pop()?.id;

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {message.sender === 'ai' && (
                           <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                               <BotIcon />
                           </div>
                       )}

                        <div className={`max-w-md p-4 rounded-2xl ${
                            message.sender === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-700 text-gray-200 rounded-bl-none'
                        }`}>
                            <p>{message.text}</p>
                            {message.recognisedText && (
                                <p className="text-xs italic text-gray-400 mt-2 opacity-70">Reconnu : "{message.recognisedText}"</p>
                            )}

                             {message.sender === 'ai' && message.id === lastAiMessageId && !isLoading && (
                                <button onClick={onReplay} className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors">
                                    <PlayIcon />
                                </button>
                            )}
                        </div>
                        
                        {message.sender === 'user' && (
                           <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                               <UserIcon />
                           </div>
                       )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 justify-start">
                         <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                               <BotIcon />
                           </div>
                        <div className="bg-gray-700 p-4 rounded-2xl rounded-bl-none flex items-center space-x-2">
                           <SpinnerIcon />
                           <span className="text-gray-400">L'IA réfléchit...</span>
                        </div>
                    </div>
                )}
            </div>
            <div ref={endOfMessagesRef} />
        </div>
    );
};
