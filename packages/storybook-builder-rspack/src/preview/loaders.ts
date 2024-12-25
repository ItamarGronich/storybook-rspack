import { getProjectRoot } from '@storybook/core-common';
import type { Options as SwcOptions } from '@swc/core';
import { dedent } from 'ts-dedent';
import { logger } from '@storybook/node-logger';
import type { Options } from '@storybook/types';

export const createSWCLoader = async (excludes: string[] = [], options: Options) => {
  logger.info(dedent`Using SWC compiler`);

  const swc = await options.presets.apply('swc', {}, options);
  const typescriptOptions = await options.presets.apply<{
    skipCompiler?: boolean;
  }>('typescript', {}, options);

  const config: SwcOptions = {
    ...swc,
    jsc: {
      ...(swc.jsc ?? {}),
      parser: {
        ...(swc.jsc?.parser ?? {}),
        syntax: 'typescript',
        tsx: true,
        dynamicImport: true,
      },
    },
  };
  return {
    test: typescriptOptions.skipCompiler ? /\.(mjs|cjs|jsx?)$/ : /\.(mjs|cjs|tsx?|jsx?)$/,
    loader: 'builtin:swc-loader',
    options: config,
    include: [getProjectRoot()],
    exclude: [/node_modules/, ...excludes],
  };
};
