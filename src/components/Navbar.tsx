import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  Smartphone,
  Gauge,
  Store,
  ArrowRight,
  Zap,
  Code2,
  ShieldCheck,
  Rocket,
} from "lucide-react";

const NAV_LINKS = [{ label: "Contact", to: "/contact" }];

/* Menu item union — `to` for router links, `href` for external/mailto, `soon` for non-links */
type MenuItem = { label: string; to?: string; href?: string; soon?: boolean };
type MenuColumn = { heading: string; items: MenuItem[] };

type OpenMenu = "products" | "resources" | "company" | null;

/* Featured products — icon + name + one-line descriptor (Corefy "Products" col) */
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

/* Grouped capability columns (Corefy Process / Control / Orchestrate pattern) */
const MENU_COLUMNS: MenuColumn[] = [
  {
    heading: "Pay",
    items: [
      { label: "Scan to Pay", to: "/products/pay" },
      { label: "P2P & Checkout", to: "/products/pay" },
      { label: "Top-Up & Cash-In", to: "/products/pay" },
      { label: "Offline Payments", to: "/products/pay" },
      { label: "KYC Tiers", to: "/products/pay" },
    ],
  },
  {
    heading: "Score",
    items: [
      { label: "How Scoring Works", to: "/products/score" },
      { label: "Score Tiers", to: "/products/score" },
      { label: "Explainability", to: "/products/score" },
      { label: "Earned Wage Access", soon: true },
      { label: "RUKPI Card", soon: true },
    ],
  },
  {
    heading: "Merchants",
    items: [
      { label: "Merchant Portal", to: "/merchants" },
      { label: "RESTO", to: "/merchants" },
      { label: "Checkout", to: "/merchants" },
      { label: "Developer API", to: "/merchants" },
    ],
  },
];

/* Resources mega menu — featured column (PRODUCT_LINKS card pattern) */
const RESOURCE_LINKS = [
  {
    icon: Code2,
    name: "Developer API",
    desc: "One REST API across every payment rail.",
    to: "/merchants#api",
  },
  {
    icon: ShieldCheck,
    name: "Security & Trust",
    desc: "How we protect every transaction.",
    to: "/security",
  },
  {
    icon: Rocket,
    name: "Pilot Program",
    desc: "Mogadishu pilot: 50 merchants, 500 wallets.",
    to: "/contact",
  },
];

const RESOURCE_COLUMNS: MenuColumn[] = [
  {
    heading: "Learn",
    items: [
      { label: "How Scoring Works", to: "/products/score" },
      { label: "KYC Tiers", to: "/products/pay" },
      { label: "Offline Payments", to: "/products/pay" },
      { label: "Brand Guidelines", to: "/company" },
    ],
  },
  {
    heading: "Developers",
    items: [
      { label: "Platform Engineering", to: "/technology" },
      { label: "API Overview", to: "/merchants#api" },
      { label: "Checkout", to: "/merchants" },
      { label: "RESTO Integration", to: "/merchants#resto" },
      { label: "OpenAPI Docs", soon: true },
      { label: "SDKs", soon: true },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Contact Us", to: "/contact" },
      { label: "FAQ", to: "/contact" },
      { label: "System Status", soon: true },
      { label: "Service Desk", soon: true },
    ],
  },
];

/* Company dropdown — 2 grouped columns + promo rail (Corefy pattern) */
const COMPANY_COLUMNS: MenuColumn[] = [
  {
    heading: "Company",
    items: [
      { label: "About Us", to: "/company" },
      { label: "Mission & Values", to: "/company" },
      { label: "Roadmap", to: "/company" },
      { label: "Brand", to: "/company" },
      { label: "Media Kit", soon: true },
    ],
  },
  {
    heading: "Get in Touch",
    items: [
      { label: "Contact Us", to: "/contact" },
      { label: "Careers", soon: true },
      { label: "Partnerships", to: "/contact" },
      { label: "press@rukpi.finance", href: "mailto:press@rukpi.finance" },
    ],
  },
];

/* Mobile overlay link groups (mirror desktop menus) */
const MOBILE_RESOURCES: MenuItem[] = [
  { label: "Developer API", to: "/merchants#api" },
  { label: "Security & Trust", to: "/security" },
  { label: "Technology", to: "/technology" },
  { label: "Pilot Program", to: "/contact" },
  { label: "Support", to: "/contact" },
];

const MOBILE_COMPANY: MenuItem[] = [
  { label: "About Us", to: "/company" },
  { label: "Roadmap", to: "/company" },
  { label: "Media Kit", soon: true },
  { label: "Partnerships", to: "/contact" },
];

function SoonBadge() {
  return (
    <span className="rounded-[3px] border border-amber/40 px-1.5 py-px font-mono text-[10px] uppercase tracking-[0.08em] text-amber">
      soon
    </span>
  );
}

