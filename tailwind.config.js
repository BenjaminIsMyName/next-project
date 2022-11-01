/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
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
