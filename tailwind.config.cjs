/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#90caf9",
          dark: "#5d99c6",
          light: "#c3fdff",
        },
        onPrimary: "#000000",
        secondary: {
          default: "#ffab91",
          dark: "#c97b63",
          light: "#ffddc1",
        },
        onSecondary: "#000000",
        background: "#121212",
        onBackground: "#ffffff",
        surface: {
          default: "#1f1f1f",
          dark: "#121212",
          light: "#2f2f2f",
        },
        onSurface: "#ffffff",
      },
    },
  },
  plugins: [],
};
