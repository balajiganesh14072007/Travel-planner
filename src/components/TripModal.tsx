import React, { useState, useEffect } from 'react';
import { Trip, TripStatus } from '../types';
import { tripsAPI } from '../services/api';
import { X, Check, AlertCircle } from 'lucide-react';

interface TripModalProps {
  trip?: Trip | null; // If passed, edit mode; else create mode
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedTrip: Trip) => void;
}

export const TripModal: React.FC<TripModalProps> = ({ trip, isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [budget, setBudget] = useState(25000);
  const [currency, setCurrency] = useState('INR');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<TripStatus>('planning');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setOrigin(trip.origin);
      setDestination(trip.destination);
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setTravellers(trip.travellers);
      setBudget(trip.budget);
      setCurrency(trip.currency);
      setNotes(trip.notes || '');
      setStatus(trip.status);
    } else {
      // Defaults for a new trip
      setTitle('Goa Coastal Weekend');
      setOrigin('Hyderabad, Telangana');
      setDestination('Goa, India');
      const today = new Date();
      const inTwoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      const inThreeWeeks = new Date(today.getTime() + 19 * 24 * 60 * 60 * 1000);
      setStartDate(inTwoWeeks.toISOString().split('T')[0]);
      setEndDate(inThreeWeeks.toISOString().split('T')[0]);
      setTravellers(2);
      setBudget(35000);
      setCurrency('INR');
      setNotes('');
      setStatus('planning');
    }
    setError(null);
  }, [trip, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !origin || !destination || !startDate || !endDate) {
      setError('Please fill in all required fields.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        origin: origin.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        travellers: Number(travellers) || 1,
        budget: Number(budget) || 0,
        currency,
        notes,
        status,
      };

      if (trip && trip._id) {
        const res = await tripsAPI.update(trip._id, payload);
        if (res.success && res.data) {
          onSuccess(res.data);
          onClose();
        }
      } else {
        const res = await tripsAPI.create(payload);
        if (res.success && res.data) {
          onSuccess(res.data);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-base">{trip ? 'Edit Trip' : 'Create New Trip'}</h3>
            <p className="text-xs text-slate-500">Plan dates, destination, travellers, and budget</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Trip Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Goa Coastal Vacation"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Point (Origin) *</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g., Hyderabad, Telangana"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Final Destination *</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Goa, India"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Travellers</label>
              <input
                type="number"
                min="1"
                required
                value={travellers}
                onChange={(e) => setTravellers(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Planned Budget</label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TripStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none capitalize"
              >
                <option value="planning">Planning</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Packing Reminders</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes on routes, hotel confirmation, or must-see places"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 shrink-0">
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
              {loading ? 'Saving...' : <><Check className="w-3.5 h-3.5" /> {trip ? 'Update Trip' : 'Create Trip'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
