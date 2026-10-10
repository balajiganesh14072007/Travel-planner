import React, { useState, useEffect } from 'react';
import { tripsAPI, expensesAPI } from '../services/api';
import { Trip, Activity, Expense, FinancialOverview } from '../types';
import { useAuth } from '../context/AuthContext';
import { TripCard } from '../components/TripCard';
import { TripModal } from '../components/TripModal';
import { ExpenseModal } from '../components/ExpenseModal';
import {
  Compass,
  Plus,
  Search,
  Wallet,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [financials, setFinancials] = useState<FinancialOverview | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deleteConfirmTrip, setDeleteConfirmTrip] = useState<{ id: string; title: string } | null>(null);
  const [createExpenseOpen, setCreateExpenseOpen] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const tripsRes = await tripsAPI.getAll();
      if (tripsRes.success) {
        setTrips(tripsRes.data);
      }

      const expRes = await expensesAPI.getOverview();
      if (expRes.success) {
        setFinancials(expRes.overview);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Derived counts
  const totalTripsCount = trips.length;
  const upcomingTripsCount = trips.filter((t) => t.status === 'upcoming' || t.status === 'planning').length;
  const completedTripsCount = trips.filter((t) => t.status === 'completed').length;

  const totalBudget = financials?.totalPlannedBudget || trips.reduce((s, t) => s + t.budget, 0);
  const totalExpenses = financials?.totalExpenses || 0;
  const remainingBudget = totalBudget - totalExpenses;
  const budgetUsedPct = totalBudget > 0 ? +((totalExpenses / totalBudget) * 100).toFixed(1) : 0;
  const isOverBudget = totalExpenses > totalBudget;

  // Category Pie Chart data
  const pieData = financials?.categoryTotals
    ? Object.entries(financials.categoryTotals)
        .filter(([_, val]) => val > 0)
        .map(([name, value]) => ({ name, value }))
    : [];

  // Bar chart data for trips
  const barData = financials?.tripComparisonData
    ? financials.tripComparisonData.map((d) => ({
        name: d.title.length > 14 ? d.title.slice(0, 14) + '...' : d.title,
        Planned: d.budget,
        Spent: d.spent,
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>MERN Executive Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Traveller'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Overview of your upcoming itineraries, budget allocations, and travel expenses.
          </p>
        </div>

        {/* Mandatory Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCreateTripOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Trip</span>
          </button>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Explore Destinations</span>
          </Link>
          {trips.length > 0 && (
            <button
              onClick={() => setCreateExpenseOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
          )}
          <Link
            to="/itinerary"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>View Itinerary</span>
          </Link>
        </div>
      </div>

      {/* Critical Budget Warning Alert if Over Budget */}
      {isOverBudget && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-3 shadow-sm animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Portfolio Budget Warning: Overall Expenditure Exceeds Budget!</h4>
            <p>
              Your aggregate expenses have crossed your total planned budget limit by <strong className="font-mono">₹{(totalExpenses - totalBudget).toLocaleString()}</strong> ({budgetUsedPct}% utilized). Review category breakdowns below.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards Grid (6 Required KPI metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Trips */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Trips</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">{totalTripsCount}</div>
          <p className="text-[10px] text-slate-500">In database</p>
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Upcoming</span>
          <div className="text-2xl font-extrabold text-blue-600 font-mono tabular-nums">{upcomingTripsCount}</div>
          <p className="text-[10px] text-slate-500">Planning & scheduled</p>
        </div>

        {/* Completed Trips */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">{completedTripsCount}</div>
          <p className="text-[10px] text-slate-500">Past journeys</p>
        </div>

        {/* Total Planned Budget */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Planned Budget</span>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            ₹{totalBudget.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500">Allocated ceiling</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Total Expenses</span>
          <div className="text-xl font-bold text-blue-600 font-mono tabular-nums">
            ₹{totalExpenses.toLocaleString()}
          </div>
          <p className="text-[10px] text-blue-600">{budgetUsedPct}% of budget</p>
        </div>

        {/* Remaining Budget */}
        <div className={`rounded-xl border p-4 shadow-sm space-y-1 ${isOverBudget ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'}`}>
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${isOverBudget ? 'text-red-700' : 'text-emerald-600'}`}>
            {isOverBudget ? 'Deficit' : 'Remaining'}
          </span>
          <div className={`text-xl font-bold font-mono tabular-nums ${isOverBudget ? 'text-red-700' : 'text-emerald-700'}`}>
            ₹{Math.abs(remainingBudget).toLocaleString()}
          </div>
          <p className={`text-[10px] ${isOverBudget ? 'text-red-600' : 'text-slate-500'}`}>
            {isOverBudget ? 'Over budget limit' : 'Available balance'}
          </p>
        </div>
      </div>

      {/* Analytics Charts (Expense breakdown & Budget comparison) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Recharts Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Expense Breakdown by Category</h3>
              <p className="text-xs text-slate-500">Distribution of expenditures</p>
            </div>
            <Link to="/expenses" className="text-xs text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="h-60 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No expense data recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Budget vs Actual Spending Recharts Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Budget vs Actual Spending by Trip</h3>
              <p className="text-xs text-slate-500">Planned allocation versus incurred costs</p>
            </div>
            <Link to="/expenses" className="text-xs text-blue-600 font-semibold hover:underline">
              Analyze
            </Link>
          </div>
          <div className="h-60 w-full">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Planned" fill="#93C5FD" radius={[4, 4, 0, 0]} name="Planned Budget" />
                  <Bar dataKey="Spent" fill="#2563EB" radius={[4, 4, 0, 0]} name="Actual Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No trip financial data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Trips Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Trips</h3>
            <p className="text-xs text-slate-500">Recently updated travel plans</p>
          </div>
          <Link to="/trips" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>View All Trips ({trips.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No trips configured. Click "Create New Trip" above to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onEdit={(t) => setEditingTrip(t)}
                onDelete={(id, title) => setDeleteConfirmTrip({ id, title })}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <TripModal
        isOpen={createTripOpen || Boolean(editingTrip)}
        trip={editingTrip}
        onClose={() => {
          setCreateTripOpen(false);
          setEditingTrip(null);
        }}
        onSuccess={() => {
          loadDashboardData();
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Trip?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">"{deleteConfirmTrip.title}"</strong>? All associated activities and expenses will be permanently removed.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmTrip(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await tripsAPI.delete(deleteConfirmTrip.id);
                    setDeleteConfirmTrip(null);
                    loadDashboardData();
                  } catch {
                    //
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {trips.length > 0 && (
        <ExpenseModal
          isOpen={createExpenseOpen}
          tripId={trips[0]._id}
          onClose={() => setCreateExpenseOpen(false)}
          onSuccess={() => loadDashboardData()}
        />
      )}
    </div>
  );
};
