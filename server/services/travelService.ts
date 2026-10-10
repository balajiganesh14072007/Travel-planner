export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
  stateCountry?: string;
}

export interface AttractionData {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  distanceFromCenterKm: number;
  openingHours?: string;
  admissionFee?: string;
  estimatedVisitDuration?: string;
  tags: string[];
}

export interface TransportOption {
  mode: 'flight' | 'train' | 'bus' | 'car';
  title: string;
  provider: string;
  durationText: string;
  durationMinutes: number;
  estimatedFareMin: number;
  estimatedFareMax: number;
  currency: string;
  distanceKm: number;
  frequency: string;
  bookingUrl: string;
  isEstimated: boolean;
  ecoRating: string;
  notes: string;
}

export interface RouteSearchResult {
  origin: GeoLocation;
  destination: GeoLocation;
  distanceKm: number;
  drivingDurationText: string;
  drivingDurationMinutes: number;
  polyline: [number, number][];
  alternatives: {
    name: string;
    distanceKm: number;
    durationText: string;
    via: string;
  }[];
  attractions: AttractionData[];
  transportOptions: TransportOption[];
}

// Well-known coordinates database for instant, zero-latency response
const KNOWN_COORDINATES: Record<string, GeoLocation> = {
  'hyderabad': { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867, stateCountry: 'Telangana, India' },
  'hyderabad, telangana': { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867, stateCountry: 'Telangana, India' },
  'goa': { name: 'Goa, India', lat: 15.2993, lng: 74.1240, stateCountry: 'Goa, India' },
  'goa, india': { name: 'Goa, India', lat: 15.2993, lng: 74.1240, stateCountry: 'Goa, India' },
  'north goa': { name: 'North Goa', lat: 15.5800, lng: 73.7400, stateCountry: 'Goa, India' },
  'south goa': { name: 'South Goa', lat: 15.1800, lng: 74.0100, stateCountry: 'Goa, India' },
  'mumbai': { name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777, stateCountry: 'Maharashtra, India' },
  'mumbai, maharashtra': { name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777, stateCountry: 'Maharashtra, India' },
  'delhi': { name: 'New Delhi, Delhi', lat: 28.6139, lng: 77.2090, stateCountry: 'Delhi, India' },
  'new delhi': { name: 'New Delhi, Delhi', lat: 28.6139, lng: 77.2090, stateCountry: 'Delhi, India' },
  'bengaluru': { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, stateCountry: 'Karnataka, India' },
  'bangalore': { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, stateCountry: 'Karnataka, India' },
  'jaipur': { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873, stateCountry: 'Rajasthan, India' },
  'manali': { name: 'Manali, Himachal Pradesh', lat: 32.2396, lng: 77.1887, stateCountry: 'Himachal Pradesh, India' },
  'agra': { name: 'Agra, Uttar Pradesh', lat: 27.1767, lng: 78.0081, stateCountry: 'Uttar Pradesh, India' },
  'chennai': { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707, stateCountry: 'Tamil Nadu, India' },
  'kolkata': { name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639, stateCountry: 'West Bengal, India' },
  'pune': { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567, stateCountry: 'Maharashtra, India' },
  'kochi': { name: 'Kochi, Kerala', lat: 9.9312, lng: 76.2673, stateCountry: 'Kerala, India' },
  'varanasi': { name: 'Varanasi, Uttar Pradesh', lat: 25.3176, lng: 82.9739, stateCountry: 'Uttar Pradesh, India' },
  'dubai': { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, stateCountry: 'United Arab Emirates' },
  'singapore': { name: 'Singapore', lat: 1.3521, lng: 103.8198, stateCountry: 'Singapore' },
  'paris': { name: 'Paris, France', lat: 48.8566, lng: 2.3522, stateCountry: 'France' },
  'tokyo': { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, stateCountry: 'Japan' },
  'london': { name: 'London, UK', lat: 51.5074, lng: -0.1278, stateCountry: 'United Kingdom' },
  'new york': { name: 'New York, USA', lat: 40.7128, lng: -74.0060, stateCountry: 'United States' },
};

