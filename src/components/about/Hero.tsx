import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(".about-skyline", { scale: 1 });
        return;
      }

      // cinematic settle: skyline scales 1.08 → 1.0 on load (2s)
      gsap.fromTo(
        ".about-skyline",
        { scale: 1.08 },
        { scale: 1, duration: 2, ease: "power2.out" },
      );

      // parallax: skyline moves at 0.6 rate, copy at 1.0; amber horizon brightens
      gsap.to(".about-skyline", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".about-horizon", {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top top", end: "60% top", scrub: true },
      });
      gsap.to(".about-copy", {
        yPercent: 20,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
      });

      // character reveal (0.025s stagger) + subhead word reveal
      const split = new SplitText(".about-headline", { type: "chars", mask: "chars" });
      const splitSub = new SplitText(".about-sub", { type: "words" });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.4 });
      tl.from(".about-eyebrow", { opacity: 0, y: 12, duration: 0.6 })
        .from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.025 }, 0.1)
        .from(splitSub.words, { opacity: 0, y: 14, duration: 0.7, stagger: 0.03 }, 0.5)
        .from(".about-scroll-cue", { opacity: 0, duration: 0.6 }, 1.2);
      return () => {
        split.revert();
        splitSub.revert();
      };
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative -mt-[72px] flex min-h-[100dvh] flex-col overflow-hidden bg-ink-0"
    >
      {/* full-bleed duotone skyline */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/mogadishu-skyline.png"
          alt=""
          className="about-skyline h-full w-full object-cover"
        />
        {/* legibility overlay: Deep Slate 0 80% → 40% top → bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-0/80 via-ink-0/55 to-ink-0/40" />
        {/* amber horizon line — brightens as the user scrolls */}
        <div
          className="about-horizon absolute inset-x-0 bottom-[28%] h-px opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(229,169,60,0.9) 50%, transparent)",
            boxShadow: "0 0 24px rgba(229,169,60,0.45)",
          }}
        />
      </div>

      {/* copy — centered, lower third */}
      <div className="about-copy relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-end px-6 pb-28 pt-[160px] text-center">
        <p className="about-eyebrow eyebrow text-amber">Our Story · Mogadishu, Somalia</p>
        <h1 className="about-headline mt-6 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.03em] text-txt sm:text-[64px] lg:text-[80px]">
          Rukun means pillar.
        </h1>
        <p className="about-sub mx-auto mt-8 max-w-[680px] text-lg leading-[1.6] text-txt/90 sm:text-xl">
          In Somali and Arabic, a rukun is a foundational principle — a load-bearing pillar. We
          named our company after it because that&apos;s what payment infrastructure is: the thing
          everything else stands on.
        </p>
        <div className="about-scroll-cue mt-14 flex flex-col items-center gap-2" aria-hidden="true">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-txt-ter">
            Scroll
          </span>
          <span className="block h-10 w-px animate-scroll-hint bg-amber" />
        </div>
      </div>
    </section>
  );
}
