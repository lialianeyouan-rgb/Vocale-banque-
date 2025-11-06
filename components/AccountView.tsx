import React from 'react';
import { User, Transaction, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';

interface AccountViewProps {
    user: User;
    transactions: Transaction[];
    language: Language;
}

export const AccountView: React.FC<AccountViewProps> = ({ user, transactions, language }) => {
    const sortedTransactions = [...transactions]
        .filter(t => t.userId === user.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

    return (
        <div className="bg-black/20 rounded-2xl p-6 h-full flex flex-col shadow-lg backdrop-blur-sm border border-gray-700/50">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">{getTranslation('greeting', language, { name: user.name })}</h2>
            <div className="mb-6">
                <p className="text-sm text-blue-400">{getTranslation('currentBalance', language)}</p>
                <p className="text-4xl font-bold text-white tracking-tight">
                    {user.balance.toLocaleString(language)} <span className="text-2xl text-gray-400">{getTranslation('francs', language)}</span>
                </p>
            </div>
            <h3 className="text-md font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">{getTranslation('recentTransactions', language)}</h3>
            <ul className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {sortedTransactions.map(tx => (
                    <li key={tx.id} className="flex items-center text-sm gap-4">
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                            tx.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                            {tx.type === 'credit' ? <ArrowDownIcon /> : <ArrowUpIcon />}
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-200">{tx.description}</p>
                            <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleDateString(language, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <p className={`font-medium ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString(language)}
                        </p>
                    </li>
                ))}
                 {sortedTransactions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">{getTranslation('noRecentTransactions', language)}</p>
                )}
            </ul>
        </div>
    );
};