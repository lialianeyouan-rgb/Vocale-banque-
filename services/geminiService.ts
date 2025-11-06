import { BankActionResult, Language, LocalFunctionCall } from '../types';
import { getTranslation } from '../utils/translations';

// A simple command parser to replace the Gemini API call.
// It uses regular expressions to identify intents and extract arguments.
interface CommandRule {
    regex: RegExp;
    action: string;
    // Extracts arguments from the regex match array.
    argExtractor?: (match: RegExpMatchArray) => { [key: string]: any };
}

// For simplicity, these regex are primarily designed for French, the default language.
const commandRules: CommandRule[] = [
    {
        regex: /solde|balance/i,
        action: 'getBalance',
    },
    {
        regex: /(?:relevé|historique|transactions)(?: de (\d+))?/i,
        action: 'getStatement',
        argExtractor: (match) => ({ limit: match[1] ? parseInt(match[1], 10) : 5 }),
    },
    {
        regex: /(?:virement|transférer|envoyer) ([\d\s]+)(?: francs)? à (\w+)/i,
        action: 'transferFunds',
        argExtractor: (match) => ({
            amount: parseInt(match[1].replace(/\s/g, ''), 10),
            recipientName: match[2],
        }),
    },
    {
        regex: /analyse|analyser (?:mes )?dépenses/i,
        action: 'analyzeSpending',
    },
    {
        regex: /(?:alerte|notifier|préviens-moi) (?:de |si je dépense plus de )([\d\s]+)(?: sur (?:la catégorie|le|la) (\w+))?/i,
        action: 'setSpendingAlert',
        argExtractor: (match) => ({
            amount: parseInt(match[1].replace(/\s/g, ''), 10),
            category: match[3] || undefined
        }),
    }
];


export const getAiResponseAndAction = async (
    prompt: string,
    // The 'chat' parameter is no longer used but kept for signature consistency
    // to minimize changes in App.tsx. It can be passed as `null`.
    chat: any, 
    handleBankAction: (functionCall: LocalFunctionCall) => BankActionResult,
    language: Language
): Promise<{ responseText: string }> => {
    const trimmedPrompt = prompt.trim();

    for (const rule of commandRules) {
        const match = trimmedPrompt.match(rule.regex);
        if (match) {
            const args = rule.argExtractor ? rule.argExtractor(match) : {};
            const result = handleBankAction({ name: rule.action, args });
            // The handleBankAction function already returns a user-friendly message.
            return { responseText: result.message };
        }
    }

    // If no command is matched, return a fallback message.
    return { responseText: getTranslation('fallback', language) };
};