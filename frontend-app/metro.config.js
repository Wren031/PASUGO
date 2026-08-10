const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.experiments = {
  ...config.experiments,
  tsconfigPaths: true,
};

module.exports = withNativeWind(config, { input: './global.css' });
