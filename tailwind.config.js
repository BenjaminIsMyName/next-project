/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      "main-color": withOpacity("--main-color"),
      "second-color": withOpacity("--second-color"),
      "third-color": withOpacity("--third-color"),
      "shadows-color": withOpacity("--shadows-color"),
      "option-text-color": withOpacity("--option-text-color"),
      "error-color": withOpacity("--error-color"),
    },
  },

  plugins: [],
};

function withOpacity(variableName) {
  return ({ opacityValue }) =>
    `rgba(var(${variableName}), ${opacityValue || 1})`;
}
