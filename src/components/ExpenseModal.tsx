import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '../types';
import { expensesAPI } from '../services/api';
import { X, Check, AlertCircle } from 'lucide-react';

interface ExpenseModalProps {
  tripId: string;
  expense?: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (saved: Expense) => void;
  tripCurrency?: string;
}

const CATEGORIES: ExpenseCategory[] = [
  'Transportation',
  'Accommodation',
  'Food',
  'Tourist attractions',
  'Shopping',
  'Other',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  tripId,
  expense,
  isOpen,
  onClose,
  onSuccess,
  tripCurrency = 'INR',
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('Transportation');
  const [amount, setAmount] = useState<number | string>('');
  const [currency, setCurrency] = useState('INR');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expense) {
      setCategory(expense.category);
      setAmount(expense.amount);
      setCurrency(expense.currency);
      setDate(expense.date);
      setDescription(expense.description || '');
    } else {
      setCategory('Transportation');
      setAmount('');
      setCurrency(tripCurrency);
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
    setError(null);
  }, [expense, isOpen, tripCurrency]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number greater than 0.');
      return;
    }
    if (!category || !date) {
      setError('Category and date are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        category,
        amount: numAmount,
        currency: currency.toUpperCase(),
        date,
        description: description.trim(),
      };

      if (expense && expense._id) {
        const res = await expensesAPI.update(expense._id, payload);
        if (res.success && res.data) {
          onSuccess(res.data);
          onClose();
        }
      } else {
        const res = await expensesAPI.create(tripId, payload);
        if (res.success && res.data) {
          onSuccess(res.data);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{expense ? 'Edit Expense Record' : 'Record New Expense'}</h3>
            <p className="text-xs text-slate-500">Track and categorize expenditures against your trip budget</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                placeholder="e.g., 2500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Vendor *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Return Flight Tickets / Beach Shack Seafood"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {loading ? 'Recording...' : <><Check className="w-3.5 h-3.5" /> {expense ? 'Update Expense' : 'Log Expense'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