/* Grouped link column — heading + link/soon/mailto rows (shared by all menus) */
function ColumnLinks({ col }: { col: MenuColumn }) {
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-txt-ter">
        {col.heading}
      </p>
      <ul className="space-y-2.5">
        {col.items.map((item) =>
          item.soon ? (
            <li
              key={item.label}
              className="flex cursor-default items-center gap-2 text-[13.5px] text-txt-ter"
            >
              {item.label}
              <SoonBadge />
            </li>
          ) : item.href ? (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-[13.5px] text-txt-sub transition-colors hover:text-teal"
              >
                {item.label}
              </a>
            </li>
          ) : (
            <li key={item.label}>
              <Link
                to={item.to!}
                className="text-[13.5px] text-txt-sub transition-colors hover:text-teal"
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

/* Featured card list — icon + name + one-line descriptor (shared by menus) */
function FeaturedCards({
  heading,
  links,
}: {
  heading: string;
  links: typeof PRODUCT_LINKS;
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-txt-ter">
        {heading}
      </p>
      <div className="space-y-1">
        {links.map((p) => (
          <Link
            key={p.name}
            to={p.to}
            className="group/card flex gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-teal/40 hover:bg-ink-3"
          >
            <p.icon
              className="mt-0.5 h-5 w-5 shrink-0 text-teal"
              strokeWidth={1.5}
            />
            <span>
              <span className="block font-mono text-[13px] font-medium tracking-[0.05em] text-txt">
                {p.name}
              </span>
              <span className="mt-1 block text-[12px] leading-snug text-txt-sub">
                {p.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change (render-time state adjustment pattern)
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileOpen(false);
    setOpenMenu(null);
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
          {/* Products mega menu */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("products")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              className="group relative flex items-center gap-1 font-sans text-[15px] font-medium text-txt-sub transition-colors hover:text-txt"
              aria-expanded={openMenu === "products"}
              onClick={() =>
                setOpenMenu((v) => (v === "products" ? null : "products"))
              }
            >
              Products
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${openMenu === "products" ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full" />
            </button>
            <AnimatePresence>
              {openMenu === "products" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 top-full w-[940px] -translate-x-1/2 pt-4"
                >
                  <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-ink-1/95 shadow-teal-edge backdrop-blur-[16px]">
                    {/* Main grid: featured + grouped columns + promo rail */}
                    <div className="grid grid-cols-[240px_1fr_1fr_1fr_220px] gap-x-6 p-5">
                      {/* Featured products */}
                      <FeaturedCards heading="Products" links={PRODUCT_LINKS} />

                      {/* Grouped capability columns */}
                      {MENU_COLUMNS.map((col) => (
                        <ColumnLinks key={col.heading} col={col} />
                      ))}

                      {/* Promo rail (Corefy "Supported integrations" analog) */}
                      <div className="border-l border-white/[0.06] pl-6">
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-txt-ter">
                          The Network
                        </p>
                        <div className="rounded-lg bg-teal-sweep p-4">
                          <p className="font-display text-[26px] font-extrabold leading-none text-white">
                            1 balance
                          </p>
                          <p className="mt-1.5 text-[12px] text-white/80">
                            across every rail
                          </p>
                        </div>
                        <Link
                          to="/company"
                          className="group mt-3.5 flex items-center gap-1.5 font-sans text-[13px] font-semibold text-txt transition-colors hover:text-teal"
                        >
                          How it fits together
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                            strokeWidth={1.5}
                          />
                        </Link>
                        <p className="mt-1.5 text-[12px] leading-snug text-txt-sub">
                          Bank, mobile money and card rails — unified in one
                          ledger.
                        </p>
                      </div>
                    </div>

                    {/* Bottom promo strip (Corefy "Test-drive" card analog) */}
                    <div className="border-t border-white/[0.06] px-5 py-3.5">
                      <Link
                        to="/contact"
                        className="group flex items-center gap-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-sweep">
                          <Zap className="h-4 w-4 text-white" strokeWidth={1.5} />
                        </span>
                        <span>
                          <span className="flex items-center gap-1.5 font-sans text-[13px] font-semibold text-txt transition-colors group-hover:text-teal">
                            Join the pilot
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                              strokeWidth={1.5}
                            />
                          </span>
                          <span className="mt-0.5 block text-[12px] text-txt-sub">
                            We're onboarding first users and merchants in
                            Mogadishu — reserve your spot.
                          </span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resources mega menu */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("resources")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              className="group relative flex items-center gap-1 font-sans text-[15px] font-medium text-txt-sub transition-colors hover:text-txt"
              aria-expanded={openMenu === "resources"}
              onClick={() =>
                setOpenMenu((v) => (v === "resources" ? null : "resources"))
              }
            >
              Resources
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${openMenu === "resources" ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full" />
            </button>
            <AnimatePresence>
              {openMenu === "resources" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 top-full w-[860px] -translate-x-1/2 pt-4"
                >
                  <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-ink-1/95 shadow-teal-edge backdrop-blur-[16px]">
                    {/* Main grid: featured + 3 grouped columns */}
                    <div className="grid grid-cols-[240px_1fr_1fr_1fr] gap-x-6 p-5">
                      <FeaturedCards heading="Resources" links={RESOURCE_LINKS} />
                      {RESOURCE_COLUMNS.map((col) => (
                        <ColumnLinks key={col.heading} col={col} />
                      ))}
                    </div>

                    {/* Bottom promo strip */}
                    <div className="border-t border-white/[0.06] px-5 py-3.5">
                      <Link
                        to="/products/score"
                        className="group flex items-center gap-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-teal-sweep">
                          <Gauge className="h-4 w-4 text-white" strokeWidth={1.5} />
                        </span>
                        <span>
                          <span className="flex items-center gap-1.5 font-sans text-[13px] font-semibold text-txt transition-colors group-hover:text-teal">
                            See how RUKPI SCORE works
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                              strokeWidth={1.5}
                            />
                          </span>
                          <span className="mt-0.5 block text-[12px] text-txt-sub">
                            A 0–1000 credit score built from live transaction
                            telemetry.
                          </span>
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Company dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("company")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              className="group relative flex items-center gap-1 font-sans text-[15px] font-medium text-txt-sub transition-colors hover:text-txt"
              aria-expanded={openMenu === "company"}
              onClick={() =>
                setOpenMenu((v) => (v === "company" ? null : "company"))
              }
            >
              Company
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${openMenu === "company" ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full" />
            </button>
            <AnimatePresence>
              {openMenu === "company" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 top-full w-[620px] -translate-x-1/2 pt-4"
                >
                  <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-ink-1/95 shadow-teal-edge backdrop-blur-[16px]">
                    {/* Main grid: 2 grouped columns + promo rail */}
                    <div className="grid grid-cols-[1fr_1fr_200px] gap-x-6 p-5">
                      {COMPANY_COLUMNS.map((col) => (
                        <ColumnLinks key={col.heading} col={col} />
                      ))}

                      {/* Promo rail */}
                      <div className="border-l border-white/[0.06] pl-6">
                        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-txt-ter">
                          Our Story
                        </p>
                        <div className="rounded-lg bg-teal-sweep p-4">
                          <p className="font-display text-[26px] font-extrabold leading-none text-white">
                            155M
                          </p>
                          <p className="mt-1.5 text-[12px] text-white/80">
                            mobile-money transactions / month
                          </p>
                        </div>
                        <Link
                          to="/company"
                          className="group mt-3.5 flex items-center gap-1.5 font-sans text-[13px] font-semibold text-txt transition-colors hover:text-teal"
                        >
                          Built in Mogadishu, for Pan-Africa
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                            strokeWidth={1.5}
                          />
                        </Link>
                        <p className="mt-1.5 text-[12px] leading-snug text-txt-sub">
                          Meet the team unifying Somalia's payment rails.
                        </p>
                      </div>
                    </div>
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
            className="fixed inset-0 top-[72px] z-40 flex flex-col overflow-y-auto bg-ink-0 px-6 pb-10 pt-6 lg:hidden"
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
                  className="block border-b border-white/[0.06] py-3 font-display text-lg font-semibold text-txt sm:py-3.5 sm:text-xl"
                >
                  {p.name}
                </Link>
              </motion.div>
            ))}

            <p className="eyebrow mb-4 mt-8 text-teal">Resources</p>
            {MOBILE_RESOURCES.map((l, i) => (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * (i + PRODUCT_LINKS.length), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={l.to!}
                  className="block border-b border-white/[0.06] py-3 font-display text-lg font-semibold text-txt sm:py-3.5 sm:text-xl"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}

            <p className="eyebrow mb-4 mt-8 text-teal">Company</p>
            {MOBILE_COMPANY.map((l, i) => (
              <motion.div
                key={l.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * (i + PRODUCT_LINKS.length + MOBILE_RESOURCES.length), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {l.soon ? (
                  <div className="flex cursor-default items-center gap-3 border-b border-white/[0.06] py-4 font-display text-2xl font-bold text-txt-ter">
                    {l.label}
                    <SoonBadge />
                  </div>
                ) : (
                  <Link
                    to={l.to!}
                    className="block border-b border-white/[0.06] py-3 font-display text-lg font-semibold text-txt sm:py-3.5 sm:text-xl"
                  >
                    {l.label}
                  </Link>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * (PRODUCT_LINKS.length + MOBILE_RESOURCES.length + MOBILE_COMPANY.length), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to="/contact"
                className="block border-b border-white/[0.06] py-3 font-display text-lg font-semibold text-txt sm:py-3.5 sm:text-xl"
              >
                Contact
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
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
