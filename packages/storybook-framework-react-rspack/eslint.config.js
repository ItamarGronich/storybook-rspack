const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
<<<<<<< Updated upstream
          ignoredDependencies: [
            '@gitamar/storybook-builder-rspack',
            '@gitamar/storybook-preset-react-rspack',
            '@storybook/react',
            '@babel/core',
            'react-dom',
            'storybook',
            'typescript',
            'react',
          ],
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
          ],
||||||| Stash base
          ignoredDependencies: [
            '@storybook/react',
            '@babel/core',
            'react-dom',
            'storybook',
            'typescript',
            'react',
          ],
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
          ],
=======
          ignoredDependencies: ['@gitamar/storybook-preset-react-rspack', '@storybook/react', '@babel/core', 'react-dom', 'storybook', 'typescript', 'react'],
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}', '{projectRoot}/vite.config.{js,ts,mjs,mts}'],
>>>>>>> Stashed changes
        },
      ],
    },
    languageOptions: {
      parser: require('jsonc-eslint-parser'),
    },
  },
];
