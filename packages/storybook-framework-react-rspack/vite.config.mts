import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir:
    '../../node_modules/.vite/packages/storybook-framework-react-rspack',
  plugins: [],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    passWithNoTests: true,
    coverage: {
      reportsDirectory:
        '../../coverage/packages/storybook-framework-react-rspack',
      provider: 'v8',
    },
  },
});
