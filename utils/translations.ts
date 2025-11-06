import { Language } from '../types';

type Translations = {
    [key: string]: { [lang in Language]?: string };
};

export const translations: Translations = {
    // Header
    appTitle: {
        [Language.EN]: 'AI Voice Banking',
        [Language.FR]: 'Banque Vocale IA',
        [Language.CI_DYU]: 'Banki Vokali IA',
        [Language.CI_BAO]: 'Banki Vokali IA',
    },
    online: {
        [Language.EN]: 'Online',
        [Language.FR]: 'En ligne',
        [Language.CI_DYU]: 'Ladamuni',
        [Language.CI_BAO]: 'Ladamuni',
    },
    offline: {
        [Language.EN]: 'Offline',
        [Language.FR]: 'Hors ligne',
        [Language.CI_DYU]: 'Tɛnɛ',
        [Language.CI_BAO]: 'Tɛnɛ',
    },
    // AccountView
    greeting: {
        [Language.EN]: 'Hello, {name}',
        [Language.FR]: 'Bonjour, {name}',
        [Language.CI_DYU]: 'I ni ce, {name}',
        [Language.CI_BAO]: 'Akwaba, {name}',
    },
    currentBalance: {
        [Language.EN]: 'Current Balance',
        [Language.FR]: 'Solde Actuel',
        [Language.CI_DYU]: 'Wari Jate',
        [Language.CI_BAO]: 'Wari Jate',
    },
    francs: {
        [Language.EN]: 'francs',
        [Language.FR]: 'francs',
        [Language.CI_DYU]: 'francs',
        [Language.CI_BAO]: 'francs',
    },
    recentTransactions: {
        [Language.EN]: 'Recent Transactions',
        [Language.FR]: 'Transactions Récentes',
        [Language.CI_DYU]: 'Transaction Kura',
        [Language.CI_BAO]: 'Transaction Kura',
    },
    noRecentTransactions: {
        [Language.EN]: 'No recent transactions.',
        [Language.FR]: 'Aucune transaction récente.',
        [Language.CI_DYU]: 'Transaction kura tɛ yen.',
        [Language.CI_BAO]: 'Transaction kura tɛ yen.',
    },
    // ChatHistory
    heard: {
        [Language.EN]: 'Heard: "{text}"',
        [Language.FR]: 'Entendu : "{text}"',
        [Language.CI_DYU]: 'Mɛnni: "{text}"',
        [Language.CI_BAO]: 'Mɛnni: "{text}"',
    },
    aiIsThinking: {
        [Language.EN]: 'AI is thinking...',
        [Language.FR]: 'L\'IA réfléchit...',
        [Language.CI_DYU]: 'IA be miirila...',
        [Language.CI_BAO]: 'IA be miirila...',
    },
    // ActionBar
    recording: {
        [Language.EN]: 'Recording...',
        [Language.FR]: 'Enregistrement...',
        [Language.CI_DYU]: 'Enregistrement...',
        [Language.CI_BAO]: 'Enregistrement...',
    },
    typeOrMic: {
        [Language.EN]: 'Type a message or use the microphone...',
        [Language.FR]: 'Écrivez un message ou utilisez le micro...',
        [Language.CI_DYU]: 'Sɛbɛnni walima ka mikoro baara...',
        [Language.CI_BAO]: 'Sɛbɛnni walima ka mikoro baara...',
    },
    // VoicePinScreen
    voiceAuthentication: {
        [Language.EN]: 'Voice Authentication',
        [Language.FR]: 'Authentification Vocale',
        [Language.CI_DYU]: 'Vokali Yɛrɛlajɛ',
        [Language.CI_BAO]: 'Vokali Yɛrɛlajɛ',
    },
    sayPin: {
        [Language.EN]: 'Please say your voice PIN.',
        [Language.FR]: 'Veuillez dire votre PIN vocal.',
        [Language.CI_DYU]: 'I y\'i kan PIN fɔ.',
        [Language.CI_BAO]: 'I y\'i kan PIN fɔ.',
    },
    sayPinTest: {
        [Language.EN]: '(Say "one two three four" for the test)',
        [Language.FR]: '(Dites "un deux trois quatre" pour le test)',
        [Language.CI_DYU]: '(Fɔ "kelen fila saba naani" ka ladilan)',
        [Language.CI_BAO]: '(Fɔ "kelen fila saba naani" ka ladilan)',
    },
    pinCorrect: {
        [Language.EN]: 'PIN correct. Access granted.',
        [Language.FR]: 'PIN correct. Accès autorisé.',
        [Language.CI_DYU]: 'PIN jusitɛ. Donni sɔnna.',
        [Language.CI_BAO]: 'PIN jusitɛ. Donni sɔnna.',
    },
    accessGranted: {
        [Language.EN]: 'Access granted.',
        [Language.FR]: 'Accès autorisé.',
        [Language.CI_DYU]: 'Donni sɔnna.',
        [Language.CI_BAO]: 'Donni sɔnna.',
    },
    incorrectPin: {
        [Language.EN]: 'Incorrect PIN. Please try again.',
        [Language.FR]: 'PIN incorrect. Veuillez réessayer.',
        [Language.CI_DYU]: 'PIN man jusitɛ. I ka segin.',
        [Language.CI_BAO]: 'PIN man jusitɛ. I ka segin.',
    },
    recognizing: {
        [Language.EN]: 'Recognizing: "{text}"',
        [Language.FR]: 'Reconnaissance : "{text}"',
        [Language.CI_DYU]: 'Yɛrɛlajɛra: "{text}"',
        [Language.CI_BAO]: 'Yɛrɛlajɛra: "{text}"',
    },
    lastAttempt: {
        [Language.EN]: 'Last attempt: "{text}"',
        [Language.FR]: 'Dernière tentative : "{text}"',
        [Language.CI_DYU]: 'Laban yɛrɛlajɛ: "{text}"',
        [Language.CI_BAO]: 'Laban yɛrɛlajɛ: "{text}"',
    },
    attempts: {
        [Language.EN]: 'Attempts: {count}',
        [Language.FR]: 'Tentatives : {count}',
        [Language.CI_DYU]: 'Yɛrɛlajɛ: {count}',
        [Language.CI_BAO]: 'Yɛrɛlajɛ: {count}',
    },
    // App error
    appError: {
        [Language.EN]: 'Sorry, an unexpected error occurred. Please try again.',
        [Language.FR]: 'Désolé, une erreur inattendue est survenue. Veuillez réessayer.',
        [Language.CI_DYU]: 'Yafa, koo dɔ kɛra. I ka segin.',
        [Language.CI_BAO]: 'Yafa, koo dɔ kɛra. I ka segin.',
    },
    // Command Parser / Bot responses
    initialGreeting: {
        [Language.EN]: 'Hello {name}, welcome to your voice banking assistant. How can I help you today?',
        [Language.FR]: 'Bonjour {name}, bienvenue sur votre assistant bancaire vocal. Comment puis-je vous aider aujourd\'hui ?',
        [Language.CI_DYU]: 'I ni ce {name}, i ka banki dɛmɛbaga la. N bɛ se ka i dɛmɛ cogo di bi?',
        [Language.CI_BAO]: 'Akwaba {name}, i ka banki dɛmɛbaga la. N bɛ se ka i dɛmɛ cogo di ɛnnɛ?',
    },
    balanceResponse: {
        [Language.EN]: 'Your current balance is {balance} francs.',
        [Language.FR]: 'Votre solde actuel est de {balance} francs.',
        [Language.CI_DYU]: 'I ka wari jate ye {balance} francs ye.',
        [Language.CI_BAO]: 'I ka wari jate ye {balance} francs ye.',
    },
    statementResponse: {
        [Language.EN]: 'Here are your last {limit} transactions: {statement}',
        [Language.FR]: 'Voici vos {limit} dernières transactions : {statement}',
        [Language.CI_DYU]: 'Transaction laban {limit} niŋ kɔ: {statement}',
        [Language.CI_BAO]: 'Transaction laban {limit} niŋ kɔ: {statement}',
    },
    transferRecipientNotFound: {
        [Language.EN]: "Sorry, I can't find a recipient named {recipientName}.",
        [Language.FR]: "Désolé, je ne trouve pas de destinataire nommé {recipientName}.",
        [Language.CI_DYU]: "Yafa, n'te se ka mɔgɔ min tɔgɔ ye {recipientName} sɔrɔ.",
        [Language.CI_BAO]: "Yafa, n'te se ka mɔgɔ min tɔgɔ ye {recipientName} sɔrɔ.",
    },
    transferInsufficientBalance: {
        [Language.EN]: 'Insufficient balance to transfer {amount} francs.',
        [Language.FR]: 'Solde insuffisant pour transférer {amount} francs.',
        [Language.CI_DYU]: 'Wari man ca ka {amount} francs ci.',
        [Language.CI_BAO]: 'Wari man ca ka {amount} francs ci.',
    },
    transferSuccess: {
        [Language.EN]: 'The transfer of {amount} francs to {recipientName} was successful.',
        [Language.FR]: 'Le virement de {amount} francs à {recipientName} a réussi.',
        [Language.CI_DYU]: 'Wari {amount} francs cira {recipientName} ma.',
        [Language.CI_BAO]: 'Wari {amount} francs cira {recipientName} ma.',
    },
    transferTo: {
        [Language.EN]: 'Transfer to {name}',
        [Language.FR]: 'Virement à {name}',
        [Language.CI_DYU]: 'Wari ci {name} ma',
        [Language.CI_BAO]: 'Wari ci {name} ma',
    },
    transferInfoMissing: {
        [Language.EN]: 'To make a transfer, please tell me the amount and the recipient\'s name.',
        [Language.FR]: 'Pour effectuer un virement, veuillez m\'indiquer le montant et le nom du destinataire.',
        [Language.CI_DYU]: 'Wari ci, i ka wari jate ni tɔgɔ fɔ.',
        [Language.CI_BAO]: 'Wari ci, i ka wari jate ni tɔgɔ fɔ.',
    },
    greetingResponse: {
        [Language.EN]: "Hello! How can I help you today?",
        [Language.FR]: "Bonjour ! Comment puis-je vous aider ?",
        [Language.CI_DYU]: "I ni ce! N'bɛ se ka i dɛmɛ cogo di?",
        [Language.CI_BAO]: "Akwaba! N'bɛ se ka i dɛmɛ cogo di?",
    },
    unknownAction: {
        [Language.EN]: "Sorry, I don't recognize that action.",
        [Language.FR]: "Désolé, je ne reconnais pas cette action.",
        [Language.CI_DYU]: "Yafa, n'te se ka koo nin yɛrɛ lajɛ.",
        [Language.CI_BAO]: "Yafa, n'te se ka koo nin yɛrɛ lajɛ.",
    },
    fallback: {
        [Language.EN]: "I'm sorry, I didn't understand. You can ask for your 'balance', 'history', or 'transfer [amount] to [name]'.",
        [Language.FR]: "Désolé, je n'ai pas compris. Vous pouvez demander votre 'solde', 'historique', ou 'transférer [montant] à [nom]'.",
        [Language.CI_DYU]: "Yafa, n'ma a faamu. I bɛ se ka 'solde', 'historique', walima 'wari ci [warijɛ] ma [tɔgɔ]' ɲini.",
        [Language.CI_BAO]: "Yafa, n'ma a faamu. I bɛ se ka 'solde', 'historique', walima 'wari ci [warijɛ] ma [tɔgɔ]' ɲini.",
    },
    spendingAnalysisIntro: {
        [Language.EN]: 'Here is a breakdown of your recent spending:',
        [Language.FR]: 'Voici une analyse de vos dépenses récentes :',
        [Language.CI_DYU]: 'I ka depansi kura lajɛlen niŋ kɔ:',
        [Language.CI_BAO]: 'I ka depansi kura lajɛlen niŋ kɔ:',
    },
    spendingAnalysisCategory: {
        [Language.EN]: '{category}: {amount} francs',
        [Language.FR]: '{category} : {amount} francs',
        [Language.CI_DYU]: '{category}: {amount} francs',
        [Language.CI_BAO]: '{category}: {amount} francs',
    },
    spendingAnalysisFallback: {
        [Language.EN]: "I couldn't find any significant spending to analyze.",
        [Language.FR]: "Je n'ai trouvé aucune dépense significative à analyser.",
        [Language.CI_DYU]: 'Depansi caman sɔrɔla ka lajɛ.',
        [Language.CI_BAO]: 'Depansi caman sɔrɔla ka lajɛ.',
    },
    alertSetSuccess: {
        [Language.EN]: 'Alright, I will notify you if your spending on {category} exceeds {amount} francs.',
        [Language.FR]: 'D\'accord, je vous notifierai si vos dépenses en {category} dépassent {amount} francs.',
        [Language.CI_DYU]: 'N\'i ka depansi {category} la ka {amount} francs tɛmɛ, n\'b\'i lasɔrɔ.',
        [Language.CI_BAO]: 'N\'i ka depansi {category} la ka {amount} francs tɛmɛ, n\'b\'i lasɔrɔ.',
    },
    alertSetSuccessNoCategory: {
        [Language.EN]: 'Got it. I will set a general spending alert for {amount} francs.',
        [Language.FR]: 'Compris. Je vais définir une alerte de dépense générale pour {amount} francs.',
        [Language.CI_DYU]: 'N\'ye a faamu. N\'bɛ depansi lasɔrɔ caman dɔ sigi {amount} francs la.',
        [Language.CI_BAO]: 'N\'ye a faamu. N\'bɛ depansi lasɔrɔ caman dɔ sigi {amount} francs la.',
    }
};

export const getTranslation = (key: string, lang: Language, params: Record<string, string | number> = {}) => {
    let text = translations[key]?.[lang] || key;
    for (const p in params) {
        text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), String(params[p]));
    }
    return text;
};