/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "900px",
      // => @media (min-width: 900px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      animation: {
        up: "up 1s ease-in-out forwards",
      },
      keyframes: {
        up: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
    colors: {
      "main-color": withOpacity("--main-color"),
      "second-color": withOpacity("--second-color"),
      "third-color": withOpacity("--third-color"),
      "shadows-color": withOpacity("--shadows-color"),
      "option-text-color": withOpacity("--option-text-color"),
      "error-color": withOpacity("--error-color"),
    },
    fontFamily: {
      "main-font-family": "var(--main-font-family)",
      "another-font-family": "var(--another-font-family)",
      "custom-font-family": "var(--custom-font-family)",
    },
  },

  plugins: [],
};

function withOpacity(variableName) {
  return ({ opacityValue }) =>
    `rgba(var(${variableName}), ${opacityValue || 1})`;
}
