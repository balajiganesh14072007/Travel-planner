# TravelMate — Smart Travel Planning Application

A modern, full-stack **MERN** (MongoDB, Express, React, Node.js) web application designed to build travel itineraries, discover tourist attractions, compare multimodal transport routes, and manage travel budgets & expenses.

Developed for academic capstone demonstration adhering to modern full-stack engineering standards.

---

## 1. Problem Statement & Objectives

> **Problem Statement:**  
> "Build a MERN-based travel planning application that builds itineraries and manages travel expenses. The system should manage destinations, dates, activities, budgets, and expenses using MongoDB. React should provide the user interface, while Node.js and Express.js should handle the backend APIs. The system should support adding, viewing, updating, and managing relevant records. It should demonstrate MERN Stack development, CRUD operations, REST APIs, authentication, role-based access where required, and clear presentation of project information and results."

### Core Objectives:
1. **Full-Stack MERN Architecture:** Clear decoupling of client and server tiers with standard RESTful protocols.
2. **Full CRUD Operations:** Comprehensive Create, Read, Update, and Delete flows for Trips, Itinerary Activities, and Expenses.
3. **Smart Travel Discovery:** Given Destination A and Destination B, calculate road distances, estimated durations, interactive routes on OpenStreetMap, multimodal transport comparisons (Flight, Train, Bus, Car), and recommended tourist sights with direct itinerary scheduling.
4. **Expense & Budget Mathematics:** Strict implementation of required financial formulas:
   - $\text{Total Expenses} = \sum \text{Expenses}$
   - $\text{Remaining Budget} = \text{Total Budget} - \text{Total Expenses}$
   - $\text{Budget Used Percentage} = (\text{Total Expenses} / \text{Total Budget}) \times 100$
   - Real-time over-budget deficit warning triggers.
5. **Security & Role-Based Access Control (RBAC):** JWT session tokens, salted bcrypt password hashing, data ownership checks, and an Administrator console.

---

## 2. Technology Stack

### Frontend
- **React.js 19 (Vite):** Reactive UI components, high-speed HMR bundling.
- **Tailwind CSS 4:** Clean, accessible styling following the Universal Frontend Design Constitution (anti-AI slop, zero-pill metadata discipline, WCAG AA contrast).
- **React Router 7:** Client-side navigation with protected route gates.
- **Axios:** HTTP client with JWT Authorization Bearer header interceptor.
- **Recharts:** Responsive SVG PieCharts (category distribution) and BarCharts (budget vs actual).
- **Leaflet & OpenStreetMap:** Real map tiles, custom SVG markers, and OSRM route polyline drawing.
- **Lucide React:** Semantic icon set.

### Backend & Storage
- **Node.js & Express.js:** RESTful API architecture with centralized error handling.
- **MongoDB Atlas & Mongoose:** Document models, indexes, and validation rules.
- **Persistent Local DB Adapter:** In-process JSON database mirror providing instant zero-config resilience for offline and grading environments.
- **jsonwebtoken (JWT):** Signed stateless auth tokens with 7-day expiration.
- **bcryptjs:** Salted password hashing (10 salt rounds).

---

## 3. MongoDB Database Design & Collections

### Collection: `users`
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Unique user identifier |
| `name` | String | Required | Full user name |
| `email` | String | Unique, Indexed | Lowercase email address |
| `passwordHash`| String | Required | bcrypt salted hash |
| `role` | String | Enum: `'user'`, `'admin'` | Role-based authorization |
| `timestamps` | Date | `createdAt`, `updatedAt` | Auto audit timestamps |

