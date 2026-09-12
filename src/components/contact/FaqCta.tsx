import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How do I join the merchant pilot?",
    a: (
      <>
        Write to{" "}
        <a
          href="mailto:merchants@rukpi.finance"
          className="font-mono text-[13px] text-teal underline decoration-teal/40 underline-offset-4 hover:decoration-teal"
        >
          merchants@rukpi.finance
        </a>{" "}
        — onboarding is an 11-step process that includes at least 48 hours of shadow mode
        before you go live.
      </>
    ),
  },
  {
    q: "When will RUKPI PAY be available?",
    a: "The Phase 5 closed-loop pilot comes first; public app availability follows the go/no-go gates on pilot health metrics. Join the waitlist via the form above and we'll email you at each gate.",
  },
  {
    q: "Is my money safe during network outages?",
    a: (
      <>
        Yes. Transactions queue offline and settle with exactly-once semantics when a rail
        recovers — no duplicates, no lost funds.
      </>
    ),
  },
];

/** Section 5 — FAQ teaser + CTA (contact.md). Light; shadcn Accordion. */
export default function FaqCta() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow text-teal">Quick answers</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ltxt">
            Before you write in.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-bordergray">
                <AccordionTrigger className="py-5 font-display text-lg font-semibold text-ltxt hover:text-teal hover:no-underline [&[data-state=open]>svg]:text-teal [&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-sovereign">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-ltxt-sub">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <a href="#contact-form" className="btn-primary group">
            Get the App
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </a>
          <Link
            to="/products/pay"
            className="group inline-flex items-center gap-2 rounded-[4px] border border-bordergray px-7 py-3.5 font-sans text-[15px] font-semibold text-ltxt transition-all duration-200 ease-sovereign hover:border-teal hover:text-teal"
          >
            Explore RUKPI PAY
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
