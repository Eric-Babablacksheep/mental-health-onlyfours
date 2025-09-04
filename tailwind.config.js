/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "hsl(320 20% 98%)",
        foreground: "hsl(240 15% 25%)",
        card: "hsl(320 15% 96%)",
        primary: "hsl(260 60% 75%)",
        secondary: "hsl(25 80% 85%)",
        accent: "hsl(150 50% 80%)",
        muted: "hsl(200 30% 92%)",
        destructive: "hsl(0 65% 70%)",
        border: "hsl(240 15% 88%)",
      },
      borderRadius: {
        xl: "1rem",
      },
      borderColor: ({ theme }) => ({
        DEFAULT: theme("colors.border"), 
      }),
      linearGradient: {
        calm: ["hsl(260 60% 85%)", "hsl(200 50% 85%)"],
        warm: ["hsl(25 80% 88%)", "hsl(45 70% 90%)"],
      },
    },
  },
  plugins: [],
}