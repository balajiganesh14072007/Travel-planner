import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripsAPI, activitiesAPI, expensesAPI, travelAPI } from '../services/api';
import { Trip, Activity, Expense, RouteSearchResult } from '../types';
import { MapView } from '../components/MapView';
import { BudgetOverviewCard } from '../components/BudgetOverviewCard';
import { ActivityModal } from '../components/ActivityModal';
import { ExpenseModal } from '../components/ExpenseModal';
import { TripModal } from '../components/TripModal';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Clock,
  Plus,
  Edit,
  Trash2,
  CalendarCheck,
  TrendingUp,
  Map,
  ArrowLeft,
  AlertCircle,
  Tag,
  DollarSign,
  Compass,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [routeData, setRouteData] = useState<RouteSearchResult | null>(null);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'expenses' | 'map'>('itinerary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Deletion confirm
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'activity' | 'expense'; id: string; name: string } | null>(null);

  const loadTripData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await tripsAPI.getById(id);
      if (res.success && res.data) {
        setTrip(res.data);
        setActivities(res.data.activities || []);
        setExpenses(res.data.expenses || []);

        // Load route coordinates for interactive map
        try {
          const routeRes = await travelAPI.getRoute(res.data.origin, res.data.destination, res.data.travellers);
          if (routeRes.success) {
            setRouteData(routeRes.data);
          }
        } catch {
          // Route map fallback
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load trip details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTripData();
  }, [id]);

  const handleDeleteActivity = (actId: string, title: string) => {
    setDeleteConfirm({ type: 'activity', id: actId, name: title });
  };

  const handleDeleteExpense = (expId: string, desc: string) => {
    setDeleteConfirm({ type: 'expense', id: expId, name: desc });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'activity') {
        await activitiesAPI.delete(deleteConfirm.id);
      } else {
        await expensesAPI.delete(deleteConfirm.id);
      }
      setDeleteConfirm(null);
      loadTripData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  // Group activities chronologically by day
  const groupedActivities: Record<string, Activity[]> = {};
  activities.forEach((act) => {
    if (!groupedActivities[act.date]) {
      groupedActivities[act.date] = [];
    }
    groupedActivities[act.date].push(act);
  });

  const sortedDates = Object.keys(groupedActivities).sort();

  // Financial calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = trip?.budget || 0;
  const remainingBudget = totalBudget - totalExpenses;
  const budgetUsedPercentage = totalBudget > 0 ? +((totalExpenses / totalBudget) * 100).toFixed(1) : 0;
  const isOverBudget = totalExpenses > totalBudget;

  // Category data for Recharts
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const pieChartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{error || 'Trip Not Found'}</h2>
        <p className="text-xs text-slate-500">
          The requested trip may have been removed or you may lack permissions to view it.
        </p>
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <Link
          to="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Trips</span>
        </Link>

        <button
          onClick={() => setTripModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Trip Configuration</span>
        </button>
      </div>

      {/* Trip Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {trip.status}
              </span>
              <span className="text-xs text-slate-500">Created {new Date(trip.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{trip.origin}</span>
                <span className="text-slate-400">→</span>
                <span className="font-semibold text-slate-900">{trip.destination}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{trip.startDate} to {trip.endDate}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="font-mono">{trip.travellers} {trip.travellers === 1 ? 'traveller' : 'travellers'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEditingActivity(null);
                setActivityModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
            <button
              onClick={() => {
                setEditingExpense(null);
                setExpenseModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {trip.notes && (
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            <strong>Notes & Reminders:</strong> {trip.notes}
          </p>
        )}

        {/* Financial Summary Card */}
        <BudgetOverviewCard
          totalBudget={totalBudget}
          totalExpenses={totalExpenses}
          remainingBudget={remainingBudget}
          budgetUsedPercentage={budgetUsedPercentage}
          isOverBudget={isOverBudget}
          currency={trip.currency}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`pb-3 flex items-center gap-2 transition-colors relative ${
              activeTab === 'itinerary'
                ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Itinerary Schedule ({activities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`pb-3 flex items-center gap-2 transition-colors relative ${
              activeTab === 'expenses'
                ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Expense Tracker ({expenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`pb-3 flex items-center gap-2 transition-colors relative ${
              activeTab === 'map'
                ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Route & Map</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Day-by-Day Itinerary Schedule */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Day-by-Day Travel Schedule</h2>
              <p className="text-xs text-slate-500">Activities arranged in chronological schedule order</p>
            </div>
            <button
              onClick={() => {
                setEditingActivity(null);
                setActivityModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">No Activities Scheduled Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Build your daily schedule by adding sight-seeing, activities, meals, or excursions.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setEditingActivity(null);
                    setActivityModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  Add First Activity
                </button>
                <Link
                  to={`/explore?origin=${encodeURIComponent(trip.origin)}&destination=${encodeURIComponent(
                    trip.destination
                  )}`}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  Discover Recommended Attractions
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDates.map((dayDate, dayIndex) => (
                <div key={dayDate} className="space-y-3">
                  {/* Day Header */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      D{dayIndex + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {new Date(dayDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </h3>
                    <span className="text-xs text-slate-400">
                      ({groupedActivities[dayDate].length} {groupedActivities[dayDate].length === 1 ? 'activity' : 'activities'})
                    </span>
                  </div>

                  {/* Activity Timeline Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-9">
                    {groupedActivities[dayDate].map((act) => (
                      <div
                        key={act._id}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{act.title}</h4>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingActivity(act);
                                  setActivityModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(act._id, act.title)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {(act.startTime || act.endTime) && (
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{act.startTime} {act.endTime ? `- ${act.endTime}` : ''}</span>
                            </div>
                          )}

                          {act.location && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">{act.location}</span>
                            </div>
                          )}

                          {act.description && (
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {act.description}
                            </p>
                          )}

                          {act.notes && (
                            <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-500 border border-slate-100">
                              {act.notes}
                            </div>
                          )}
                        </div>

                        {act.estimatedCost > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500">Estimated Cost:</span>
                            <span className="font-bold text-slate-900 font-mono">
                              ₹{act.estimatedCost.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Expense and Budget Management */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Expense Management</h2>
              <p className="text-xs text-slate-500">Track and categorize expenditures incurred during the trip</p>
            </div>
            <button
              onClick={() => {
                setEditingExpense(null);
                setExpenseModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Expense</span>
            </button>
          </div>

          {/* Visual Expense Breakdown */}
          {expenses.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Breakdown Recharts Pie Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Expense Breakdown by Category</h3>
                  <p className="text-xs text-slate-500 mb-4">Proportion of total expenditure</p>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        innerRadius={45}
                        paddingAngle={3}
                      >
                        {pieChartData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Ledger Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm lg:col-span-2">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Logged Transactions ({expenses.length})</h3>
                  <span className="text-xs text-slate-500">Total: <strong className="font-mono text-slate-900">₹{totalExpenses.toLocaleString()}</strong></span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 text-right">Amount (₹)</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenses.map((exp) => (
                        <tr key={exp._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 text-slate-600 font-mono whitespace-nowrap">{exp.date}</td>
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
                                  setExpenseModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(exp._id, exp.description || exp.category)}
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
              </div>
            </div>
          )}

          {expenses.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">No Expenses Logged Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Keep your trip within budget by recording fuel, hotel stays, dining, and attraction fees.
              </p>
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setExpenseModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Log First Expense
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Interactive Route Map */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Trip Geographic Route</h2>
              <p className="text-xs text-slate-500">
                Interactive routing map between {trip.origin} and {trip.destination}
              </p>
            </div>
          </div>

          {routeData ? (
            <MapView
              origin={routeData.origin}
              destination={routeData.destination}
              distanceKm={routeData.distanceKm}
              durationText={routeData.drivingDurationText}
              polyline={routeData.polyline}
              attractions={routeData.attractions}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Generating interactive route map for {trip.origin} to {trip.destination}...
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TripModal
        isOpen={tripModalOpen}
        trip={trip}
        onClose={() => setTripModalOpen(false)}
        onSuccess={() => loadTripData()}
      />

      <ActivityModal
        isOpen={activityModalOpen}
        tripId={trip._id}
        activity={editingActivity}
        tripStartDate={trip.startDate}
        tripEndDate={trip.endDate}
        onClose={() => setActivityModalOpen(false)}
        onSuccess={() => loadTripData()}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        tripId={trip._id}
        expense={editingExpense}
        tripCurrency={trip.currency}
        onClose={() => setExpenseModalOpen(false)}
        onSuccess={() => loadTripData()}
      />

      {/* Deletion Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Delete {deleteConfirm.type === 'activity' ? 'Activity' : 'Expense'}?
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">"{deleteConfirm.name}"</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
