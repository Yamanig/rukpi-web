import { useEffect, useState } from "react";
import type { Clause } from "./clauses";

interface TermsTocProps {
  clauses: Clause[];
}

/**
 * Sticky mini table-of-contents for the Terms tab (legal.md, desktop only).
 * Scroll-spy via IntersectionObserver: active section gets teal text +
 * left border indicator.
 */
export default function TermsToc({ clauses }: TermsTocProps) {
  const [active, setActive] = useState<string>(clauses[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    for (const c of clauses) {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [clauses]);

  return (
    <nav aria-label="Terms of Service sections" className="sticky top-[120px]">
      <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ltxt-muted">
        Contents
      </p>
      <ul className="space-y-1">
        {clauses.map((c, i) => {
          const isActive = active === c.id;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(c.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`block border-l-2 py-1.5 pl-4 text-[14px] transition-all duration-200 ${
                  isActive
                    ? "border-teal font-medium text-teal"
                    : "border-bordergray text-ltxt-muted hover:border-ltxt-muted hover:text-ltxt-sub"
                }`}
              >
                <span className="mr-2 font-mono text-[12px]">{String(i + 1).padStart(2, "0")}</span>
                {c.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
