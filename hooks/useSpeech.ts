
import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';

interface Transcript {
    interim: string;
    final: string;
}

const getSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        return new SpeechRecognition();
    }
    return null;
};

export const useSpeech = (lang: Language) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState<Transcript>({ interim: '', final: '' });
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const lastSpokenTextRef = useRef<string>('');

    useEffect(() => {
        const recognition = getSpeechRecognition();
        if (!recognition) {
            console.warn('Speech Recognition API is not supported in this browser.');
            return;
        }

        recognition.lang = lang;
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript({ interim: interimTranscript, final: finalTranscript.trim() });
        };

        recognition.onend = () => {
            setIsRecording(false);
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };
        
        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [lang]);

    const startRecording = useCallback(() => {
        if (recognitionRef.current && !isRecording) {
            setTranscript({ interim: '', final: '' });
            recognitionRef.current.start();
            setIsRecording(true);
        }
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) {
            console.warn('Speech Synthesis API is not supported in this browser.');
            return;
        }
        lastSpokenTextRef.current = text;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }, [lang]);
    
    const replay = useCallback(() => {
        if (lastSpokenTextRef.current) {
            speak(lastSpokenTextRef.current);
        }
    }, [speak]);

    return { isRecording, transcript, startRecording, stopRecording, speak, replay };
};
