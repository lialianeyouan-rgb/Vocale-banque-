
import { User, Transaction } from './types';

export const CURRENT_USER_ID = 'user-001';

export const MOCK_USERS: User[] = [
  { id: 'user-001', name: 'Koffi', balance: 75500 },
  { id: 'user-002', name: 'Awa', balance: 123000 },
  { id: 'user-003', name: 'Moussa', balance: 42000 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't-1', userId: 'user-001', type: 'credit', amount: 50000, description: 'Dépôt de salaire', timestamp: '2023-10-01T10:00:00Z' },
  { id: 't-2', userId: 'user-001', type: 'debit', amount: 2500, description: 'Achat supermarché', timestamp: '2023-10-02T14:30:00Z' },
  { id: 't-3', userId: 'user-001', type: 'debit', amount: 12000, description: 'Facture électricité', timestamp: '2023-10-05T09:00:00Z' },
  { id: 't-4', userId: 'user-001', type: 'credit', amount: 10000, description: 'Remboursement ami', timestamp: '2023-10-07T18:45:00Z' },
  { id: 't-5', userId: 'user-002', type: 'credit', amount: 100000, description: 'Dépôt initial', timestamp: '2023-09-15T11:00:00Z' },
  { id: 't-6', userId: 'user-003', type: 'credit', amount: 30000, description: 'Dépôt initial', timestamp: '2023-09-20T16:20:00Z' },
];
