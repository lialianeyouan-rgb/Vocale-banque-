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
  id:string;
  text: string;
  sender: 'user' | 'ai';
  recognisedText?: string;
}

export interface LocalFunctionCall {
    name: string;
    args: { [key: string]: any };
}

export enum Language {
  EN = 'en-US',
  FR = 'fr-FR',
  CI_DYU = 'ci-DYU', // Placeholder pour le Dioula
  CI_BAO = 'ci-BAO', // Placeholder pour le Baoulé
}

export const languageOptions = [
    { value: Language.EN, label: 'English' },
    { value: Language.FR, label: 'Français' },
    { value: Language.CI_DYU, label: 'Dioula' },
    { value: Language.CI_BAO, label: 'Baoulé' },
];

export interface BankActionResult {
    success: boolean;
    message: string;
    data?: any;
}
