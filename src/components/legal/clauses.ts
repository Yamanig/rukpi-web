/** Legal clause content for the /legal page (legal.md). */

export interface Clause {
  id: string;
  title: string;
  /** Plain-language summary shown on the left card */
  summary: string;
  /** Formal clause text (right column, expandable) */
  formal: string;
  /** Optional inline link rendered inside the formal text */
  link?: { to: string; label: string };
}

export const PRIVACY_CLAUSES: Clause[] = [
  {
    id: "privacy-data-we-collect",
    title: "Data we collect",
    summary: "Only what the service needs to function and comply.",
    formal:
      "RUKPI collects your phone number, KYC identity documents (required from TIER_2 upward), transaction telemetry — amounts, counterparties, timestamps, and the rail used — and device fingerprints for fraud prevention. We collect nothing beyond what is required to operate the service and to meet regulatory obligations.",
  },
  {
    id: "privacy-how-we-use",
    title: "How we use it",
    summary: "Your data works for you — scoring, security, compliance. Nothing else.",
    formal:
      "Personal data is used on a consent basis to process your transactions, compute your RUKPI SCORE, and perform fraud and AML screening. Data is processed only for the purposes stated at collection, and consent can be withdrawn where processing is not legally required.",
  },
  {
    id: "privacy-never-do",
    title: "What we never do",
    summary: "No sale of personal data. No dark-pattern consent. No hidden third-party sharing.",
    formal:
      "RUKPI does not sell personal data, does not obtain consent through dark patterns, and does not share personal data with third parties except as disclosed in this policy or as required by law. Any processor we engage is bound by equivalent data-protection obligations.",
  },
  {
    id: "privacy-deletion",
    title: "Account deletion",
    summary: "PII is purged within 30 days of account deletion.",
    formal:
      "When you delete your account, personally identifiable information is purged from our systems within 30 days. Ledger entries persist only as anonymized records where retention is legally required, and cannot be linked back to you.",
  },
  {
    id: "privacy-security",
    title: "Security of data",
    summary: "AES-256-GCM at rest, TLS 1.3 in transit, HSM-backed keys.",
    formal:
      "Data at rest is encrypted with AES-256-GCM; data in transit is protected by TLS 1.3. Cryptographic keys are held in hardware security modules. Technical and organizational measures are reviewed continuously.",
  },
  {
    id: "privacy-contact",
    title: "Contact",
    summary: "Privacy questions go to a human, not a ticket queue.",
    formal:
      "For any privacy question, request, or complaint, contact hello@rukpi.finance. We respond within one business day.",
    link: { to: "/contact", label: "Go to Contact" },
  },
];

export const TERMS_CLAUSES: Clause[] = [
  {
    id: "terms-service",
    title: "The service",
    summary: "One USD-denominated balance across every rail.",
    formal:
      "RUKPI provides payment infrastructure that unifies mobile-money rails and bank transfers into USD-denominated balances. The internal unit of account, SOMAS, equals 1 USD at all times.",
  },
  {
    id: "terms-accounts-kyc",
    title: "Accounts & KYC tiers",
    summary: "TIER_0 to TIER_3, with limits that grow as verification deepens.",
    formal:
      "Accounts operate under KYC tiers TIER_0 through TIER_3, each with associated transaction and balance limits. You must provide accurate information during onboarding; identity verification combines AI document analysis with manual review.",
  },
  {
    id: "terms-balances-fees",
    title: "Balances & fees",
    summary: "Available = Total − Reserved − Encumbered. Fees shown before you confirm.",
    formal:
      "Your available balance equals total balance minus reserved and encumbered amounts. All fees are displayed before every transaction; dynamic P2P fees are disclosed pre-send. No fee is ever applied without prior disclosure.",
  },
  {
    id: "terms-acceptable-use",
    title: "Acceptable use",
    summary: "Lawful use only. Screening and regulatory holds are mandatory, not optional.",
    formal:
      "The service may be used for lawful purposes only. All activity is subject to AML watchlist screening. Regulatory holds and compliance freezes may encumber balances where required by law.",
  },
  {
    id: "terms-pilot",
    title: "Pilot terms",
    summary: "Phase 5 is a closed-loop pilot with explicit ceilings and go/no-go gates.",
    formal:
      "During the Phase 5 closed-loop pilot, network-wide throughput is capped at 1,000 transactions per day, balances are denominated in SOMAS, and continuation past each stage is subject to published go/no-go gate commitments.",
  },
  {
    id: "terms-liability",
    title: "Liability & disputes",
    summary: "In-app disputes, with escalation targets from chat to war room.",
    formal:
      "Disputes are raised through the in-app flow and follow our support escalation targets: chat response under 5 minutes, up to war-room engagement under 30 minutes for critical incidents. These terms are governed by the laws of the Federal Republic of Somalia.",
  },
  {
    id: "terms-changes",
    title: "Changes",
    summary: "Material changes come with 30-day notice — in-app and by email.",
    formal:
      "We provide 30 days' notice of material changes to these terms, delivered in-app and by email. Continued use of the service after the notice period constitutes acceptance.",
  },
];
