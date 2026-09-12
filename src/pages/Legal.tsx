import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClauseRow from "../components/legal/ClauseRow";
import TermsToc from "../components/legal/TermsToc";
import { PRIVACY_CLAUSES, TERMS_CLAUSES } from "../components/legal/clauses";

type TabKey = "privacy" | "terms";

const TAB_META: Record<TabKey, string> = {
  privacy: "LAST UPDATED: 2025 · APPLIES TO: RUKPI PAY, MERCHANT, RESTO",
  terms: "LAST UPDATED: 2025 · APPLIES TO: RUKPI PAY, MERCHANT, RESTO",
};

/**
 * Legal — `/legal` (legal.md).
 * Privacy Policy + Terms of Service with an underline-slide tab switcher.
 * Light document page; restrained fades only.
 */
export default function Legal() {
  const [tab, setTab] = useState<TabKey>(() =>
    typeof window !== "undefined" && window.location.hash === "#terms" ? "terms" : "privacy",
  );

  return (
    <section className="bg-white pb-24 pt-[88px] lg:pb-32">
      <div className="mx-auto max-w-[860px] px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow text-teal">Legal</p>
          <h1 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ltxt lg:text-5xl">
            Clear terms. No fine-print games.
          </h1>
        </motion.div>

        {/* Tab switcher — underline indicator slides via layoutId */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="mt-12 gap-0">
          <TabsList className="h-auto w-full justify-start gap-8 rounded-none border-b border-bordergray bg-transparent p-0">
            {(
              [
                ["privacy", "PRIVACY POLICY"],
                ["terms", "TERMS OF SERVICE"],
              ] as const
            ).map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative h-auto flex-none rounded-none border-0 bg-transparent px-0 pb-3 font-mono text-[13px] font-medium tracking-[0.08em] text-ltxt-muted shadow-none transition-colors duration-200 hover:text-ltxt data-[state=active]:bg-transparent data-[state=active]:text-ltxt data-[state=active]:shadow-none"
              >
                {label}
                {tab === value && (
                  <motion.span
                    layoutId="legal-tab-underline"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-teal"
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <motion.p
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 font-mono text-[12px] tracking-[0.08em] text-ltxt-muted"
          >
            {TAB_META[tab]}
          </motion.p>
        </Tabs>

        {/* Tab content — crossfade 0.3s, blocks fade up gently */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            {tab === "privacy" ? (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {PRIVACY_CLAUSES.map((c, i) => (
                  <ClauseRow key={c.id} clause={c} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]"
              >
                <div className="hidden lg:block">
                  <TermsToc clauses={TERMS_CLAUSES} />
                </div>
                <div className="min-w-0">
                  {TERMS_CLAUSES.map((c, i) => (
                    <ClauseRow key={c.id} clause={c} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer note (both tabs) */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center font-mono text-[12px] tracking-[0.08em] text-ltxt-muted"
        >
          RUKUN PAYMENT INFRASTRUCTURE · MOGADISHU · QUESTIONS: HELLO@RUKPI.SO
        </motion.p>
      </div>
    </section>
  );
}
