/** Shared topic model for the Contact page (routing cards ↔ form dropdown). */

export type TopicKey = "general" | "merchants" | "support" | "press";

export interface Topic {
  key: TopicKey;
  /** Dropdown label (contact.md Section 2) */
  label: string;
  /** Routing card name */
  name: string;
  email: string;
  desc: string;
  badge?: { text: string; tone: "teal" | "success" };
}

export const TOPICS: Topic[] = [
  {
    key: "general",
    name: "General",
    label: "General",
    email: "hello@rukpi.finance",
    desc: "Questions about RUKPI, partnerships, or anything else.",
  },
  {
    key: "merchants",
    name: "Merchants",
    label: "Merchant onboarding",
    email: "merchants@rukpi.finance",
    desc: "Onboarding, pricing, and the pilot program.",
    badge: { text: "PILOT OPEN", tone: "teal" },
  },
  {
    key: "support",
    name: "Support",
    label: "Support",
    email: "support@rukpi.finance",
    desc: "Wallet or payment issues. Median resolution under 4 hours.",
    badge: { text: "<4H MEDIAN", tone: "success" },
  },
  {
    key: "press",
    name: "Press",
    label: "Press",
    email: "press@rukpi.finance",
    desc: "Media, interviews, and brand assets.",
  },
];

/** Resolve a `?topic=` query value to a TopicKey (accepts keys or labels). */
export function topicFromQuery(raw: string | null): TopicKey | null {
  if (!raw) return null;
  const norm = raw.trim().toLowerCase();
  const hit = TOPICS.find(
    (t) => t.key === norm || t.label.toLowerCase() === norm || t.name.toLowerCase() === norm,
  );
  return hit ? hit.key : null;
}
