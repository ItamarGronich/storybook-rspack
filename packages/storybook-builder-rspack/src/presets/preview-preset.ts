import rspackConfig from '../preview/iframe-rspack.config';

export const rspack = async (_: unknown, options: any) => rspackConfig(options);

export const entries = async (_: unknown, options: any) => {
  let result: string[] = [];

  if (options.configType === 'DEVELOPMENT') {
    // Suppress informational messages when --quiet is specified. webpack-hot-middleware's quiet
    // parameter would also suppress warnings.
    result = result.concat(`${require.resolve('webpack-hot-middleware/client')}?reload=true&quiet=false&noInfo=${options.quiet}`);
  }

  return result;
};

export const previewMainTemplate = () => require.resolve('@gitamar/storybook-builder-rspack/templates/preview.ejs');
