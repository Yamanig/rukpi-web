import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Smartphone, Store, UtensilsCrossed, LayoutDashboard, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PRODUCTS = [
  {
    icon: Smartphone,
    name: "RUKPI PAY",
    body: "Consumer wallet — one USD balance across every rail.",
    to: "/products/pay",
  },
  {
    icon: Store,
    name: "RUKPI MERCHANT",
    body: "Merchant portal, analytics, and T+1 settlement.",
    to: "/merchants",
  },
  {
    icon: UtensilsCrossed,
    name: "RUKPI RESTO",
    body: "Restaurant floor, orders, and kitchen display.",
    to: "/merchants#resto",
  },
  {
    icon: LayoutDashboard,
    name: "RUKPI ADMIN",
    body: "Operations, compliance, and ledger oversight.",
    to: "/merchants",
  },
];

export default function Ecosystem() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      gsap.from(".eco-head", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });
      gsap.from(".eco-card", {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".eco-grid", start: "top 78%" },
      });
      gsap.from(".eco-footer", {
        opacity: 0,
        duration: 0.7,
        scrollTrigger: { trigger: ".eco-footer", start: "top 90%" },
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <p className="eco-head eyebrow text-teal">The Ecosystem at a Glance</p>
        <h2 className="eco-head mt-4 max-w-3xl font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ltxt lg:text-5xl">
          One company, four products, one ledger.
        </h2>

        <div className="eco-grid mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <Link
              key={p.name}
              to={p.to}
              className="eco-card group rounded-xl border border-bordergray bg-white p-7 shadow-light-card transition-all duration-300 ease-sovereign hover:-translate-y-1 hover:border-teal"
            >
              <p.icon className="h-6 w-6 text-teal" strokeWidth={1.5} />
              <p className="mt-5 flex items-center gap-1.5 font-mono text-[13px] font-medium tracking-[0.05em] text-ltxt">
                {p.name}
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-teal opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  strokeWidth={1.5}
                />
              </p>
              <p className="mt-2 text-[15px] leading-[1.6] text-ltxt-sub">{p.body}</p>
            </Link>
          ))}
        </div>

        <p className="eco-footer tabular mt-12 text-center font-mono text-[12px] uppercase tracking-[0.08em] text-ltxt-muted">
          ~155M ecosystem transactions/month · sub-100ms · 99.99% target
        </p>
      </div>
    </section>
  );
}
