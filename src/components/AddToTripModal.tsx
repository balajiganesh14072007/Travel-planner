import React, { useState, useEffect } from 'react';
import { Attraction, Trip } from '../types';
import { tripsAPI, activitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, MapPin, Check, Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AddToTripModalProps {
  attraction: Attraction;
  onClose: () => void;
  onSuccess: (tripTitle: string) => void;
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({ attraction, onClose, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [activityDate, setActivityDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('12:30');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [loadingTrips, setLoadingTrips] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchUserTrips() {
      try {
        const res = await tripsAPI.getAll();
        if (res.success && res.data.length > 0) {
          setTrips(res.data);
          setSelectedTripId(res.data[0]._id);
          setActivityDate(res.data[0].startDate);
        }
      } catch {
        setError('Failed to load trips.');
      } finally {
        setLoadingTrips(false);
      }
    }

    fetchUserTrips();

    // Parse potential price number from admission fee
    const feeMatch = attraction.admissionFee?.match(/\d+/);
    if (feeMatch) {
      setEstimatedCost(Number(feeMatch[0]));
    }
  }, [isAuthenticated, attraction]);

  const handleTripChange = (tripId: string) => {
    setSelectedTripId(tripId);
    const chosen = trips.find((t) => t._id === tripId);
    if (chosen) {
      setActivityDate(chosen.startDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) {
      setError('Please select a trip.');
      return;
    }
    if (!activityDate) {
      setError('Please pick an activity date.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const selectedTrip = trips.find((t) => t._id === selectedTripId);

      await activitiesAPI.create(selectedTripId, {
        title: `Visit ${attraction.name}`,
        date: activityDate,
        startTime,
        endTime,
        location: attraction.location,
        description: attraction.description,
        estimatedCost: Number(estimatedCost) || 0,
        notes: notes ? `${notes} · ${attraction.openingHours || ''}` : attraction.openingHours || '',
      });

      onSuccess(selectedTrip?.title || 'Trip');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add activity to itinerary.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Add to Trip Itinerary</h3>
            <p className="text-xs text-slate-500">Schedule this attraction into your travel plan</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Sign In to Save Attractions</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                You must be logged in to attach recommended attractions to your personalized trip itineraries.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <Link
                to="/auth"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        ) : loadingTrips ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading your trips...</div>
        ) : trips.length === 0 ? (
          <div className="p-6 text-center space-y-3">
            <p className="text-xs text-slate-600">You don't have any trips created yet.</p>
            <Link
              to="/plan"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Selected Attraction Highlight */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                <img
                  src={attraction.imageUrl}
                  alt={attraction.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <h4 className="font-bold text-slate-900 truncate">{attraction.name}</h4>
                <div className="text-slate-500 flex items-center gap-1 truncate mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{attraction.location}</span>
                </div>
              </div>
            </div>

            {/* Choose Trip */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Trip</label>
              <select
                value={selectedTripId}
                onChange={(e) => handleTripChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.title} ({t.startDate} to {t.endDate})
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Estimated Cost */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Admission / Activity Cost (₹)</label>
              <input
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Book morning tickets, carry camera"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                {submitting ? 'Saving...' : <><Check className="w-3.5 h-3.5" /> Confirm & Add</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
