import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Smartphone, Lock, Fingerprint, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    icon: Smartphone,
    title: "Phone + OTP",
    body: "Enter your +252 number, verify with a 4-digit code. E.164 standard.",
  },
  {
    icon: Lock,
    title: "Set your PIN",
    body: "A 4-digit PIN, device-bound with salted hashing. Never leaves your phone.",
  },
  {
    icon: Fingerprint,
    title: "Add biometrics",
    body: "Optional fingerprint or face unlock for every payment.",
  },
  {
    icon: Zap,
    title: "Top up $5",
    body: "Activate with a minimum $5 top-up. Make a $0.10 test payment to feel the speed.",
  },
];

export default function Onboarding() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(".ob-step", { opacity: 1 });
        gsap.set(".ob-line", { scaleX: 1 });
        gsap.set(".ob-ring", { opacity: 1 });
        return;
      }

      const counter = { v: 1 };
      const counterEl = scope.current?.querySelector(".ob-counter-current");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "+=150%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
        defaults: { ease: "power2.out" },
      });

      // scroll draws the connecting line
      tl.fromTo(".ob-line", { scaleX: 0 }, { scaleX: 1, duration: 4, ease: "none" }, 0);

      // step counter ticks 01 -> 04 in sync
      tl.to(
        counter,
        {
          v: 4,
          duration: 4,
          ease: "none",
          onUpdate: () => {
            if (counterEl) {
              counterEl.textContent = String(Math.max(1, Math.round(counter.v))).padStart(2, "0");
            }
          },
        },
        0,
      );

      // activate each step in sequence
      STEPS.forEach((_, i) => {
        const at = i + 0.05;
        tl.to(`.ob-step-${i}`, { opacity: 1, scale: 1.05, duration: 0.35 }, at).to(
          `.ob-ring-${i}`,
          { opacity: 1, duration: 0.35 },
          at,
        );
        if (i > 0) {
          tl.to(`.ob-step-${i - 1}`, { opacity: 0.4, scale: 1, duration: 0.35 }, at).to(
            `.ob-ring-${i - 1}`,
            { opacity: 0, duration: 0.35 },
            at,
          );
        }
      });

      // tail so the last step holds before unpin
      tl.to({}, { duration: 0.6 });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="pay-onboarding"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-dark-surface py-24"
    >
      <div className="mx-auto w-full max-w-content px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-teal">Onboarding</p>
            <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
              Live in under two minutes.
            </h2>
          </div>
          <p className="font-mono text-sm tracking-[0.1em] text-txt-ter">
            <span className="ob-counter-current text-teal">01</span>
            <span> / 04</span>
          </p>
        </div>

        {/* Progress line */}
        <div className="relative mt-16 h-px w-full bg-ink-4/60" aria-hidden="true">
          <div className="ob-line absolute inset-0 origin-left bg-teal" />
        </div>

        {/* Steps */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={`ob-step ob-step-${i} relative rounded-xl border border-ink-4/60 bg-ink-1 p-6 opacity-40`}
            >
              <div
                className={`ob-ring ob-ring-${i} pointer-events-none absolute -inset-px rounded-xl border border-teal opacity-0 shadow-teal-glow`}
                aria-hidden="true"
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] tracking-[0.1em] text-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.icon className="h-5 w-5 text-txt-sub" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-txt">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-txt-sub">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
