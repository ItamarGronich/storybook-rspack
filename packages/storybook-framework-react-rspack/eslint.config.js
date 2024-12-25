const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['@gitamar/storybook-preset-react-rspack', '@storybook/react', '@babel/core', 'react-dom', 'storybook', 'typescript', 'react'],
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}', '{projectRoot}/vite.config.{js,ts,mjs,mts}'],
        },
      ],
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser'),
    },
  },
];