// Rich tourist attractions for top travel hubs
const DESTINATION_ATTRACTIONS: Record<string, AttractionData[]> = {
  'goa': [
    {
      id: 'goa-baga',
      name: 'Baga Beach & Coastal Promenade',
      category: 'Beach & Leisure',
      imageUrl: '/src/assets/images/dest_goa_beach_1791608248104.jpg',
      description: 'One of North Goa’s most famous beaches, vibrant with nightlife, beach shacks, golden sands, and scenic sunset walks.',
      location: 'Calangute - Baga Road, North Goa',
      lat: 15.5553,
      lng: 73.7517,
      distanceFromCenterKm: 14.5,
      openingHours: 'Open 24 hours (Shacks 10:00 AM - 11:30 PM)',
      admissionFee: 'Free entry',
      estimatedVisitDuration: '2 - 4 hours',
      tags: ['Beach', 'Sunset', 'Nightlife', 'Seafood'],
    },
    {
      id: 'goa-aguada',
      name: 'Fort Aguada & Historic Lighthouse',
      category: 'Historical Fortress',
      imageUrl: '/src/assets/images/dest_goa_beach_1791608248104.jpg',
      description: 'A well-preserved 17th-century Portuguese fortress commanding panoramic views of Sinquerim Beach and the Arabian Sea.',
      location: 'Candolim, Goa 403515',
      lat: 15.4925,
      lng: 73.7736,
      distanceFromCenterKm: 11.2,
      openingHours: '09:30 AM - 05:30 PM daily',
      admissionFee: '₹50 per person (Indians), ₹300 (Foreigners)',
      estimatedVisitDuration: '1.5 - 2 hours',
      tags: ['Heritage', 'Photography', 'Sea View', 'Architecture'],
    },
    {
      id: 'goa-dudhsagar',
      name: 'Dudhsagar Waterfalls Trek',
      category: 'Nature & Adventure',
      imageUrl: '/src/assets/images/hero_travel_scenic_1791608236411.jpg',
      description: 'A four-tiered waterfall on the Mandovi River resembling a cascading sea of milk, surrounded by dense Bhagwan Mahaveer Sanctuary forest.',
      location: 'Sonaulim, South Goa border',
      lat: 15.3144,
      lng: 74.3144,
      distanceFromCenterKm: 62.0,
      openingHours: '06:00 AM - 05:00 PM (Best during post-monsoon)',
      admissionFee: '₹100 Sanctuary Entry + Jeep Safari fare ₹500/head',
      estimatedVisitDuration: '4 - 6 hours',
      tags: ['Waterfall', 'Trekking', 'Jeep Safari', 'Wildlife'],
    },
    {
      id: 'goa-basilica',
      name: 'Basilica of Bom Jesus',
      category: 'UNESCO World Heritage',
      imageUrl: '/src/assets/images/dest_hyderabad_heritage_1791608259973.jpg',
      description: 'UNESCO World Heritage monument in Old Goa housing the sacred relics of St. Francis Xavier, renowned for baroque Portuguese architecture.',
      location: 'Old Goa Road, Bainguinim, Goa 403402',
      lat: 15.5009,
      lng: 73.9116,
      distanceFromCenterKm: 9.8,
      openingHours: '09:00 AM - 06:30 PM (Sun 10:30 AM - 06:30 PM)',
      admissionFee: 'Free entry',
      estimatedVisitDuration: '1 - 2 hours',
      tags: ['UNESCO', 'History', 'Sacred', 'Baroque Architecture'],
    },
  ],
  'hyderabad': [
    {
      id: 'hyd-charminar',
      name: 'Charminar & Laad Bazaar',
      category: 'Monument & Heritage',
      imageUrl: '/src/assets/images/dest_hyderabad_heritage_1791608259973.jpg',
      description: 'Iconic 1591 CE Indo-Islamic quadruple-arch monument standing at the historic core of Hyderabad, encircled by vibrant pearl and bangle bazaars.',
      location: 'Char Kaman, Ghansi Bazaar, Hyderabad',
      lat: 17.3616,
      lng: 78.4747,
      distanceFromCenterKm: 4.2,
      openingHours: '09:30 AM - 05:30 PM',
      admissionFee: '₹25 per person (Indians), ₹300 (Foreigners)',
      estimatedVisitDuration: '1.5 - 2.5 hours',
      tags: ['Heritage', 'Shopping', 'Street Food', 'Irani Chai'],
    },
    {
      id: 'hyd-golconda',
      name: 'Golconda Fort & Sound & Light Show',
      category: 'Ancient Citadel',
      imageUrl: '/src/assets/images/dest_hyderabad_heritage_1791608259973.jpg',
      description: 'Massive fortress complex renowned for acoustic engineering, diamond trade vaults, and mesmerizing evening sound & light storytelling.',
      location: 'Ibrahim Bagh, Hyderabad 500008',
      lat: 17.3833,
      lng: 78.4011,
      distanceFromCenterKm: 9.5,
      openingHours: '09:00 AM - 05:30 PM daily',
      admissionFee: '₹25 entry, ₹140 sound & light show',
      estimatedVisitDuration: '3 - 4 hours',
      tags: ['Citadel', 'Acoustics', 'History', 'Sunset View'],
    },
    {
      id: 'hyd-hussain-sagar',
      name: 'Hussain Sagar Lake & Buddha Statue',
      category: 'Lake & Park',
      imageUrl: '/src/assets/images/hero_travel_scenic_1791608236411.jpg',
      description: 'Heart-shaped historic lake featuring a monolithic 18-meter granite Buddha statue on Gibraltar Rock reached via scenic ferry cruise.',
      location: 'Tank Bund Road, Hyderabad',
      lat: 17.4239,
      lng: 78.4738,
      distanceFromCenterKm: 5.1,
      openingHours: '08:00 AM - 10:00 PM',
      admissionFee: 'Park free, Ferry boat ₹80 - ₹120',
      estimatedVisitDuration: '1.5 - 2 hours',
      tags: ['Boating', 'Skyline', 'Gardens', 'Sculpture'],
    },
  ],
  'manali': [
    {
      id: 'man-solang',
      name: 'Solang Valley Adventure Arena',
      category: 'Alpine Adventure',
      imageUrl: '/src/assets/images/dest_manali_mountains_1791608271543.jpg',
      description: 'Side valley at the top of the Kullu Valley, offering paragliding, zorbing, skiing, and panoramic snow views of the Pir Panjal range.',
      location: 'Solang, Burwa, Himachal Pradesh 175131',
      lat: 32.3164,
      lng: 77.1578,
      distanceFromCenterKm: 13.5,
      openingHours: '09:00 AM - 06:00 PM daily',
      admissionFee: 'Valley entry free; Activities ₹500 - ₹3,000',
      estimatedVisitDuration: '3 - 5 hours',
      tags: ['Snow', 'Paragliding', 'Mountains', 'Adventure'],
    },
    {
      id: 'man-hadimba',
      name: 'Hadimba Wooden Temple & Dhungri Woods',
      category: 'Heritage & Nature',
      imageUrl: '/src/assets/images/dest_manali_mountains_1791608271543.jpg',
      description: '1553 CE pagoda-style wooden temple dedicated to Goddess Hadimba, nestled amidst towering cedar deodar pine forest.',
      location: 'Hadimba Temple Rd, Old Manali',
      lat: 32.2483,
      lng: 77.1802,
      distanceFromCenterKm: 2.1,
      openingHours: '08:00 AM - 06:00 PM',
      admissionFee: 'Free entry',
      estimatedVisitDuration: '1 - 2 hours',
      tags: ['Temple', 'Pine Forest', 'Cedar Wood', 'Serene'],
    },
  ],
  'jaipur': [
    {
      id: 'jai-hawa-mahal',
      name: 'Hawa Mahal — Palace of Winds',
      category: 'Royal Architecture',
      imageUrl: '/src/assets/images/dest_jaipur_palace_1791608285269.jpg',
      description: 'Extravagant 5-story pink honeycomb facade with 953 jharokha windows built in 1799 for royal women to witness street festivities.',
      location: 'Hawa Mahal Rd, Badi Choupad, Jaipur 302002',
      lat: 26.9239,
      lng: 75.8267,
      distanceFromCenterKm: 3.5,
      openingHours: '09:00 AM - 04:30 PM daily',
      admissionFee: '₹50 per person (Indians), ₹200 (Foreigners)',
      estimatedVisitDuration: '1 - 2 hours',
      tags: ['Palace', 'Photography', 'Pink City', 'History'],
    },
    {
      id: 'jai-amber',
      name: 'Amber Palace & Maota Lake',
      category: 'Hilltop Fortress',
      imageUrl: '/src/assets/images/dest_jaipur_palace_1791608285269.jpg',
      description: 'UNESCO World Heritage palace set on high rugged hills, famous for Sheesh Mahal (hall of mirrors) and elephant ramparts.',
      location: 'Devisinghpura, Amer, Jaipur 302001',
      lat: 26.9855,
      lng: 75.8513,
      distanceFromCenterKm: 11.0,
      openingHours: '08:00 AM - 05:30 PM & Night Show 06:30 PM',
      admissionFee: '₹100 (Indians), ₹500 (Foreigners)',
      estimatedVisitDuration: '3 - 4 hours',
      tags: ['UNESCO', 'Fortress', 'Sheesh Mahal', 'Royal'],
    },
  ],
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;

  // Road distance is ~20-28% longer than straight air distance
  return Math.round(straightDistance * 1.25);
}

