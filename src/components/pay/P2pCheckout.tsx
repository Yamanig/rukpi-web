import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Timer, CheckCircle2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const RECIPIENTS = ["AH", "FA", "MJ", "KD", "SO"];

/** Panel A — interactive send-money mock. */
function SendMoneyPanel() {
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(false);

  const send = () => {
    if (sending) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setToast(true);
      window.setTimeout(() => setToast(false), 2400);
    }, 800);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-bordergray bg-white p-6 shadow-light-card lg:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
          <Send className="h-5 w-5 text-teal" strokeWidth={1.5} />
        </span>
        <h3 className="font-display text-2xl font-semibold">Send Money</h3>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ltxt-sub">
        Pay anyone by phone number — no rail, no wallet app, no guesswork on their side. Dynamic
        fees shown before you send.
      </p>

      {/* entry mock */}
      <div className="mt-6 rounded-lg border border-bordergray bg-offwhite px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ltxt-muted">
          Phone number
        </p>
        <p className="tabular mt-1 font-mono text-[15px] text-ltxt">+252 ·· ···· 4492</p>
      </div>

      {/* recent recipients */}
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ltxt-muted">
        Recent recipients — tap to send $25
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {RECIPIENTS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={send}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-bordergray bg-white font-mono text-[13px] text-ltxt transition-all duration-200 hover:scale-105 hover:border-teal hover:text-teal"
            aria-label={`Send $25 to recipient ${r}`}
          >
            {r}
          </button>
        ))}
      </div>

      <p className="tabular mt-6 font-mono text-[12px] tracking-[0.04em] text-ltxt-muted">
        FEE $0.25 · TOTAL $25.25 · SHOWN BEFORE YOU SEND
      </p>

      {/* flying teal coin */}
      <AnimatePresence>
        {sending && (
          <motion.div
            key="coin"
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: [0, 48, 96],
              y: [0, -120, -210],
              scale: [1, 1.15, 0.4],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="pointer-events-none absolute bottom-[168px] left-12 h-5 w-5 rounded-full bg-teal shadow-teal-glow"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* success toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-x-6 bottom-6 flex items-center gap-3 rounded-lg border border-success/40 bg-ink-0 px-4 py-3 shadow-light-card"
            role="status"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" strokeWidth={1.5} />
            <span className="tabular font-mono text-[13px] tracking-[0.06em] text-txt">
              SENT · $25.00 · &lt;1s
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Panel B — checkout authorization with looping countdown. */
function CheckoutPanel() {
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((s) => (s <= 0 ? 300 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex h-full flex-col rounded-xl border border-bordergray bg-white p-6 shadow-light-card lg:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
          <Timer className="h-5 w-5 text-teal" strokeWidth={1.5} />
        </span>
        <h3 className="font-display text-2xl font-semibold">Pay with RUKPI</h3>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ltxt-sub">
        Checkout online, approve in-app. A push notification with the itemized order, a 5-minute
        expiry timer, and real-time sync to the merchant.
      </p>

      <div className="relative mt-6 overflow-hidden rounded-lg border border-bordergray">
        <img
          src="/pay-checkout.png"
          alt="Pay with RUKPI authorization push with itemized order sheet and approve button"
          className="block h-56 w-full object-cover object-top sm:h-64"
        />
        {/* countdown chip */}
        <div className="absolute right-3 top-3 flex items-center gap-2 rounded-md border border-amber/50 bg-ink-0/90 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-amber" />
          <motion.span
            key={seconds}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="tabular inline-block font-mono text-[14px] font-medium tracking-[0.08em] text-amber"
          >
            {mm}:{ss}
          </motion.span>
        </div>
      </div>

      <p className="tabular mt-6 font-mono text-[12px] tracking-[0.04em] text-ltxt-muted">
        AUTHORIZATION EXPIRES AFTER 5:00 · MERCHANT SYNCED IN REAL TIME
      </p>
    </div>
  );
}

export default function P2pCheckout() {
  return (
    <section className="bg-offwhite py-24 text-ltxt lg:py-32">
      <div className="mx-auto max-w-content px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {[SendMoneyPanel, CheckoutPanel].map((Panel, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              <Panel />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