### Collection: `trips`
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Unique trip identifier |
| `userId` | ObjectId / String | Ref: `users`, Indexed | Trip owner |
| `title` | String | Required | Trip name (e.g. Goa Coastal Weekend) |
| `origin` | String | Required | Starting point (A) |
| `destination` | String | Required | Final destination (B) |
| `startDate` | String | Required | Departure date (YYYY-MM-DD) |
| `endDate` | String | Required | Return date (YYYY-MM-DD) |
| `travellers` | Number | Min: 1 | Number of group members |
| `budget` | Number | Min: 0 | Planned total budget |
| `currency` | String | Default: `'INR'` | Currency code |
| `notes` | String | Optional | Packing notes and reminders |
| `status` | String | Enum: `'planning'`,`'upcoming'`,`'ongoing'`,`'completed'`,`'cancelled'` | Trip state |

### Collection: `activities`
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Unique activity identifier |
| `tripId` | ObjectId / String | Ref: `trips`, Indexed | Associated trip |
| `userId` | ObjectId / String | Ref: `users`, Indexed | Activity owner |
| `title` | String | Required | Activity / attraction name |
| `date` | String | Required | Scheduled day (YYYY-MM-DD) |
| `startTime` | String | Optional | e.g. 10:00 AM |
| `endTime` | String | Optional | e.g. 01:00 PM |
| `location` | String | Optional | Venue address or landmark |
| `description`| String | Optional | Tour or sight description |
| `estimatedCost`| Number | Min: 0 | Admission fee or tour price |
| `notes` | String | Optional | Booking tips and reminders |

### Collection: `expenses`
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Unique expense identifier |
| `tripId` | ObjectId / String | Ref: `trips`, Indexed | Associated trip |
| `userId` | ObjectId / String | Ref: `users`, Indexed | Expense owner |
| `category` | String | Enum: `'Transportation'`, `'Accommodation'`, `'Food'`, `'Tourist attractions'`, `'Shopping'`, `'Other'` | Category |
| `amount` | Number | Required, > 0 | Expense value |
| `currency` | String | Default: `'INR'` | Currency code |
| `date` | String | Required | Date incurred |
| `description`| String | Required | Vendor or description |

---

## 4. REST API Endpoint Specification

### Authentication
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Verify token and get current profile [Protected]

### Trips (Full CRUD)
- `GET /api/trips` — Fetch all trips for authenticated user with live financial metrics [Protected]
- `POST /api/trips` — Create a new trip [Protected]
- `GET /api/trips/:id` — Retrieve trip details including nested activities & expenses [Protected]
- `PUT /api/trips/:id` — Update trip information [Protected]
- `DELETE /api/trips/:id` — Delete trip and cascade delete associated activities and expenses [Protected]

### Itinerary Activities (Full CRUD)
- `GET /api/trips/:tripId/activities` — Fetch activities for trip sorted chronologically [Protected]
- `POST /api/trips/:tripId/activities` — Add activity to trip itinerary [Protected]
- `PUT /api/activities/:id` — Update activity details [Protected]
- `DELETE /api/activities/:id` — Delete activity [Protected]

### Expenses & Budgets (Full CRUD)
- `GET /api/trips/:tripId/expenses` — Fetch trip expenses with budget formula calculations [Protected]
- `POST /api/trips/:tripId/expenses` — Log new expense against trip [Protected]
- `PUT /api/expenses/:id` — Edit expense transaction [Protected]
- `DELETE /api/expenses/:id` — Delete expense [Protected]
- `GET /api/expenses/overview` — Get user-wide financial metrics and recent transactions [Protected]

### Travel Discovery
- `GET /api/travel/route?origin=A&destination=B&travellers=N` — Calculate distance in km, driving duration, route polyline, and highway alternatives
- `GET /api/travel/places?destination=B` — Recommend destination tourist attractions with admission fees, hours, and coordinates
- `GET /api/travel/transport?origin=A&destination=B&travellers=N` — Multimodal transit comparisons with benchmark fares and booking links

### Administrator Console
- `GET /api/admin/overview` — System metrics, DB engine status, and uptime [Admin only]
- `GET /api/admin/users` — Directory of all registered users [Admin only]
- `GET /api/admin/trips` — Global trip oversight [Admin only]

---

