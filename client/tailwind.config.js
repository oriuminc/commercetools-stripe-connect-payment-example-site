/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  safelist: [
    "bg-custom-teal",
    "bg-custom-indigo"
  ],
  theme: {
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      colors: {
        purple: "#7e5bef",
        pink: "#ff49db",
        orange: "#ff7849",
        "gray-dark": "#273444",
        gray: "#8492a6",
        "gray-light": "#d3dce6",
        "custom-teal": "#0bbfbf",
        "custom-indigo": "#6359ff",
      },
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
      }
    },
  },
};
