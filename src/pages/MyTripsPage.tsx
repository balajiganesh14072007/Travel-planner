import React, { useState, useEffect } from 'react';
import { Trip } from '../types';
import { tripsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TripCard } from '../components/TripCard';
import { TripModal } from '../components/TripModal';
import { Link } from 'react-router-dom';
import {
  Compass,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';

export const MyTripsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('date-asc');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // Deletion confirmation
  const [deleteConfirmTrip, setDeleteConfirmTrip] = useState<{ id: string; title: string } | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripsAPI.getAll({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: sortOption,
      });
      if (res.success) {
        setTrips(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, statusFilter, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setModalOpen(true);
  };

  const handleDeleteTrip = (id: string, title: string) => {
    setDeleteConfirmTrip({ id, title });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmTrip) return;
    try {
      await tripsAPI.delete(deleteConfirmTrip.id);
      setDeleteConfirmTrip(null);
      fetchTrips();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete trip.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Trip Management · Full CRUD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Travel Trips
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your itineraries, travel dates, budgets, and destination records.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTrip(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or destination..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </form>

        {/* Status and Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="date-asc">Date (Earliest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="budget-desc">Budget (High to Low)</option>
              <option value="budget-asc">Budget (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Auth Banner if Guest */}
      {!isAuthenticated && (
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-blue-950 text-sm">Sign in to sync your trips across devices</h3>
            <p className="text-xs text-blue-800 mt-1">
              Your trips are saved securely under your user account with role-based access.
            </p>
          </div>
          <Link
            to="/auth"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold whitespace-nowrap shrink-0"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Trip Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Trips Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {search || statusFilter !== 'all'
                ? 'No trips matched your search or status filter. Try clearing filters.'
                : 'You have not created any trips yet. Get started by creating your first travel plan!'}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTrip(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Trip</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={handleEditTrip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}

      {/* Trip Modal for Create/Edit */}
      <TripModal
        isOpen={modalOpen}
        trip={editingTrip}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchTrips();
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Delete Trip?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">"{deleteConfirmTrip.title}"</strong>? All associated day activities, itinerary records, and expense entries will be permanently removed from MongoDB.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmTrip(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
