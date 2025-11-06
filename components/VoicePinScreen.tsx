
import React, { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { Language } from '../types';
import { MicrophoneIcon } from './ActionBar';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { getTranslation } from '../utils/translations';

interface VoicePinScreenProps {
    onAuthenticated: () => void;
    language: Language;
    speak: (text: string) => void;
}

export const VoicePinScreen: React.FC<VoicePinScreenProps> = ({ onAuthenticated, language, speak }) => {
    const t = (key: string, params?: Record<string, any>) => getTranslation(key, language, params);
    
    const [statusMessage, setStatusMessage] = useState<string>(t('sayPin'));
    const [pinAttempts, setPinAttempts] = useState<number>(0);
    const TEST_PIN = '1234';

    const {
        isRecording,
        transcript,
        startRecording,
        stopRecording,
        setIsListeningEnabled,
    } = useSpeech(language);

    // Effect to start listening automatically on component mount.
    useEffect(() => {
        setIsListeningEnabled(true);
        // Delay to allow the component to render before speaking/recording
        const startTimeout = setTimeout(() => {
            speak(t('sayPin'));
            if (!isRecording) {
                startRecording();
            }
        }, 500);

        return () => {
            clearTimeout(startTimeout);
            stopRecording();
            setIsListeningEnabled(false);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    // Effect to process the final transcript when it becomes available.
    useEffect(() => {
        if (!transcript.final) return;

        const spokenPin = transcript.final.replace(/\s/g, '');
        
        if (spokenPin === TEST_PIN) {
            setIsListeningEnabled(false); // Stop any further listening
            speak(t('accessGranted'));
            setStatusMessage(t('pinCorrect'));
            setTimeout(onAuthenticated, 1500);
        } else {
            setPinAttempts(prev => prev + 1);
            const errorMessage = t('incorrectPin');
            speak(errorMessage);
            setStatusMessage(errorMessage);

            // After speaking the error, wait a moment and then start listening again.
            const listenAgainTimeout = setTimeout(() => {
                startRecording();
            }, 2000); // Allow time for the error message to be spoken

            return () => clearTimeout(listenAgainTimeout);
        }
    }, [transcript.final, onAuthenticated, setIsListeningEnabled, speak, t, startRecording]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white p-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-wider mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {t('voiceAuthentication')}
            </h2>
            <p className="text-lg text-gray-300 mb-6 text-center">
                {statusMessage} <br />
                <span className="text-sm text-blue-300">{t('sayPinTest')}</span>
            </p>

            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording
                            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={false}
                    aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                    {isRecording ? <SpinnerIcon /> : <MicrophoneIcon />}
                </button>
                {isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-36 h-36 rounded-full bg-red-500 opacity-30 animate-ping-slow"></div>
                    </div>
                )}
            </div>

            {transcript.interim && (
                <p className="text-md text-gray-400 italic mt-4 px-4 text-center">
                    {t('recognizing', { text: transcript.interim })}
                </p>
            )}
            {transcript.final && !isRecording && (
                <p className="text-md text-gray-400 italic mt-4 px-4 text-center">
                    {t('lastAttempt', { text: transcript.final })}
                </p>
            )}

            {pinAttempts > 0 && (
                <p className="text-sm text-red-400 mt-4">{t('attempts', { count: pinAttempts })}</p>
            )}
        </div>
    );
};
