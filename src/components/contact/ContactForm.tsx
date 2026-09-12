import { forwardRef, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { TOPICS, topicFromQuery } from "./topics";
import type { TopicKey } from "./topics";

type Status = "idle" | "sending" | "sent";

interface Fields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type Errors = Partial<Record<keyof Fields | "topic", string>>;

interface ContactFormProps {
  topic: TopicKey;
  onTopicChange: (t: TopicKey) => void;
  /** increments each time a routing card is clicked → flash topic border teal once */
  flash: number;
}

const INPUT =
  "w-full rounded-[4px] border border-bordergray bg-subtle px-4 py-3 text-[15px] text-ltxt placeholder:text-ltxt-muted transition-all duration-200 focus:border-teal focus:outline-none focus:ring-[3px] focus:ring-teal/20";
const LABEL = "mb-2 block font-mono text-[13px] uppercase tracking-[0.05em] text-ltxt-sub";

const shake = {
  rest: { x: 0 },
  err: { x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } },
};

function makeRef(): string {
  const chars = "0123456789ABCDEF";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * 16)];
  return `RQ-${s}`;
}

/** Faint skyline-line SVG motif for the HQ card. */
function SkylineMotif() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-bordergray"
      viewBox="0 0 400 96"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 96 V64 H24 V48 H40 V70 H58 V38 H74 V58 H96 V30 H112 V52 H132 V20 H150 V44 H172 V66 H192 V40 H210 V60 H232 V26 H252 V54 H272 V72 H296 V46 H316 V62 H340 V34 H360 V58 H380 V74 H400 V96"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M0 96 H400" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const ContactForm = forwardRef<HTMLDivElement, ContactFormProps>(function ContactForm(
  { topic, onTopicChange, flash },
  ref,
) {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [refCode, setRefCode] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [flashOn, setFlashOn] = useState(false);

  // Honor `?topic=` on first mount (contact.md Section 2)
  useEffect(() => {
    const q = topicFromQuery(new URLSearchParams(window.location.search).get("topic"));
    if (q) onTopicChange(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Teal border flash on the topic field when a routing card selects it
  useEffect(() => {
    if (flash === 0) return;
    setFlashOn(true);
    const t = window.setTimeout(() => setFlashOn(false), 900);
    return () => window.clearTimeout(t);
  }, [flash]);

  const set = (k: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!fields.name.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
      next.email = "Enter a valid email address.";
    if (!fields.message.trim()) next.message = "A short message helps us route this fast.";
    setErrors(next);
    setAttempt((a) => a + 1);
    if (Object.keys(next).length > 0) return;
    setStatus("sending");
    window.setTimeout(() => {
      setRefCode(makeRef());
      setStatus("sent");
    }, 1200);
  };

  const fieldWrap = (key: keyof Fields, children: React.ReactNode) => (
    <motion.div
      key={`${key}-${attempt}`}
      variants={shake}
      initial="rest"
      animate={errors[key] ? "err" : "rest"}
    >
      {children}
      {errors[key] && <p className="mt-1.5 text-[13px] font-medium text-error">{errors[key]}</p>}
    </motion.div>
  );

  const errRing = (k: keyof Fields) => (errors[k] ? " !border-error focus:!ring-error/20" : "");

  return (
    <section ref={ref} id="contact-form" className="scroll-mt-[96px] bg-white py-24 lg:py-32">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-14 px-6 lg:grid-cols-[3fr_2fr] lg:gap-16">
        {/* Form column (60%) */}
        <div className="relative min-h-[420px]">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-xl border border-bordergray bg-offwhite px-8 py-16 text-center"
              >
                <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <motion.path
                    d="M20 33 L28.5 41.5 L45 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
                <p className="mt-6 font-display text-2xl font-semibold text-ltxt">
                  Message received.
                </p>
                <p className="mt-2 text-[15px] text-ltxt-sub">
                  We respond within one business day.
                </p>
                <span className="mt-6 rounded-md border border-teal/40 px-3 py-1.5 font-mono text-[13px] tracking-[0.05em] text-teal">
                  REF: {refCode}
                </span>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={submit}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {(
                  [
                    ["topic", 0],
                    ["name", 1],
                    ["email", 2],
                    ["phone", 3],
                    ["message", 4],
                  ] as const
                ).map(([field, i]) => (
                  <motion.div
                    key={field}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {field === "topic" && (
                      <div>
                        <label htmlFor="contact-topic" className={LABEL}>
                          Topic
                        </label>
                        <select
                          id="contact-topic"
                          value={topic}
                          onChange={(e) => onTopicChange(e.target.value as TopicKey)}
                          className={`${INPUT} cursor-pointer ${flashOn ? "!border-teal !ring-[3px] !ring-teal/20" : ""}`}
                        >
                          {TOPICS.map((t) => (
                            <option key={t.key} value={t.key}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {field === "name" &&
                      fieldWrap(
                        "name",
                        <>
                          <label htmlFor="contact-name" className={LABEL}>
                            Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            value={fields.name}
                            onChange={set("name")}
                            placeholder="Amina Warsame"
                            className={INPUT + errRing("name")}
                          />
                        </>,
                      )}
                    {field === "email" &&
                      fieldWrap(
                        "email",
                        <>
                          <label htmlFor="contact-email" className={LABEL}>
                            Email
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={fields.email}
                            onChange={set("email")}
                            placeholder="you@business.so"
                            className={`${INPUT} font-mono ${errRing("email")}`}
                          />
                        </>,
                      )}
                    {field === "phone" &&
                      fieldWrap(
                        "phone",
                        <>
                          <label htmlFor="contact-phone" className={LABEL}>
                            Phone <span className="normal-case text-ltxt-muted">(optional)</span>
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            value={fields.phone}
                            onChange={set("phone")}
                            placeholder="+252 61 000 0000"
                            className={`${INPUT} font-mono`}
                          />
                        </>,
                      )}
                    {field === "message" &&
                      fieldWrap(
                        "message",
                        <>
                          <label htmlFor="contact-message" className={LABEL}>
                            Message
                          </label>
                          <textarea
                            id="contact-message"
                            rows={5}
                            value={fields.message}
                            onChange={set("message")}
                            placeholder="How can we help?"
                            className={`${INPUT} resize-y ${errRing("message")}`}
                          />
                        </>,
                      )}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-primary disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                        <span className="font-mono text-[13px] tracking-[0.05em]">SENDING…</span>
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Info column (40%) */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="relative overflow-hidden rounded-xl border border-bordergray bg-offwhite p-7 pb-28 shadow-light-card">
            <p className="font-mono text-[13px] uppercase tracking-[0.05em] text-ltxt-muted">
              Headquarters
            </p>
            <p className="mt-3 font-display text-2xl font-semibold text-ltxt">
              Mogadishu, Somalia
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ltxt-sub">
              The unified payment layer for Somalia and Pan-Africa.
            </p>
            <SkylineMotif />
          </div>
          <div className="rounded-xl border border-bordergray bg-offwhite p-7 shadow-light-card">
            <p className="font-mono text-[13px] uppercase tracking-[0.05em] text-ltxt-muted">
              App domain
            </p>
            <span className="mt-3 inline-block rounded-md border border-teal/40 px-3 py-1.5 font-mono text-[14px] tracking-[0.05em] text-teal">
              pay.rukpi.finance
            </span>
          </div>
          <p className="px-1 text-[14px] leading-relaxed text-ltxt-muted">
            For brand assets and interviews:{" "}
            <a
              href="mailto:press@rukpi.finance"
              className="font-mono text-[13px] text-teal underline decoration-teal/40 underline-offset-4 transition-colors hover:decoration-teal"
            >
              press@rukpi.finance
            </a>
          </p>
        </motion.aside>
      </div>
    </section>
  );
});

export default ContactForm;
