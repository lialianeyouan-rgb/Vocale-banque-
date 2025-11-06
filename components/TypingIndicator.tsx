import React from 'react';

export const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);