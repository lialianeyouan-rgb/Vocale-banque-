
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Chat } from '@google/genai';
import { FunctionCall } from '@google/genai';
import { Header } from './components/Header';
import { AccountView } from './components/AccountView';
import { ChatHistory } from './components/ChatHistory';
import { ActionBar } from './components/ActionBar';
import { useSpeech } from './hooks/useSpeech';
import { getAiResponseAndAction } from './services/geminiService';
import { MOCK_USERS, MOCK_TRANSACTIONS, CURRENT_USER_ID } from './constants';
import { User, Transaction, Message, Language, BankActionResult } from './types';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<Language>(Language.FR);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  const currentUser = users.find(u => u.id === CURRENT_USER_ID) as User;
  const chatRef = useRef<Chat | null>(null);

  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    speak,
    replay,
  } = useSpeech(language);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const initializeChat = useCallback(() => {
    if (process.env.API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash' });
    }
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);


  const handleBankAction = (functionCall: FunctionCall): BankActionResult => {
        const { name, args } = functionCall;
        switch (name) {
            case 'getBalance':
                return { success: true, message: `Le solde de ${currentUser.name} est de ${currentUser.balance} francs.` };
            case 'getStatement': {
                const limit = args.limit as number || 3;
                const userTransactions = transactions
                    .filter(t => t.userId === currentUser.id)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, limit);
                const statement = userTransactions.map(t => `${t.description}: ${t.type === 'debit' ? '-' : '+'}${t.amount} francs`).join(', ');
                return { success: true, message: `Voici les ${limit} dernières transactions: ${statement}` };
            }
            case 'transferFunds': {
                const { recipientName, amount } = args as { recipientName: string; amount: number };
                const recipient = users.find(u => u.name.toLowerCase() === (recipientName as string).toLowerCase());

                if (!recipient) return { success: false, message: `Désolé, je ne trouve pas de destinataire nommé ${recipientName}.` };
                if (currentUser.balance < amount) return { success: false, message: `Solde insuffisant pour transférer ${amount} francs.` };

                setUsers(prevUsers =>
                    prevUsers.map(u => {
                        if (u.id === currentUser.id) return { ...u, balance: u.balance - amount };
                        if (u.id === recipient.id) return { ...u, balance: u.balance + amount };
                        return u;
                    })
                );

                const newTransaction: Transaction = {
                    id: `t-${Date.now()}`,
                    userId: currentUser.id,
                    type: 'debit',
                    amount,
                    description: `Virement à ${recipient.name}`,
                    timestamp: new Date().toISOString(),
                };
                setTransactions(prev => [...prev, newTransaction]);
                
                return { success: true, message: `Virement de ${amount} francs à ${recipient.name} effectué avec succès.` };
            }
            default:
                return { success: false, message: "Désolé, je ne reconnais pas cette action." };
        }
    };


  const processUserMessage = useCallback(async (text: string, recognisedText?: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: `user-${Date.now()}`, text, sender: 'user', recognisedText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    if (!chatRef.current) {
        initializeChat();
        if (!chatRef.current) {
            const errorMessage = "Erreur: Le client Gemini n'a pas pu être initialisé. Veuillez vérifier votre clé API.";
            setMessages(prev => [...prev, { id: `ai-${Date.now()}`, text: errorMessage, sender: 'ai' }]);
            setIsLoading(false);
            return;
        }
    }
    
    try {
        const { responseText } = await getAiResponseAndAction(chatRef.current, text, handleBankAction);
        const aiMessage: Message = { id: `ai-${Date.now()}`, text: responseText, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);
        speak(responseText);
    } catch (error) {
        console.error("Error processing message:", error);
        const errorMessage = "Désolé, une erreur s'est produite. Veuillez réessayer.";
        setMessages(prev => [...prev, { id: `ai-err-${Date.now()}`, text: errorMessage, sender: 'ai' }]);
        speak(errorMessage);
    } finally {
        setIsLoading(false);
    }
  }, [speak, initializeChat]);

  useEffect(() => {
    if (!isRecording && transcript.final) {
      processUserMessage(transcript.final, transcript.interim);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, transcript.final, processUserMessage]);
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 font-sans">
      <Header 
        language={language} 
        onLanguageChange={setLanguage}
        isOnline={isOnline}
      />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <AccountView user={currentUser} transactions={transactions.filter(t => t.userId === currentUser.id)} />
        </div>
        <div className="flex-1 flex flex-col bg-black/20 rounded-xl overflow-hidden">
          <ChatHistory messages={messages} isLoading={isLoading} onReplay={replay}/>
          <ActionBar
            isRecording={isRecording}
            isLoading={isLoading}
            transcript={transcript}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onSendMessage={processUserMessage}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
