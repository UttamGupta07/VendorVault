 import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import {
  ShieldCheck,
  Sparkles,
  Bell,
  Users,
  Lock,
  FileText,
  BrainCircuit,
  ArrowRight,
  Play,
  CheckCircle2,
  Clock3,
  Shield,
  Upload,
  FileSearch,
  LayoutDashboard,
  Zap,
} from "lucide-react";

/* ============================================================
   DESIGN SYSTEM
============================================================ */

const COLORS = {
  navy: "#06142d",
  navyLight: "#0b1d3a",
  blue: "#2563eb",
  violet: "#7c3aed",
  purple: "#9333ea",
  text: "#ffffff",
  textSoft: "#94a3b8",
  border: "rgba(255,255,255,0.10)",
};

/* ============================================================
   FONT LOADER
============================================================ */

function Fonts() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap"
    />
  );
}

/* ============================================================
   SCROLL ANIMATION
============================================================ */

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(35px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   BACKGROUND EFFECT
============================================================ */

function BackgroundEffects() {
  return (
    <>
      <div
        className="
          pointer-events-none
          absolute
          -top-40
          -left-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-600/10
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          top-20
          right-[-200px]
          h-[600px]
          w-[600px]
          rounded-full
          bg-violet-600/10
          blur-[150px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)]
          [background-size:32px_32px]
        "
      />
    </>
  );
}

