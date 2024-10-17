const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias['react'] = require.resolve('react');
  config.resolve.alias['react-router'] = require.resolve('react-router');
  config.resolve.alias['react-router-dom'] = require.resolve('react-router-dom');
  return config;
};

module.exports = function override(config, env) {
  if (env === 'production') {
    config.plugins = config.plugins.filter(
      (plugin) => !(plugin.constructor && plugin.constructor.name === 'GenerateSW'),
    );
  }
  return config;
};
