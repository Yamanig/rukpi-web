import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Handshake, TimerReset, Eye } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STATEMENTS = [
  {
    icon: Handshake,
    title: "Consent-based use",
    body: "Your data is used only for purposes you approve.",
  },
  {
    icon: TimerReset,
    title: "30-day purge",
    body: "Delete your account and your PII is purged within 30 days.",
  },
  {
    icon: Eye,
    title: "Radical clarity",
    body: "No dark patterns. No hidden sharing. Financial interfaces with zero obfuscation.",
  },
];

export default function DataRights() {
  return (
    <section className="bg-white py-24 text-ltxt lg:py-32">
      <div className="mx-auto max-w-[720px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          <p className="eyebrow text-teal">Data Rights &amp; Privacy</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            Your data, on your terms.
          </h2>
        </motion.div>

        {/* restrained staggered fade-ups — no playful motion */}
        <div className="mt-14 space-y-10">
          {STATEMENTS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              className="flex items-start gap-5"
            >
              <span className="mt-0.5 inline-flex rounded-lg border border-bordergray bg-offwhite p-2.5">
                <s.icon className="h-5 w-5 text-teal" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-1.5 leading-[1.7] text-ltxt-sub">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 border-t border-bordergray pt-8 text-center"
        >
          <Link
            to="/legal"
            className="group inline-flex items-center gap-2 font-semibold text-teal transition-colors hover:text-teal-deep"
          >
            Read the full Privacy Policy
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
