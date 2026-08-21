 import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  FileText,
  FileCheck,
  ClipboardList,
  BarChart3,
  Settings,
  Bell,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers
} from 'lucide-react';

/* ==========================================================================
   CONFIG: PUBLIC & AUTHENTICATED NAVIGATION LINKS
   ========================================================================== */

// Public Landing Page links (Before Login)
const PUBLIC_NAV_ITEMS = [
  { label: 'Features', path: '/#features' },
  { label: 'AI Extraction', path: '/#ai-extraction' },
  { label: 'Compliance & Expiry', path: '/#compliance' },
  { label: 'Security', path: '/#security' },
  { label: 'Pricing', path: '/#pricing' },
];

// Authenticated links filtered by User Role (After Login)
const AUTH_NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'VENDOR', 'AUDITOR'],
  },
  {
    label: 'Vendors',
    path: '/vendors',
    icon: Users,
    roles: ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR'],
  },
  {
    label: 'Documents',
    path: '/documents',
    icon: FileText,
    roles: ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'VENDOR', 'AUDITOR'],
  },
  {
    label: 'Upload Document',
    path: '/documents/upload',
    icon: UploadCloud,
    roles: ['VENDOR'],
    isAction: true,
  },
  {
    label: 'Compliance Policies',
    path: '/policies',
    icon: FileCheck,
    roles: ['SUPER_ADMIN', 'COMPLIANCE_OFFICER'],
  },
  {
    label: 'Audit Logs',
    path: '/audit-logs',
    icon: ClipboardList,
    roles: ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR'],
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR'],
  },
];

// Mock notification alerts for authenticated users
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Urgent Expiry: Insurance Certificate',
    vendor: 'Apex Logistics Ltd',
    time: 'Expires in 7 days',
    type: 'critical',
    unread: true,
  },
  {
    id: 2,
    title: 'AI Extraction Completed',
    vendor: 'Global Freight Inc — GST Cert',
    time: '20 mins ago',
    type: 'ai',
    unread: true,
  },
  {
    id: 3,
    title: 'Document Approved',
    vendor: 'TechCorp Solutions — NDA',
    time: '2 hours ago',
    type: 'success',
    unread: false,
  },
];

/* ==========================================================================
   MAIN NAVBAR COMPONENT
   ========================================================================== */

export default function Navbar({
  isAuthenticated = false, // Pass true when logged in
  user = null, // e.g., { name: 'Uttam Gupta', email: 'uttam@acme.com', role: 'SUPER_ADMIN', organization: 'Acme Corp' }
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'COMPLIANCE_OFFICER':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'VENDOR':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'AUDITOR':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatRoleName = (role) => {
    return role ? role.replace('_', ' ') : 'USER';
  };

  // Filter in-app tabs by current user's role
  const allowedAuthItems = AUTH_NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role || 'VENDOR')
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* =========================================================
              LEFT: Logo & Brand
             ========================================================= */}
          <div className="flex items-center gap-6">
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                    Vendor<span className="text-indigo-600 dark:text-indigo-400">Vault</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-950/50 dark:text-indigo-300">
                    <Sparkles className="h-2.5 w-2.5" /> AI
                  </span>
                </div>
                <span className="hidden sm:block text-[11px] font-medium text-slate-400 -mt-1">
                  B2B Compliance & Document Intelligence
                </span>
              </div>
            </Link>

            {/* If Logged In: Show current organization badge */}
            {isAuthenticated && user?.organization && (
              <div className="hidden xl:flex items-center gap-1.5 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-medium truncate max-w-[160px]">{user.organization}</span>
              </div>
            )}
          </div>

          {/* =========================================================
              CENTER NAVIGATION
             ========================================================= */}
          
          {/* STATE 1: PUBLIC NAVIGATION (Before Login) */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* STATE 2: AUTHENTICATED APP NAVIGATION (After Login) */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {allowedAuthItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                      } ${
                        item.isAction
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white shadow-sm shadow-indigo-600/20'
                          : ''
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* =========================================================
              RIGHT SECTION: CTAs or User Profile
             ========================================================= */}
          
          {/* STATE 1: BEFORE LOGIN (Login & Get Started Buttons) */}
          {!isAuthenticated && (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* STATE 2: AFTER LOGIN (Alerts, Role Badge & Profile Menu) */}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              
              {/* Notification Expiry Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-1 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                          Alerts & Reminders
                        </span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-400">No active alerts</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors cursor-pointer ${
                              notif.unread
                                ? 'bg-slate-50 dark:bg-slate-800/60'
                                : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                            }`}
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {notif.type === 'critical' && (
                                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                                  <AlertTriangle className="h-4 w-4" />
                                </div>
                              )}
                              {notif.type === 'ai' && (
                                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                  <Sparkles className="h-4 w-4" />
                                </div>
                              )}
                              {notif.type === 'success' && (
                                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {notif.vendor}
                              </p>
                              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                <Clock className="h-3 w-3" />
                                <span>{notif.time}</span>
                              </div>
                            </div>
                            {notif.unread && (
                              <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5"></span>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-2 border-t border-slate-100 pt-2 text-center dark:border-slate-800">
                      <Link
                        to="/alerts"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                      >
                        View all compliance alerts →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Role Badge (Desktop) */}
              <div
                className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getRoleBadgeColor(
                  user?.role
                )}`}
              >
                {formatRoleName(user?.role)}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-xl p-1.5 text-slate-700 hover:bg-slate-100 focus:outline-none dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white uppercase shadow-sm">
                    {user?.name ? user.name.slice(0, 2) : 'U'}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'user@vendorvault.io'}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Role:</span>
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadgeColor(
                            user?.role
                          )}`}
                        >
                          {formatRoleName(user?.role)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 space-y-0.5">
                      <NavLink
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        My Profile
                      </NavLink>

                      {user?.role === 'SUPER_ADMIN' && (
                        <NavLink
                          to="/settings/org"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Settings className="h-4 w-4 text-slate-400" />
                          Organization Settings
                        </NavLink>
                      )}
                    </div>

                    <div className="mt-1 border-t border-slate-100 pt-1 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          onLogout?.();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              MOBILE MENU TOGGLE BUTTON
             ========================================================= */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================
          MOBILE DRAWER / MENU
         ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 dark:border-slate-800 dark:bg-slate-900 shadow-xl">
          
          {/* Public Mobile Drawer */}
          {!isAuthenticated ? (
            <div className="space-y-3">
              <nav className="space-y-1">
                {PUBLIC_NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="border-t border-slate-100 pt-3 dark:border-slate-800 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Authenticated Mobile Drawer */
            <div className="space-y-3">
              <div className="px-2 py-1 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{user?.organization}</span>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadgeColor(
                    user?.role
                  )}`}
                >
                  {formatRoleName(user?.role)}
                </span>
              </div>

              <nav className="space-y-1">
                {allowedAuthItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                        }`
                      }
                    >
                      <Icon className="h-5 w-5 text-slate-400" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between px-2">
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </header>
  );
}