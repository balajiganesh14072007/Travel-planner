import React from 'react';
import { AlertTriangle, TrendingUp, Wallet, CheckCircle2 } from 'lucide-react';

interface BudgetOverviewCardProps {
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
  budgetUsedPercentage: number;
  isOverBudget: boolean;
  currency?: string;
  tripTitle?: string;
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({
  totalBudget,
  totalExpenses,
  remainingBudget,
  budgetUsedPercentage = 0,
  isOverBudget,
  currency = 'INR',
  tripTitle,
}) => {
  const safePercentage = isNaN(budgetUsedPercentage) ? 0 : Math.max(0, budgetUsedPercentage);
  const overBudgetAmount = Math.max(0, totalExpenses - totalBudget);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Financial & Budget Summary {tripTitle ? `· ${tripTitle}` : ''}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">Budget Management Status</h3>
        </div>
        <div className="flex items-center gap-2">
          {isOverBudget ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Over Budget ({safePercentage}%)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Within Budget ({safePercentage}%)</span>
            </span>
          )}
        </div>
      </div>

      {/* Critical Over-Budget Warning Banner */}
      {isOverBudget && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Budget Alert: Spending Exceeded Planned Allocation!</p>
            <p className="mt-0.5 text-red-700">
              Total expenses exceed planned budget by <strong className="font-mono">₹{overBudgetAmount.toLocaleString()}</strong> ({budgetUsedPercentage}% used). Consider trimming non-essential shopping or activity expenses.
            </p>
          </div>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Planned Budget */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Planned Budget</span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            ₹{totalBudget.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Configured trip ceiling</p>
        </div>

        {/* Total Expenses Incurred */}
        <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100">
          <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
            <span>Total Expenses Incurred</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-blue-700 font-mono tabular-nums">
            ₹{totalExpenses.toLocaleString()}
          </div>
          <p className="text-[11px] text-blue-600 mt-1">{budgetUsedPercentage}% of total budget</p>
        </div>

        {/* Remaining Budget */}
        <div className={`p-3.5 rounded-lg border ${isOverBudget ? 'bg-red-50/50 border-red-200' : 'bg-emerald-50/50 border-emerald-100'}`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={isOverBudget ? 'text-red-700' : 'text-emerald-700'}>
              {isOverBudget ? 'Budget Deficit' : 'Remaining Budget'}
            </span>
            <span className="font-mono text-xs">{isOverBudget ? '-' : '+'}</span>
          </div>
          <div className={`text-xl font-bold font-mono tabular-nums ${isOverBudget ? 'text-red-700' : 'text-emerald-700'}`}>
            ₹{Math.abs(remainingBudget).toLocaleString()}
          </div>
          <p className={`text-[11px] mt-1 ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
            {isOverBudget ? 'Deficit over limit' : 'Available for remaining itinerary'}
          </p>
        </div>
      </div>

      {/* Visual Budget Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-600 mb-1.5">
          <span>Budget Utilization Progress</span>
          <span className="font-semibold font-mono tabular-nums">{safePercentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverBudget
                ? 'bg-red-500'
                : safePercentage > 85
                ? 'bg-amber-500'
                : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, safePercentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
