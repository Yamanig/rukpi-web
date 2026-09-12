import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Faint light-gray rail lines behind the device (clarity-mode rail motif). */
function LightRails() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 600 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#E2E8F0" strokeWidth="1" fill="none">
        <path d="M-20 620 C 180 560, 320 420, 620 240" />
        <path d="M-20 540 C 160 480, 340 360, 620 160" />
        <path d="M-20 460 C 140 400, 360 300, 620 80" />
        <path d="M-20 680 C 200 640, 300 500, 620 320" />
      </g>
      <g fill="#CBD5E1">
        <circle cx="180" cy="545" r="3" />
        <circle cx="330" cy="410" r="3" />
        <circle cx="470" cy="300" r="3" />
        <circle cx="150" cy="468" r="3" />
        <circle cx="352" cy="352" r="3" />
      </g>
    </svg>
  );
}

export default function PayHero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set("[data-pay-hero]", { opacity: 1, y: 0, x: 0 });
        return;
      }

      const split = new SplitText(".pay-headline", { type: "chars", mask: "chars" });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".pay-hero-eyebrow", { opacity: 0, y: 12, duration: 0.5 })
        .from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.02 }, 0.1)
        .from(".pay-hero-body", { opacity: 0, y: 24, duration: 0.7 }, 0.5)
        .from(".pay-hero-cta", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, 0.8)
        .from(".pay-hero-micro", { opacity: 0, duration: 0.6 }, 1.0)
        // phone slides in from the right
        .from(".pay-phone-enter", { opacity: 0, x: 80, duration: 1 }, 0.3);

      // idle float (isolated inner wrapper)
      gsap.to(".pay-phone-float", {
        y: -8,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // phone parallaxes slower than copy on scroll
      gsap.to(".pay-phone-parallax", {
        y: 64,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      return () => split.revert();
    },
    { scope },
  );

  const scrollToOnboarding = () => {
    document.getElementById("pay-onboarding")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={scope} className="relative overflow-hidden bg-white text-ltxt">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[55fr_45fr] lg:py-28">
        {/* Copy */}
        <div>
          <p className="pay-hero-eyebrow eyebrow text-teal">RUKPI PAY · CONSUMER WALLET</p>
          <h1 className="pay-headline mt-6 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.03em] text-ltxt sm:text-[56px] lg:text-[72px]">
            Your Money, Unified.
          </h1>
          <p className="pay-hero-body mt-8 max-w-[560px] text-lg leading-[1.6] text-ltxt-sub sm:text-xl">
            One USD balance pooled from every rail you already use — EVC Plus, ZAAD, Sahal,
            e-Dahab, E-BESA, MY-CASH, Premier Wallet, or your bank. Spend it anywhere RUKPI is
            accepted, send it to anyone, and
            watch it build your financial identity.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/contact" className="pay-hero-cta btn-primary group">
              Get the App
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
            <button
              type="button"
              onClick={scrollToOnboarding}
              className="pay-hero-cta group inline-flex cursor-pointer items-center gap-2 rounded-[4px] border border-bordergray px-7 py-3.5 font-sans text-[15px] font-semibold text-ltxt transition-all duration-200 ease-sovereign hover:border-teal hover:text-teal"
            >
              See how it works
              <ArrowDown
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-1"
                strokeWidth={1.5}
              />
            </button>
          </div>
          <p className="pay-hero-micro mt-6 font-mono text-[12px] tracking-[0.08em] text-ltxt-muted">
            MIN. $5 TOP-UP TO ACTIVATE · $0.10 TEST PAYMENT
          </p>
        </div>

        {/* Device */}
        <div className="pay-phone-parallax relative mx-auto w-full max-w-[360px]">
          <LightRails />
          <div className="pay-phone-enter relative" style={{ perspective: "1200px" }}>
            {/* slight 3D tilt on its own wrapper so GSAP float/parallax transforms don't clobber it */}
            <div style={{ transform: "rotateY(-8deg)" }}>
              <div className="pay-phone-float relative">
              {/* soft teal glow beneath */}
              <div
                className="absolute -bottom-10 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full bg-teal/25 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-bordergray bg-ink-0 shadow-[0_32px_80px_rgba(9,13,16,0.18)]">
                <img
                  src="/pay-app-hero.png"
                  alt="RUKPI PAY wallet showing a unified USD balance with funding sources EVC Plus, ZAAD, Sahal, e-Dahab, E-BESA, MY-CASH, Premier Wallet and bank via SIPS"
                  className="block h-auto w-full"
                />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
