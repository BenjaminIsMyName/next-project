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
      // the "extend" is to preserve the default values but also *add* extra stuff.
      animation: {
        up: "up 1s ease-in-out forwards",
        skeleton: "skeleton 1s linear infinite alternate",
        "fade-up":
          "fade-up 1s ease-in-out forwards" /* if you change the timing, change the setTimeout in <Post/> too */,
        "go-in":
          "go-in 0.9s cubic-bezier(.38,1.89,0,1.07) forwards" /* consider: 0.4s cubic-bezier(.15,1.25,.51,1.62) */,
        show: "show 0.8s 0.4s ease forwards",
      },
      keyframes: {
        up: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        skeleton: {
          "0%": {
            opacity: "0.05",
            "background-color": "rgb(var(--third-color))",
          },
          "100%": {
            opacity: "0.2",
            "background-color": "rgb(var(--third-color))",
          },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(100%) rotateY(80deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0%) rotateY(0deg)",
          },
        },
        "go-in": {
          "0%": {
            transform: "scale(1) rotate(0deg)",
          },
          "10%": {
            transform: "scale(0.7) rotate(330deg)",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
          },
        },
        show: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
    // TODO: change the default shadows to use our colors.
    // boxShadow: {
    //   'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    // },
    colors: {
      // see: https://tailwindcss.com/blog/tailwindcss-v3-1#easier-css-variable-color-configuration
      "main-color": "rgb(var(--main-color), <alpha-value>)",
      "second-color": "rgb(var(--second-color), <alpha-value>)",
      "third-color": "rgb(var(--third-color), <alpha-value>)",
      "shadows-color": "rgb(var(--shadows-color), <alpha-value>)",
      "option-text-color": "rgb(var(--option-text-color), <alpha-value>)",
      "error-color": "rgb(var(--error-color), <alpha-value>)",
    },
    fontFamily: {
      "main-font-family": "var(--main-font-family)",
      "another-font-family": "var(--another-font-family)",
      "custom-font-family": "var(--custom-font-family)",
    },
  },

  plugins: [],
};
