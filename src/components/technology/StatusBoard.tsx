import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STATS = [
  { label: "API LATENCY P50", value: "<50ms", note: "WebSocket transport" },
  { label: "CROSS-SCREEN CONSISTENCY", value: "<100ms", note: null },
  { label: "FAILOVER RPO", value: "0", note: null },
  { label: "PEAK STRESS TEST", value: "150%", note: null },
];

const GLYPHS = "0123456789ABCDEF<>%#/*";

/** Figure that flickers in like a booting console — char scramble resolving in 0.8s. */
function Scramble({ text, delay }: { text: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const dur = 800;
    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (now - start) / dur);
      const settled = Math.floor(p * text.length);
      let s = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) {
        s += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, delay]);

  return (
    <span ref={ref} className="tabular">
      {out}
    </span>
  );
}

export default function StatusBoard() {
  return (
    <section className="bg-ink-0 py-24 lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-xl border border-ink-4/60 bg-ink-1 p-6 shadow-teal-edge lg:p-10"
        >
          {/* board header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[12px] tracking-[0.14em] text-txt-ter">
              SYSTEM STATUS · OPS CONSOLE
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.1em] text-success">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>

          {/* stat cells */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                className="stat-cell bg-ink-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success"
                    style={{ animationDuration: "2s" }}
                  />
                  <p className="font-mono text-[11px] tracking-[0.1em] text-txt-ter">
                    {s.label}
                  </p>
                </div>
                <p className="mt-4 font-mono text-[36px] font-medium leading-none text-txt lg:text-[40px]">
                  <Scramble text={s.value} delay={0.2 + i * 0.15} />
                </p>
                {s.note && (
                  <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-txt-ter">
                    {s.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* footnote */}
          <p className="mt-8 border-t border-white/[0.06] pt-4 text-right font-mono text-[11px] tracking-[0.12em] text-txt-ter">
            TARGETS & TEST RESULTS · PHASE 5 PILOT
          </p>
        </motion.div>
      </div>
    </section>
  );
}
