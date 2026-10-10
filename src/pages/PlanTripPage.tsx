import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Wallet,
  ArrowRight,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

export const PlanTripPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState('Goa Coastal Weekend Getaway');
  const [origin, setOrigin] = useState('Hyderabad, Telangana');
  const [destination, setDestination] = useState('Goa, India');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [travellers, setTravellers] = useState(2);
  const [budget, setBudget] = useState(35000);
  const [currency, setCurrency] = useState('INR');
  const [notes, setNotes] = useState('Explore North Goa beaches, fort heritage sights, and local authentic seafood shacks.');
  const [status, setStatus] = useState<'planning' | 'upcoming'>('planning');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/auth?redirect=/plan');
      return;
    }

    if (!title || !origin || !destination || !startDate || !endDate) {
      setError('Please provide all mandatory trip details.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Trip end date cannot be earlier than start date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await tripsAPI.create({
        title: title.trim(),
        origin: origin.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        travellers: Number(travellers) || 1,
        budget: Number(budget) || 0,
        currency: currency.toUpperCase(),
        notes: notes.trim(),
        status,
      });

      if (res.success && res.data) {
        navigate(`/trips/${res.data._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>New Itinerary Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Plan Your Next Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Set up destinations, dates, budgets, and traveller group details stored securely in MongoDB.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Trip Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Trip Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Manali Himalayan Winter Trek"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Starting Location (Origin) *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g., Hyderabad, Telangana"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Final Destination *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Goa, India"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Travel Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Departure Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Return Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Group, Budget, and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Number of Travellers
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="number"
                  min="1"
                  required
                  value={travellers}
                  onChange={(e) => setTravellers(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Planned Budget (₹)
              </label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none capitalize h-[42px]"
              >
                <option value="planning">Planning</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          {/* Trip Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Trip Notes, Checklist & Packing Ideas
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key things to remember, transport booking notes, emergency contacts..."
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500">
              Your trip will be created in MongoDB Atlas and available on your dashboard immediately.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Trip...' : 'Create Trip & Open Itinerary'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
