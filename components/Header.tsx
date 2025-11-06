
import React from 'react';
import { Language, languageOptions } from '../types';
import { getTranslation } from '../utils/translations';

interface HeaderProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
    isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, isOnline }) => {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 shadow-lg flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {getTranslation('appTitle', language)}
            </h1>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value as Language)}
                        className="bg-gray-800 border border-gray-600 rounded-md py-1 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    >
                        {languageOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    <span className="hidden md:inline text-sm text-gray-400">{isOnline ? getTranslation('online', language) : getTranslation('offline', language)}</span>
                </div>
            </div>
        </header>
    );
};
