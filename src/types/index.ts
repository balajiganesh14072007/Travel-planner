export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type ExpenseCategory =
  | 'Transportation'
  | 'Accommodation'
  | 'Food'
  | 'Tourist attractions'
  | 'Shopping'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Trip {
  _id: string;
  userId: string;
  title: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
  budget: number;
  currency: string;
  notes?: string;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
  totalExpenses?: number;
  remainingBudget?: number;
  budgetUsedPercentage?: number;
  isOverBudget?: boolean;
  activityCount?: number;
  expenseCount?: number;
}

export interface Activity {
  _id: string;
  tripId: string;
  userId: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  estimatedCost: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  tripId: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
  stateCountry?: string;
}

export interface Attraction {
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

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  averageCostPerPerson: number;
  imageUrl: string;
  specialties: string[];
  location: string;
  lat: number;
  lng: number;
  distanceFromCenterKm: number;
  openingHours: string;
  dietaryOptions: string[];
  ambiance: string;
  tags: string[];
  googleMapsLink?: string;
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
  attractions: Attraction[];
  restaurants: Restaurant[];
  transportOptions: TransportOption[];
}

export interface FinancialOverview {
  totalTrips: number;
  totalPlannedBudget: number;
  totalExpenses: number;
  remainingBudget: number;
  budgetUsedPercentage: number;
  isOverBudget: boolean;
  categoryTotals: Record<string, number>;
  tripComparisonData: {
    tripId: string;
    title: string;
    budget: number;
    spent: number;
    remaining: number;
  }[];
  recentExpenses: (Expense & { tripTitle: string })[];
}
