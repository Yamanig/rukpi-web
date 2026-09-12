import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface Rail {
  name: string;
  chip: string;
  limits: string;
  fee: (amount: number) => number;
}

const RAILS: Rail[] = [
  { name: "Hormuud EVC Plus", chip: "INSTANT", limits: "$500 T1 / $5,000 T2", fee: (a) => a * 0.01 },
  { name: "Telesom ZAAD", chip: "INSTANT", limits: "$500 T1 / $5,000 T2", fee: (a) => a * 0.01 },
  { name: "Golis Sahal", chip: "INSTANT", limits: "$500 T1 / $5,000 T2", fee: (a) => a * 0.008 },
  { name: "Dahabshiil e-Dahab", chip: "INSTANT", limits: "$500 T1 / $5,000 T2", fee: (a) => a * 0.008 },
  { name: "IBS Bank E-BESA", chip: "INSTANT", limits: "$500 T1 / $5,000 T2", fee: (a) => a * 0.008 },
  { name: "Amal Bank MY-CASH", chip: "INSTANT", limits: "$500 T1 / $5,000 T2", fee: (a) => a * 0.008 },
  { name: "Premier Bank Wallet", chip: "INSTANT", limits: "$500 T1 / $5,000 T2", fee: (a) => a * 0.008 },
  { name: "Bank Transfer", chip: "T+0", limits: "$2,000 / $20,000", fee: () => 0.5 },
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Odometer-style rolling value (0.3s digit roll on change). */
function useRolledValue(target: number, duration = 0.3) {
  const [display, setDisplay] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const controls = animate(current.current, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    current.current = target;
    return () => controls.stop();
  }, [target, duration]);

  return display;
}

export default function TopUp() {
  const [selected, setSelected] = useState(0);
  const [amount, setAmount] = useState(120);

  const fee = RAILS[selected].fee(amount);
  const receive = useRolledValue(amount - fee);
  const feeRolled = useRolledValue(fee);

  return (
    <section className="bg-white py-24 text-ltxt lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <div className="max-w-2xl">
          <p className="eyebrow text-teal">Top-Up Rails</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            Fund from the rail you already trust.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ltxt-sub">
            Every major Somali mobile-money network plus bank transfer — pick a rail, set an
            amount, and see exactly what lands in your balance before you confirm.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
          {/* Ledger table */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
            className="overflow-hidden rounded-xl border border-bordergray bg-white shadow-light-card"
          >
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-bordergray bg-subtle px-5 py-3">
              <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ltxt-muted">Rail</p>
              <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ltxt-muted">Speed</p>
              <p className="text-right font-mono text-[12px] uppercase tracking-[0.1em] text-ltxt-muted">
                Limits
              </p>
            </div>
            {RAILS.map((r, i) => (
              <motion.button
                key={r.name}
                type="button"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                className={`grid w-full cursor-pointer grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-bordergray px-5 py-4 text-left transition-colors last:border-b-0 ${
                  selected === i
                    ? "border-l-[3px] border-l-teal bg-subtle pl-[17px]"
                    : "border-l-[3px] border-l-transparent pl-[17px] hover:bg-offwhite"
                }`}
              >
                <span className="font-sans text-[15px] font-semibold text-ltxt">{r.name}</span>
                <span
                  className={`rounded-md border px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] ${
                    r.chip === "INSTANT"
                      ? "border-teal/40 text-teal"
                      : "border-info/40 text-info"
                  }`}
                >
                  {r.chip}
                </span>
                <span className="tabular text-right font-mono text-[13px] text-ltxt-sub">
                  {r.limits}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Fee preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="flex flex-col rounded-xl border border-bordergray bg-offwhite p-6 shadow-light-card lg:p-8"
          >
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ltxt-muted">
              Amount
            </p>
            <p className="tabular mt-2 font-mono text-4xl font-medium text-ltxt">
              ${amount.toFixed(2)}
            </p>

            <div className="mt-8">
              <Slider
                value={[amount]}
                onValueChange={([v]) => setAmount(v)}
                min={5}
                max={500}
                step={1}
                aria-label="Top-up amount"
                className="[&_[data-slot=slider-range]]:bg-teal [&_[data-slot=slider-thumb]]:border-teal [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-bordergray"
              />
              <div className="mt-2 flex justify-between font-mono text-[12px] text-ltxt-muted">
                <span>$5</span>
                <span>$500</span>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-teal/30 bg-white p-4">
              <p className="tabular font-mono text-[15px] tracking-[0.04em] text-ltxt">
                YOU RECEIVE:{" "}
                <span className="font-medium text-teal">
                  $
                  {receive.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </p>
              <p className="tabular mt-1.5 font-mono text-[12px] tracking-[0.04em] text-ltxt-muted">
                FEE ${feeRolled.toFixed(2)} · {RAILS[selected].name.toUpperCase()} · FEE PREVIEWED
                IN REAL TIME
              </p>
            </div>

            <p className="mt-auto pt-6 text-[13px] leading-relaxed text-ltxt-muted">
              Fees shown before every top-up — never after. Limits scale with your KYC tier.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
