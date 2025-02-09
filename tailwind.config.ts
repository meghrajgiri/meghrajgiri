import { withTV } from "tailwind-variants/transformer";

import { Config } from "tailwindcss";

module.exports = withTV({
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-grid": "url('/hero-img.png')",
      },
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        button: "var(--button-color)",
        "button-outline": "var(--button-outline-color)",
        "button-secondary": "var(--button-secondary-color)",
        background: "var(--background-color)",
        white: {
          10: "var(--white-10)",
          15: "var(--white-15)",
          20: "var(--white-20)",
          35: "var(--white-35)",
          50: "var(--white-50)",
          100: "var(--white-100)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config);
