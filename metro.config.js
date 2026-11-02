const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Tests are colocated with routes. Keep them out of the app bundle and of the
// static web render, where a Jest global such as `expect` is not defined.
config.resolver.blockList = [
  /.*\.test\.[jt]sx?$/,
  /.*\/__tests__\/.*/,
];

module.exports = config;
