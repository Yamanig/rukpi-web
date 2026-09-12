import { useId, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Clause } from "./clauses";

interface ClauseRowProps {
  clause: Clause;
  index: number;
}

/**
 * Two-column legal clause row (legal.md): plain-language summary card on the
 * left (teal left border), formal clause text on the right. Clicking the
 * summary expands/collapses the full text; mono chip tracks SUMMARY/FULL TEXT.
 */
export default function ClauseRow({ clause, index }: ClauseRowProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <motion.article
      id={clause.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-[120px] border-b border-bordergray py-8 first:pt-0"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr] md:gap-10">
        {/* Summary card */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group cursor-pointer rounded-lg border-l-2 border-teal bg-subtle p-5 text-left transition-colors duration-200 hover:bg-bordergray/50"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-semibold leading-[1.3] text-ltxt">
              {clause.title}
            </h3>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-ltxt-muted transition-transform duration-300 ease-sovereign group-hover:text-teal ${
                open ? "rotate-180 text-teal" : ""
              }`}
              strokeWidth={1.5}
            />
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-ltxt-sub">{clause.summary}</p>
          <span
            className={`mt-4 inline-block rounded-md border px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] transition-colors duration-200 ${
              open ? "border-teal/40 text-teal" : "border-ltxt-muted/40 text-ltxt-muted"
            }`}
          >
            {open ? "FULL TEXT" : "SUMMARY"}
          </span>
        </button>

        {/* Formal clause (expand/collapse) */}
        <div className="min-w-0">
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="text-[15px] leading-[1.7] text-ltxt-sub">
                  {clause.formal}
                  {clause.link && (
                    <>
                      {" "}
                      <Link
                        to={clause.link.to}
                        className="text-teal underline decoration-teal/40 underline-offset-4 transition-colors hover:decoration-teal"
                      >
                        {clause.link.label} →
                      </Link>
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!open && (
            <p className="hidden text-[14px] leading-relaxed text-ltxt-muted md:block">
              Expand the summary to read the full clause.
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