function resolveCoordinates(query: string): GeoLocation {
  const clean = (query || '').trim().toLowerCase();

  if (!clean) {
    return { name: query || 'Location', lat: 20.5937, lng: 78.9629, stateCountry: 'India' };
  }

  // 1. Exact match
  if (KNOWN_COORDINATES[clean]) {
    return KNOWN_COORDINATES[clean];
  }

  // 2. City prefix match (e.g. "Hyderabad, Telangana" -> "hyderabad")
  const cityPart = clean.split(',')[0].trim();
  if (KNOWN_COORDINATES[cityPart]) {
    return KNOWN_COORDINATES[cityPart];
  }

  // 3. Substring match only if clean is at least 3 characters
  if (clean.length >= 3) {
    for (const [key, loc] of Object.entries(KNOWN_COORDINATES)) {
      if (clean.includes(key) || (key.length >= 4 && key.includes(clean))) {
        return loc;
      }
    }
  }

  // Fallback hash-based deterministic coordinates near central India if unknown
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = (Math.abs(hash % 100) / 100) * 10 - 5;
  const lngOffset = (Math.abs((hash >> 3) % 100) / 100) * 10 - 5;

  return {
    name: query,
    lat: +(20.5937 + latOffset).toFixed(4),
    lng: +(78.9629 + lngOffset).toFixed(4),
    stateCountry: query,
  };
}

