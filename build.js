import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

/**
 * @type {import('esbuild-sass-plugin').SassPluginOptions}
 */
const sassPluginOptions = {
  type: 'style',
};

/**
 * @type {import('esbuild').BuildOptions}
 */
const buildOptions = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  loader: {
    '.svg': 'text',
  },
  plugins: [sassPlugin(sassPluginOptions)],
};

await build({
  ...buildOptions,
  outfile: 'lib/docsify-chat.js',
});
await build({
  ...buildOptions,
  minify: true,
  outfile: 'lib/docsify-chat.min.js',
});
