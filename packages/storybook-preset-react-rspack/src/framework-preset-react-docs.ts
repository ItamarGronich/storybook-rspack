import { hasDocsOrControls } from '@storybook/docs-tools';
import type { Configuration } from '@rspack/core';
import type { StorybookConfig } from './types';
import { requirer } from './requirer';

export const rspackFinal: StorybookConfig['rspackFinal'] = async (config, options): Promise<Configuration> => {
  if (!hasDocsOrControls(options)) return config;

  const typescriptOptions = await options.presets.apply<StorybookConfig['typescript']>('typescript', {} as any);
  const debug = options.loglevel === 'debug';

  const { reactDocgen, reactDocgenTypescriptOptions } = typescriptOptions || {};

  if (typeof reactDocgen !== 'string') {
    return config;
  }

  if (reactDocgen !== 'react-docgen-typescript') {
    const babelOptions = await options.presets.apply('babel', {});
    return {
      ...config,
      module: {
        ...(config.module ?? {}),
        rules: [
          ...(config.module?.rules ?? []),
          {
            test: /\.(cjs|mjs|tsx?|jsx?)$/,
            loader: requirer(require.resolve, '@gitamar/storybook-preset-react-rspack/dist/loaders/react-docgen-loader'),
            options: {
              babelOptions,
              debug,
            },
            exclude: /(\.(stories|story)\.(js|jsx|ts|tsx))|(node_modules)/,
          },
        ],
      },
    };
  }

  const { ReactDocgenTypeScriptPlugin } = await import('@storybook/react-docgen-typescript-plugin');

  const babelOptions = await options.presets.apply('babel', {});

  return {
    ...config,
    module: {
      ...(config.module ?? {}),
      rules: [
        ...(config.module?.rules ?? []),
        {
          test: /\.(cjs|mjs|jsx?)$/,
          loader: requirer(require.resolve, '@gitamar/storybook-preset-react-rspack/dist/loaders/react-docgen-loader'),
          options: {
            babelOptions,
            debug,
          },
          exclude: /(\.(stories|story)\.(js|jsx|ts|tsx))|(node_modules)/,
        },
      ],
    },
    plugins: [
      ...(config.plugins || []),
      new ReactDocgenTypeScriptPlugin({
        ...reactDocgenTypescriptOptions,
        // We *need* this set so that RDT returns default values in the same format as react-docgen
        savePropValueAsString: true,
      }),
    ],
  };
};
