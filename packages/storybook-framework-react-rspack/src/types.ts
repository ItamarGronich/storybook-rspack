import type { ReactOptions, StorybookConfig as StorybookConfigBase, TypescriptOptions as TypescriptOptionsReact } from '@gitamar/storybook-preset-react-rspack';
import type { StorybookConfigRspack, BuilderOptions, TypescriptOptions as TypescriptOptionsBuilder } from '@gitamar/storybook-builder-rspack';

type FrameworkName = '@gitamar/storybook-framework-react-rspack';
type BuilderName = '@gitamar/storybook-builder-rspack';

export type FrameworkOptions = ReactOptions & {
  builder?: BuilderOptions;
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName;
        options: FrameworkOptions;
      };
  core?: StorybookConfigBase['core'] & {
    builder?:
      | BuilderName
      | {
          name: BuilderName;
          options: BuilderOptions;
        };
  };
  typescript?: Partial<TypescriptOptionsBuilder & TypescriptOptionsReact> & StorybookConfigBase['typescript'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<StorybookConfigBase, keyof StorybookConfigRspack | keyof StorybookConfigFramework> & StorybookConfigRspack & StorybookConfigFramework;
