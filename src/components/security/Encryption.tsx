import { motion } from "framer-motion";
import { ArrowLeftRight, Database, KeyRound } from "lucide-react";
import ScrambleText from "./ScrambleText";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const CARDS = [
  {
    icon: ArrowLeftRight,
    title: "In transit",
    mono: "TLS 1.3",
    body: "Exclusively TLS 1.3. No legacy protocol fallbacks, ever. Certificate pinning in every app.",
  },
  {
    icon: Database,
    title: "At rest",
    mono: "AES-256-GCM",
    body: "Authenticated encryption for all stored data.",
  },
  {
    icon: KeyRound,
    title: "Signing",
    mono: "ED25519 + HSM",
    body: "Hardware security module–backed Ed25519 keys sign critical operations. Keys never leave the HSM.",
  },
];

export default function Encryption() {
  return (
    <section className="bg-white py-24 text-ltxt lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-teal">Encryption &amp; Transport</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] lg:text-5xl">
            Every byte, encrypted twice over.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              className="group rounded-xl border border-bordergray bg-white p-8 shadow-light-card transition-all duration-300 ease-sovereign hover:-translate-y-1 hover:border-teal"
            >
              <span className="inline-flex transition-transform duration-300 ease-sovereign group-hover:rotate-[15deg]">
                <card.icon className="h-7 w-7 text-teal" strokeWidth={1.5} />
              </span>
              <ScrambleText
                text={card.mono}
                duration={0.6}
                delay={0.2 + i * 0.12}
                className="mt-6 block font-mono text-[13px] tracking-[0.1em] text-ltxt-muted"
              />
              <h3 className="mt-2 font-display text-2xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ltxt-sub">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
