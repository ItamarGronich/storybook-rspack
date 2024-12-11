# @gitamar/storybook-builder-rspack

This library is a storybook `framework` that uses Rspack and React.

to use this first install the package:

```bash
npm install @gitamar/storybook-builder-rspack
```

then add it to your storybook config `.storybook/main.js`:

```js
module.exports = {
  // ...
  core: {
    builder: '@gitamar/storybook-builder-rspack',
  },
  // ...
};
```