/* ============================================================
   HERO DASHBOARD / DOCUMENT VISUAL
============================================================ */

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">

      {/* Glow */}
      <div
        className="
          absolute
          inset-10
          rounded-full
          bg-blue-500/20
          blur-[100px]
        "
      />

      {/* Main glass panel */}
      <div
        className="
          relative
          rounded-2xl
          border
          border-white/10
          bg-white/[0.07]
          p-3
          shadow-[0_30px_100px_rgba(0,0,0,0.45)]
          backdrop-blur-xl

          animate-[float_6s_ease-in-out_infinite]
        "
      >
        {/* Fake dashboard header */}
        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-white/10
            bg-[#091a35]
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                bg-gradient-to-br
                from-blue-500
                to-violet-600
              "
            >
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>

            <span className="text-xs font-semibold text-white">
              VendorVault
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-400">
              Compliance Officer
            </span>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="mt-3 grid grid-cols-[110px_1fr] gap-3">

          {/* Sidebar */}
          <div
            className="
              rounded-xl
              border
              border-white/10
              bg-[#081932]
              p-3
            "
          >
            <div className="mb-5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-[9px] font-semibold text-slate-300">
                Dashboard
              </span>
            </div>

            {[
              { icon: LayoutDashboard, text: "Dashboard", active: true },
              { icon: Users, text: "Vendors" },
              { icon: FileText, text: "Documents" },
              { icon: Bell, text: "Alerts" },
              { icon: Shield, text: "Reports" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className={`
                    mb-2
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    px-2
                    py-2

                    ${
                      item.active
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-slate-500"
                    }
                  `}
                >
                  <Icon className="h-3 w-3" />

                  <span className="text-[8px]">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dashboard content */}
          <div className="space-y-3">

            {/* Greeting */}
            <div>
              <p className="text-[9px] text-slate-500">
                Good morning,
              </p>

              <p className="text-sm font-semibold text-white">
                Compliance Officer 👋
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <MiniStat
                value="48"
                label="Vendors"
              />

              <MiniStat
                value="36"
                label="Compliant"
              />

              <MiniStat
                value="6"
                label="At Risk"
              />
            </div>

            {/* Content */}
            <div className="grid grid-cols-[1fr_110px] gap-2">

              {/* Expiry list */}
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-[#091a35]
                  p-3
                "
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-white">
                    Upcoming Expiries
                  </span>

                  <span className="text-[8px] text-blue-400">
                    View All
                  </span>
                </div>

                <ExpiryRow
                  icon={FileText}
                  title="GST Certificate"
                  vendor="ABC Fooding"
                  days="7 days"
                />

                <ExpiryRow
                  icon={Shield}
                  title="Insurance Policy"
                  vendor="FreshMart Supplies"
                  days="15 days"
                />

                <ExpiryRow
                  icon={FileText}
                  title="License Agreement"
                  vendor="Global Services"
                  days="30 days"
                />
              </div>

              {/* Score */}
              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-[#091a35]
                  p-3
                "
              >
                <span className="text-[8px] text-slate-400">
                  Compliance Score
                </span>

                <div className="relative mx-auto mt-4 flex h-20 w-20 items-center justify-center">

                  <svg
                    className="absolute inset-0 h-full w-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="8"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="251"
                      strokeDashoffset="30"
                    />
                  </svg>

                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      92%
                    </div>

                    <div className="text-[7px] text-slate-500">
                      Overall
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating extraction notification */}

      <div
        className="
          absolute
          -bottom-7
          -left-10

          flex
          items-center
          gap-3

          rounded-xl
          border
          border-white/10

          bg-[#0b1d3a]/90

          px-4
          py-3

          shadow-2xl
          backdrop-blur-xl

          animate-[float_5s_ease-in-out_infinite_1s]
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            bg-blue-500/15
          "
        >
          <BrainCircuit className="h-5 w-5 text-blue-400" />
        </div>

        <div>
          <p className="text-[10px] font-semibold text-white">
            AI Extraction Complete
          </p>

          <p className="text-[9px] text-slate-500">
            Expiry date detected
          </p>
        </div>

        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      </div>

      {/* Floating alert */}

      <div
        className="
          absolute
          -right-8
          top-14

          flex
          items-center
          gap-2

          rounded-lg

          border
          border-red-400/20

          bg-[#111d34]/95

          px-3
          py-2

          shadow-xl

          backdrop-blur-xl
        "
      >
        <Bell className="h-3.5 w-3.5 text-red-400" />

        <div>
          <p className="text-[8px] font-semibold text-white">
            Expiring in 7 days
          </p>

          <p className="text-[7px] text-slate-500">
            GST Registration Certificate
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SMALL DASHBOARD COMPONENTS
============================================================ */

function MiniStat({ value, label }) {
  return (
    <div
      className="
        rounded-lg
        border
        border-white/10
        bg-white/[0.025]
        p-2
      "
    >
      <div className="text-sm font-bold text-white">
        {value}
      </div>

      <div className="text-[7px] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function ExpiryRow({
  icon: Icon,
  title,
  vendor,
  days,
}) {
  return (
    <div className="mb-2 flex items-center gap-2">

      <div
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-md
          bg-orange-500/10
        "
      >
        <Icon className="h-3 w-3 text-orange-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[8px] font-medium text-white">
          {title}
        </p>

        <p className="truncate text-[7px] text-slate-500">
          {vendor}
        </p>
      </div>

      <span className="text-[7px] text-orange-400">
        {days}
      </span>
    </div>
  );
}

/* ============================================================
   HERO
============================================================ */

function Hero() {
  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden

        flex
        items-center

        bg-[#06142d]
      "
    >

      <BackgroundEffects />

      {/* Building background */}
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          opacity-[0.18]
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80')",
        }}
      />

      {/* Dark overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#06142d]
          via-[#06142d]/95
          to-[#06142d]/70
        "
      />

      {/* Bottom fade */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-40
          bg-gradient-to-t
          from-[#06142d]
          to-transparent
        "
      />

      <div
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-7xl

          px-6
          pb-24
          pt-28

          lg:px-8
          lg:pt-32
        "
      >
        <div
          className="
            grid
            items-center
            gap-16
            lg:grid-cols-[0.9fr_1.1fr]
          "
        >

          {/* ==================================================
              LEFT CONTENT
          =================================================== */}

          <div>

            <Reveal>

              {/* Eyebrow */}

              <div
                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2

                  rounded-full
                  border
                  border-blue-400/20

                  bg-blue-500/[0.07]

                  px-3
                  py-1.5
                "
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-blue-300
                  "
                >
                  B2B Compliance Made Effortless
                </span>
              </div>

              {/* Heading */}

              <h1
                className="
                  max-w-2xl

                  text-4xl
                  font-extrabold
                  leading-[1.08]
                  tracking-[-0.04em]

                  text-white

                  sm:text-5xl
                  lg:text-[62px]
                "
                style={{
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                From Document Chaos
                <br />

                <span
                  className="
                    bg-gradient-to-r
                    from-blue-400
                    via-indigo-400
                    to-violet-400

                    bg-clip-text
                    text-transparent
                  "
                >
                  to Complete Compliance
                </span>
              </h1>

              {/* Description */}

              <p
                className="
                  mt-7
                  max-w-xl

                  text-base
                  leading-7

                  text-slate-400

                  sm:text-lg
                "
              >
                Let VendorVault handle the paperwork.
                Extract important details, track expiries,
                send reminders and keep your vendors compliant
                — automatically.
              </p>

              {/* CTA */}

              <div className="mt-9 flex flex-wrap items-center gap-4">

                <Link
                  to="/register"
                  className="
                    group

                    inline-flex
                    items-center
                    gap-2

                    rounded-lg

                    bg-gradient-to-r
                    from-violet-600
                    to-purple-500

                    px-6
                    py-3.5

                    text-sm
                    font-semibold
                    text-white

                    shadow-lg
                    shadow-violet-600/25

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:shadow-xl
                    hover:shadow-violet-600/30
                  "
                >
                  Get Started Free

                  <ArrowRight
                    className="
                      h-4
                      w-4

                      transition-transform
                      duration-300

                      group-hover:translate-x-1
                    "
                  />
                </Link>

                <a
                  href="#how"
                  className="
                    group

                    inline-flex
                    items-center
                    gap-2

                    rounded-lg

                    border
                    border-white/20

                    bg-white/[0.03]

                    px-6
                    py-3.5

                    text-sm
                    font-medium
                    text-white

                    backdrop-blur-sm

                    transition-all
                    duration-300

                    hover:border-white/40
                    hover:bg-white/[0.08]
                  "
                >
                  <span
                    className="
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-white/20
                    "
                  >
                    <Play className="ml-0.5 h-3 w-3 fill-current" />
                  </span>

                  Watch Demo
                </a>

              </div>

              {/* Trust features */}

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3">

                <HeroTrust
                  icon={BrainCircuit}
                  text="AI-Powered Extraction"
                />

                <HeroTrust
                  icon={Clock3}
                  text="Automated Alerts"
                />

                <HeroTrust
                  icon={Users}
                  text="Multi-Role Access"
                />

                <HeroTrust
                  icon={Lock}
                  text="Secure & Reliable"
                />

              </div>

            </Reveal>
          </div>

          {/* ==================================================
              RIGHT VISUAL
          =================================================== */}

          <Reveal delay={180}>
            <HeroVisual />
          </Reveal>

        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HERO TRUST ITEM
============================================================ */

function HeroTrust({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2">

      <div
        className="
          flex
          h-6
          w-6
          items-center
          justify-center

          rounded-full

          border
          border-white/10

          bg-white/[0.04]
        "
      >
        <Icon className="h-3 w-3 text-blue-400" />
      </div>

      <span className="text-[10px] text-slate-400">
        {text}
      </span>
    </div>
  );
}

/* ============================================================
   STAT STRIP
============================================================ */

function StatStrip() {
  const stats = [
    {
      value: "38 hrs",
      label: "saved per month on manual document review",
      icon: Clock3,
    },
    {
      value: "30 / 15 / 7",
      label: "day alert windows before every expiry",
      icon: Bell,
    },
    {
      value: "100%",
      label: "of uploads logged to an immutable audit trail",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative border-y border-white/[0.07] bg-[#07172f]">

      <div className="mx-auto grid max-w-7xl gap-px px-6 sm:grid-cols-3 lg:px-8">

        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Reveal key={stat.value} delay={index * 100}>

              <div
                className="
                  group
                  flex
                  items-center
                  gap-4
                  px-5
                  py-8

                  transition-colors
                  duration-300

                  hover:bg-white/[0.025]
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-blue-400/10

                    bg-blue-500/[0.07]
                  "
                >
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>

                <div>

                  <div className="text-xl font-bold text-white">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    {stat.label}
                  </div>

                </div>
              </div>

            </Reveal>
          );
        })}

      </div>
    </section>
  );
}

/* ============================================================
   FEATURE CARD
============================================================ */

function FeatureCard({
  icon: Icon,
  number,
  title,
  children,
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden

        rounded-2xl

        border
        border-white/[0.08]

        bg-white/[0.035]

        p-7

        backdrop-blur-sm

        transition-all
        duration-500

        hover:-translate-y-2
        hover:border-blue-400/20
        hover:bg-white/[0.055]

        hover:shadow-2xl
        hover:shadow-blue-900/10
      "
    >

      {/* Hover glow */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20

          h-40
          w-40

          rounded-full

          bg-blue-500/10

          blur-3xl

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100
        "
      />

      {/* Number */}

      <div className="absolute right-6 top-5 text-xs font-semibold text-slate-700">
        {number}
      </div>

      {/* Icon */}

      <div
        className="
          mb-6
          flex
          h-12
          w-12
          items-center
          justify-center

          rounded-xl

          border
          border-blue-400/10

          bg-gradient-to-br
          from-blue-500/15
          to-violet-500/10

          transition-transform
          duration-500

          group-hover:scale-110
        "
      >
        <Icon className="h-5 w-5 text-blue-400" />
      </div>

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {children}
      </p>
    </div>
  );
}

/* ============================================================
   FEATURES
============================================================ */

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#06142d] py-24 sm:py-32"
    >

      <BackgroundEffects />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

        <Reveal>

          <div className="max-w-2xl">

            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2

                rounded-full
                border
                border-blue-400/10

                bg-blue-500/[0.06]

                px-3
                py-1.5
              "
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                What's inside VendorVault
              </span>
            </div>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white

                sm:text-4xl
              "
            >
              Everything you need for
              <span className="text-blue-400">
                {" "}vendor compliance.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400">
              From document uploads to expiry alerts, VendorVault
              brings your entire vendor compliance workflow into
              one secure platform.
            </p>

          </div>

        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">

          <Reveal delay={100}>
            <FeatureCard
              number="01"
              icon={BrainCircuit}
              title="AI Document Extraction"
            >
              Upload a PDF and automatically extract document
              type, expiry date, document number and important
              clauses in seconds.
            </FeatureCard>
          </Reveal>

          <Reveal delay={180}>
            <FeatureCard
              number="02"
              icon={Bell}
              title="Proactive Expiry Alerts"
            >
              Get automated reminders before documents expire,
              with configurable 30, 15 and 7 day alert windows.
            </FeatureCard>
          </Reveal>

          <Reveal delay={260}>
            <FeatureCard
              number="03"
              icon={LayoutDashboard}
              title="Compliance Dashboard"
            >
              Track vendor status, compliance scores, pending
              reviews, expiring documents and issues from one
              dashboard.
            </FeatureCard>
          </Reveal>

          <Reveal delay={100}>
            <FeatureCard
              number="04"
              icon={Users}
              title="Role-Based Access"
            >
              Separate access for Super Admins, Compliance
              Officers, Vendors and Auditors.
            </FeatureCard>
          </Reveal>

          <Reveal delay={180}>
            <FeatureCard
              number="05"
              icon={Lock}
              title="Secure & Reliable"
            >
              HTTP-only authentication, encrypted data handling
              and controlled access keep sensitive vendor
              information protected.
            </FeatureCard>
          </Reveal>

          <Reveal delay={260}>
            <FeatureCard
              number="06"
              icon={FileText}
              title="Document Management"
            >
              Keep vendor documents organized with approval
              status, expiry information and compliance tracking.
            </FeatureCard>
          </Reveal>

        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
============================================================ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Upload,
      title: "Vendor uploads a document",
      body:
        "Vendors upload their licenses, certificates, insurance documents and other required files through the self-service portal.",
    },
    {
      n: "02",
      icon: BrainCircuit,
      title: "VendorVault reads it",
      body:
        "AI extraction identifies the document type, expiry date and important information automatically.",
    },
    {
      n: "03",
      icon: FileSearch,
      title: "Your team reviews it",
      body:
        "Compliance Officers review extracted information and approve or reject documents when required.",
    },
    {
      n: "04",
      icon: Bell,
      title: "Everyone gets notified",
      body:
        "Automated alerts notify vendors and compliance teams before important documents expire.",
    },
  ];

  return (
    <section
      id="how"
      className="
        relative
        overflow-hidden

        border-y
        border-white/[0.07]

        bg-[#07172f]

        py-24
        sm:py-32
      "
    >

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <Reveal>

          <div className="max-w-2xl">

            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2

                rounded-full
                border
                border-violet-400/10

                bg-violet-500/[0.06]

                px-3
                py-1.5
              "
            >
              <Zap className="h-3.5 w-3.5 text-violet-400" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                Simple. Secure. Automated.
              </span>
            </div>

            <h2
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white

                sm:text-4xl
              "
            >
              How VendorVault
              <span className="text-violet-400">
                {" "}works.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-400">
              Replace manual spreadsheets and endless email
              follow-ups with a simple automated compliance workflow.
            </p>

          </div>

        </Reveal>

        {/* Steps */}

        <div className="mt-16 grid gap-4 lg:grid-cols-4">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Reveal
                key={step.n}
                delay={index * 120}
              >
                <div className="group relative h-full">

                  {/* connector */}

                  {index !== steps.length - 1 && (
                    <div
                      className="
                        absolute
                        right-[-18px]
                        top-10
                        z-10
                        hidden
                        h-px
                        w-8
                        bg-gradient-to-r
                        from-blue-500/40
                        to-transparent
                        lg:block
                      "
                    />
                  )}

                  <div
                    className="
                      h-full
                      rounded-2xl
                      border
                      border-white/[0.08]

                      bg-[#091a35]

                      p-6

                      transition-all
                      duration-500

                      group-hover:-translate-y-2
                      group-hover:border-blue-400/20
                      group-hover:shadow-xl
                      group-hover:shadow-blue-900/10
                    "
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center

                          rounded-xl

                          bg-gradient-to-br
                          from-blue-500/15
                          to-violet-500/15

                          border
                          border-white/10
                        "
                      >
                        <Icon className="h-5 w-5 text-blue-400" />
                      </div>

                      <span className="text-3xl font-bold text-white/[0.06]">
                        {step.n}
                      </span>

                    </div>

                    <h3 className="mt-7 text-base font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {step.body}
                    </p>

                  </div>
                </div>
              </Reveal>
            );
          })}

        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA
============================================================ */

function CTABand() {
  return (
    <section
      id="start"
      className="
        relative
        overflow-hidden

        bg-[#06142d]

        py-28
      "
    >

      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2

          h-[500px]
          w-[700px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-violet-600/10

          blur-[130px]
        "
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">

        <Reveal>

          <div
            className="
              mx-auto
              mb-5

              flex
              h-12
              w-12

              items-center
              justify-center

              rounded-xl

              border
              border-blue-400/10

              bg-blue-500/10
            "
          >
            <ShieldCheck className="h-6 w-6 text-blue-400" />
          </div>

          <h2
            className="
              text-3xl
              font-bold
              tracking-tight
              text-white

              sm:text-4xl
              lg:text-5xl
            "
          >
            Your vendor documents are already expiring.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Don't wait for an audit to discover missing or expired
            documents. Start managing vendor compliance proactively
            with VendorVault.
          </p>

          <Link
            to="/register"
            className="
              group
              mt-9

              inline-flex
              items-center
              gap-2

              rounded-lg

              bg-gradient-to-r
              from-blue-600
              to-violet-600

              px-7
              py-3.5

              text-sm
              font-semibold
              text-white

              shadow-xl
              shadow-blue-600/20

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-2xl
              hover:shadow-violet-600/25
            "
          >
            Get Started Free

            <ArrowRight
              className="
                h-4
                w-4

                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            />
          </Link>

          <div className="mt-6 flex items-center justify-center gap-5">

            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              No credit card required
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Setup in minutes
            </div>

          </div>

        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   HOME
============================================================ */

export default function Home() {
  return (
    <div
      className="
        min-h-screen
        overflow-hidden
        bg-[#06142d]
        text-white
      "
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >

      <Fonts />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        html {
          scroll-behavior: smooth;
        }

        ::selection {
          background: rgba(124, 58, 237, 0.5);
          color: white;
        }
      `}</style>

      <Hero />

      <StatStrip />

      <Features />

      <HowItWorks />

      <CTABand />

    </div>
  );
}