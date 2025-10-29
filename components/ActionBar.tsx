
import React, { useState } from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';

interface ActionBarProps {
    isRecording: boolean;
    isLoading: boolean;
    transcript: { interim: string; final: string };
    onStartRecording: () => void;
    onStopRecording: () => void;
    onSendMessage: (text: string) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
    isRecording,
    isLoading,
    transcript,
    onStartRecording,
    onStopRecording,
    onSendMessage,
}) => {
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend