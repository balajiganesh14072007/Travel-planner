import React from 'react';
import { TransportOption } from '../types';
import { Plane, Train, Bus, Car, ExternalLink, Info, Leaf } from 'lucide-react';

interface TransportComparisonProps {
  options: TransportOption[];
  travellers: number;
}

export const TransportComparison: React.FC<TransportComparisonProps> = ({ options, travellers }) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'flight':
        return <Plane className="w-5 h-5 text-sky-600" />;
      case 'train':
        return <Train className="w-5 h-5 text-indigo-600" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-amber-600" />;
      case 'car':
        return <Car className="w-5 h-5 text-emerald-600" />;
      default:
        return <Car className="w-5 h-5 text-slate-600" />;
    }
  };

  const getModeBadgeColor = (mode: string) => {
    switch (mode) {
      case 'flight':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'train':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'bus':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'car':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Transportation Comparison</h3>
          <p className="text-xs text-slate-500">
            Compare travel duration, estimated fares for {travellers} traveller{travellers > 1 ? 's' : ''}, and transit options
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Benchmark Estimates · Real-time tickets via links</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((opt) => (
          <div
            key={opt.mode}
            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {getModeIcon(opt.mode)}
                </div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getModeBadgeColor(opt.mode)}`}>
                  {opt.mode}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mb-1">{opt.title}</h4>
              <p className="text-xs text-slate-500 mb-3">{opt.provider}</p>

              {/* Metrics */}
              <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-800 font-mono tabular-nums">{opt.durationText}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Estimated Fare:</span>
                  <span className="font-bold text-blue-600 font-mono tabular-nums">
                    ₹{opt.estimatedFareMin.toLocaleString()} - ₹{opt.estimatedFareMax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Distance:</span>
                  <span className="text-slate-700 font-mono tabular-nums">{opt.distanceKm} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Frequency:</span>
                  <span className="text-slate-700 text-right">{opt.frequency}</span>
                </div>
              </div>

              {/* Eco footprint note */}
              <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{opt.ecoRating}</span>
              </div>
            </div>

            {/* Provider booking deep link */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href={opt.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <span>Check Live Availability</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
              </a>
              <p className="text-[10px] text-center text-slate-400 mt-1.5">
                Official external booking portal
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
