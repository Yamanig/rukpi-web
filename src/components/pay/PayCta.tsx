import { useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PayCta() {
  const scope = useRef<HTMLElement>(null);
  const magnet = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".pay-cta-reveal", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });

      // magnetic pull on the primary CTA (8px max)
      const el = magnet.current;
      if (!el) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3.out" });
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(gsap.utils.clamp(-8, 8, dx * 0.2));
        yTo(gsap.utils.clamp(-8, 8, dy * 0.2));
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope },
  );

  return (
    <section ref={scope} className="bg-white py-28 text-ltxt lg:py-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="pay-cta-reveal font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
          One app. Every rail. Your money.
        </h2>
        <div className="pay-cta-reveal mt-10 flex flex-wrap items-center justify-center gap-4">
          <div ref={magnet} className="inline-block">
            <Link to="/contact" className="btn-primary group">
              Get the App
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
        <p className="pay-cta-reveal mt-8 font-mono text-[12px] tracking-[0.08em] text-ltxt-muted">
          iOS &amp; ANDROID · WCAG 2.1 AA ACCESSIBLE
        </p>
        <p className="pay-cta-reveal mt-6">
          <Link
            to="/merchants"
            className="group inline-flex items-center gap-1.5 font-sans text-[15px] font-semibold text-teal transition-colors hover:text-teal-deep"
          >
            Are you a merchant?
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </p>
      </div>
    </section>
  );
}
