import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface StoredUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface StoredTrip {
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
  notes: string;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface StoredActivity {
  _id: string;
  tripId: string;
  userId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  estimatedCost: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredExpense {
  _id: string;
  tripId: string;
  userId: string;
  category: 'Transportation' | 'Accommodation' | 'Food' | 'Tourist attractions' | 'Shopping' | 'Other';
  amount: number;
  currency: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  trips: StoredTrip[];
  activities: StoredActivity[];
  expenses: StoredExpense[];
}

const DATA_FILE = path.resolve(process.cwd(), '.travelmate_data.json');

class DatabaseStore {
  private data: DatabaseSchema = {
    users: [],
    trips: [],
    activities: [],
    expenses: [],
  };

  private initialized = false;

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.seedInitialData();
      }
    } catch {
      this.seedInitialData();
    }
    this.initialized = true;
  }

  private saveData() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  private seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('password123', salt);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);

    const demoUserId = '65f12a34b12c4d5e6f7a8001';
    const adminUserId = '65f12a34b12c4d5e6f7a8002';

    const demoUser: StoredUser = {
      _id: demoUserId,
      name: 'Rohan Sharma',
      email: 'demo@travelmate.com',
      passwordHash: demoPasswordHash,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const adminUser: StoredUser = {
      _id: adminUserId,
      name: 'System Administrator',
      email: 'admin@travelmate.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const trip1Id = '65f12a34b12c4d5e6f7a9001';
    const trip2Id = '65f12a34b12c4d5e6f7a9002';

    const trip1: StoredTrip = {
      _id: trip1Id,
      userId: demoUserId,
      title: 'Goa Coastal Sun & Adventure',
      origin: 'Hyderabad, Telangana',
      destination: 'Goa, India',
      startDate: '2026-11-15',
      endDate: '2026-11-20',
      travellers: 2,
      budget: 35000,
      currency: 'INR',
      notes: 'Road trip or train journey from Hyderabad to North Goa. Explore beaches, forts, and local seafood.',
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const trip2: StoredTrip = {
      _id: trip2Id,
      userId: demoUserId,
      title: 'Manali Himalayan Retreat',
      origin: 'Delhi, India',
      destination: 'Manali, Himachal Pradesh',
      startDate: '2026-12-05',
      endDate: '2026-12-12',
      travellers: 4,
      budget: 50000,
      currency: 'INR',
      notes: 'Winter mountain expedition with friends. Snow activities at Solang and Old Manali cafes.',
      status: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const activities: StoredActivity[] = [
      {
        _id: '65f12a34b12c4d5e6f7aa001',
        tripId: trip1Id,
        userId: demoUserId,
        title: 'Check-in & Sunset at Baga Beach',
        date: '2026-11-15',
        startTime: '16:30',
        endTime: '19:00',
        location: 'Baga Beach, North Goa',
        description: 'Arrive at hotel, refresh, and stroll along the shoreline with coastal music and snacks.',
        estimatedCost: 1200,
        notes: 'Book beach shack table before 5 PM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f12a34b12c4d5e6f7aa002',
        tripId: trip1Id,
        userId: demoUserId,
        title: 'Fort Aguada & Lighthouse Exploration',
        date: '2026-11-16',
        startTime: '09:30',
        endTime: '12:30',
        location: 'Candolim, Goa',
        description: '17th-century Portuguese fort overlooking Sinquerim beach with historic lighthouse and ocean views.',
        estimatedCost: 500,
        notes: 'Carry hats and cameras',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f12a34b12c4d5e6f7aa003',
        tripId: trip1Id,
        userId: demoUserId,
        title: 'Water Sports at Calangute',
        date: '2026-11-17',
        startTime: '10:00',
        endTime: '13:00',
        location: 'Calangute Beach',
        description: 'Parasailing, jet skiing, and banana boat ride combo.',
        estimatedCost: 4500,
        notes: 'Certified instructors package',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const expenses: StoredExpense[] = [
      {
        _id: '65f12a34b12c4d5e6f7ab001',
        tripId: trip1Id,
        userId: demoUserId,
        category: 'Transportation',
        amount: 8500,
        currency: 'INR',
        date: '2026-11-15',
        description: 'Sleeper Volvo Bus Tickets (2 Passengers)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f12a34b12c4d5e6f7ab002',
        tripId: trip1Id,
        userId: demoUserId,
        category: 'Accommodation',
        amount: 14000,
        currency: 'INR',
        date: '2026-11-15',
        description: 'Boutique Beach Resort (3 nights advance)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f12a34b12c4d5e6f7ab003',
        tripId: trip1Id,
        userId: demoUserId,
        category: 'Food',
        amount: 3200,
        currency: 'INR',
        date: '2026-11-16',
        description: 'Dinner at Fisherman’s Wharf Seafood Shack',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '65f12a34b12c4d5e6f7ab004',
        tripId: trip1Id,
        userId: demoUserId,
        category: 'Tourist attractions',
        amount: 1000,
        currency: 'INR',
        date: '2026-11-16',
        description: 'Aguada Fort & Heritage Lighthouse tickets',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.data = {
      users: [demoUser, adminUser],
      trips: [trip1, trip2],
      activities,
      expenses,
    };

    this.saveData();
  }

  // User operations
  findUserByEmail(email: string): StoredUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): StoredUser | undefined {
    return this.data.users.find((u) => u._id === id);
  }

  getAllUsers(): StoredUser[] {
    return [...this.data.users];
  }

  createUser(user: Omit<StoredUser, '_id' | 'createdAt' | 'updatedAt'>): StoredUser {
    const newUser: StoredUser = {
      ...user,
      _id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  // Trip operations
  getTripsByUser(userId: string): StoredTrip[] {
    return this.data.trips.filter((t) => t.userId === userId);
  }

  getAllTrips(): StoredTrip[] {
    return [...this.data.trips];
  }

  getTripById(id: string): StoredTrip | undefined {
    return this.data.trips.find((t) => t._id === id);
  }

  createTrip(trip: Omit<StoredTrip, '_id' | 'createdAt' | 'updatedAt'>): StoredTrip {
    const newTrip: StoredTrip = {
      ...trip,
      _id: 'trip_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.trips.push(newTrip);
    this.saveData();
    return newTrip;
  }

  updateTrip(id: string, updates: Partial<StoredTrip>): StoredTrip | null {
    const index = this.data.trips.findIndex((t) => t._id === id);
    if (index === -1) return null;
    this.data.trips[index] = {
      ...this.data.trips[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.trips[index];
  }

  deleteTrip(id: string): boolean {
    const initialLen = this.data.trips.length;
    this.data.trips = this.data.trips.filter((t) => t._id !== id);
    if (this.data.trips.length === initialLen) return false;

    // Cascade delete associated activities and expenses
    this.data.activities = this.data.activities.filter((a) => a.tripId !== id);
    this.data.expenses = this.data.expenses.filter((e) => e.tripId !== id);
    this.saveData();
    return true;
  }

  // Activity operations
  getActivitiesByTrip(tripId: string): StoredActivity[] {
    return this.data.activities
      .filter((a) => a.tripId === tripId)
      .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.startTime || '').localeCompare(b.startTime || ''));
  }

  getActivityById(id: string): StoredActivity | undefined {
    return this.data.activities.find((a) => a._id === id);
  }

  createActivity(activity: Omit<StoredActivity, '_id' | 'createdAt' | 'updatedAt'>): StoredActivity {
    const newAct: StoredActivity = {
      ...activity,
      _id: 'act_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.activities.push(newAct);
    this.saveData();
    return newAct;
  }

  updateActivity(id: string, updates: Partial<StoredActivity>): StoredActivity | null {
    const index = this.data.activities.findIndex((a) => a._id === id);
    if (index === -1) return null;
    this.data.activities[index] = {
      ...this.data.activities[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.activities[index];
  }

  deleteActivity(id: string): boolean {
    const initialLen = this.data.activities.length;
    this.data.activities = this.data.activities.filter((a) => a._id !== id);
    if (this.data.activities.length === initialLen) return false;
    this.saveData();
    return true;
  }

  // Expense operations
  getExpensesByTrip(tripId: string): StoredExpense[] {
    return this.data.expenses
      .filter((e) => e.tripId === tripId)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }

  getAllExpenses(): StoredExpense[] {
    return [...this.data.expenses];
  }

  getExpenseById(id: string): StoredExpense | undefined {
    return this.data.expenses.find((e) => e._id === id);
  }

  createExpense(expense: Omit<StoredExpense, '_id' | 'createdAt' | 'updatedAt'>): StoredExpense {
    const newExp: StoredExpense = {
      ...expense,
      _id: 'exp_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.expenses.push(newExp);
    this.saveData();
    return newExp;
  }

  updateExpense(id: string, updates: Partial<StoredExpense>): StoredExpense | null {
    const index = this.data.expenses.findIndex((e) => e._id === id);
    if (index === -1) return null;
    this.data.expenses[index] = {
      ...this.data.expenses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.expenses[index];
  }

  deleteExpense(id: string): boolean {
    const initialLen = this.data.expenses.length;
    this.data.expenses = this.data.expenses.filter((e) => e._id !== id);
    if (this.data.expenses.length === initialLen) return false;
    this.saveData();
    return true;
  }
}

export const dbStore = new DatabaseStore();
