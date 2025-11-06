import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';

// Fix: Add types for the Web Speech API which are not included in standard TS DOM lib
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
}

// Extend window object with SpeechRecognition constructors
// Fix: Use `declare global` to augment the window object in a module, resolving TS errors.
declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

interface Transcript {
    interim: string;
    final: string;
}

interface UseSpeechOptions {
    onSpeechEnd?: () => void;
}

const getSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        return new SpeechRecognition();
    }
    return null;
};

export const useSpeech = (lang: Language, options?: UseSpeechOptions) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState<Transcript>({ interim: '', final: '' });
    const [isListeningEnabled, setIsListeningEnabled] = useState(true); // New state to control listening
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const lastSpokenTextRef = useRef<string>('');
    const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            voicesRef.current = window.speechSynthesis.getVoices();
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    useEffect(() => {
        if (!isListeningEnabled) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            return;
        }

        const recognition = getSpeechRecognition();
        if (!recognition) {
            console.warn('Speech Recognition API is not supported in this browser.');
            return;
        }

        recognition.lang = lang;
        recognition.interimResults = true;
        recognition.continuous = false; 

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            setTranscript(prev => ({
                interim: interim,
                final: final || prev.final
            }));
        };

        recognition.onend = () => {
            setIsRecording(false);
            setTranscript(prev => ({ ...prev, interim: '' })); 
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };
        
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [lang, isListeningEnabled]); 

    const startRecording = useCallback(() => {
        if (recognitionRef.current && !isRecording && isListeningEnabled) {
            setTranscript({ interim: '', final: '' }); 
            recognitionRef.current.start();
            setIsRecording(true);
        }
    }, [isRecording, isListeningEnabled]);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false); 
        }
    }, [isRecording]);

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window && text) {
            lastSpokenTextRef.current = text;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            
            const voices = voicesRef.current;
            const voicePriority = [
                (v: SpeechSynthesisVoice) => v.lang === lang && v.name.includes('Google'),
                (v: SpeechSynthesisVoice) => v.lang === lang && v.name.includes('Microsoft'),
                (v: SpeechSynthesisVoice) => v.lang === lang && v.localService,
                (v: SpeechSynthesisVoice) => v.lang === lang,
            ];

            let selectedVoice: SpeechSynthesisVoice | null = null;
            for (const priorityFn of voicePriority) {
                const foundVoice = voices.find(priorityFn);
                if (foundVoice) {
                    selectedVoice = foundVoice;
                    break;
                }
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            utterance.rate = 0.95;
            utterance.pitch = 1.0;

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    }, [lang]);

    const replay = useCallback(() => {
        if (lastSpokenTextRef.current) {
            speak(lastSpokenTextRef.current);
        }
    }, [speak]);

    return { isRecording, transcript, startRecording, stopRecording, speak, replay, setIsListeningEnabled };
};