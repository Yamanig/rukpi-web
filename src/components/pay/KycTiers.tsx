import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Tier {
  code: string;
  name: string;
  body: ReactNode;
  popular?: boolean;
}

/** Limit figures wrapped so they brighten to teal on card hover. */
function Lim({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.92em] text-ltxt transition-colors duration-300 group-hover:text-teal">
      {children}
    </span>
  );
}

const TIERS: Tier[] = [
  {
    code: "TIER_0",
    name: "Unverified",
    body: "Browse the app. No transactions yet.",
  },
  {
    code: "TIER_1",
    name: "Basic",
    body: (
      <>
        Phone + OTP verification. <Lim>~$100/day</Lim>. Top up from any mobile-money rail.
      </>
    ),
  },
  {
    code: "TIER_2",
    name: "KYC",
    popular: true,
    body: (
      <>
        Government ID with AI analysis (<Lim>&gt;90% confidence</Lim>) plus manual review. Lifted
        limits: <Lim>$5,000</Lim> mobile-money balance, <Lim>$20,000</Lim> bank.
      </>
    ),
  },
  {
    code: "TIER_3",
    name: "Business",
    body: "Full merchant capabilities, API access, settlement accounts.",
  },
];

const STAIR = ["lg:mt-0", "lg:mt-6", "lg:mt-12", "lg:mt-[72px]"];

export default function KycTiers() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".kyc-head", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });
      gsap.from(".kyc-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".kyc-grid", start: "top 80%" },
      });
      // TIER_2 emits a soft teal pulse once on entry
      gsap.fromTo(
        ".kyc-popular",
        { boxShadow: "0 0 0 0 rgba(0,163,161,0.45)" },
        {
          boxShadow: "0 0 0 18px rgba(0,163,161,0)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ".kyc-grid", start: "top 80%" },
        },
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-offwhite py-24 text-ltxt lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kyc-head eyebrow text-teal">KYC Tiers</p>
          <h2 className="kyc-head mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            Limits that grow with you.
          </h2>
          <p className="kyc-head mt-5 text-lg leading-relaxed text-ltxt-sub">
            Start with just a phone number. Verify more, unlock more — each tier lifts what you
            can hold and move.
          </p>
        </div>

        <div className="kyc-grid mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:pb-[72px]">
          {TIERS.map((t, i) => (
            <div
              key={t.code}
              className={`kyc-card group relative rounded-xl bg-white p-6 shadow-light-card transition-transform duration-300 ease-sovereign hover:-translate-y-1.5 ${STAIR[i]} ${
                t.popular
                  ? "kyc-popular border-2 border-teal"
                  : "border border-bordergray"
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-6 rounded-md bg-teal-sweep px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-white">
                  MOST POPULAR
                </span>
              )}
              <p className="font-mono text-[13px] tracking-[0.1em] text-ltxt-muted">{t.code}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{t.name}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ltxt-sub">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
