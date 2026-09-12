import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Smartphone, Store, UtensilsCrossed, ShieldCheck } from "lucide-react";

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

function CardShell({
  to,
  className,
  children,
}: {
  to: string | null;
  className: string;
  children: React.ReactNode;
}) {
  const cls = `ledger-card group relative flex overflow-hidden ${className}`;
  return to ? (
    <Link to={to} className={cls}>
      {children}
    </Link>
  ) : (
    <div className={cls}>{children}</div>
  );
}

function ExploreRow({ to }: { to: string | null }) {
  return to ? (
    <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-teal">
      Explore
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        strokeWidth={1.5}
      />
    </span>
  ) : (
    <span className="mt-5 inline-block rounded-md border border-ink-4 px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-txt-ter">
      INTERNAL USE ONLY
    </span>
  );
}

/** Product Ecosystem — full-visual bento grid (21st.dev bento pattern). */
export default function Products() {
  return (
    <section className="bg-dark-surface py-24 lg:py-36">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-teal">Product Ecosystem</p>
          <h2 className="mt-5 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
            Four products. One ledger.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.7] text-txt-sub">
            Every RUKPI product writes to the same append-only ledger — consumers, merchants,
            restaurants, and operators all read from a single source of truth.
          </p>
        </motion.div>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-6"
        >
          {/* RUKPI PAY — hero card, tall */}
          <motion.div variants={card} className="lg:col-span-4 lg:row-span-2">
            <CardShell to="/products/pay" className="h-full flex-col">
              <div className="p-8 pb-0">
                <div className="flex items-center justify-between">
                  <Smartphone className="h-6 w-6 text-teal" strokeWidth={1.5} />
                  <span className="font-mono text-[11px] tracking-[0.08em] text-txt-ter">
                    iOS · ANDROID
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-txt">RUKPI PAY</h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-txt-sub">
                  Your Money, Unified. One balance across every rail — EVC Plus, ZAAD, Sahal,
                  e-Dahab, E-BESA, MY-CASH and Premier Wallet — spendable anywhere.
                </p>
                <ExploreRow to="/products/pay" />
              </div>
              <div className="relative mt-6 min-h-[340px] flex-1 overflow-hidden">
                <div
                  className="absolute left-1/2 top-10 h-24 w-2/3 -translate-x-1/2 rounded-full bg-teal/20 blur-3xl"
                  aria-hidden="true"
                />
                <img
                  src="/pay-app-hero.png"
                  alt="RUKPI PAY app showing a unified USD balance with top-up sources for every rail"
                  loading="lazy"
                  className="absolute left-1/2 top-8 w-[240px] -translate-x-1/2 rounded-[1.6rem] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-sovereign group-hover:-translate-y-2 sm:w-[280px]"
                />
              </div>
            </CardShell>
          </motion.div>

          {/* RUKPI MERCHANT */}
          <motion.div variants={card} className="lg:col-span-2">
            <CardShell to="/merchants" className="h-full flex-col">
              <div className="relative h-44 shrink-0 overflow-hidden">
                <img
                  src="/merchant-dashboard.png"
                  alt="RUKPI MERCHANT portal dashboard with revenue analytics and settlement summary"
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-sovereign group-hover:scale-[1.05]"
                />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-1 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Store className="h-6 w-6 text-teal" strokeWidth={1.5} />
                  <span className="font-mono text-[11px] tracking-[0.08em] text-txt-ter">
                    B2B PORTAL
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-txt">
                  RUKPI MERCHANT
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-txt-sub">
                  Revenue analytics, API keys, transaction grid, and T+1 settlement.
                </p>
                <ExploreRow to="/merchants" />
              </div>
            </CardShell>
          </motion.div>

          {/* RUKPI RESTO */}
          <motion.div variants={card} className="lg:col-span-2">
            <CardShell to="/merchants#resto" className="h-full flex-col">
              <div className="relative h-44 shrink-0 overflow-hidden">
                <img
                  src="/resto-floor.png"
                  alt="RUKPI RESTO floor plan with table status and live order queue"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-sovereign group-hover:scale-[1.05]"
                />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-1 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <UtensilsCrossed className="h-6 w-6 text-teal" strokeWidth={1.5} />
                  <span className="font-mono text-[11px] tracking-[0.08em] text-txt-ter">
                    HOSPITALITY
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-txt">RUKPI RESTO</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-txt-sub">
                  Floor plans, table status, order queue, and a real-time kitchen display.
                </p>
                <ExploreRow to="/merchants#resto" />
              </div>
            </CardShell>
          </motion.div>

          {/* RUKPI ADMIN — wide horizontal card */}
          <motion.div variants={card} className="lg:col-span-6">
            <CardShell to={null} className="h-full flex-col lg:flex-row">
              <div className="p-8 lg:w-[38%] lg:shrink-0">
                <div className="flex items-center justify-between">
                  <ShieldCheck className="h-6 w-6 text-teal" strokeWidth={1.5} />
                  <span className="font-mono text-[11px] tracking-[0.08em] text-txt-ter">
                    INTERNAL
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-txt">RUKPI ADMIN</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-txt-sub">
                  The operator cockpit: system metrics, per-rail circuit breakers, append-only
                  audit log, and health monitors across the whole network.
                </p>
                <ExploreRow to={null} />
              </div>
              <div className="relative min-h-[220px] flex-1 overflow-hidden">
                <img
                  src="/admin-console.png"
                  alt="RUKPI ADMIN operations console with circuit breakers and audit log"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-500 ease-sovereign group-hover:scale-[1.03]"
                />
                <div className="absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-ink-1 to-transparent lg:block" />
              </div>
            </CardShell>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
