
export interface User {
  id: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  timestamp: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  recognisedText?: string;
}

export enum Language {
  FR = 'fr-FR',
  EN = 'en-US',
  CI_DYU = 'ci-DYU', // Placeholder for Dioula
  CI_BAO = 'ci-BAO', // Placeholder for Baoulé
}

export const languageOptions = [
    { value: Language.FR, label: 'Français' },
    { value: Language.CI_DYU, label: 'Dioula' },
    { value: Language.CI_BAO, label: 'Baoulé' },
];

export interface BankActionResult {
    success: boolean;
    message: string;
    data?: any;
}
