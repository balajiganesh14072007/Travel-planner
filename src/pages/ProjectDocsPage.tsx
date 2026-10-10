import React from 'react';
import {
  BookOpen,
  Server,
  Database,
  Layers,
  Code,
  CheckCircle,
  FileText,
  Key,
  Shield,
  Compass,
} from 'lucide-react';

export const ProjectDocsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Capstone Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          TravelMate — College Project Specifications
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Smart Travel Planning Application built using the MERN Stack (MongoDB, Express, React, Node.js).
        </p>
      </div>

      {/* 1. Problem Statement & Objectives */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>1. Problem Statement & Objectives</span>
        </h2>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-mono">
          "Build a MERN-based travel planning application that builds itineraries and manages travel expenses. The system should manage destinations, dates, activities, budgets, and expenses using MongoDB. React should provide the user interface, while Node.js and Express.js should handle the backend APIs. The system should support adding, viewing, updating, and managing relevant records. It should demonstrate MERN Stack development, CRUD operations, REST APIs, authentication, role-based access where required, and clear presentation of project information and results."
        </div>
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Core Objectives Accomplished:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Complete MERN Architecture:</strong> Decoupled React frontend communicating with Node.js/Express REST APIs connected to MongoDB via Mongoose.</li>
            <li><strong>Full CRUD across 3 Core Entities:</strong> Trips, Itinerary Activities, and Budget Expenses.</li>
            <li><strong>Smart Travel Discovery:</strong> Destination A to B route calculation, distance in km, driving duration, Leaflet OpenStreetMap interactive polyline rendering, multimodal comparisons (Flight, Train, Bus, Car), and recommended tourist attractions with one-click itinerary additions.</li>
            <li><strong>Financial Algorithms:</strong> Enforces the exact 3 mathematical formulas: Total Expenses, Remaining Budget, and Budget Used Percentage with over-budget alerts.</li>
            <li><strong>Security & RBAC:</strong> JWT authentication, bcrypt password hashing, resource ownership protection, and Administrator console.</li>
          </ul>
        </div>
      </section>

      {/* 2. MERN Technology Stack */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>2. Technology Stack Breakdown</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" /> Frontend Client
            </h3>
            <ul className="space-y-1 text-slate-600">
              <li>• <strong>React 19 & Vite:</strong> Ultra-fast component bundling with SPA architecture.</li>
              <li>• <strong>Tailwind CSS 4:</strong> Production styling following universal design constitution.</li>
              <li>• <strong>React Router 7:</strong> Declarative client-side routing with protected view gates.</li>
              <li>• <strong>Axios:</strong> HTTP client with JWT Authorization Bearer header interceptor.</li>
              <li>• <strong>Recharts:</strong> Responsive PieCharts for category spending and BarCharts for budget vs actual.</li>
              <li>• <strong>Leaflet:</strong> OpenStreetMap tiles, interactive markers, and OSRM route polylines.</li>
              <li>• <strong>Lucide React:</strong> Semantic icons for travel modes, cards, and navigation.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" /> Backend Server & Database
            </h3>
            <ul className="space-y-1 text-slate-600">
              <li>• <strong>Node.js & Express:</strong> High-performance RESTful API endpoints.</li>
              <li>• <strong>MongoDB & Mongoose:</strong> Document schemas, indexes, and validation rules.</li>
              <li>• <strong>Persistent Data Adapter:</strong> In-process JSON database mirror providing zero-config local reliability.</li>
              <li>• <strong>jsonwebtoken:</strong> Signed JWT bearer tokens with 7-day expiration.</li>
              <li>• <strong>bcryptjs:</strong> Salted password hashing (10 salt rounds).</li>
              <li>• <strong>Role-Based Access Control:</strong> Distinct <code className="text-blue-600 font-mono">'user'</code> and <code className="text-purple-600 font-mono">'admin'</code> authorization middleware.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Database Schema Models */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-600" />
          <span>3. MongoDB Database Schema Design</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 space-y-1">
            <span className="text-blue-400 font-bold">// Collection: Users</span>
            <p>name: String (required)</p>
            <p>email: String (unique, index, lowercase)</p>
            <p>passwordHash: String (bcrypt)</p>
            <p>role: 'user' | 'admin'</p>
            <p>timestamps: true</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 space-y-1">
            <span className="text-emerald-400 font-bold">// Collection: Trips</span>
            <p>userId: ObjectId (ref: User, index)</p>
            <p>title: String</p>
            <p>origin: String, destination: String</p>
            <p>startDate: String, endDate: String</p>
            <p>travellers: Number, budget: Number</p>
            <p>status: 'planning'|'upcoming'|'ongoing'|'completed'</p>
            <p>timestamps: true</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 space-y-1">
            <span className="text-amber-400 font-bold">// Collection: Activities (Itinerary)</span>
            <p>tripId: ObjectId (ref: Trip, index)</p>
            <p>userId: ObjectId (ref: User, index)</p>
            <p>title: String, date: String</p>
            <p>startTime: String, endTime: String</p>
            <p>location: String, estimatedCost: Number</p>
            <p>timestamps: true</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 space-y-1">
            <span className="text-purple-400 font-bold">// Collection: Expenses</span>
            <p>tripId: ObjectId (ref: Trip, index)</p>
            <p>userId: ObjectId (ref: User, index)</p>
            <p>category: 'Transportation' | 'Accommodation' | 'Food' | 'Tourist attractions' | 'Shopping' | 'Other'</p>
            <p>amount: Number (positive), currency: String</p>
            <p>date: String, description: String</p>
          </div>
        </div>
      </section>

      {/* 4. REST API Endpoints Specification */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-5 h-5 text-emerald-600" />
          <span>4. REST API Endpoint Reference</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5">Method</th>
                <th className="px-3 py-2.5">Endpoint</th>
                <th className="px-3 py-2.5">Access</th>
                <th className="px-3 py-2.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              <tr><td className="px-3 py-2 text-blue-600 font-bold">POST</td><td className="px-3 py-2">/api/auth/register</td><td className="px-3 py-2 text-slate-500 font-sans">Public</td><td className="px-3 py-2 font-sans text-slate-700">Register new user account</td></tr>
              <tr><td className="px-3 py-2 text-blue-600 font-bold">POST</td><td className="px-3 py-2">/api/auth/login</td><td className="px-3 py-2 text-slate-500 font-sans">Public</td><td className="px-3 py-2 font-sans text-slate-700">Authenticate user & issue JWT token</td></tr>
              <tr><td className="px-3 py-2 text-emerald-600 font-bold">GET</td><td className="px-3 py-2">/api/auth/me</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Retrieve authenticated user identity</td></tr>
              <tr><td className="px-3 py-2 text-emerald-600 font-bold">GET</td><td className="px-3 py-2">/api/trips</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Fetch user trips with dynamic financial metrics</td></tr>
              <tr><td className="px-3 py-2 text-blue-600 font-bold">POST</td><td className="px-3 py-2">/api/trips</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Create new trip record</td></tr>
              <tr><td className="px-3 py-2 text-emerald-600 font-bold">GET</td><td className="px-3 py-2">/api/trips/:id</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Get trip with nested activities & expenses</td></tr>
              <tr><td className="px-3 py-2 text-amber-600 font-bold">PUT</td><td className="px-3 py-2">/api/trips/:id</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Update trip configuration</td></tr>
              <tr><td className="px-3 py-2 text-red-600 font-bold">DELETE</td><td className="px-3 py-2">/api/trips/:id</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Delete trip and cascade delete activities & expenses</td></tr>
              <tr><td className="px-3 py-2 text-emerald-600 font-bold">GET</td><td className="px-3 py-2">/api/trips/:tripId/activities</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Get activities for trip sorted by date/time</td></tr>
              <tr><td className="px-3 py-2 text-blue-600 font-bold">POST</td><td className="px-3 py-2">/api/trips/:tripId/activities</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Add activity to trip itinerary</td></tr>
              <tr><td className="px-3 py-2 text-emerald-600 font-bold">GET</td><td className="px-3 py-2">/api/trips/:tripId/expenses</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Get trip expenses and financial formulas summary</td></tr>
              <tr><td className="px-3 py-2 text-blue-600 font-bold">POST</td><td className="px-3 py-2">/api/trips/:tripId/expenses</td><td className="px-3 py-2 text-amber-600 font-sans">JWT</td><td className="px-3 py-2 font-sans text-slate-700">Record new expense line item</td></tr>
              <tr><td className="px-3 py-2 text-emerald-600 font-bold">GET</td><td className="px-3 py-2">/api/travel/route</td><td className="px-3 py-2 text-slate-500 font-sans">Public</td><td className="px-3 py-2 font-sans text-slate-700">Compute route, distance, duration & polylines</td></tr>
              <tr><td className="px-3 py-2 text-emerald-600 font-bold">GET</td><td className="px-3 py-2">/api/travel/places</td><td className="px-3 py-2 text-slate-500 font-sans">Public</td><td className="px-3 py-2 font-sans text-slate-700">Recommend destination tourist attractions</td></tr>
              <tr><td className="px-3 py-2 text-emerald-600 font-bold">GET</td><td className="px-3 py-2">/api/travel/transport</td><td className="px-3 py-2 text-slate-500 font-sans">Public</td><td className="px-3 py-2 font-sans text-slate-700">Multimodal transport options comparison</td></tr>
              <tr><td className="px-3 py-2 text-purple-600 font-bold">GET</td><td className="px-3 py-2">/api/admin/overview</td><td className="px-3 py-2 text-purple-600 font-sans">Admin</td><td className="px-3 py-2 font-sans text-slate-700">System metrics, DB status, uptime</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Pre-configured Test Accounts */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          <span>5. Pre-configured Evaluator Test Accounts</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <h4 className="font-bold text-blue-900">Standard User Account</h4>
            <p className="text-blue-800">Email: <strong className="font-mono">demo@travelmate.com</strong></p>
            <p className="text-blue-800">Password: <strong className="font-mono">password123</strong></p>
            <p className="text-[11px] text-blue-700">Role: User · Pre-seeded with Goa & Manali trips, daily itineraries, and expense transactions.</p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <h4 className="font-bold text-purple-900">Administrator Account</h4>
            <p className="text-purple-800">Email: <strong className="font-mono">admin@travelmate.com</strong></p>
            <p className="text-purple-800">Password: <strong className="font-mono">admin123</strong></p>
            <p className="text-[11px] text-purple-700">Role: Admin · Access to System Oversight console, registered user directory, and all trips.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
