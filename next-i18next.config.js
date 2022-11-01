const path = require("path");

module.exports = {
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en", "he"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en",
  },
  localePath: path.resolve("./public/locales"), // this might be fixing an issue where translations do not work in SSR pages on Vercel, see commit be333e45a56d895d4d401b507d8aff4824c22aae for more info
};
