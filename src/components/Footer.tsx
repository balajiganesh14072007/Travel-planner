import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Project Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span>TravelMate</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Smart Travel Planning Application built on the MERN stack with MongoDB Atlas, Express, React, and Node.js.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-xs text-blue-300 font-medium">
              <span>MERN College Capstone Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Core Features</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore" className="hover:text-white transition-colors">Smart Destination Search</Link></li>
              <li><Link to="/plan" className="hover:text-white transition-colors">Create Trip Itinerary</Link></li>
              <li><Link to="/trips" className="hover:text-white transition-colors">Trip Management (CRUD)</Link></li>
              <li><Link to="/expenses" className="hover:text-white transition-colors">Expense & Budget Tracker</Link></li>
              <li><Link to="/itinerary" className="hover:text-white transition-colors">Day-by-Day Schedule</Link></li>
            </ul>
          </div>

          {/* System & API Specs */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Architecture & APIs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Database: MongoDB Atlas / Mongoose</li>
              <li>Backend: Node.js & Express REST API</li>
              <li>Frontend: React 19 + Tailwind CSS</li>
              <li>Maps: Leaflet & OpenStreetMap Engine</li>
              <li>Auth: Secure JWT & bcrypt Hashing</li>
            </ul>
          </div>

          {/* College Project Submission Docs */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Project Documentation</h4>
            <p className="text-xs leading-relaxed mb-3 text-slate-400">
              Complete technical specifications, database schemas, REST endpoints, and test instructions.
            </p>
            <Link
              to="/docs"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              <span>View Full Project Specs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TravelMate — Smart Travel Planning Application. Built for Academic Demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">REST API: <span className="text-emerald-400 font-mono">v1.0 (Active)</span></span>
            <span>·</span>
            <span>All CRUD operations authenticated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
