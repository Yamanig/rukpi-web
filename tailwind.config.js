/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // RUKPI brand tokens (design.md Section 2)
        teal: {
          DEFAULT: "#00A3A1",
          deep: "#0B2F35",
        },
        amber: {
          DEFAULT: "#E5A93C",
          light: "#F0C76A",
        },
        ink: {
          0: "#040A0B",
          alt: "#090D10",
          1: "#0E1419",
          2: "#12181F",
          3: "#1A232B",
          4: "#2A3A47",
        },
        offwhite: "#F8FAFC",
        subtle: "#F1F5F9",
        bordergray: "#E2E8F0",
        txt: {
          DEFAULT: "#E8EDF0",
          sub: "#8FA3AD",
          ter: "#5A6E78",
        },
        ltxt: {
          DEFAULT: "#090D10",
          sub: "#475569",
          muted: "#94A3B8",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      transitionTimingFunction: {
        sovereign: "cubic-bezier(0.16, 1, 0.3, 1)",
        "sovereign-out": "cubic-bezier(0.7, 0, 0.3, 1)",
      },
      maxWidth: {
        content: "1280px",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "teal-glow": "0 8px 24px rgba(0,163,161,0.35)",
        "teal-edge": "inset 0 1px 0 rgba(0,163,161,0.25)",
        "light-card": "0 4px 24px rgba(9,13,16,0.06)",
      },
      backgroundImage: {
        "teal-sweep": "linear-gradient(135deg, #00A3A1, #0B2F35)",
        "dark-surface": "linear-gradient(180deg, #090D10, #12181F)",
        "amber-glow": "linear-gradient(135deg, #E5A93C, #F0C76A)",
        "glass-surface": "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "rail-drift": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scan-line": {
          "0%": { transform: "translateX(-10%)", opacity: "0" },
          "10%": { opacity: "0.15" },
          "90%": { opacity: "0.15" },
          "100%": { transform: "translateX(110%)", opacity: "0" },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "scroll-hint": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "45%": { transform: "scaleY(1)", transformOrigin: "top" },
          "55%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "rail-drift": "rail-drift 40s linear infinite",
        "scan-line": "scan-line 4s linear infinite",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
        marquee: "marquee 42s linear infinite",
        "scroll-hint": "scroll-hint 2.2s cubic-bezier(0.16,1,0.3,1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
