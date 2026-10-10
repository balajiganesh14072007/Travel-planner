import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User as UserIcon, LogOut, ShieldCheck, Plus, Menu, X, BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    { name: 'Explore Destinations', path: '/explore' },
    { name: 'Plan a Trip', path: '/plan' },
    { name: 'My Trips', path: '/trips' },
    { name: 'Itinerary', path: '/itinerary' },
    { name: 'Expenses', path: '/expenses' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <Compass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            </div>
            <span>Travel<span className="text-blue-600">Mate</span></span>
          </Link>

          {/* Zone 2: Single-Line Text Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive(link.path)
                    ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/docs"
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                isActive('/docs')
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Project Docs</span>
            </Link>
          </nav>

          {/* Zone 3: 1 Primary Action / User Profile */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 text-sm z-50 animate-in fade-in-50 zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <p className="text-xs text-blue-600 font-medium capitalize mt-0.5">Role: {user.role}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Executive Dashboard
                    </Link>
                    <Link
                      to="/trips"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      My Travel Trips
                    </Link>
                    <Link
                      to="/expenses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Budget & Expenses
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-50 transition-colors font-medium"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/auth');
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </Link>
                <Link
                  to="/plan"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Plan a Trip
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Project Documentation
          </Link>
          <div className="border-t border-slate-200 pt-3 mt-2">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-sm font-medium text-slate-600">
                  Logged in as <span className="font-semibold text-slate-900">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/auth');
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium shadow-sm"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
