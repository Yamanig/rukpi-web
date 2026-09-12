import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const PARAGRAPHS = [
  "Somalia moves money like nowhere else on earth — roughly 155 million mobile-money transactions every month. The demand is proven. What's wasted is the fragmentation: seven wallets, seven balances, seven histories that never meet.",
  "RUKPI exists to connect the rails, denominate value in stable USD units, and convert everyday payment history into financial identity. Every transaction should leave the transactor stronger than it found them.",
  "Built in Mogadishu, designed for the continent.",
];

export default function Mission() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".mission-eyebrow, .mission-h2", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });

      // reading-line effect: line-level split, clip mask, 0.4s stagger per block
      const splits: SplitText[] = [];
      gsap.utils.toArray<HTMLElement>(".mission-p").forEach((el) => {
        const split = new SplitText(el, { type: "lines", mask: "lines" });
        splits.push(split);
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.8,
          stagger: 0.4 / Math.max(1, split.lines.length),
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });
      return () => splits.forEach((s) => s.revert());
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[800px] px-6">
        <p className="mission-eyebrow eyebrow text-teal">Mission</p>
        <h2 className="mission-h2 mt-4 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-ltxt lg:text-[40px]">
          To unify Africa&apos;s most dynamic mobile-money economy into one financial layer — and
          make every transaction build the transactor.
        </h2>
        <div className="mt-10 space-y-6">
          {PARAGRAPHS.map((p, i) => (
            <p key={i} className="mission-p text-lg leading-[1.75] text-ltxt-sub">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
