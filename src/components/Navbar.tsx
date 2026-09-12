import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, Smartphone, Gauge, Store } from "lucide-react";

const NAV_LINKS = [
  { label: "Company", to: "/company" },
  { label: "Contact", to: "/contact" },
];

const PRODUCT_LINKS = [
  {
    icon: Smartphone,
    name: "RUKPI PAY",
    desc: "Consumer wallet — one balance across every rail.",
    to: "/products/pay",
  },
  {
    icon: Gauge,
    name: "RUKPI SCORE",
    desc: "Credit scoring from live transaction telemetry.",
    to: "/products/score",
  },
  {
    icon: Store,
    name: "For Merchants",
    desc: "Portal, RESTO, checkout and T+1 settlement.",
    to: "/merchants",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change (render-time state adjustment pattern)
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileOpen(false);
    setDropOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[rgba(4,10,11,0.72)] backdrop-blur-[16px]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-full max-w-content items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" aria-label="RUKPI home" className="flex shrink-0 items-center">
          <img
            src="/brand/rukpi-logo-white-transparent.png"
            alt="RUKPI"
            className="h-9 w-auto"
          />
          <span className="ml-2.5 font-display text-lg font-extrabold tracking-[0.08em] text-white">
            RUKPI
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-8 lg:flex">
          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
          >
            <button
              type="button"
              className="group relative flex items-center gap-1 font-sans text-[15px] font-medium text-txt-sub transition-colors hover:text-txt"
              aria-expanded={dropOpen}
              onClick={() => setDropOpen((v) => !v)}
            >
              Products
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full" />
            </button>
            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-4"
                >
                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/[0.08] bg-ink-1/95 p-3 shadow-teal-edge backdrop-blur-[16px]">
                    {PRODUCT_LINKS.map((p) => (
                      <Link
                        key={p.name}
                        to={p.to}
                        className="group/card rounded-lg border border-transparent p-4 transition-colors hover:border-teal/40 hover:bg-ink-3"
                      >
                        <p.icon className="mb-3 h-5 w-5 text-teal" strokeWidth={1.5} />
                        <p className="font-mono text-[13px] font-medium tracking-[0.05em] text-txt">
                          {p.name}
                        </p>
                        <p className="mt-1.5 text-[13px] leading-snug text-txt-sub">{p.desc}</p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `group relative font-sans text-[15px] font-medium transition-colors ${
                  isActive ? "text-txt" : "text-txt-sub hover:text-txt"
                }`
              }
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </div>

        {/* Right cluster */}
        <div className="hidden items-center gap-4 lg:flex">
          <span
            className="cursor-not-allowed rounded-md border border-ink-4 px-2.5 py-1 font-mono text-[12px] tracking-[0.08em] text-txt-ter"
            title="Arabic (RTL) coming soon"
          >
            EN
          </span>
          <Link
            to="/merchants"
            className="rounded-[4px] border border-ink-4 px-4 py-2 font-sans text-[14px] font-semibold text-txt transition-colors hover:border-teal hover:text-teal"
          >
            For Merchants
          </Link>
          <Link to="/contact" className="btn-primary !px-5 !py-2 text-[14px]">
            Get the App
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="text-txt lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[72px] z-40 flex flex-col overflow-y-auto bg-ink-0 px-6 pb-10 pt-8 lg:hidden"
          >
            <p className="eyebrow mb-6 text-teal">Products</p>
            {PRODUCT_LINKS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={p.to}
                  className="block border-b border-white/[0.06] py-4 font-display text-2xl font-bold text-txt"
                >
                  {p.name}
                </Link>
              </motion.div>
            ))}
            {NAV_LINKS.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * (i + PRODUCT_LINKS.length), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={l.to}
                  className="block border-b border-white/[0.06] py-4 font-display text-2xl font-bold text-txt"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-8 flex flex-col gap-3"
            >
              <Link to="/contact" className="btn-primary justify-center">
                Get the App
              </Link>
              <Link to="/merchants" className="btn-ghost justify-center">
                For Merchants
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
