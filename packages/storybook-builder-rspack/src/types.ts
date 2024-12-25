import type { Configuration, Stats } from '@rspack/core';
import type { Options, BuilderResult as BuilderResultBase, StorybookConfig, TypescriptOptions as RspackTypescriptOptions } from '@storybook/core-webpack';

import type { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';

type TypeScriptOptionsBase = Partial<RspackTypescriptOptions>;

/**
 * Options for TypeScript usage within Storybook.
 */
export interface TypescriptOptions extends TypeScriptOptionsBase {
  /**
   * Configures `ts-checker-rspack-plugin`
   */
  checkOptions?: ConstructorParameters<typeof TsCheckerRspackPlugin>[0];
}

export interface StorybookConfigRspack extends Omit<StorybookConfig, 'rspack' | 'rspackFinal'> {
  /**
   * Modify or return a custom rspack config after the Storybook's default configuration
   * has run (mostly used by addons).
   */
  rspack?: (config: Configuration, options: Options) => Configuration | Promise<Configuration>;

  /**
   * Modify or return a custom Rspack config after every addon has run.
   */
  rspackFinal?: (config: Configuration, options: Options) => Configuration | Promise<Configuration>;
}

export type BuilderOptions = {
  lazyCompilation?: boolean;
};

export interface BuilderResult extends BuilderResultBase {
  stats?: Stats;
}
