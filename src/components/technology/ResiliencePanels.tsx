import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ---------------- Panel A: exactly-once retry collapse ---------------- */

const LOG_LINES = [
  "→ POST /v1/transfers · key 9f2c…a41e",
  "→ POST /v1/transfers · retry 1 (timeout)",
  "→ POST /v1/transfers · retry 2 (timeout)",
];

function ExactlyOnceDemo() {
  // phase: 0 typing, 1 striking, 2 collapsed
  const [visible, setVisible] = useState(0);
  const [struck, setStruck] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(LOG_LINES.length);
      setStruck(true);
      setCollapsed(true);
      return;
    }
    let cancelled = false;
    const later = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(() => !cancelled && fn(), ms));
    };
    const cycle = () => {
      setVisible(0);
      setStruck(false);
      setCollapsed(false);
      LOG_LINES.forEach((_, i) => later(() => setVisible(i + 1), 500 + i * 900));
      later(() => setStruck(true), 3600);
      later(() => setCollapsed(true), 4400);
      later(cycle, 8000);
    };
    cycle();
    return () => {
      cancelled = true;
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div
      className="relative mt-6 min-h-[132px] rounded-lg border border-white/[0.06] bg-ink-2 p-4 font-mono text-[12.5px] leading-[2]"
      aria-label="Three retried requests collapse into one execution"
    >
      <AnimatePresence>
        {!collapsed &&
          LOG_LINES.slice(0, visible).map((l, i) => (
            <motion.div
              key={`line-${i}`}
              layout="position"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={
                struck && i > 0
                  ? "text-txt-ter line-through decoration-error/70"
                  : "text-txt-sub"
              }
            >
              {l}
            </motion.div>
          ))}
      </AnimatePresence>
      <AnimatePresence>
        {collapsed && (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="flex h-[100px] items-center justify-center gap-2 font-mono text-[14px] tracking-[0.08em] text-success"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-success/50">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            1 EXECUTION
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Panel B: chaos waveform ---------------- */

/** Connectivity waveform with dropout gaps; queued txns flush on recovery. 8s loop. */
function ChaosWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const CYCLE = 8000; // ms
    // dropout windows within the cycle (fractions)
    const GAPS: [number, number][] = [
      [0.18, 0.34],
      [0.62, 0.78],
    ];

    let w = 0;
    let h = 0;
    const resize = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const signal = (x: number) => {
      // healthy connectivity squiggle
      return (
        Math.sin(x * 0.09) * 10 + Math.sin(x * 0.023 + 1.7) * 16 + Math.sin(x * 0.31) * 3
      );
    };

    const draw = (now: number) => {
      const t = ((now % CYCLE) + CYCLE) % CYCLE;
      const p = t / CYCLE; // 0..1 sweep
      ctx.clearRect(0, 0, w, h);
      const mid = h * 0.55;

      // amber-shaded gap regions
      for (const [g0, g1] of GAPS) {
        ctx.fillStyle = "rgba(229,169,60,0.10)";
        ctx.fillRect(g0 * w, 0, (g1 - g0) * w, h);
        ctx.strokeStyle = "rgba(229,169,60,0.35)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(g0 * w, 0);
        ctx.lineTo(g0 * w, h);
        ctx.moveTo(g1 * w, 0);
        ctx.lineTo(g1 * w, h);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // waveform (2s sweep feel: draw up to sweep head)
      const headX = p * w;
      ctx.strokeStyle = "#00A3A1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let pen = false;
      for (let x = 0; x <= headX; x += 2) {
        const f = x / w;
        const inGap = GAPS.some(([g0, g1]) => f >= g0 && f <= g1);
        if (inGap) {
          pen = false;
          continue; // flatline gap = no connectivity
        }
        const y = mid + signal(x);
        if (!pen) {
          ctx.moveTo(x, y);
          pen = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // sweep head glow
      ctx.fillStyle = "rgba(0,163,161,0.9)";
      ctx.beginPath();
      ctx.arc(headX, mid + (GAPS.some(([g0, g1]) => p >= g0 && p <= g1) ? 0 : signal(headX)), 3, 0, Math.PI * 2);
      ctx.fill();

      // queued transactions during gaps + flush bursts on recovery
      for (const [g0, g1] of GAPS) {
        if (p > g0 && p <= g1) {
          // queue accumulating
          const q = Math.floor(((p - g0) / (g1 - g0)) * 6);
          for (let i = 0; i < q; i++) {
            const bx = (g0 + 0.02 + i * ((g1 - g0 - 0.04) / 6)) * w;
            const bh = 8 + i * 5;
            ctx.fillStyle = "rgba(229,169,60,0.75)";
            ctx.fillRect(bx, h - 14 - bh, 4, bh);
          }
          ctx.fillStyle = "rgba(229,169,60,0.8)";
          ctx.font = "10px 'JetBrains Mono', monospace";
          ctx.fillText(`QUEUED: ${q}`, g0 * w + 6, 16);
        } else if (p > g1 && p <= g1 + 0.14) {
          // flush bursts rising, staggered
          const fp = (p - g1) / 0.14;
          for (let i = 0; i < 6; i++) {
            const local = Math.min(1, Math.max(0, fp * 1.6 - i * 0.1));
            const bx = (g0 + 0.02 + i * ((g1 - g0 - 0.04) / 6)) * w;
            const rise = local * (h * 0.55);
            ctx.fillStyle = `rgba(0,163,161,${1 - local * 0.7})`;
            ctx.beginPath();
            ctx.arc(bx + 2, h - 16 - rise, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    let raf = 0;
    let inView = false;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (reduced) {
      draw(CYCLE * 0.5); // static frame
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView) start();
          else stop();
        },
        { threshold: 0.1 },
      );
      io.observe(wrap);
      return () => {
        io.disconnect();
        stop();
        window.removeEventListener("resize", resize);
      };
    }
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mt-6 h-[160px] overflow-hidden rounded-lg border border-white/[0.06] bg-ink-2"
      aria-label="Connectivity waveform with dropout gaps; transactions queue and flush on recovery"
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}

/* ---------------- Section ---------------- */

const PANEL_A_BULLETS = [
  "SHA-256 idempotency keys on every mutation",
  "Serializable isolation for wallet operations",
  "Optimistic locking against double-spend",
];

export default function ResiliencePanels() {
  return (
    <section className="bg-ink-alt py-24 lg:py-32">
      <div className="mx-auto grid max-w-content gap-8 px-6 lg:grid-cols-2">
        {/* Panel A — Exactly-once */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-xl border border-ink-4/60 bg-ink-1 p-8 shadow-teal-edge lg:p-10"
        >
          <p className="font-mono text-[12px] tracking-[0.12em] text-txt-ter">
            EXACTLY-ONCE SEMANTICS
          </p>
          <h3 className="mt-3 font-display text-[24px] font-semibold leading-[1.3] text-txt lg:text-[28px]">
            Exactly once, even when the network says otherwise.
          </h3>
          <ul className="mt-6 space-y-3">
            {PANEL_A_BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] leading-[1.7] text-txt-sub">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
          <ExactlyOnceDemo />
        </motion.div>

        {/* Panel B — Chaos-tested */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="rounded-xl border border-ink-4/60 bg-ink-1 p-8 shadow-teal-edge lg:p-10"
        >
          <p className="font-mono text-[12px] tracking-[0.12em] text-txt-ter">
            CHAOS ENGINEERING
          </p>
          <h3 className="mt-3 font-display text-[24px] font-semibold leading-[1.3] text-txt lg:text-[28px]">
            Built for 30-second drops, every 5 minutes.
          </h3>
          <p className="mt-6 text-[15px] leading-[1.7] text-txt-sub">
            We chaos-engineer against Somalia's actual connectivity signature — and we do
            it at 150% of peak load with RPO=0 failover.
          </p>
          <ChaosWaveform />
          <p className="tabular mt-4 font-mono text-[12px] tracking-[0.08em] text-txt-sub">
            DROPS SURVIVED: <span className="text-teal">1,024</span> · DUPLICATES:{" "}
            <span className="text-success">0</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
