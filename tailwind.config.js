/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}", // Include TypeScript files if applicable
    "./components/**/*.{js,jsx,ts,tsx}", // Include TypeScript files if applicable
    "./context/**/*.{js,jsx,ts,tsx}", // Include context folder (if needed)
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // Themes configuration
  },
};
