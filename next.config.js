/** @type {import('next').NextConfig} */

const runtimeCaching = require("./cache");
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  experimental: {
    /* 
    without this there is a tiny bug in the current version of next.js - when opening a post (only when there are many posts) for the first time and then clicking on
    the go-back button in the browser, the page (feed) will scroll to the top. FocusTrap's "onDeactivate" is 
    solving this for some reason, but not when opening a post *for the first time*
    see: https://github.com/vercel/next.js/issues/37893#issuecomment-1221335543
    and also see alternative solution: https://github.com/vercel/next.js/issues/20951#issuecomment-757565850
    */
    scrollRestoration: true,
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  dynamicStartUrl: true, // default
  // maximumFileSizeToCacheInBytes: 15, // doesn't work...
  runtimeCaching,
});

module.exports = withPWA(nextConfig);
