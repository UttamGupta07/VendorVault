 import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Zap,
  Lock,
  Building2,
  Users,
  BarChart3,
  History,
  Check,
  X,
  UploadCloud,
  FileCheck2,
  Cpu,
  ChevronRight,
  Shield,
  FileSpreadsheet,
  MailCheck,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('ai-extraction');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
      
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80">
          <div
            className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-indigo-500 to-purple-600 opacity-20 dark:opacity-30"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-md dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Next-Gen B2B Compliance & Document Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-tight">
              Stop Managing Vendor Compliance in{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Spreadsheets.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-slate-600 sm:text-xl dark:text-slate-400 leading-relaxed">
              VendorVault automates document collection, utilizes LLMs to extract metadata & expiry dates, monitors renewal schedules, and guarantees audit readiness across hundreds of vendors.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all hover:scale-105"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Tenant Isolation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automated 30/15/7-Day Expiry Alerts
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> LLM Structured Extraction
              </span>
            </div>
          </div>

          {/* =========================================================================
              HERO VISUAL / INTERACTIVE DASHBOARD CARD
              ========================================================================= */}
          <div className="mt-14 relative rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 sm:p-5">
            <div className="rounded-xl border border-slate-200/60 bg-slate-900 p-4 sm:p-6 text-white dark:border-slate-800 shadow-inner">
              
              {/* Mock Dashboard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400" />
                    Enterprise Compliance Hub
                  </h3>
                  <p className="text-xs text-slate-400">Real-time status across 250 connected vendors</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    AI Worker Active
                  </span>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/50">
                  <p className="text-xs font-medium text-slate-400">Total Vendors</p>
                  <p className="text-2xl font-bold text-white mt-1">250</p>
                  <p className="text-[11px] text-emerald-400 mt-1">100% Onboarded</p>
                </div>
                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/50">
                  <p className="text-xs font-medium text-slate-400">Compliant</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">180</p>
                  <p className="text-[11px] text-slate-400 mt-1">72% of total</p>
                </div>
                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/50">
                  <p className="text-xs font-medium text-slate-400">At Risk (Expiring Soon)</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">40</p>
                  <p className="text-[11px] text-amber-400/80 mt-1">Alerts Dispatched</p>
                </div>
                <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700/50">
                  <p className="text-xs font-medium text-slate-400">Non-Compliant / Expired</p>
                  <p className="text-2xl font-bold text-rose-400 mt-1">20</p>
                  <p className="text-[11px] text-rose-400/80 mt-1">Action Required</p>
                </div>
              </div>

              {/* Extracted Document Live Banner */}
              <div className="mt-5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 p-4 border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-600/30 border border-indigo-500/30 text-indigo-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-200">Latest AI Extraction Stream</p>
                    <p className="text-[11px] text-slate-300">
                      Apex Logistics • Commercial General Liability Insurance • <span className="text-emerald-400 font-semibold">Expiry: 15 March 2027</span>
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Status: Pending Human Review</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PROBLEM VS SOLUTION SECTION
          ========================================================================= */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why Legacy Methods Fail
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Compliance Shouldn't Rely on Memory & Inboxes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Old Way */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 sm:p-8 dark:border-rose-900/40 dark:bg-rose-950/10">
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-6">
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">The Chaos of Manual Management</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Missed Expirations:</strong> Policies and licenses expire unnoticed until audit failures or legal liabilities occur.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Endless Email Ping-Pong:</strong> Chasing vendors manually for renewals eats up 20+ hours a month.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Disorganized Cloud Folders:</strong> Document versions get overwritten, losing historical compliance trails.</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Slow Manual Data Entry:</strong> Staff spend minutes typing dates and clauses into spreadsheets.</span>
                </li>
              </ul>
            </div>

            {/* The VendorVault Way */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6 sm:p-8 dark:border-indigo-900/40 dark:bg-indigo-950/10 shadow-lg shadow-indigo-500/5">
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-6">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">The VendorVault Way</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>AI Document Understanding:</strong> LLMs instantly read PDFs, extracting expiry dates, policy types, and risk clauses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Automated Expiry Radar:</strong> 30, 15, 7, and 1-day reminders dispatched automatically to vendors & officers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Immutable Versioning & Audits:</strong> Keep complete history of previous versions with one-click auditor access.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Dynamic Vendor Scoring:</strong> Instant compliance percentages based on required policy checklists.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS (PIPELINE)
          ========================================================================= */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              End-to-End Workflow
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              From Document Upload to Autonomous Expiry Monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-bold text-base mb-2">Vendor Uploads</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Vendors securely submit Insurance, GST, NDAs, or licenses via their dedicated portal into isolated cloud storage.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-indigo-300 bg-indigo-50/40 p-6 dark:border-indigo-800 dark:bg-indigo-950/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mb-4 font-bold text-lg shadow-md shadow-indigo-500/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-base text-indigo-900 dark:text-indigo-200 mb-2">AI Extraction</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Background BullMQ workers & LLMs parse the document, extracting dates, critical clauses, and risk flags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-bold text-base mb-2">Human Verification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Compliance Officers quickly approve or request revision on AI-extracted data with a single click.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4 font-bold text-lg">
                4
              </div>
              <h4 className="font-bold text-base mb-2">Continuous Alerts</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automated cron schedules calculate expiry proximity and trigger emails & in-app alerts at 30, 15, and 7 days.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE FEATURE PLAYGROUND (TABS)
          ========================================================================= */}
      <section id="ai-extraction" className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Deep-Dive Platform Capabilities
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Explore VendorVault's Core Intelligence
            </p>
          </div>

          {/* Tabs Selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={() => setActiveTab('ai-extraction')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'ai-extraction'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="h-4 w-4" />
                AI Extraction Engine
              </button>
              <button
                onClick={() => setActiveTab('expiry-schedule')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'expiry-schedule'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="h-4 w-4" />
                Expiry Radar
              </button>
              <button
                onClick={() => setActiveTab('rbac')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'rbac'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="h-4 w-4" />
                Multi-Role RBAC
              </button>
            </div>
          </div>

          {/* Tab 1 Content: AI Extraction Simulator */}
          {activeTab === 'ai-extraction' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-800/60 rounded-2xl border border-slate-700 p-6 sm:p-8">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase">Input & Processing</span>
                <h3 className="text-2xl font-bold mt-1 mb-4">Understands Documents, Not Just Pixels</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  VendorVault passes uploaded PDF and image tokens through an LLM extraction pipeline. It identifies exact expiry dates, verifies issuer authenticity, and flags high-risk clauses before human approval.
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Handles GST, Insurance, NDAs, Licenses, and MSME certs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Extracts structured JSON payload directly to database</span>
                  </div>
                </div>
              </div>

              {/* Code / JSON Preview */}
              <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-indigo-300 border border-slate-800 overflow-x-auto shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-slate-500">
                  <span>output_extracted_metadata.json</span>
                  <span className="text-emerald-400">99.4% confidence</span>
                </div>
                <pre>{`{
  "documentType": "Commercial General Liability Insurance",
  "issuer": "Liberty Mutual Corp",
  "policyNumber": "GL-889201-99B",
  "effectiveDate": "2026-03-15",
  "expiryDate": "2027-03-15",
  "coverageAmount": "$2,000,000",
  "keyClauses": [
    "Annual audit renewal required",
    "30-day notice of cancellation"
  ],
  "riskFlags": []
}`}</pre>
              </div>
            </div>
          )}

          {/* Tab 2 Content: Expiry Radar */}
          {activeTab === 'expiry-schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-800/60 rounded-2xl border border-slate-700 p-6 sm:p-8">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase">Autonomous Scheduling</span>
                <h3 className="text-2xl font-bold mt-1 mb-4">Zero Missed Expiries, Ever</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  VendorVault calculates expiry proximity continuously. Configurable automated alerts notify both the vendor and your compliance officers via email and in-app feeds.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-slate-300">30 Days Before</span>
                    <span className="text-indigo-400 font-semibold">Gentle Email Reminder</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-slate-300">15 Days Before</span>
                    <span className="text-amber-400 font-semibold">In-App + Email Alert</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-slate-300">7 Days & 1 Day</span>
                    <span className="text-rose-400 font-semibold">Urgent Compliance Escalation</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-6 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Alert Simulation</h4>
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rose-200">Critical Expiry: TechCorp NDA</p>
                    <p className="text-[11px] text-slate-400">Expires in 24 hours. Automated renewal link sent to vendor.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/50 flex items-start gap-3">
                  <MailCheck className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-indigo-200">Reminder Dispatched</p>
                    <p className="text-[11px] text-slate-400">Sent renewal checklist to 14 vendors with expiries this month.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3 Content: RBAC Matrix */}
          {activeTab === 'rbac' && (
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-6 sm:p-8">
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-400 uppercase">Multi-Tenancy & Access</span>
                <h3 className="text-2xl font-bold mt-1">Role-Based Security by Design</h3>
                <p className="text-sm text-slate-300">
                  Granular permissions ensure vendors only see their own files while auditors and compliance teams get dedicated views.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-700 text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Permission</th>
                      <th className="py-3 px-4">Super Admin</th>
                      <th className="py-3 px-4">Compliance Officer</th>
                      <th className="py-3 px-4">Vendor</th>
                      <th className="py-3 px-4">Auditor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="py-3 px-4 font-medium">View All Organization Vendors</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-rose-400">❌</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Upload Compliance Documents</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-rose-400">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Approve / Reject Documents</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-rose-400">❌</td>
                      <td className="py-3 px-4 text-rose-400">❌</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Access Audit Logs & Reports</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                      <td className="py-3 px-4 text-rose-400">❌</td>
                      <td className="py-3 px-4 text-emerald-400">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          5. FEATURES GRID
          ========================================================================= */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Enterprise Feature Matrix
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything Needed to Manage Compliance at Scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 w-fit mb-4">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Document Versioning</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                When renewed policies are uploaded, historical versions remain preserved for compliance audits, never overwritten.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 w-fit mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Dynamic Health Scoring</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically calculates organization and vendor-level compliance scores based on required policy checklists.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 w-fit mb-4">
                <History className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Immutable Audit Trails</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Detailed records of every upload, verification, AI extraction, reminder, and download for strict regulatory review.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 w-fit mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Risk Clause Detection</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                AI flags missing mandatory clauses, low coverage amounts, and unusual termination terms before approval.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 w-fit mb-4">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Multi-Tenant Architecture</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete data isolation with organization-scoped authorization, ensuring confidential documents remain strictly private.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 w-fit mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Signed URLs & S3 Storage</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Time-restricted private signed URLs for document downloads prevent unauthorized link sharing or scrapers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PRICING TIERS
          ========================================================================= */}
      <section id="pricing" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple, Predictable Plans
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Scale Compliance As Your Vendor Network Grows
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Starter */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold">Starter</h4>
                <p className="text-xs text-slate-500 mt-1">For small teams getting started</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$49</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Up to 25 Vendors</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> AI Document Extraction (100 docs/mo)</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Automated Email Expiry Alerts</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Standard Role Access</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 block text-center rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>

            {/* Growth (Featured) */}
            <div className="rounded-2xl border-2 border-indigo-600 bg-indigo-50/20 p-8 dark:bg-indigo-950/20 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                Most Popular
              </div>
              <div>
                <h4 className="text-lg font-bold text-indigo-950 dark:text-indigo-200">Growth</h4>
                <p className="text-xs text-slate-500 mt-1">For growing businesses & mid-market</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$149</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Up to 150 Vendors</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Unlimited AI Extraction & OCR</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Multi-Tier Expiry Schedules</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Auditor Portal & Exportable Logs</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600" /> Custom Compliance Policies</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 block text-center rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-500"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold">Enterprise</h4>
                <p className="text-xs text-slate-500 mt-1">For large organizations with strict audits</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">Custom</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Unlimited Vendors & Storage</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Dedicated BullMQ Extraction Workers</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Custom LLM Fine-Tuning for Clauses</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> SLA & Priority 24/7 Support</li>
                </ul>
              </div>
              <a
                href="mailto:support@vendorvault.io"
                className="mt-8 block text-center rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Contact Sales
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FINAL CTA
          ========================================================================= */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
            Ready to Automate Your Vendor Compliance?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-2xl mx-auto">
            Join organizations preventing compliance gaps, eliminating manual data entry, and streamlining vendor renewals in minutes.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-xl hover:bg-indigo-50 transition-all hover:scale-105"
            >
              <span>Get Started Now — It's Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}