import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4ecdc",
        ink: "#261d16",
        brand: "#b55d33",
        accent: "#7f9c96",
        border: "#d9c7aa",
        card: "#fffaf1",
        storm: "#6f8196",
        sun: "#d69c28",
      },
      boxShadow: {
        note: "0 18px 45px rgba(38, 29, 22, 0.12)",
      },
      backgroundImage: {
        paper:
          "radial-gradient(circle at top, rgba(255,255,255,0.55), transparent 36%), linear-gradient(135deg, rgba(212,190,155,0.25), rgba(255,250,241,0.95))",
      },
    },
  },
  plugins: [],
};

export default config;
