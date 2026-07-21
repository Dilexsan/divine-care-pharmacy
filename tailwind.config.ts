import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clinic: {
          bg: "#FAFBFA",
          surface: "#FFFFFF",
          border: "#E4E9E8",
          ink: "#152423",
          muted: "#5C6E6C",
          teal: {
            DEFAULT: "#146C6E",
            dark: "#0E4F50",
            light: "#DFEEEC",
          },
          amber: {
            DEFAULT: "#B8720A",
            bg: "#FCF0DA",
          },
          red: {
            DEFAULT: "#B23A34",
            bg: "#FBE8E6",
          },
          green: {
            DEFAULT: "#2E7D5B",
            bg: "#E4F3EC",
          },
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(21, 36, 35, 0.06), 0 1px 1px rgba(21, 36, 35, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
