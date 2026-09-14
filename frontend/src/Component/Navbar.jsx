 import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

/* ============================================================
   NAVIGATION
============================================================ */

const NAV_LINKS = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Features",
    path: "/#features",
  },
  {
    label: "How It Works",
    path: "/#how",
  },
  {
    label: "Pricing",
    path: "/#pricing",
  },
  {
    label: "About",
    path: "/#about",
  },
];

/* ============================================================
   NAVBAR
============================================================ */

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  /* ==========================================================
     SCROLL EFFECT
  ========================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ==========================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ========================================================== */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  /* ==========================================================
     ACTIVE LINK
  ========================================================== */

  const isActive = (link) => {
    /* Home */
    if (link.label === "Home") {
      return location.pathname === "/" && !location.hash;
    }

    /* Section links */
    if (link.path.includes("#")) {
      const hash = link.path.split("#")[1];

      return location.hash === `#${hash}`;
    }

    return location.pathname === link.path;
  };

  /* ==========================================================
     HANDLE SECTION NAVIGATION
  ========================================================== */

  const handleNavClick = (e, path) => {
    /*
      If the user is already on the homepage,
      smoothly scroll to the section.
    */

    if (
      path.includes("#") &&
      location.pathname === "/"
    ) {
      e.preventDefault();

      const id = path.split("#")[1];
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        /*
          Update URL hash without jumping.
        */

        window.history.pushState(
          null,
          "",
          `/#${id}`
        );
      }
    }

    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ======================================================
          NAVBAR
      ======================================================= */}

      <header
        className={`
          fixed
          top-0
          left-0
          right-0
          z-50
          h-[64px]
          transition-all
          duration-500

          ${
            scrolled
              ? `
                border-b
                border-white/[0.07]
                bg-[#06142d]/85
                backdrop-blur-xl
                shadow-[0_8px_30px_rgba(0,0,0,0.18)]
              `
              : `
                bg-transparent
              `
          }
        `}
      >
        <div
          className="
            mx-auto
            flex
            h-full
            max-w-[1280px]
            items-center
            px-5
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          {/* ==================================================
              LEFT — LOGO
          =================================================== */}

          <a
            href="/"
            className="
              group
              flex
              shrink-0
              items-center
              gap-2.5
              transition-opacity
              duration-300
              hover:opacity-90
            "
          >
            {/* Shield */}

            <div
              className="
                relative
                flex
                h-[29px]
                w-[29px]
                items-center
                justify-center
                rounded-[7px]
                bg-white/[0.08]
                ring-1
                ring-white/10
                transition-all
                duration-300
                group-hover:bg-white/[0.12]
                group-hover:ring-white/20
              "
            >
              <ShieldCheck
                className="
                  h-[18px]
                  w-[18px]
                  text-white
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
            </div>

            {/* Brand */}

            <span
              className="
                text-[16px]
                font-semibold
                tracking-[-0.3px]
                text-white
                sm:text-[17px]
              "
            >
              Vendor
              <span className="text-slate-300">
                Vault
              </span>
            </span>
          </a>

          {/* ==================================================
              CENTER — DESKTOP NAV
          =================================================== */}

          <nav
            className="
              absolute
              left-1/2
              hidden
              h-full
              -translate-x-1/2
              items-center
              lg:flex
            "
          >
            <div
              className="
                flex
                h-full
                items-center
                gap-8
                xl:gap-10
              "
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(link);

                return (
                  <a
                    key={link.label}
                    href={link.path}
                    onClick={(e) =>
                      handleNavClick(e, link.path)
                    }
                    className={`
                      group
                      relative
                      flex
                      h-full
                      items-center
                      whitespace-nowrap
                      px-1
                      text-[14px]
                      font-medium
                      tracking-[0.01em]
                      transition-all
                      duration-300

                      xl:text-[15px]

                      ${
                        active
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                      }
                    `}
                  >
                    {link.label}

                    {/* Active / Hover line */}

                    <span
                      className={`
                        absolute
                        bottom-[8px]
                        left-1/2
                        h-[2px]
                        -translate-x-1/2
                        rounded-full
                        bg-gradient-to-r
                        from-blue-500
                        to-violet-500
                        transition-all
                        duration-300

                        ${
                          active
                            ? "w-[22px] opacity-100"
                            : "w-0 opacity-0 group-hover:w-[22px] group-hover:opacity-100"
                        }
                      `}
                    />
                  </a>
                );
              })}
            </div>
          </nav>

          {/* ==================================================
              RIGHT — ACTIONS
          =================================================== */}

          <div
            className="
              ml-auto
              flex
              items-center
              gap-2.5
              sm:gap-3
            "
          >
            {/* ==================================================
                LOGIN
            =================================================== */}

            <a
              href="/login"
              className="
                hidden
                h-[36px]
                items-center
                justify-center
                rounded-[8px]
                border
                border-white/20
                bg-white/[0.025]
                px-4
                text-[13px]
                font-medium
                text-slate-200
                backdrop-blur-sm
                transition-all
                duration-300

                lg:flex
                xl:h-[38px]
                xl:px-[17px]
                xl:text-[14px]

                hover:border-white/35
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-95
              "
            >
              Login
            </a>

            {/* ==================================================
                GET STARTED
            =================================================== */}

            <a
              href="/register"
              className="
                group
                hidden
                h-[36px]
                items-center
                justify-center
                gap-1.5
                rounded-[8px]
                bg-gradient-to-r
                from-[#6d28d9]
                via-[#7c3aed]
                to-[#9333ea]
                px-4
                text-[13px]
                font-semibold
                text-white
                shadow-[0_4px_18px_rgba(124,58,237,0.28)]
                transition-all
                duration-300

                lg:flex
                xl:h-[38px]
                xl:px-[18px]
                xl:text-[14px]

                hover:-translate-y-[1px]
                hover:shadow-[0_7px_25px_rgba(124,58,237,0.38)]
                active:translate-y-0
              "
            >
              <span>
                Get Started
              </span>

              <ArrowRight
                className="
                  h-[13px]
                  w-[13px]
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
              />
            </a>

            {/* ==================================================
                MOBILE MENU BUTTON
            =================================================== */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (prev) => !prev
                )
              }
              className="
                flex
                h-[34px]
                w-[34px]
                items-center
                justify-center
                rounded-[7px]
                border
                border-white/10
                bg-white/[0.04]
                text-slate-200
                transition-all
                duration-300

                lg:hidden

                hover:border-white/20
                hover:bg-white/[0.08]
              "
              aria-label={
                mobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
            >
              {mobileMenuOpen ? (
                <X className="h-[17px] w-[17px]" />
              ) : (
                <Menu className="h-[17px] w-[17px]" />
              )}
            </button>
          </div>
        </div>

        {/* ======================================================
            MOBILE MENU
        ======================================================= */}

        <div
          className={`
            absolute
            left-0
            right-0
            top-[64px]
            overflow-hidden
            border-b
            border-white/[0.07]
            bg-[#06142d]/95
            backdrop-blur-2xl
            shadow-[0_20px_50px_rgba(0,0,0,0.3)]
            transition-all
            duration-300

            lg:hidden

            ${
              mobileMenuOpen
                ? "max-h-[500px] opacity-100"
                : "pointer-events-none max-h-0 opacity-0"
            }
          `}
        >
          <div className="px-5 py-5">
            {/* Mobile Links */}

            <nav className="space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link);

                return (
                  <a
                    key={link.label}
                    href={link.path}
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        link.path
                      )
                    }
                    className={`
                      flex
                      items-center
                      justify-between
                      rounded-lg
                      px-4
                      py-3
                      text-sm
                      font-medium
                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            bg-white/[0.06]
                            text-white
                          `
                          : `
                            text-slate-400
                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    <span>
                      {link.label}
                    </span>

                    {active && (
                      <span
                        className="
                          h-1.5
                          w-1.5
                          rounded-full
                          bg-violet-400
                          shadow-[0_0_8px_rgba(167,139,250,0.7)]
                        "
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Actions */}

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-2
                border-t
                border-white/[0.07]
                pt-4
              "
            >
              {/* Login */}

              <a
                href="/login"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="
                  flex
                  h-[42px]
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/15
                  bg-white/[0.03]
                  text-xs
                  font-medium
                  text-white
                  transition-all
                  hover:bg-white/[0.07]
                "
              >
                Login
              </a>

              {/* Get Started */}

              <a
                href="/register"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="
                  flex
                  h-[42px]
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-gradient-to-r
                  from-[#6d28d9]
                  to-[#9333ea]
                  text-xs
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-violet-600/20
                "
              >
                Get Started

                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}