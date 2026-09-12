import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Lock, ShieldCheck, KeyRound, ListOrdered } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ITEMS = [
  { icon: Lock, label: "TLS 1.3 ONLY", desc: "Exclusively modern transport encryption" },
  { icon: ShieldCheck, label: "AES-256-GCM", desc: "Encryption at rest" },
  { icon: KeyRound, label: "ED25519 + HSM", desc: "Hardware-backed signing keys" },
  { icon: ListOrdered, label: "APPEND-ONLY LEDGER", desc: "Every state transition journaled" },
];

export default function SecurityStrip() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      gsap.from(".sec-item", {
        opacity: 0,
        x: -24,
        duration: 0.6,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 80%" },
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="border-y border-white/[0.06] bg-ink-1 py-16">
      <div className="relative mx-auto max-w-content overflow-hidden px-6">
        {/* scanning teal line */}
        <div
          className="pointer-events-none absolute inset-y-0 w-1/4 animate-scan-line bg-gradient-to-r from-transparent via-teal to-transparent"
          aria-hidden="true"
        />
        <div className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {ITEMS.map((it) => (
            <div key={it.label} className="sec-item flex items-start gap-4 px-2 py-6 lg:px-8 lg:py-2">
              <it.icon className="mt-0.5 h-6 w-6 shrink-0 text-teal" strokeWidth={1.5} />
              <div>
                <p className="font-mono text-[13px] font-medium tracking-[0.05em] text-txt">
                  {it.label}
                </p>
                <p className="mt-1.5 text-[13px] leading-snug text-txt-sub">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
