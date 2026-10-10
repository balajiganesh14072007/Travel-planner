import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  FolderOpen,
  Wallet,
  Database,
  Server,
  Calendar,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [overview, setOverview] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [tripsList, setTripsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      if (!isAdmin) return;
      setLoading(true);
      setError(null);
      try {
        const [overviewRes, usersRes, tripsRes] = await Promise.all([
          adminAPI.getOverview(),
          adminAPI.getUsers(),
          adminAPI.getTrips(),
        ]);

        if (overviewRes.success) setOverview(overviewRes.data);
        if (usersRes.success) setUsersList(usersRes.data);
        if (tripsRes.success) setTripsList(tripsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load administrator console data.');
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [isAdmin]);

  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Denied (403)</h2>
        <p className="text-xs text-slate-500">
          Administrator privileges are required to view this panel. You are signed in as an ordinary user.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Role-Based Administrator Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          System Administration & Oversight
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Monitor platform metrics, registered user directory, database operations, and trips across the application.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      ) : overview ? (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Registered Users</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {overview.totalUsers}
              </div>
              <p className="text-[11px] text-slate-500">Accounts in MongoDB</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>System Trips</span>
                <FolderOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {overview.totalTrips}
              </div>
              <p className="text-[11px] text-slate-500">Across all user accounts</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Expenses Recorded</span>
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                ₹{overview.totalExpensesAmount?.toLocaleString() || 0}
              </div>
              <p className="text-[11px] text-slate-500">{overview.totalExpensesCount || 0} line transactions</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Database Engine</span>
                <Database className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {overview.databaseMode}
              </div>
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                <Activity className="w-3 h-3" /> Uptime: {Math.round(overview.uptime)}s
              </p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Registered User Directory ({usersList.length})</h3>
              <span className="text-xs text-slate-500">Public passwords hashed with bcrypt</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Email Address</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{u._id}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* All Trips Oversight Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Application Trips Oversight ({tripsList.length})</h3>
              <span className="text-xs text-slate-500">Cross-system read access for administrators</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Trip Title</th>
                    <th className="px-4 py-3">Origin → Destination</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Budget</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tripsList.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{t.title}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {t.origin.split(',')[0]} → {t.destination.split(',')[0]}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                        {t.startDate} to {t.endDate}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 tabular-nums">
                        ₹{t.budget.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-slate-700 font-semibold">{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
