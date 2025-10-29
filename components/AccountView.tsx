
import React from 'react';
import { User, Transaction } from '../types';

interface AccountViewProps {
    user: User;
    transactions: Transaction[];
}

export const AccountView: React.FC<AccountViewProps> = ({ user, transactions }) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    return (
        <div className="bg-black/20 rounded-xl p-6 h-full flex flex-col shadow-lg">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Bonjour, {user.name}</h2>
            <div className="mb-6">
                <p className="text-sm text-blue-400">Solde actuel</p>
                <p className="text-4xl font-bold text-white tracking-tight">
                    {user.balance.toLocaleString('fr-FR')} <span className="text-2xl text-gray-400">francs</span>
                </p>
            </div>
            <h3 className="text-md font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">Transactions Récentes</h3>
            <ul className="space-y-3 overflow-y-auto flex-1 pr-2">
                {sortedTransactions.map(tx => (
                    <li key={tx.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="text-gray-200">{tx.description}</p>
                            <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <p className={`font-medium ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')}
                        </p>
                    </li>
                ))}
                 {sortedTransactions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Aucune transaction récente.</p>
                )}
            </ul>
        </div>
    );
};
