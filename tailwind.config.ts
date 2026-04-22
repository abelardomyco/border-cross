import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        border: "var(--border)",
        muted: "var(--muted)",
        ops: {
          teal: "var(--accent-teal)",
          blue: "var(--accent-blue)",
          amber: "var(--accent-amber)",
          rose: "var(--accent-rose)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
