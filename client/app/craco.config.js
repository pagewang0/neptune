
const webpack = require('webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.EnvironmentPlugin(['NODE_ENV'])
      ],
    },
    configure: webpackConfig => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        lazyCompilation: true,
      };


      return webpackConfig;
    }
  }
};