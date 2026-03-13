import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        lunar:   "#373A36",
        saddle:  "#4F2C1D",
        bahama:  "#006A8E",
        sapling: "#DFD1A7",
      },
      fontFamily: {
        display: ["var(--font-quake)", "Cormorant Garamond", "Georgia", "serif"],
        heading:  ["var(--font-raleway)", "Helvetica Neue", "Helvetica", "sans-serif"],
        body:     ["var(--font-afacad)", "Helvetica Neue", "Helvetica", "sans-serif"],
        ui:       ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        heading: "0.075em",
        nav:     "0.1em",
        "nav-hover": "0.15em",
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
