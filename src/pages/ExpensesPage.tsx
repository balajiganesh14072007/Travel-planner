import React, { useState, useEffect } from 'react';
import { tripsAPI, expensesAPI } from '../services/api';
import { Trip, Expense, ExpenseCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { BudgetOverviewCard } from '../components/BudgetOverviewCard';
import { ExpenseModal } from '../components/ExpenseModal';
import {
  Wallet,
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

const ALL_CATEGORIES: ('all' | ExpenseCategory)[] = [
  'all',
  'Transportation',
  'Accommodation',
  'Food',
  'Tourist attractions',
  'Shopping',
  'Other',
];

export const ExpensesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('all');
  const [expenses, setExpenses] = useState<(Expense & { tripTitle?: string })[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExpenseCategory>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const tripsRes = await tripsAPI.getAll();
      if (tripsRes.success) {
        setTrips(tripsRes.data);
      }

      const overviewRes = await expensesAPI.getOverview();
      if (overviewRes.success && overviewRes.overview) {
        setExpenses(overviewRes.overview.recentExpenses || []);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('Delete this expense transaction?')) return;
    try {
      await expensesAPI.delete(id);
      loadData();
    } catch {
      //
    }
  };

  // Filtered expenses list
  const filteredExpenses = expenses.filter((e) => {
    if (selectedTripId !== 'all' && e.tripId !== selectedTripId) return false;
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (search && !e.description?.toLowerCase().includes(search.toLowerCase()) && !e.category.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Calculate current scope financials
  const selectedTrip = trips.find((t) => t._id === selectedTripId);

  const scopeBudget = selectedTrip
    ? selectedTrip.budget
    : trips.reduce((sum, t) => sum + t.budget, 0);

  const scopeExpensesTotal = (selectedTripId === 'all' ? expenses : expenses.filter((e) => e.tripId === selectedTripId))
    .reduce((sum, e) => sum + e.amount, 0);

  const scopeRemaining = scopeBudget - scopeExpensesTotal;
  const scopeUsedPct = scopeBudget > 0 ? +((scopeExpensesTotal / scopeBudget) * 100).toFixed(1) : 0;
  const scopeIsOverBudget = scopeExpensesTotal > scopeBudget;

  // Category Pie Chart data
  const categoryTotals: Record<string, number> = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // Budget vs Actual Bar Chart data
  const barChartData = (selectedTripId === 'all' ? trips : trips.filter((t) => t._id === selectedTripId)).map((t) => {
    const tripSpent = expenses.filter((e) => e.tripId === t._id).reduce((s, e) => s + e.amount, 0);
    return {
      name: t.title.length > 15 ? t.title.slice(0, 15) + '...' : t.title,
      Planned: t.budget,
      Actual: tripSpent,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Log Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>Expense & Budget Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Travel Expenses & Budget Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time calculations for total expenses, remaining budget, and category spending distribution.
          </p>
        </div>

        {trips.length > 0 && (
          <button
            onClick={() => {
              setEditingExpense(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Expense</span>
          </button>
        )}
      </div>

      {/* Scope Financial Card (Calculated with strict formulas) */}
      <BudgetOverviewCard
        totalBudget={scopeBudget}
        totalExpenses={scopeExpensesTotal}
        remainingBudget={scopeRemaining}
        budgetUsedPercentage={scopeUsedPct}
        isOverBudget={scopeIsOverBudget}
        tripTitle={selectedTrip ? selectedTrip.title : 'All Trips Combined'}
      />

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expense description..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filter selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Trip Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Trip:</span>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
            >
              <option value="all">All Trips Combined</option>
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium capitalize"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Category Breakdown Pie Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Category-Wise Spending Breakdown</h3>
              <p className="text-xs text-slate-500">Distribution of expenditures by travel category</p>
            </div>
            <div className="h-64 w-full">
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {pieChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => `₹${Number(val).toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No data for current filters
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Budget vs Actual Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Planned Budget vs Actual Spending</h3>
              <p className="text-xs text-slate-500">Side-by-side comparison across your trips</p>
            </div>
            <div className="h-64 w-full">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip formatter={(val: any) => `₹${Number(val).toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Planned" fill="#93C5FD" radius={[4, 4, 0, 0]} name="Planned Budget" />
                    <Bar dataKey="Actual" fill="#2563EB" radius={[4, 4, 0, 0]} name="Actual Spent" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expenses Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Expense Transactions</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredExpenses.length} of {expenses.length} records
            </p>
          </div>
          <span className="font-bold text-slate-900 font-mono text-xs">
            Sum: ₹{filteredExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-xs text-slate-500">No transactions match your current search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Trip</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Amount (₹)</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-slate-600 font-mono whitespace-nowrap">{exp.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{exp.tripTitle || 'Trip'}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">{exp.category}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{exp.description}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">
                      ₹{exp.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingExpense(exp);
                            setModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expense Modal */}
      {trips.length > 0 && (
        <ExpenseModal
          isOpen={modalOpen}
          tripId={editingExpense ? editingExpense.tripId : selectedTripId !== 'all' ? selectedTripId : trips[0]._id}
          expense={editingExpense}
          onClose={() => setModalOpen(false)}
          onSuccess={() => loadData()}
        />
      )}
    </div>
  );
};
