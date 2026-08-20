

import { Link } from "react-router-dom";

const COLORS = {
  paper: "#EDEAE0",
  paperCard: "#F5F3EB",
  ink: "#1C2B3A",
  inkSoft: "#54636F",
  rule: "#C9C2AE",
  brass: "#A8792C",
  brassDark: "#8B631F",
  rust: "#A6402B",
  forest: "#33604F",
};

function Fonts() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
    />
  );
}

function Stamp() {
  return (
    <div
      className="motion-safe:animate-[stampIn_0.6s_ease-out_0.4s_both] absolute -right-4 -top-3 select-none"
      style={{
        border: `3px double ${COLORS.rust}`,
        color: COLORS.rust,
        borderRadius: "9999px",
        padding: "10px 16px",
        transform: "rotate(-9deg)",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <div className="text-[11px] font-medium tracking-[0.18em] text-center leading-tight">
        VERIFIED
        <br />
        EXP 14 MAR 27
      </div>
    </div>
  );
}

function DocCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <style>{`
        @keyframes stampIn {
          from { opacity: 0; transform: rotate(-9deg) scale(1.6); }
          to { opacity: 1; transform: rotate(-9deg) scale(1); }
        }
      `}</style>
      <div
        className="relative rounded-sm p-6 pt-8"
        style={{
          background: COLORS.paperCard,
          border: `1px solid ${COLORS.rule}`,
          boxShadow: "0 20px 40px -24px rgba(28,43,58,0.35)",
        }}
      >
        <Stamp />
        <div
          className="text-[11px] tracking-[0.14em] uppercase mb-4"
          style={{ color: COLORS.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Doc #VN-2291 &middot; Insurance certificate
        </div>
        {[100, 92, 96, 70, 88, 60].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full mb-3"
            style={{ width: `${w}%`, background: COLORS.rule, opacity: 0.7 }}
          />
        ))}
        <div
          className="mt-5 pt-4 flex items-center justify-between"
          style={{ borderTop: `1px solid ${COLORS.rule}` }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.12em]"
            style={{ color: COLORS.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Extracted expiry
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: COLORS.rust, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            14 Mar 2027
          </span>
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div
          className="text-lg tracking-tight"
          style={{ fontFamily: "'Newsreader', serif", color: COLORS.ink, fontWeight: 600 }}
        >
          VendorVault
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: COLORS.inkSoft }}>
          <a href="#features" className="hover:opacity-70">Product</a>
          <a href="#how" className="hover:opacity-70">How it works</a>
          <a href="#pricing" className="hover:opacity-70">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#login" className="text-sm hidden sm:inline" style={{ color: COLORS.inkSoft }}>
            Log in
          </a>
          <Link
          className="text-sm px-4 py-2 rounded-sm text-white"
            style={{ background: COLORS.brass }}
            to="/organization-register"
          >
          Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-8 pb-20 md:pt-16 md:pb-28 grid md:grid-cols-2 gap-14 items-center">
      <div>
        <div
          className="text-xs uppercase tracking-[0.18em] mb-5"
          style={{ color: COLORS.brassDark, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Vendor compliance, automated
        </div>
        <h1
          className="text-4xl md:text-5xl leading-[1.1] mb-6"
          style={{ fontFamily: "'Newsreader', serif", color: COLORS.ink, fontWeight: 500 }}
        >
          Stop finding out a license expired after the audit does.
        </h1>
        <p className="text-base md:text-lg mb-9 max-w-md" style={{ color: COLORS.inkSoft }}>
          VendorVault reads every contract, license, and certificate you upload —
          pulls out the expiry date and the risk clauses — and tells you weeks
          before it matters.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#start"
            className="px-6 py-3 rounded-sm text-white text-sm"
            style={{ background: COLORS.brass }}
          >
            Start tracking vendors
          </a>
          <a
            href="#how"
            className="px-6 py-3 rounded-sm text-sm"
            style={{ color: COLORS.ink, border: `1px solid ${COLORS.rule}` }}
          >
            See how extraction works
          </a>
        </div>
      </div>
      <DocCard />
    </section>
  );
}

function StatStrip() {
  const stats = [
    { value: "38 hrs", label: "saved per month on manual document review" },
    { value: "30 / 15 / 7", label: "day alert windows before every expiry" },
    { value: "100%", label: "of uploads logged to an immutable audit trail" },
  ];
  return (
    <section
      className="border-y"
      style={{ borderColor: COLORS.rule, background: COLORS.paperCard }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <div key={i}>
            <div
              className="text-2xl mb-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.ink }}
            >
              {s.value}
            </div>
            <div className="text-sm" style={{ color: COLORS.inkSoft }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureTab({ letter, title, color, children }) {
  return (
    <div
      className="relative pt-9 px-6 pb-7 rounded-sm"
      style={{ background: COLORS.paperCard, border: `1px solid ${COLORS.rule}` }}
    >
      <div
        className="absolute -top-3 left-6 px-3 py-1 text-xs tracking-widest rounded-sm text-white"
        style={{ background: color, fontFamily: "'IBM Plex Mono', monospace" }}
      >
        TAB {letter}
      </div>
      <h3
        className="text-lg mb-3"
        style={{ fontFamily: "'Newsreader', serif", color: COLORS.ink, fontWeight: 600 }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
        {children}
      </p>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-lg mb-12">
        <div
          className="text-xs uppercase tracking-[0.18em] mb-3"
          style={{ color: COLORS.brassDark, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          What's inside the vault
        </div>
        <h2
          className="text-3xl"
          style={{ fontFamily: "'Newsreader', serif", color: COLORS.ink, fontWeight: 500 }}
        >
          Three tabs, one filing system.
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        <FeatureTab letter="A" title="Auto-extraction" color={COLORS.brass}>
          Upload a PDF. Get back a structured record — document type, expiry
          date, key clauses — in seconds, not a read-through.
        </FeatureTab>
        <FeatureTab letter="B" title="Alert engine" color={COLORS.rust}>
          Configurable reminders reach the right person before a license
          lapses, not after a vendor calls to say it already has.
        </FeatureTab>
        <FeatureTab letter="C" title="Audit trail" color={COLORS.forest}>
          Every upload, edit, and approval is logged. When an auditor asks
          "prove it," export the trail instead of searching your inbox.
        </FeatureTab>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Vendor uploads a document",
      body: "Self-serve portal — no email attachments, no chasing a supplier for the current insurance certificate.",
    },
    {
      n: "2",
      title: "VendorVault reads it",
      body: "Extraction pulls the expiry date, document type, and risk flags. Anything it isn't confident about gets flagged for a person, never guessed.",
    },
    {
      n: "3",
      title: "Your team gets ahead of it",
      body: "The dashboard shows what's expiring this month. Alerts fire on their own — nobody has to remember to check.",
    },
  ];
  return (
    <section
      id="how"
      className="border-y"
      style={{ borderColor: COLORS.rule, background: COLORS.paperCard }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2
          className="text-3xl mb-14 max-w-lg"
          style={{ fontFamily: "'Newsreader', serif", color: COLORS.ink, fontWeight: 500 }}
        >
          From inbox chaos to one dashboard, in three steps.
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.n}>
              <div
                className="text-4xl mb-4"
                style={{ fontFamily: "'Newsreader', serif", color: COLORS.brass, fontWeight: 500 }}
              >
                {s.n}
              </div>
              <h3
                className="text-base mb-2"
                style={{ color: COLORS.ink, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
              >
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 text-center">
      <h2
        className="text-3xl md:text-4xl mb-6 max-w-2xl mx-auto"
        style={{ fontFamily: "'Newsreader', serif", color: COLORS.ink, fontWeight: 500 }}
      >
        Your vendor documents are already expiring. You just don't know when.
      </h2>
      <a
        href="#start"
        className="inline-block px-7 py-3 rounded-sm text-white text-sm mt-4"
        style={{ background: COLORS.brass }}
      >
        Get started free
      </a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: COLORS.rule }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div
          className="text-sm"
          style={{ fontFamily: "'Newsreader', serif", color: COLORS.ink, fontWeight: 600 }}
        >
          VendorVault
        </div>
        <div className="text-xs" style={{ color: COLORS.inkSoft }}>
          Every document, one filing system, zero missed expiries.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div style={{ background: COLORS.paper, minHeight: "100%" }}>
      <Fonts />
      <NavBar />
      <Hero />
      <StatStrip />
      <Features />
      <HowItWorks />
      <CTABand />
      <Footer />
    </div>
  );
}