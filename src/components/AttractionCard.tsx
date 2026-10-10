import React, { useState } from 'react';
import { Attraction } from '../types';
import { MapPin, Clock, Tag, Plus, Check, Compass } from 'lucide-react';

interface AttractionCardProps {
  attraction: Attraction;
  onAddToTrip: (attraction: Attraction) => void;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, onAddToTrip }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Visual asset container with zero-broken-image fallback */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          {!imgError ? (
            <img
              src={attraction.imageUrl}
              alt={attraction.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center p-4 text-white">
              <Compass className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-xs font-semibold text-center">{attraction.name}</span>
            </div>
          )}

          {/* Clean category label */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-sm">
            {attraction.category}
          </div>

          {/* Distance from center */}
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono tabular-nums">
            {attraction.distanceFromCenterKm} km from center
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 space-y-2.5">
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors leading-snug">
            {attraction.name}
          </h4>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {attraction.description}
          </p>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{attraction.location}</span>
            </div>

            {attraction.openingHours && (
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{attraction.openingHours}</span>
              </div>
            )}

            {attraction.admissionFee && (
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">{attraction.admissionFee}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToTrip(attraction)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-semibold text-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add to Itinerary</span>
        </button>
      </div>
    </div>
  );
};
