import { User, Transaction } from './types';

export const CURRENT_USER_ID = 'user-001';

export const MOCK_USERS: User[] = [
  { id: 'user-001', name: 'Alex', balance: 75500 },
  { id: 'user-002', name: 'Maria', balance: 123000 },
  { id: 'user-003', name: 'David', balance: 42000 },
  { id: 'user-004', name: 'Sophia', balance: 85000 },
  { id: 'user-005', name: 'Liam', balance: 210000 },
  { id: 'user-006', name: 'Olivia', balance: 67500 },
  { id: 'user-007', name: 'Noah', balance: 99000 },
  { id: 'user-008', name: 'Emma', balance: 15000 },
  { id: 'user-009', name: 'William', balance: 500000 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't-1', userId: 'user-001', type: 'credit', amount: 50000, description: 'Dépôt de salaire', timestamp: '2023-10-28T10:00:00Z' },
  { id: 't-2', userId: 'user-001', type: 'debit', amount: 2500, description: 'Achat supermarché', timestamp: '2023-10-28T14:30:00Z' },
  { id: 't-3', userId: 'user-001', type: 'debit', amount: 12000, description: 'Facture d\'électricité', timestamp: '2023-10-27T09:00:00Z' },
  { id: 't-4', userId: 'user-001', type: 'credit', amount: 10000, description: 'Remboursement ami', timestamp: '2023-10-26T18:45:00Z' },
  { id: 't-101', userId: 'user-001', type: 'debit', amount: 750, description: 'Café', timestamp: '2023-10-25T08:15:00Z' },
  { id: 't-102', userId: 'user-001', type: 'debit', amount: 5500, description: 'Station service', timestamp: '2023-10-25T17:00:00Z' },
  { id: 't-103', userId: 'user-001', type: 'debit', amount: 8900, description: 'Dîner au restaurant', timestamp: '2023-10-24T20:30:00Z' },
  { id: 't-104', userId: 'user-001', type: 'debit', amount: 3200, description: 'Pharmacie', timestamp: '2023-10-24T11:00:00Z' },
  { id: 't-105', userId: 'user-001', type: 'debit', amount: 15000, description: 'Achat en ligne - Vêtements', timestamp: '2023-10-23T15:00:00Z' },
  { id: 't-106', userId: 'user-001', type: 'debit', amount: 20000, description: 'Retrait au distributeur', timestamp: '2023-10-22T13:00:00Z' },
  { id: 't-107', userId: 'user-001', type: 'credit', amount: 25000, description: 'Paiement projet freelance', timestamp: '2023-10-22T10:00:00Z' },
  { id: 't-108', userId: 'user-001', type: 'debit', amount: 1800, description: 'Boulangerie', timestamp: '2023-10-21T09:20:00Z' },
  { id: 't-109', userId: 'user-001', type: 'debit', amount: 4500, description: 'Tickets de cinéma', timestamp: '2023-10-20T19:00:00Z' },
  { id: 't-110', userId: 'user-001', type: 'debit', amount: 60000, description: 'Paiement du loyer', timestamp: '2023-10-20T12:00:00Z' },
  { id: 't-111', userId: 'user-001', type: 'debit', amount: 7200, description: 'Facture internet', timestamp: '2023-10-19T11:30:00Z' },
  { id: 't-112', userId: 'user-001', type: 'credit', amount: 5000, description: 'Vente d\'un vieil article', timestamp: '2023-10-18T16:00:00Z' },
  { id: 't-113', userId: 'user-001', type: 'debit', amount: 1250, description: 'Abonnement service streaming', timestamp: '2023-10-17T00:05:00Z' },
  { id: 't-114', userId: 'user-001', type: 'debit', amount: 9800, description: 'Magasin d\'électronique', timestamp: '2023-10-16T14:50:00Z' },
  { id: 't-115', userId: 'user-001', type: 'debit', amount: 3500, description: 'Déjeuner entre collègues', timestamp: '2023-10-15T13:10:00Z' },
  { id: 't-116', userId: 'user-001', type: 'debit', amount: 15000, description: 'Virement à Sophia', timestamp: '2023-10-14T18:00:00Z' },
  { id: 't-117', userId: 'user-001', type: 'credit', amount: 7500, description: 'Remboursement de Liam', timestamp: '2023-10-13T11:00:00Z' },
  { id: 't-118', userId: 'user-001', type: 'debit', amount: 4200, description: 'Librairie', timestamp: '2023-10-12T16:25:00Z' },
  { id: 't-119', userId: 'user-001', type: 'debit', amount: 650, description: 'Transport public', timestamp: '2023-10-11T08:45:00Z' },
  { id: 't-120', userId: 'user-001', type: 'debit', amount: 3000, description: 'Abonnement salle de sport', timestamp: '2023-10-10T07:00:00Z' },
  { id: 't-5', userId: 'user-002', type: 'credit', amount: 100000, description: 'Dépôt initial', timestamp: '2023-09-15T11:00:00Z' },
  { id: 't-6', userId: 'user-003', type: 'credit', amount: 30000, description: 'Dépôt initial', timestamp: '2023-09-20T16:20:00Z' },
];