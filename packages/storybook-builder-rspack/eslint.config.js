const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: [
            '@storybook/react',
            '@babel/preset-flow',
            '@storybook/preview-api',
            '@types/babel__core',
            '@types/node',
            '@types/semver',
            'process',
            'semver',
            'url',
            'util',
            'react-dom',
            'react',
            '@babel/core',
            '@storybook/channels',
            '@storybook/client-logger',
          ],
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
        },
      ],
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser'),
    },
  },
];
