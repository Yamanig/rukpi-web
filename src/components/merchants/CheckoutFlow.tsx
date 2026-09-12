import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Laptop, Smartphone, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    icon: Laptop,
    title: "Customer checks out",
    body: "Your store creates a payment intent with an itemized order.",
    tag: null as string | null,
  },
  {
    icon: Smartphone,
    title: "Push notification",
    body: "The customer authorizes in the RUKPI app — itemized, with a 5-minute expiry.",
    tag: "EXPIRES 5:00",
  },
  {
    icon: CheckCircle2,
    title: "Real-time confirmation",
    body: "Your backend receives confirmation over server-sent events.",
    tag: "<100MS SSE SYNC",
  },
];

export default function CheckoutFlow() {
  const scope = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const flow = flowRef.current!;
      const dot = dotRef.current!;
      const path = pathRef.current!;
      const nodes = Array.from(flow.querySelectorAll<HTMLElement>("[data-flow-node]"));

      const setX = gsap.quickSetter(dot, "x", "px");
      const setY = gsap.quickSetter(dot, "y", "px");

      const measure = () => {
        const fr = flow.getBoundingClientRect();
        const pts = nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return {
            x: r.left - fr.left + r.width / 2,
            y: r.top - fr.top + r.height / 2,
          };
        });
        // Route the connector between the vertical centers of the nodes
        const d = pts
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ");
        path.setAttribute("d", d);
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        return { pts, len };
      };

      let geo = measure();

      const placeDot = (p: number) => {
        const pt = path.getPointAtLength(p * geo.len);
        setX(pt.x);
        setY(pt.y);
      };

      if (reduced) {
        setActiveStep(STEPS.length - 1);
        path.style.strokeDashoffset = "0";
        dot.style.opacity = "0";
        return;
      }

      const st = ScrollTrigger.create({
        trigger: scope.current,
        start: "top top+=72",
        end: "+=150%",
        pin: true,
        scrub: 0.6,
        onRefresh: (self) => {
          geo = measure();
          placeDot(self.progress);
        },
        onUpdate: (self) => {
          const p = self.progress;
          placeDot(p);
          path.style.strokeDashoffset = String(geo.len * (1 - p));
          // Activate nodes as the packet passes them (packet reaches node i at its fraction)
          const n = STEPS.length;
          let active = -1;
          for (let i = 0; i < n; i++) {
            if (p >= i / (n - 1) - 0.04) active = i;
          }
          setActiveStep((prev) => (prev === active ? prev : active));
        },
      });

      return () => st.kill();
    },
    { scope },
  );

  return (
    <section ref={scope} className="overflow-hidden bg-ink-0">
      <div className="mx-auto max-w-content px-6 py-24 lg:py-28">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="eyebrow text-teal">Pay with RUKPI · Online Checkout</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt sm:text-[48px]">
            Online checkout without cards.
          </h2>
          <p className="mt-6 text-lg leading-[1.6] text-txt-sub">
            Customers authorize in the RUKPI app with an itemized order and a 5-minute
            expiry. Your store receives confirmation over server-sent events in real time —
            no webhooks to reconcile, no card fees.
          </p>
        </div>

        {/* Flow */}
        <div ref={flowRef} className="relative mt-16">
          {/* connector svg */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              fill="none"
              stroke="#00A3A1"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
          {/* the authorization packet */}
          <div
            ref={dotRef}
            className="pointer-events-none absolute left-0 top-0 z-10 h-3.5 w-3.5 rounded-full bg-teal"
            style={{ boxShadow: "0 0 16px rgba(0,163,161,0.9), 0 0 40px rgba(0,163,161,0.5)" }}
            aria-hidden="true"
          />

          <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((s, i) => {
              const active = i <= activeStep;
              return (
                <div
                  key={s.title}
                  data-flow-node
                  className={`relative rounded-xl border bg-ink-1 p-8 text-center transition-all duration-500 ${
                    active
                      ? "border-teal/70 shadow-[0_0_32px_rgba(0,163,161,0.15),inset_0_1px_0_rgba(0,163,161,0.35)]"
                      : "border-ink-4/60"
                  }`}
                >
                  <span
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl border transition-colors duration-500 ${
                      active ? "border-teal/50 bg-teal/10 text-teal" : "border-ink-4 bg-ink-2 text-txt-ter"
                    }`}
                  >
                    <s.icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-txt">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.7] text-txt-sub">{s.body}</p>
                  {s.tag && (
                    <span
                      className={`mt-4 inline-block rounded-md border px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] transition-colors duration-500 ${
                        s.tag.startsWith("EXPIRES")
                          ? "border-amber/40 bg-amber/10 text-amber"
                          : active
                            ? "border-success/40 bg-success/10 text-success"
                            : "border-ink-4 text-txt-ter"
                      }`}
                    >
                      {s.tag}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
