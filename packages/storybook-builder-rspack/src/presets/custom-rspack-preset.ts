import path from 'path';
import * as rspackReal from '@rspack/core';
import { logger } from '@storybook/node-logger';
import type { Options, CoreConfig } from '@storybook/types';
import { serverRequire } from '@storybook/core-common';
import type { Configuration } from '@rspack/core';
import deprecate from 'util-deprecate';
import { dedent } from 'ts-dedent';
import { createDefaultRspackConfig } from '../preview/base-rspack.config';

const rspackConfigs = ['rspack.config'];

export const loadCustomRspackConfig = (configDir: string) => serverRequire(rspackConfigs.map(configName => path.resolve(configDir, configName)));

export async function rspack(config: Configuration, options: Options) {
  // @ts-expect-error (Converted from ts-ignore)
  const { configDir, configType, presets, rspackConfig } = options;

  const coreOptions = await presets.apply<CoreConfig>('core');

  let defaultConfig = config;
  if (!coreOptions?.disableWebpackDefaults) {
    defaultConfig = await createDefaultRspackConfig(config, options);
  }

  const finalDefaultConfig = await presets.apply('rspackFinal', defaultConfig, options);

  // through standalone rspackConfig option
  if (rspackConfig) {
    return deprecate(
      rspackConfig,
      dedent`
      You've provided an Rspack config directly in CallOptions, this is not recommended. Please use presets instead. This feature will be removed in 7.0
      `,
    )(finalDefaultConfig);
  }

  // Check whether user has a custom Rspack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomRspackConfig(configDir);

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom Rspack config (full-control mode).');
    return customConfig({ config: finalDefaultConfig, mode: configType });
  }

  logger.info('=> Using default Rspack setup');
  return finalDefaultConfig;
}

export const rspackInstance = async () => rspackReal;
