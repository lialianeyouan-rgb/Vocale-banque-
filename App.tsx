import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { AccountView } from './components/AccountView';
import { ChatHistory } from './components/ChatHistory';
import { ActionBar } from './components/ActionBar';
import { VoicePinScreen } from './components/VoicePinScreen';
import { useSpeech } from './hooks/useSpeech';
import { getAiResponseAndAction } from './services/geminiService';
import { MOCK_USERS, MOCK_TRANSACTIONS, CURRENT_USER_ID } from './constants';
import { User, Transaction, Message, Language, BankActionResult, LocalFunctionCall } from './types';
import { getTranslation } from './utils/translations';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<Language>(Language.FR);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const currentUser = users.find(u => u.id === CURRENT_USER_ID) as User;

  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    speak,
    replay,
  } = useSpeech(language);

  const showWelcomeMessage = useCallback((lang: Language) => {
    const welcomeMessageText = getTranslation('initialGreeting', lang, { name: currentUser.name });
    const welcomeMessage: Message = { id: `ai-welcome-${Date.now()}`, text: welcomeMessageText, sender: 'ai' };
    setMessages([welcomeMessage]);
    speak(welcomeMessageText);
  }, [currentUser.name, speak]);

  useEffect(() => {
    if (isAuthenticated) {
      showWelcomeMessage(language);
    }
  }, [isAuthenticated, language, showWelcomeMessage]);


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

  const handleBankAction = useCallback((functionCall: LocalFunctionCall, lang: Language): BankActionResult => {
        const { name, args } = functionCall;
        switch (name) {
            case 'getBalance':
                return { success: true, message: getTranslation('balanceResponse', lang, { name: currentUser.name, balance: currentUser.balance.toLocaleString(lang) }) };
            case 'getStatement': {
                const limit = args.limit as number || 5;
                const userTransactions = transactions
                    .filter(t => t.userId === currentUser.id)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, limit);
                const statement = userTransactions.map(t => `${t.description}: ${t.type === 'debit' ? '-' : '+'}${t.amount.toLocaleString(lang)} ${getTranslation('francs', lang)}`).join('; ');
                return { success: true, message: getTranslation('statementResponse', lang, { limit, statement }) };
            }
            case 'transferFunds': {
                const { recipientName, amount } = args as { recipientName: string; amount: number };
                const recipient = users.find(u => u.name.toLowerCase() === (recipientName as string).toLowerCase());

                if (!recipient) return { success: false, message: getTranslation('transferRecipientNotFound', lang, { recipientName }) };
                if (currentUser.balance < amount) return { success: false, message: getTranslation('transferInsufficientBalance', lang, { amount: amount.toLocaleString(lang) }) };

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
                    description: getTranslation('transferTo', lang, { name: recipient.name }),
                    timestamp: new Date().toISOString(),
                };
                setTransactions(prev => [...prev, newTransaction]);
                
                return { success: true, message: getTranslation('transferSuccess', lang, { amount: amount.toLocaleString(lang), recipientName: recipient.name }) };
            }
            case 'analyzeSpending': {
                 const userTransactions = transactions.filter(t => t.userId === currentUser.id && t.type === 'debit');
                 const categorySpending: { [key: string]: number } = {};
                 
                 const categoryKeywords: { [key: string]: string[] } = {
                     'Achats': ['achat', 'shopping', 'magasin', 'boutique', 'en ligne', 'vêtements', 'électronique', 'pharmacie'],
                     'Alimentation & Restaurant': ['restaurant', 'supermarché', 'boulangerie', 'café', 'déjeuner', 'dîner', 'alimentation'],
                     'Factures & Services': ['facture', 'électricité', 'internet', 'loyer', 'abonnement'],
                     'Transport': ['station service', 'transport'],
                     'Loisirs': ['cinéma', 'librairie'],
                 };

                 userTransactions.forEach(transaction => {
                     let foundCategory = 'Autres'; // Default category
                     for (const category in categoryKeywords) {
                         if (categoryKeywords[category].some(keyword => transaction.description.toLowerCase().includes(keyword))) {
                             foundCategory = category;
                             break;
                         }
                     }
                     categorySpending[foundCategory] = (categorySpending[foundCategory] || 0) + transaction.amount;
                 });

                 if (Object.keys(categorySpending).length === 0) {
                     return { success: true, message: getTranslation('spendingAnalysisFallback', lang) };
                 }

                 const analysisResult = Object.entries(categorySpending)
                     .map(([category, amount]) => getTranslation('spendingAnalysisCategory', lang, { category, amount: amount.toLocaleString(lang) }))
                     .join(', ');

                 return { success: true, message: `${getTranslation('spendingAnalysisIntro', lang)} ${analysisResult}` };
            }
            case 'setSpendingAlert': {
                const { amount, category } = args as { amount: number; category?: string };
                // In a real app, this would be stored. Here we just confirm.
                if (category) {
                     return { success: true, message: getTranslation('alertSetSuccess', lang, { category, amount: amount.toLocaleString(lang) }) };
                } else {
                     return { success: true, message: getTranslation('alertSetSuccessNoCategory', lang, { amount: amount.toLocaleString(lang) }) };
                }
            }
            default:
                return { success: false, message: getTranslation('unknownAction', lang) };
        }
    }, [currentUser, transactions, users, setUsers, setTransactions]);

    const processUserCommand = useCallback(async (text: string, recognisedText?: string) => {
        if (!text) return;
        setIsLoading(true);

        const userMessage: Message = { id: `user-${Date.now()}`, text, sender: 'user', recognisedText };
        setMessages(prev => [...prev, userMessage]);

        // Simulate a small delay for better UX, as the local parser is very fast.
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
          const { responseText } = await getAiResponseAndAction(text, null, (call) => handleBankAction(call, language), language);
          const aiMessage: Message = { id: `ai-${Date.now()}`, text: responseText, sender: 'ai' };
          setMessages(prev => [...prev, aiMessage]);
          speak(responseText);
        } catch (error) {
          console.error("Error processing command:", error);
          const errorMessage: Message = { id: `err-${Date.now()}`, text: getTranslation('appError', language), sender: 'ai' };
          setMessages(prev => [...prev, errorMessage]);
          speak(errorMessage.text);
        } finally {
          setIsLoading(false);
        }
    }, [handleBankAction, language, speak]);

    useEffect(() => {
        if (transcript.final) {
          processUserCommand(transcript.final, transcript.final);
        }
    }, [transcript.final, processUserCommand]);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        if(isAuthenticated) {
            showWelcomeMessage(lang);
        }
    };

    const handleAuthentication = () => {
        setIsAuthenticated(true);
    };
  
    if (!isAuthenticated) {
        return <VoicePinScreen onAuthenticated={handleAuthentication} language={language} speak={speak} />;
    }

    return (
        <div className="font-poppins h-screen w-screen flex flex-col md:flex-row bg-gray-900 overflow-hidden">
            <main className="flex-1 flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
                <Header language={language} onLanguageChange={handleLanguageChange} isOnline={isOnline} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <ChatHistory messages={messages} isLoading={isLoading} onReplay={replay} language={language} />
                    <ActionBar
                        isRecording={isRecording}
                        isLoading={isLoading}
                        transcript={transcript}
                        onStartRecording={startRecording}
                        onStopRecording={stopRecording}
                        onSendMessage={(text) => processUserCommand(text)}
                        language={language}
                    />
                </div>
            </main>
            <aside className="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full p-4 bg-gray-900/50 border-t md:border-t-0 md:border-l border-gray-700/50">
                <AccountView user={currentUser} transactions={transactions} language={language} />
            </aside>
        </div>
    );
};

export default App;
