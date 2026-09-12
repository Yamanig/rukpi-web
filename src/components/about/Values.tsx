import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldCheck, Zap, Globe2, Eye } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PILLARS = [
  { icon: ShieldCheck, name: "Structural Trust", body: "Unshakeable integrity in every transaction." },
  { icon: Zap, name: "Digital Speed", body: "Real-time processing with zero friction." },
  { icon: Globe2, name: "Pan-African Reach", body: "Built for the continent, from the ground up." },
  { icon: Eye, name: "Radical Clarity", body: "Zero obfuscation in financial interfaces." },
];

export default function Values() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".values-head", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      });

      // pillars rise like columns (y 80px, 0.15s stagger, 0.9s), then the beam draws across
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".values-grid", start: "top 75%" },
        defaults: { ease: "power4.out" },
      });
      tl.from(".value-pillar", { opacity: 0, y: 80, duration: 0.9, stagger: 0.15 }).fromTo(
        ".values-beam",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: "power4.out" },
        "-=0.15",
      );
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-dark-surface py-24 lg:py-32">
      {/* pillar texture backdrop (Rukun = pillar) at 0.2 opacity */}
      <img
        src="/values-texture.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="relative mx-auto max-w-content px-6">
        <p className="values-head eyebrow text-teal">Core Values</p>
        <h2 className="values-head mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl">
          Four pillars hold everything up.
        </h2>

        <div className="relative mt-16">
          {/* beam drawn across the pillar capitals after they land */}
          <div
            className="values-beam pointer-events-none absolute -top-3 left-0 right-0 hidden h-0.5 origin-left bg-teal/70 lg:block"
            style={{ boxShadow: "0 0 12px rgba(0,163,161,0.5)" }}
            aria-hidden="true"
          />
          <div className="values-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div
                key={p.name}
                className="value-pillar group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-xl border border-ink-4/60 bg-ink-1 shadow-teal-edge"
              >
                {/* teal capital edge */}
                <span className="absolute inset-x-0 top-0 h-1 bg-teal/70" aria-hidden="true" />
                {/* hover "load": teal fill rises from the base */}
                <span
                  className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-teal/20 to-teal/5 transition-transform ease-sovereign group-hover:scale-y-100"
                  style={{ transitionDuration: "400ms" }}
                  aria-hidden="true"
                />
                <div className="relative p-7">
                  <p.icon className="h-6 w-6 text-teal" strokeWidth={1.5} />
                  <h3 className="mt-5 font-display text-xl font-semibold text-txt transition-colors duration-300 group-hover:text-teal">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-txt-sub">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