function generateRoutePolyline(start: GeoLocation, end: GeoLocation): [number, number][] {
  const points: [number, number][] = [];
  const steps = 18;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // S-curve slight road bend realism
    const lat = start.lat + (end.lat - start.lat) * t + Math.sin(t * Math.PI) * 0.45;
    const lng = start.lng + (end.lng - start.lng) * t - Math.sin(t * Math.PI * 2) * 0.25;
    points.push([+lat.toFixed(5), +lng.toFixed(5)]);
  }

  return points;
}

export function searchSmartRoute(
  originQuery: string,
  destinationQuery: string,
  travellers: number = 1
): RouteSearchResult {
  const origin = resolveCoordinates(originQuery);
  const destination = resolveCoordinates(destinationQuery);

  const distanceKm = Math.max(30, calculateDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng));

  // Average driving speed ~60-70 km/h with highway stops
  const drivingDurationMinutes = Math.round((distanceKm / 65) * 60);
  const hours = Math.floor(drivingDurationMinutes / 60);
  const mins = drivingDurationMinutes % 60;
  const drivingDurationText = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

  const polyline = generateRoutePolyline(origin, destination);

  const destKey = destination.name.toLowerCase();
  let matchedAttractions: AttractionData[] = [];

  for (const [key, list] of Object.entries(DESTINATION_ATTRACTIONS)) {
    if (destKey.includes(key) || key.includes(destKey.split(',')[0].trim().toLowerCase())) {
      matchedAttractions = list;
      break;
    }
  }

  // If no static list, generate smart contextual attractions
  if (matchedAttractions.length === 0) {
    matchedAttractions = [
      {
        id: `attr-${destKey}-1`,
        name: `${destination.name} Central Heritage Square`,
        category: 'Landmark & Culture',
        imageUrl: '/src/assets/images/dest_jaipur_palace_1791608285269.jpg',
        description: `Explore the vibrant historic core and landmark architecture of ${destination.name}.`,
        location: `Central ${destination.name}`,
        lat: destination.lat + 0.012,
        lng: destination.lng + 0.015,
        distanceFromCenterKm: 1.8,
        openingHours: '09:00 AM - 08:00 PM',
        admissionFee: 'Free entry',
        estimatedVisitDuration: '2 - 3 hours',
        tags: ['Heritage', 'Photography', 'Local Food'],
      },
      {
        id: `attr-${destKey}-2`,
        name: `${destination.name} Scenic Viewpoint & Promenade`,
        category: 'Nature & View',
        imageUrl: '/src/assets/images/hero_travel_scenic_1791608236411.jpg',
        description: `Panoramic vantage point offering sweeping vistas over the surrounding landscape of ${destination.name}.`,
        location: `Highlands of ${destination.name}`,
        lat: destination.lat - 0.024,
        lng: destination.lng + 0.018,
        distanceFromCenterKm: 4.5,
        openingHours: '06:00 AM - 07:00 PM (Best at sunrise/sunset)',
        admissionFee: '₹20 maintenance fee',
        estimatedVisitDuration: '1.5 hours',
        tags: ['Scenic View', 'Nature', 'Sunset Walk'],
      },
      {
        id: `attr-${destKey}-3`,
        name: `${destination.name} Crafts & Spice Market`,
        category: 'Shopping & Artisans',
        imageUrl: '/src/assets/images/dest_hyderabad_heritage_1791608259973.jpg',
        description: `Lively bazaar featuring regional delicacies, handcrafted textiles, and traditional culinary stalls.`,
        location: `Old Market Quarter, ${destination.name}`,
        lat: destination.lat + 0.018,
        lng: destination.lng - 0.012,
        distanceFromCenterKm: 2.3,
        openingHours: '10:30 AM - 09:30 PM',
        admissionFee: 'Free entry',
        estimatedVisitDuration: '2 hours',
        tags: ['Shopping', 'Souvenirs', 'Culinary'],
      },
    ];
  }

  // Calculate transport options
  const transportOptions: TransportOption[] = [];

  // Flight (only if distance > 250 km)
  if (distanceKm > 250) {
    const flightDurationMinutes = Math.round(75 + (distanceKm / 750) * 60);
    const flightH = Math.floor(flightDurationMinutes / 60);
    const flightM = flightDurationMinutes % 60;
    const baseAirFare = Math.round(2400 + distanceKm * 3.8);

    transportOptions.push({
      mode: 'flight',
      title: 'Commercial Airline (Economy)',
      provider: 'IndiGo / Air India / Akasa',
      durationText: `${flightH} hr ${flightM} min (+2 hr airport transit)`,
      durationMinutes: flightDurationMinutes + 120,
      estimatedFareMin: baseAirFare * travellers,
      estimatedFareMax: Math.round(baseAirFare * 1.5) * travellers,
      currency: 'INR',
      distanceKm: Math.round(distanceKm * 0.8),
      frequency: '4 - 8 direct/connecting daily flights',
      bookingUrl: `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(origin.name)}+to+${encodeURIComponent(destination.name)}`,
      isEstimated: true,
      ecoRating: 'High Carbon (140 kg CO₂/passenger)',
      notes: 'Price varies significantly based on booking date. Includes standard 15 kg check-in baggage.',
    });
  }

  // Train
  const trainSpeed = 70; // km/h
  const trainDurationMinutes = Math.round((distanceKm / trainSpeed) * 60) + 40;
  const trainH = Math.floor(trainDurationMinutes / 60);
  const trainM = trainDurationMinutes % 60;
  const trainFareMin = Math.round(350 + distanceKm * 0.75) * travellers; // Sleeper / 3AC
  const trainFareMax = Math.round(1100 + distanceKm * 1.8) * travellers; // 2AC / 1AC

  transportOptions.push({
    mode: 'train',
    title: 'Indian Railways Express / Superfast',
    provider: 'IRCTC (Indian Railways)',
    durationText: `${trainH} hr ${trainM} min`,
    durationMinutes: trainDurationMinutes,
    estimatedFareMin: trainFareMin,
    estimatedFareMax: trainFareMax,
    currency: 'INR',
    distanceKm: Math.round(distanceKm * 1.05),
    frequency: '2 - 5 scheduled trains daily',
    bookingUrl: `https://www.irctc.co.in/nget/train-search`,
    isEstimated: true,
    ecoRating: 'Low Carbon (25 kg CO₂/passenger) — Most Eco-Friendly',
    notes: 'Reservations open 120 days in advance. Tatkal quota available 24 hours prior to departure.',
  });

  // Bus
  const busSpeed = 55;
  const busDurationMinutes = Math.round((distanceKm / busSpeed) * 60);
  const busH = Math.floor(busDurationMinutes / 60);
  const busM = busDurationMinutes % 60;
  const busFareMin = Math.round(600 + distanceKm * 1.3) * travellers;
  const busFareMax = Math.round(1100 + distanceKm * 1.9) * travellers;

  transportOptions.push({
    mode: 'bus',
    title: 'AC Multi-Axle Sleeper / Volvo Bus',
    provider: 'RedBus / KSRTC / TSRTC / Private Operators',
    durationText: `${busH} hr ${busM} min`,
    durationMinutes: busDurationMinutes,
    estimatedFareMin: busFareMin,
    estimatedFareMax: busFareMax,
    currency: 'INR',
    distanceKm: distanceKm,
    frequency: 'Hourly night and day departures',
    bookingUrl: `https://www.redbus.in/`,
    isEstimated: true,
    ecoRating: 'Moderate Carbon (45 kg CO₂/passenger)',
    notes: 'Comfortable sleeper berths with charging points, air-conditioning, and highway dinner breaks.',
  });

  // Car / Taxi
  const carFuelEstimate = Math.round((distanceKm / 15) * 105); // 15 km/l @ ₹105/liter
  const tollEstimate = Math.round((distanceKm / 100) * 120);
  const carTaxiFare = carFuelEstimate + tollEstimate;

  transportOptions.push({
    mode: 'car',
    title: 'Self-Drive or Outstation Cab (Sedan / SUV)',
    provider: 'Uber Intercity / MakeMyTrip Cabs / Zoomcar',
    durationText: drivingDurationText,
    durationMinutes: drivingDurationMinutes,
    estimatedFareMin: carTaxiFare,
    estimatedFareMax: Math.round(carTaxiFare * 1.8),
    currency: 'INR',
    distanceKm: distanceKm,
    frequency: 'On-Demand 24/7',
    bookingUrl: `https://m.uber.com/looking`,
    isEstimated: true,
    ecoRating: 'Moderate Carbon (Shared among group travellers)',
    notes: 'Ideal for scenic road trips with freedom to stop at viewpoints and highway eateries.',
  });

  return {
    origin,
    destination,
    distanceKm,
    drivingDurationText,
    drivingDurationMinutes,
    polyline,
    alternatives: [
      {
        name: 'Primary National Highway Route',
        distanceKm,
        durationText: drivingDurationText,
        via: 'Fastest corridor via Expressway & NH Bypass',
      },
      {
        name: 'Scenic State Highway Route',
        distanceKm: Math.round(distanceKm * 1.08),
        durationText: `${hours + 1} hr ${mins + 20} min`,
        via: 'Countryside route passing forest reserves & hill towns',
      },
    ],
    attractions: matchedAttractions,
    transportOptions,
  };
}