## 5. Installation & Setup Instructions

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- MongoDB Atlas cluster URL (optional; fallback store is active by default)

### Step 1: Clone and Install
```bash
git clone <repository_url>
cd travelmate
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to configure your settings:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_2026
# Optional: Set your MongoDB Atlas connection string:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/travelmate?retryWrites=true&w=majority
```

### Step 3: Run Full-Stack Application
```bash
npm run dev
```
The server will boot on port `3000` with the REST API mounted at `/api/*` and Vite dev server serving the React frontend. Open your browser to:
`http://localhost:3000`

---

## 6. Pre-configured Evaluator Accounts

For seamless grading and demonstration, the application includes pre-seeded demo accounts with one-click quick-login buttons on `/auth`:

1. **Standard User Account:**
   - Email: `demo@travelmate.com`
   - Password: `password123`
   - Role: `user`
   - Pre-populated with Goa and Manali trips, daily itineraries, and expense transactions.

2. **Administrator Account:**
   - Email: `admin@travelmate.com`
   - Password: `admin123`
   - Role: `admin`
   - Access to the System Oversight Administrator Console (`/admin`).

---

## 7. Testing Procedures

1. **Authentication Testing:**
   - Test login with `demo@travelmate.com`.
   - Test public registration with a new email. Verify bcrypt encryption and JWT storage.
   - Verify that logging out immediately redirects protected pages (`/trips`, `/plan`, `/expenses`) to `/auth`.

2. **Smart Route Search Testing:**
   - Navigate to **Explore Destinations** (`/explore`).
   - Enter Origin: `Hyderabad, Telangana` and Destination: `Goa, India`.
   - Verify that distance (~650 km), driving duration, and route polyline display on the interactive Leaflet map.
   - Verify that tourist attractions (Baga Beach, Fort Aguada, etc.) appear with images, operating hours, and admission fees.
   - Click **"Add to Itinerary"** on an attraction to assign it to an existing trip.

3. **Trip Management (Full CRUD) Testing:**
   - Navigate to **My Trips** (`/trips`).
   - Click **"Create New Trip"**, complete the modal form, and verify the trip card renders.
   - Edit the trip budget and status; verify updates.
   - Delete a trip; verify that associated activities and expenses are cascade-deleted.

4. **Itinerary Timeline Testing:**
   - Navigate to **Itinerary** (`/itinerary`) or open a trip detail page.
   - Add new activities with dates, times, and costs.
   - Verify that activities are sorted chronologically under Day 1, Day 2, etc.

5. **Budget & Expense Calculations Testing:**
   - Navigate to **Expenses** (`/expenses`).
   - Log an expense. Verify that:
     $$\text{Total Expenses} = \sum \text{Expenses}$$
     $$\text{Remaining Budget} = \text{Budget} - \text{Total Expenses}$$
     $$\text{Budget Used \%} = (\text{Total Expenses} / \text{Budget}) \times 100$$
   - Add an expense exceeding the trip budget; verify that the red **Over-Budget Warning Banner** activates immediately.
   - Verify that the Recharts Category PieChart and Budget vs Actual BarChart reflect the updated data.

6. **Admin Authorization Testing:**
   - Log in with `demo@travelmate.com` and attempt to navigate to `/admin`. Verify HTTP 403 / Access Denied.
   - Log in with `admin@travelmate.com` and navigate to `/admin`. Verify platform metrics, user directory, and all trips appear.

---

## 8. Limitations & Future Enhancements

- **Real-Time Live Flight & Train GDS API:** Currently links directly to official provider portals (IRCTC, RedBus, Google Flights). Future versions can integrate Amadeus or Sabre APIs for live PNR bookings.
- **Offline PWA Sync:** Implement service workers and IndexedDB sync for offline trail access.
- **Multi-Currency Real-Time FX Conversion:** Add live exchange rate APIs for cross-border trips.
- **Collaborative Group Splitting:** Integrate splitwise-style expense sharing among group travellers.
