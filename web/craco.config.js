const path = require('path');
module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
          if (oneOfRule) {
            const tsxRule = oneOfRule.oneOf.find(
              rule => rule.test && rule.test.toString().includes('tsx')
            );

            const newIncludePaths = [
              // relative path to the shared module
              path.resolve(__dirname, '../shared'),
            ];
            if (tsxRule) {
              if (Array.isArray(tsxRule.include)) {
                tsxRule.include = [...tsxRule.include, ...newIncludePaths];
              } else {
                tsxRule.include = [tsxRule.include, ...newIncludePaths];
              }
            }
          }
          return webpackConfig;
        },
      },
    },
  ],
};
