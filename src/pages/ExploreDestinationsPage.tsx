import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { travelAPI } from '../services/api';
import { RouteSearchResult, Attraction } from '../types';
import { MapView } from '../components/MapView';
import { TransportComparison } from '../components/TransportComparison';
import { AttractionCard } from '../components/AttractionCard';
import { AddToTripModal } from '../components/AddToTripModal';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Navigation,
} from 'lucide-react';

export const ExploreDestinationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [origin, setOrigin] = useState(searchParams.get('origin') || 'Hyderabad, Telangana');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Goa, India');
  const [departureDate, setDepartureDate] = useState(searchParams.get('date') || '2026-11-15');
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '2026-11-20');
  const [travellers, setTravellers] = useState(Number(searchParams.get('travellers')) || 2);
  const [transportMode, setTransportMode] = useState<string>('all');

  const [loading, setLoading] = useState<boolean>(true);
  const [routeResult, setRouteResult] = useState<RouteSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal for adding attraction to user's trip
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchRouteData = async (org: string, dest: string, numTravellers: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await travelAPI.getRoute(org, dest, numTravellers);
      if (res.success && res.data) {
        setRouteResult(res.data);
      } else {
        setError('Failed to compute route details.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not fetch route. Please verify locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const org = searchParams.get('origin') || origin;
    const dest = searchParams.get('destination') || destination;
    const trav = Number(searchParams.get('travellers')) || travellers;
    setOrigin(org);
    setDestination(dest);
    setTravellers(trav);

    fetchRouteData(org, dest, trav);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      setError('Please provide both Origin and Destination.');
      return;
    }

    setSearchParams({
      origin,
      destination,
      date: departureDate,
      returnDate,
      travellers: String(travellers),
    });

    fetchRouteData(origin, destination, travellers);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Core Travel Discovery Feature</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Destination-to-Destination Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Calculate road distances, estimated durations, interactive routes, multimodal transit options, and discover tourist sights.
        </p>
      </div>

      {/* Mandatory Search Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Origin */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Destination A: Starting Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g., Hyderabad, Telangana"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Destination B: Final Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Goa, India"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Departure and Return Dates */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Travellers and Preferred Transport Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Number of Travellers</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={travellers}
                  onChange={(e) => setTravellers(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Transport Mode</label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Modes (Multimodal Comparison)</option>
                <option value="train">Train (IRCTC)</option>
                <option value="bus">Bus (AC Sleeper / Volvo)</option>
                <option value="flight">Flight (Commercial Air)</option>
                <option value="car">Car / Taxi (Road Trip)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 h-[38px]"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Calculating...' : 'Search & Compute Route'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !routeResult && (
        <div className="space-y-6">
          <div className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Route & Discovery Results */}
      {routeResult && (
        <div className="space-y-10">
          {/* Section A: Route Information & Interactive Map */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Route: {routeResult.origin.name.split(',')[0]} to {routeResult.destination.name.split(',')[0]}
                </h2>
                <p className="text-xs text-slate-500">
                  Calculated road distance, estimated transit time, and live routing options
                </p>
              </div>

              {/* Highway Route Alternatives */}
              {routeResult.alternatives && routeResult.alternatives.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {routeResult.alternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px]"
                    >
                      <strong className="text-slate-900">{alt.name}:</strong> {alt.distanceKm} km ({alt.durationText})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Leaflet Map Component */}
            <MapView
              origin={routeResult.origin}
              destination={routeResult.destination}
              distanceKm={routeResult.distanceKm}
              durationText={routeResult.drivingDurationText}
              polyline={routeResult.polyline}
              attractions={routeResult.attractions}
              onSelectAttraction={(attr) => setSelectedAttraction(attr)}
            />
          </section>

          {/* Section B: Transportation Comparison */}
          <section>
            <TransportComparison
              options={
                transportMode === 'all'
                  ? routeResult.transportOptions
                  : routeResult.transportOptions.filter((t) => t.mode === transportMode)
              }
              travellers={travellers}
            />
          </section>

          {/* Section C: Tourist Attraction Recommendations */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recommended Tourist Attractions in {routeResult.destination.name.split(',')[0]}
                </h3>
                <p className="text-xs text-slate-500">
                  Popular places, admission prices, operating hours, and distance from center
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 self-start sm:self-auto">
                {routeResult.attractions.length} Attractions Recommended
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {routeResult.attractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  onAddToTrip={(attr) => setSelectedAttraction(attr)}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Modal: Add Attraction to Trip Itinerary */}
      {selectedAttraction && (
        <AddToTripModal
          attraction={selectedAttraction}
          onClose={() => setSelectedAttraction(null)}
          onSuccess={(tripTitle) => {
            setToastMessage(`Added "${selectedAttraction.name}" to trip "${tripTitle}"!`);
            setTimeout(() => setToastMessage(null), 4000);
          }}
        />
      )}
    </div>
  );
};
