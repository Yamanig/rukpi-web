import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import type { ReactNode } from "react";

type Lang = "curl" | "node" | "python";

const T = ({ c }: { c: ReactNode }) => <span className="text-teal">{c}</span>;
const S = ({ c }: { c: ReactNode }) => <span className="text-amber-light">{c}</span>;
const P = ({ c }: { c: ReactNode }) => <span className="text-txt-sub">{c}</span>;
const M = ({ c }: { c: ReactNode }) => <span className="text-txt-ter">{c}</span>;

const CODE: Record<Lang, { plain: string; lines: ReactNode[] }> = {
  curl: {
    plain: `curl -X POST https://api.rukpi.finance/v1/payments \\
  -H "Authorization: Bearer rk_live_…" \\
  -H "Idempotency-Key: 9f2c…" \\
  -d '{"amount": "25.00", "currency": "USD", "rail": "auto"}'`,
    lines: [
      <><T c="curl" /> <P c="-X POST" /> <S c="https://api.rukpi.finance/v1/payments" /> <P c="\" /></>,
      <>  <P c="-H" /> <S c='"Authorization: Bearer rk_live_…"' /> <P c="\" /></>,
      <>  <P c="-H" /> <S c='"Idempotency-Key: 9f2c…"' /> <P c="\" /></>,
      <>  <P c="-d" /> <S c={"'{\"amount\": \"25.00\", \"currency\": \"USD\", \"rail\": \"auto\"}'"} /></>,
    ],
  },
  node: {
    plain: `const res = await fetch("https://api.rukpi.finance/v1/payments", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.RUKPI_KEY}\`,
    "Idempotency-Key": crypto.randomUUID(),
  },
  body: JSON.stringify({ amount: "25.00", currency: "USD", rail: "auto" }),
});`,
    lines: [
      <><T c="const" /> <P c="res" /> <M c="=" /> <T c="await" /> <P c="fetch(" /><S c='"https://api.rukpi.finance/v1/payments"' /><P c=", {" /></>,
      <>  <P c="method:" /> <S c='"POST"' /><P c="," /></>,
      <>  <P c="headers: {" /></>,
      <>    <P c="Authorization:" /> <S c="`Bearer ${process.env.RUKPI_KEY}`" /><P c="," /></>,
      <>    <S c='"Idempotency-Key"' /><P c=":" /> <P c="crypto.randomUUID()" /><P c="," /></>,
      <>  <P c="}," /></>,
      <>  <P c="body:" /> <P c="JSON.stringify({" /> <P c="amount:" /> <S c='"25.00"' /><P c=", currency:" /> <S c='"USD"' /><P c=", rail:" /> <S c='"auto"' /> <P c="})," /></>,
      <><P c="});" /></>,
    ],
  },
  python: {
    plain: `import rukpi

payment = rukpi.payments.create(
    amount="25.00",
    currency="USD",
    rail="auto",
    idempotency_key="9f2c…",
)`,
    lines: [
      <><T c="import" /> <P c="rukpi" /></>,
      <>&nbsp;</>,
      <><P c="payment" /> <M c="=" /> <P c="rukpi.payments.create(" /></>,
      <>    <P c="amount=" /><S c='"25.00"' /><P c="," /></>,
      <>    <P c="currency=" /><S c='"USD"' /><P c="," /></>,
      <>    <P c="rail=" /><S c='"auto"' /><P c="," /></>,
      <>    <P c="idempotency_key=" /><S c='"9f2c…"' /><P c="," /></>,
      <><P c=")" /></>,
    ],
  },
};

const BULLETS = [
  "Auto-generated OpenAPI docs, always in sync with the API",
  "Exactly-once semantics via SHA-256 idempotency keys",
  "Sandbox mirroring the pilot environment",
];

export default function DeveloperApi() {
  const [lang, setLang] = useState<Lang>("curl");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE[lang].plain);
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="api" className="bg-ink-0 scroll-mt-[72px]">
      <div className="mx-auto grid max-w-content items-center gap-12 px-6 py-24 lg:grid-cols-[7fr_5fr] lg:gap-16 lg:py-32">
        {/* Code panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-xl border border-ink-4/60 bg-ink-1 shadow-teal-edge"
        >
          {/* panel header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-ink-2 px-3 py-2">
            <div className="flex gap-1">
              {(["curl", "node", "python"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded-md px-3 py-1.5 font-mono text-[12px] tracking-[0.05em] transition-colors ${
                    lang === l
                      ? "bg-ink-3 text-teal"
                      : "text-txt-ter hover:text-txt-sub"
                  }`}
                >
                  {l === "curl" ? "cURL" : l === "node" ? "Node" : "Python"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1.5 rounded-md border border-ink-4 px-2.5 py-1.5 font-mono text-[11px] tracking-[0.06em] text-txt-sub transition-colors hover:border-teal hover:text-teal"
              aria-live="polite"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} />
                  <span className="text-success">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                  COPY
                </>
              )}
            </button>
          </div>
          {/* code body */}
          <div className="relative min-h-[280px] p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.pre
                key={lang}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto font-mono text-[12.5px] leading-[2] sm:text-[13.5px]"
              >
                {CODE[lang].lines.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
                <span className="ml-1 inline-block h-4 w-2 animate-caret-blink bg-teal align-middle" aria-hidden="true" />
              </motion.pre>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow text-teal">Developers</p>
          <h3 className="mt-4 font-display text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-txt sm:text-[32px]">
            Type-safe, idempotent, documented.
          </h3>
          <ul className="mt-8 space-y-4">
            {BULLETS.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 leading-[1.7] text-txt-sub"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                {b}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
