import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GeoLocation, Attraction } from '../types';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface MapViewProps {
  origin: GeoLocation;
  destination: GeoLocation;
  distanceKm: number;
  durationText: string;
  polyline: [number, number][];
  attractions?: Attraction[];
  onSelectAttraction?: (attraction: Attraction) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  distanceKm,
  durationText,
  polyline,
  attractions = [],
  onSelectAttraction,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up prior map instance if existing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const centerLat = (origin.lat + destination.lat) / 2;
    const centerLng = (origin.lng + destination.lng) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // High quality OpenStreetMap raster tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom Start Marker (Green circle pin)
    const startIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #10B981; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2.5px solid white;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="8"/></svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    // Custom Destination Marker (Blue location pin)
    const endIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="background-color: #2563EB; color: white; width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2.5px solid white;">
          <div style="transform: rotate(45deg); font-weight: bold; font-size: 11px;">DEST</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    // Add Start Marker
    const startMarker = L.marker([origin.lat, origin.lng], { icon: startIcon }).addTo(map);
    startMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px;">
        <span style="color: #059669; font-weight: 700; text-transform: uppercase; font-size: 11px;">Origin Point</span>
        <h4 style="margin: 3px 0 0; font-size: 14px; font-weight: 700;">${origin.name}</h4>
      </div>
    `);

    // Add Destination Marker
    const endMarker = L.marker([destination.lat, destination.lng], { icon: endIcon }).addTo(map);
    endMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px;">
        <span style="color: #2563EB; font-weight: 700; text-transform: uppercase; font-size: 11px;">Final Destination</span>
        <h4 style="margin: 3px 0 0; font-size: 14px; font-weight: 700;">${destination.name}</h4>
      </div>
    `);

    // Draw route polyline
    if (polyline && polyline.length > 0) {
      const routeLine = L.polyline(polyline, {
        color: '#2563EB',
        weight: 5,
        opacity: 0.85,
        smoothFactor: 1,
      }).addTo(map);

      // Fit map bounds to cover entire route
      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
        ...polyline,
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    // Add tourist attraction markers around destination
    attractions.forEach((attraction) => {
      const attrIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background-color: #D97706; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.25); border: 2px solid white; cursor: pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const attrMarker = L.marker([attraction.lat, attraction.lng], { icon: attrIcon }).addTo(map);
      attrMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; max-width: 220px;">
          <span style="color: #B45309; font-weight: 700; text-transform: uppercase; font-size: 10px;">${attraction.category}</span>
          <h4 style="margin: 2px 0 4px; font-size: 13px; font-weight: 700;">${attraction.name}</h4>
          <p style="margin: 0 0 6px; font-size: 11px; color: #4B5563; line-height: 1.3;">${attraction.description.slice(0, 85)}...</p>
          <div style="font-size: 11px; font-weight: 600; color: #1F2937;">${attraction.distanceFromCenterKm} km from center · ${attraction.admissionFee || 'Free'}</div>
        </div>
      `);

      attrMarker.on('click', () => {
        if (onSelectAttraction) onSelectAttraction(attraction);
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [origin, destination, polyline, attractions]);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.name)}&destination=${encodeURIComponent(destination.name)}&travelmode=driving`;
  const osmUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${origin.lat}%2C${origin.lng}%3B${destination.lat}%2C${destination.lng}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      {/* Route Info Header Bar */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <span>{origin.name.split(',')[0]}</span>
              <span>→</span>
              <span>{destination.name.split(',')[0]}</span>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span className="font-mono tabular-nums font-bold text-white">{distanceKm} km</span>
              <span>·</span>
              <span>Est. Driving: <strong className="text-white">{durationText}</strong></span>
            </div>
          </div>
        </div>

        {/* Deep links to mapping providers */}
        <div className="flex items-center gap-2 text-xs">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            <span>OpenStreetMap</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div className="relative w-full h-[400px] md:h-[460px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Legend Box Overlay */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 px-3 py-2 text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Origin: {origin.name.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            <span>Destination: {destination.name.split(',')[0]}</span>
          </div>
          {attractions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Recommended Attractions ({attractions.length})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
