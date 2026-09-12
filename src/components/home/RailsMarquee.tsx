const RAILS = [
  { name: "EVC PLUS", op: "Hormuud Telecom" },
  { name: "ZAAD", op: "Telesom" },
  { name: "SAHAL", op: "Golis Telecom" },
  { name: "E-DAHAB", op: "Somtel" },
  { name: "E-BESA", op: "IBS Bank" },
  { name: "MY-CASH", op: "Amal Bank" },
  { name: "PREMIER WALLET", op: "Premier Bank" },
  { name: "SIPS", op: "Central-bank switch" },
  { name: "CASH AGENTS", op: "Last-mile liquidity" },
];

function RailChip({ name, op }: { name: string; op: string }) {
  return (
    <div className="mx-3 flex shrink-0 items-center gap-3 rounded-lg border border-white/[0.08] bg-ink-1 px-5 py-3 transition-colors duration-300 hover:border-teal/50">
      <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
      <span className="font-mono text-[13px] font-medium tracking-[0.08em] text-txt">
        {name}
      </span>
      <span className="text-[12px] text-txt-ter">{op}</span>
    </div>
  );
}

/** Infinite rail marquee (21st.dev logo-cloud pattern): duplicated track, seamless -50% loop, edge fade, pause on hover. */
export default function RailsMarquee() {
  return (
    <section
      aria-label="Connected payment rails"
      className="relative overflow-hidden border-y border-white/[0.06] bg-ink-0 py-8"
    >
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-txt-ter">
        One contract across every rail
      </p>
      <div className="group relative [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {RAILS.map((r) => (
            <RailChip key={r.name} {...r} />
          ))}
          {RAILS.map((r) => (
            <RailChip key={`dup-${r.name}`} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
