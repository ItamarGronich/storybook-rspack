import { dirname, join } from 'path';
import ReactRefreshRspackPlugin from '@rspack/plugin-react-refresh';

import { logger } from '@storybook/node-logger';

import type { Options, Preset } from '@storybook/core-webpack';
import type { StorybookConfig, ReactOptions } from './types';

const getAbsolutePath = (input: string): string => dirname(require.resolve(join(input, 'package.json')));

const shouldApplyFastRefresh = async (options: Options) => {
  const isDevelopment = options.configType === 'DEVELOPMENT';
  const framework = await options.presets.apply<Preset>('framework');
  const reactOptions = (typeof framework === 'object' ? framework.options : {}) as ReactOptions;
  return isDevelopment && (reactOptions.fastRefresh || process.env.FAST_REFRESH === 'true');
};

export const babel: StorybookConfig['babel'] = async (config, options) => {
  if (!(await shouldApplyFastRefresh(options))) return config;

  return {
    ...config,
    plugins: [[require.resolve('react-refresh/babel'), {}, 'storybook-react-refresh'], ...(config.plugins || [])],
  };
};
const storybookReactDirName = getAbsolutePath('@gitamar/storybook-preset-react-rspack');
// TODO: improve node_modules detection
const context = storybookReactDirName.includes('node_modules')
  ? join(storybookReactDirName, '../../') // Real life case, already in node_modules
  : join(storybookReactDirName, '../../node_modules'); // SB Monorepo

const hasJsxRuntime = () => {
  try {
    require.resolve('react/jsx-runtime', { paths: [context] });
    return true;
  } catch (e) {
    return false;
  }
};

export const babelDefault: StorybookConfig['babelDefault'] = async config => {
  const presetReactOptions = hasJsxRuntime() ? { runtime: 'automatic' } : {};
  return {
    ...config,
    presets: [...(config?.presets || []), [require.resolve('@babel/preset-react'), presetReactOptions]],
    plugins: [...(config?.plugins || []), require.resolve('babel-plugin-add-react-displayname')],
  };
};

export const rspackFinal: StorybookConfig['rspackFinal'] = async (config, options) => {
  if (!(await shouldApplyFastRefresh(options))) return config;

  // matches the name of the plugin in CRA.
  const hasReactRefresh = !!config.plugins?.find(p => p?.constructor.name === 'ReactRefreshPlugin');

  if (hasReactRefresh) {
    logger.warn("=> React refresh is already set. You don't need to set the option");
    return config;
  }

  logger.info('=> Using React fast refresh');

  return {
    ...config,
    plugins: [
      ...(config.plugins || []),

      // Storybook uses webpack-hot-middleware https://github.com/storybookjs/storybook/issues/14114
      new ReactRefreshRspackPlugin({
        overlay: {
          sockIntegration: 'whm',
        },
      }),
    ],
  };
};

export const swc: StorybookConfig['swc'] = async (config, options) => {
  const isDevelopment = options.configType !== 'PRODUCTION';

  if (!(await shouldApplyFastRefresh(options))) {
    return config;
  }

  return {
    ...config,
    jsc: {
      ...(config?.jsc ?? {}),
      transform: {
        ...(config?.jsc?.transform ?? {}),
        react: {
          ...(config?.jsc?.transform?.react ?? {}),
          development: isDevelopment,
          refresh: isDevelopment,
        },
      },
    },
  };
};
