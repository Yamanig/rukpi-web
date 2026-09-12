import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TOPICS } from "./topics";
import type { TopicKey } from "./topics";

interface RoutingCardsProps {
  onSelect: (topic: TopicKey) => void;
}

/**
 * Section 1 — Hero + routing cards (contact.md).
 * Light (Off White), 2×2 grid; clicking a card pre-selects the form topic
 * and smooth-scrolls to the form.
 */
export default function RoutingCards({ onSelect }: RoutingCardsProps) {
  return (
    <section className="bg-offwhite pb-24 pt-[88px] lg:pb-32">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow text-teal"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ltxt lg:text-5xl"
          >
            Talk to the right team, first time.
          </motion.h1>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-20">
          {TOPICS.map((t, i) => (
            <motion.button
              key={t.key}
              type="button"
              onClick={() => onSelect(t.key)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer rounded-xl border border-bordergray bg-white p-7 text-left shadow-light-card transition-all duration-300 ease-sovereign hover:-translate-y-1 hover:border-teal"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-display text-xl font-semibold leading-[1.3] text-ltxt">
                  {t.name}
                </p>
                {t.badge && (
                  <span
                    className={`rounded-md border px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] ${
                      t.badge.tone === "teal"
                        ? "border-teal/40 text-teal"
                        : "border-success/40 text-success"
                    }`}
                  >
                    {t.badge.text}
                  </span>
                )}
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ltxt-sub">{t.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[14px] text-teal">
                <span className="relative">
                  {t.email}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-teal transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
