import React, { useState, useEffect } from 'react';
import { tripsAPI, activitiesAPI } from '../services/api';
import { Trip, Activity } from '../types';
import { useAuth } from '../context/AuthContext';
import { ActivityModal } from '../components/ActivityModal';
import {
  CalendarCheck,
  Plus,
  Clock,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  FolderOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ItineraryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const fetchTrips = async () => {
    try {
      const res = await tripsAPI.getAll();
      if (res.success && res.data.length > 0) {
        setTrips(res.data);
        const activeTrip = res.data[0];
        setSelectedTripId(activeTrip._id);
        fetchActivitiesForTrip(activeTrip._id);
      }
    } catch {
      //
    } finally {
      setLoadingTrips(false);
    }
  };

  const fetchActivitiesForTrip = async (tripId: string) => {
    setLoadingActivities(true);
    try {
      const res = await activitiesAPI.getByTrip(tripId);
      if (res.success) {
        setActivities(res.data);
      }
    } catch {
      //
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setLoadingTrips(false);
    }
  }, [isAuthenticated]);

  const handleTripChange = (tripId: string) => {
    setSelectedTripId(tripId);
    fetchActivitiesForTrip(tripId);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!window.confirm('Delete this scheduled itinerary activity?')) return;
    try {
      await activitiesAPI.delete(id);
      if (selectedTripId) {
        fetchActivitiesForTrip(selectedTripId);
      }
    } catch {
      //
    }
  };

  const selectedTrip = trips.find((t) => t._id === selectedTripId);

  // Group by day
  const grouped: Record<string, Activity[]> = {};
  activities.forEach((act) => {
    if (!grouped[act.date]) grouped[act.date] = [];
    grouped[act.date].push(act);
  });
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Trip Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Itinerary Management · Full CRUD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Day-by-Day Itinerary Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Organize activities chronologically, manage time slots, and schedule attractions.
          </p>
        </div>

        {/* Trip Switcher Dropdown */}
        {trips.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Viewing Trip:</label>
            <select
              value={selectedTripId}
              onChange={(e) => handleTripChange(e.target.value)}
              className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-900 shadow-sm"
            >
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title} ({t.origin.split(',')[0]} → {t.destination.split(',')[0]})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loadingTrips ? (
        <div className="space-y-4">
          <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Trips Created Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create a trip first to start scheduling day-by-day itinerary activities.
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create a Trip</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trip Summary Mini-Card */}
          {selectedTrip && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedTrip.title}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedTrip.startDate} to {selectedTrip.endDate} · {selectedTrip.destination}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingActivity(null);
                    setModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
                <Link
                  to={`/trips/${selectedTrip._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  <span>Trip Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Activities Timeline */}
          {loadingActivities ? (
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ) : activities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">No Activities in this Itinerary</h4>
              <p className="text-xs text-slate-500">
                Click "Add Activity" above or browse attractions in "Explore Destinations" to populate your daily timeline.
              </p>
              <button
                onClick={() => {
                  setEditingActivity(null);
                  setModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Schedule First Activity
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDates.map((dayDate, dayIdx) => (
                <div key={dayDate} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      D{dayIdx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {new Date(dayDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </h3>
                    <span className="text-xs text-slate-400">
                      ({grouped[dayDate].length} events)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-9">
                    {grouped[dayDate].map((act) => (
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
                                  setModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(act._id)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {(act.startTime || act.endTime) && (
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{act.startTime} {act.endTime ? `- ${act.endTime}` : ''}</span>
                            </div>
                          )}

                          {act.location && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{act.location}</span>
                            </div>
                          )}

                          {act.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {act.description}
                            </p>
                          )}
                        </div>

                        {act.estimatedCost > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
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

      {selectedTrip && (
        <ActivityModal
          isOpen={modalOpen}
          tripId={selectedTrip._id}
          activity={editingActivity}
          tripStartDate={selectedTrip.startDate}
          tripEndDate={selectedTrip.endDate}
          onClose={() => setModalOpen(false)}
          onSuccess={() => fetchActivitiesForTrip(selectedTrip._id)}
        />
      )}
    </div>
  );
};
