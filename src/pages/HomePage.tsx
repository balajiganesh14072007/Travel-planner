import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  Route,
  Wallet,
  CalendarCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('Hyderabad, Telangana');
  const [destination, setDestination] = useState('Goa, India');
  const [departureDate, setDepartureDate] = useState('2026-11-15');
  const [travellers, setTravellers] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    navigate(`/explore?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${departureDate}&travellers=${travellers}`);
  };

  const popularDestinations = [
    {
      name: 'Goa',
      state: 'Goa, India',
      tagline: 'Sun-drenched beaches, Portuguese forts & coastal nightlife',
      image: '/src/assets/images/dest_goa_beach_1791608248104.jpg',
      origin: 'Hyderabad, Telangana',
      destination: 'Goa, India',
    },
    {
      name: 'Hyderabad',
      state: 'Telangana, India',
      tagline: 'Historic Charminar, Nizami culinary heritage & Golconda fortress',
      image: '/src/assets/images/dest_hyderabad_heritage_1791608259973.jpg',
      origin: 'Bengaluru, Karnataka',
      destination: 'Hyderabad, Telangana',
    },
    {
      name: 'Manali',
      state: 'Himachal Pradesh, India',
      tagline: 'Snow-capped Himalayan valleys, alpine pine woods & adventure sports',
      image: '/src/assets/images/dest_manali_mountains_1791608271543.jpg',
      origin: 'New Delhi, Delhi',
      destination: 'Manali, Himachal Pradesh',
    },
    {
      name: 'Jaipur',
      state: 'Rajasthan, India',
      tagline: 'Majestic Pink City palaces, Amber fort & vibrant artisan bazaars',
      image: '/src/assets/images/dest_jaipur_palace_1791608285269.jpg',
      origin: 'New Delhi, Delhi',
      destination: 'Jaipur, Rajasthan',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_travel_scenic_1791608236411.jpg"
            alt="Scenic mountain lake travel wanderer"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Smart Travel Planning · Full-Stack MERN Application</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto text-balance">
            Plan Your Journey. Explore the World.
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed text-balance">
            Discover destinations, organize itineraries, compare travel options, and manage your budget in one place.
          </p>

          {/* Destination Search Panel */}
          <div className="max-w-4xl mx-auto mt-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200 text-slate-900 text-left">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              {/* Origin */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Starting Point (A)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Destination (B)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Goa, India"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date & Travellers */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Travellers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={travellers}
                    onChange={(e) => setTravellers(Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Search CTA */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Discover Route & Attractions</span>
                </button>
              </div>
            </form>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span className="text-[11px]">Popular route search:</span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setOrigin('Hyderabad, Telangana');
                    setDestination('Goa, India');
                  }}
                  className="hover:text-blue-600 transition-colors font-medium text-slate-700"
                >
                  Hyderabad → Goa
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setOrigin('New Delhi, Delhi');
                    setDestination('Manali, Himachal Pradesh');
                  }}
                  className="hover:text-blue-600 transition-colors font-medium text-slate-700"
                >
                  Delhi → Manali
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    setOrigin('New Delhi, Delhi');
                    setDestination('Jaipur, Rajasthan');
                  }}
                  className="hover:text-blue-600 transition-colors font-medium text-slate-700"
                >
                  Delhi → Jaipur
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Curated Travel Hubs</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Popular Destinations</h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Explore all destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <div
              key={dest.name}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-bold text-slate-900">
                    {dest.state}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() =>
                    navigate(
                      `/explore?origin=${encodeURIComponent(dest.origin)}&destination=${encodeURIComponent(
                        dest.destination
                      )}`
                    )
                  }
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-semibold text-xs transition-colors"
                >
                  <span>Explore Route & Sights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Application Features Bento-Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">MERN Platform Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Engineered for Effortless Travel Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Complete solution managing destinations, itineraries, activities, and expenses with MongoDB persistence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Route className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Smart Route & Attractions Discovery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculate road distances, estimated travel durations, interactive OpenStreetMap polylines, and receive recommended tourist sights with admission fees and hours.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-600">
              Interactive Leaflet Maps & OSRM Engine
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Day-by-Day Itinerary Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Build daily timelines, schedule activities, assign arrival/departure times, and attach tourist sights directly from your destination search.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-600">
              Full CRUD with Chronological Ordering
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Expense Tracking & Budget Formulas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time calculations for Total Expenses, Remaining Budget, and Budget Used Percentage, accompanied by instant over-budget warning alerts.
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-600">
              Recharts Category & Spending Analytics
            </div>
          </div>
        </div>
      </section>

      {/* College Project Submission Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-600/30 text-blue-300 text-xs font-semibold">
              <span>MERN College Capstone Submission</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Explore or Test Full CRUD Functionality?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Includes pre-configured demo user and administrator accounts, full REST API endpoints, MongoDB schemas, and test execution procedures.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> JWT Authentication</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> Full Trips & Itinerary CRUD</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> Budget Deficit Alerts</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/plan"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
            >
              Plan a New Trip
            </Link>
            <Link
              to="/docs"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all text-center"
            >
              Project Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
