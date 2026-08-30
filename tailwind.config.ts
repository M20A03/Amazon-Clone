import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          navy: "var(--color-amazon-navy)",
          dark: "var(--color-amazon-dark)",
          lightNavy: "var(--color-amazon-light-navy)",
          amber: "var(--color-amazon-amber)",
          amberHover: "var(--color-amazon-amber-hover)",
          orange: "var(--color-amazon-orange)",
          orangeHover: "var(--color-amazon-orange-hover)",
          yellow: "var(--color-amazon-yellow)",
          yellowHover: "var(--color-amazon-yellow-hover)",
          link: "var(--color-amazon-link)",
          price: "var(--color-amazon-price)",
          dealRed: "var(--color-amazon-deal-red)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          secondary: "var(--color-surface-secondary)",
          tertiary: "var(--color-surface-tertiary)",
          elevated: "var(--color-surface-elevated)",
        },
        background: {
          DEFAULT: "var(--color-background)",
          subtle: "var(--color-background-subtle)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        status: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          error: "var(--color-error)",
          info: "var(--color-info)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Amazon Ember", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        'amazon-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'amazon-card': '0 2px 5px 0 rgba(213,217,217,.5)',
        'amazon-focus': '0 0 0 3px rgba(254, 189, 105, 0.5)',
        'amazon-drawer': '-4px 0 24px rgba(0, 0, 0, 0.25)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
