# @gitamar/storybook-builder-rspack

This library is a storybook `framework` that uses Rspack and React.

Builder implemented with `Rspack` and `Rspack`-compatible loaders/plugins/config, used by `@storybook/core-server` to build the preview iframe.

## Usage

```bash
npm install @gitamar/storybook-builder-rspack
```

then add it to your storybook config `.storybook/main.js`:

```js
export default {
  core: {
    builder: '@gitamar/storybook-builder-rspack',
  },
};
```
