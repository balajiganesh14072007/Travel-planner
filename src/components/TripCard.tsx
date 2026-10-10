import React from 'react';
import { Trip } from '../types';
import { Calendar, Users, Wallet, ArrowRight, Edit, Trash2, MapPin, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string, title: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'ongoing':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'completed':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  const totalSpent = trip.totalExpenses || 0;
  const budget = trip.budget || 0;
  const rawUsedPct = trip.budgetUsedPercentage !== undefined ? trip.budgetUsedPercentage : (budget > 0 ? +((totalSpent / budget) * 100).toFixed(1) : 0);
  const usedPct = isNaN(rawUsedPct) ? 0 : Math.max(0, rawUsedPct);
  const isOver = trip.isOverBudget || totalSpent > budget;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Status & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadge(trip.status)}`}>
            {trip.status}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(trip)}
              title="Edit Trip"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(trip._id, trip.title)}
              title="Delete Trip"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link to={`/trips/${trip._id}`} className="block">
          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
            {trip.title}
          </h3>
        </Link>

        {/* Origin to Destination */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">{trip.origin.split(',')[0]}</span>
          <span className="text-slate-400">→</span>
          <span className="font-semibold text-slate-800 truncate">{trip.destination.split(',')[0]}</span>
        </div>

        {/* Travel metadata */}
        <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{trip.startDate} to {trip.endDate}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{trip.travellers} {trip.travellers === 1 ? 'traveller' : 'travellers'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span>Budget:</span>
            </div>
            <span className="font-bold text-slate-900 font-mono tabular-nums">
              ₹{trip.budget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Financial Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500">Spent: <strong className="text-slate-800 font-mono">₹{totalSpent.toLocaleString()}</strong></span>
            <span className={`font-semibold font-mono ${isOver ? 'text-red-600' : 'text-slate-700'}`}>
              {usedPct}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOver ? 'bg-red-500' : usedPct > 80 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, usedPct)}%` }}
            />
          </div>
          {isOver && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-red-600 font-medium">
              <AlertTriangle className="w-3 h-3" />
              <span>Exceeded planned budget by ₹{(totalSpent - budget).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          to={`/trips/${trip._id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-semibold text-xs transition-colors"
        >
          <span>View Itinerary & Expenses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
