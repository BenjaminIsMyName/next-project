/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
};

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  dynamicStartUrl: true, // default
});

module.exports = withPWA(nextConfig);
