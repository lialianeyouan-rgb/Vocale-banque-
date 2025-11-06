
import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

export const MicrophoneIcon = () => ( // Exported for reuse
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const StopIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 6h12v12H6z" />
    </svg>
);

const SendIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
);


interface ActionBarProps {
    isRecording: boolean;
    isLoading: boolean;
    transcript: { interim: string; final: string };
    onStartRecording: () => void;
    onStopRecording: () => void;
    onSendMessage: (text: string) => void;
    language: Language;
}

export const ActionBar: React.FC<ActionBarProps> = ({
    isRecording,
    isLoading,
    transcript,
    onStartRecording,
    onStopRecording,
    onSendMessage,
    language,
}) => {
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isRecording && !isLoading) {
            handleSend();
        }
    };

    return (
        <div className="p-4 bg-gray-900/50 border-t border-gray-700 shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 px-6 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        placeholder={isRecording ? getTranslation('recording', language) : getTranslation('typeOrMic', language)}
                        value={isRecording ? transcript.interim : inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isRecording || isLoading}
                        aria-label="Message input field"
                    />
                    {!isRecording && (
                         <button
                            onClick={handleSend}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={!inputText.trim() || isLoading}
                            aria-label="Send message"
                        >
                           <SendIcon />
                        </button>
                    )}
                </div>
                <button
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    disabled={isLoading}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isRecording 
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                    {isRecording ? <StopIcon /> : <MicrophoneIcon />}
                </button>
            </div>
            {isRecording && transcript.interim && (
                <p className="text-center text-sm text-gray-400 pt-2">
                    {transcript.interim}
                </p>
            )}
        </div>
    );
};
