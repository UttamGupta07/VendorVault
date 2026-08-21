 import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Mail,
  ArrowUpRight,
  Lock,
  FileText,
  Server
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-slate-900 text-slate-400 dark:border-slate-800">
      
      {/* TOP SECTION: Main Navigation & Links */}
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand, Value Prop & Live Status */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white">
                    Vendor<span className="text-indigo-400">Vault</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-indigo-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
                    <Sparkles className="h-2.5 w-2.5" /> AI
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              AI-Powered B2B Vendor Compliance & Document-Expiry Management Platform.
              Centralize onboarding, automate LLM metadata extraction, prevent expired certifications, and maintain continuous audit readiness.
            </p>

            {/* Live System Status Pill */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-medium text-[11px]">AI Extraction Workers: Operational</span>
              </div>
            </div>

            {/* Social & Author Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* GitHub */}
              <a
                href="https://github.com/UttamGupta07/VendorVault"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white transition-all"
                aria-label="GitHub Repository"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* LinkedIn (Inline SVG) */}
              <a
                href="https://www.linkedin.com/in/uttam-gupta-33135a327"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white transition-all"
                aria-label="LinkedIn Profile"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:uttamgupta.work@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white transition-all"
                aria-label="Email Contact"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Platform Capabilities */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-slate-200 text-[11px]">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#ai-extraction" className="hover:text-indigo-400 transition-colors">
                  AI Metadata Extraction
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">
                  Autonomous Expiry Radar
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-400 transition-colors">
                  Dynamic Compliance Scoring
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-400 transition-colors">
                  Document Versioning & History
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-400 transition-colors">
                  Immutable Audit Logs
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-indigo-400 transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Solutions & Roles */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-slate-200 text-[11px]">
              Solutions by Role
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">
                  For Super Administrators
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">
                  For Compliance Officers
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">
                  For Vendors & Suppliers
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">
                  For External Auditors
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors flex items-center gap-1 text-indigo-400 font-medium">
                  Multi-Tenancy Demo <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Architecture */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-slate-200 text-[11px]">
              Security & Architecture
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>JWT & RBAC Authorization</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Org-Scoped Multi-Tenancy</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <FileText className="h-3.5 w-3.5 text-emerald-400" />
                <span>S3 Signed Private URLs</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Server className="h-3.5 w-3.5 text-emerald-400" />
                <span>BullMQ & Redis Workers</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR: Author Attribution, Rights & Tech Stack */}
      <div className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-1.5">
            <span>© {currentYear} VendorVault. Built for Enterprise Compliance.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Designed & Developed by</span>
            <a
              href="https://www.linkedin.com/in/uttam-gupta-33135a327"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-slate-300 hover:text-indigo-400 underline decoration-slate-700 underline-offset-2 transition-colors"
            >
              Uttam Gupta
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">CSE (AI/ML)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Whitepaper</span>
          </div>

        </div>
      </div>

    </footer>
  );
}