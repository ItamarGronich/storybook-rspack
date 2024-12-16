import type { StorybookConfig } from './types';

export * from './types';

export const addons: StorybookConfig['addons'] = [
  require.resolve(
    '@gitamar/storybook-preset-react-rspack/dist/framework-preset-react'
  ),
  require.resolve(
    '@gitamar/storybook-preset-react-rspack/dist/framework-preset-cra'
  ),
  require.resolve(
    '@gitamar/storybook-preset-react-rspack/dist/framework-preset-react-docs'
  ),
];
