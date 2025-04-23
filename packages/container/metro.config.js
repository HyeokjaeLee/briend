// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// 절대 경로 설정 추가
config.resolver.extraNodeModules = {
  "@": path.resolve(__dirname),
  stores: path.resolve(__dirname, "stores"),
};

module.exports = config;
