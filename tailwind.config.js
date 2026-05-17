/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skill: {
          bg: "#EAECDC",     
          primary: "#325443" 
        }
      }
    },
  },
  plugins: [],
};