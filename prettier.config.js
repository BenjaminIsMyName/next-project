// see docs: https://prettier.io/docs/en/options.html
// also: https://prettier.io/docs/en/configuration.html
// see example from a project on GitHub: https://github.com/tailwindlabs/tailwindcss/blob/master/prettier.config.js

module.exports = {
  // These settings are duplicated in .editorconfig:
  tabWidth: 2, // indent_size = 2
  useTabs: false, // indent_style = space
  endOfLine: "lf", // end_of_line = lf
  semi: true, // default: true
  singleQuote: false, // default: false
  printWidth: 80, // default: 80
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "avoid",
};
