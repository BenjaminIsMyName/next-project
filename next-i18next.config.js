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
  localePath: path.resolve("./public/locales"),
};
