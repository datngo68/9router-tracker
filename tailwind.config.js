/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        surface: "#13161b",
        surface2: "#1b1f25",
        border: "#262b33",
        text: "#e7eaef",
        muted: "#8b94a3",
        primary: "#5b8def",
      },
    },
  },
  plugins: [],
};
