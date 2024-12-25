import ReactDocgenTypescriptPlugin from '@storybook/react-docgen-typescript-plugin';
import type { TypescriptOptions } from '@storybook/core-webpack';
import type { Configuration } from '@rspack/core';
import * as preset from './framework-preset-react-docs';

jest.mock('./requirer', () => ({
  requirer: (resolver: never, path: string) => path,
}));

describe('framework-preset-react-docgen', () => {
  const presetsListWithDocs = [{ name: '@storybook/addon-docs', options: {}, preset: null }];

  // mock requirer

  describe('react-docgen', () => {
    it('should return the rspack config with the extra rspack loader', async () => {
      const rspackConfig: Configuration = {};

      const config = await preset.rspackFinal?.(rspackConfig, {
        presets: {
          apply: async (name: string) => {
            if (name === 'typescript') {
              return {
                check: false,
                reactDocgen: 'react-docgen',
              } as Partial<TypescriptOptions>;
            }

            if (name === 'babel') {
              return {
                plugins: [],
                presets: [],
              };
            }

            return undefined;
          },
        },
        presetsList: presetsListWithDocs,
      } as any);

      expect(config).toEqual({
        module: {
          rules: [
            {
              exclude: /(\.(stories|story)\.(js|jsx|ts|tsx))|(node_modules)/,
              loader: '@gitamar/storybook-preset-react-rspack/dist/loaders/react-docgen-loader',
              options: {
                babelOptions: { plugins: [], presets: [] },
                debug: false,
              },
              test: /\.(cjs|mjs|tsx?|jsx?)$/,
            },
          ],
        },
      });
    });
  });

  describe('react-docgen-typescript', () => {
    it('should return the rspack config with the extra plugin', async () => {
      const rspackConfig = {
        plugins: [],
      };

      const config = await preset.rspackFinal?.(rspackConfig, {
        presets: {
          // @ts-expect-error (not strict)
          apply: async (name: string) => {
            if (name === 'typescript') {
              return {
                check: false,
                reactDocgen: 'react-docgen-typescript',
              } as Partial<TypescriptOptions>;
            }

            if (name === 'babel') {
              return {
                plugins: [],
                presets: [],
              };
            }

            return undefined;
          },
        },
        presetsList: presetsListWithDocs,
      });

      expect(config).toEqual({
        module: {
          rules: [
            {
              exclude: /(\.(stories|story)\.(js|jsx|ts|tsx))|(node_modules)/,
              loader: '@gitamar/storybook-preset-react-rspack/dist/loaders/react-docgen-loader',
              options: {
                babelOptions: { plugins: [], presets: [] },
                debug: false,
              },
              test: /\.(cjs|mjs|jsx?)$/,
            },
          ],
        },
        plugins: [expect.any(ReactDocgenTypescriptPlugin)],
      });
    });
  });

  describe('no docgen', () => {
    it('should not add any extra plugins', async () => {
      const rspackConfig = {
        plugins: [],
      };

      const outputRspackconfig = await preset.rspackFinal?.(rspackConfig, {
        presets: {
          // @ts-expect-error (Converted from ts-ignore)
          apply: async () =>
            ({
              check: false,
              reactDocgen: false,
            } as Partial<TypescriptOptions>),
        },
        presetsList: presetsListWithDocs,
      });

      expect(outputRspackconfig).toEqual({ plugins: [] });
    });
  });

  describe('no docs or controls addon used', () => {
    it('should not add any extra plugins', async () => {
      const rspackConfig = {
        plugins: [],
      };

      const outputRspackconfig = await preset.rspackFinal?.(rspackConfig, {
        presets: {
          // @ts-expect-error (Converted from ts-ignore)
          apply: async () =>
            ({
              check: false,
              reactDocgen: 'react-docgen-typescript',
            } as Partial<TypescriptOptions>),
        },
        presetsList: [],
      });

      expect(outputRspackconfig).toEqual({
        plugins: [],
      });
    });
  });
});
