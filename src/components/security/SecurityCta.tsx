import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function SecurityCta() {
  return (
    <section className="bg-teal-deep py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-txt lg:text-5xl"
        >
          Trust, verifiable.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/technology" className="btn-ghost group">
            See the technology
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
          <Link to="/contact" className="btn-primary group">
            Get the App
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 font-mono text-[12px] tracking-[0.08em] text-txt-ter"
        >
          QUESTIONS?{" "}
          <Link to="/contact" className="text-teal transition-colors hover:text-txt">
            SECURITY@ VIA CONTACT PAGE
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
