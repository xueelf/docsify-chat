import { build, type BuildConfig } from 'bun';
import { sassPlugin, svgPlugin } from './plugins';

const buildConfig: BuildConfig = {
  entrypoints: ['src/index.tsx'],
  outdir: 'lib',
  plugins: [sassPlugin(), svgPlugin()],
};

await build({
  ...buildConfig,
  naming: 'docsify-chat.[ext]',
});
await build({
  ...buildConfig,
  minify: true,
  naming: 'docsify-chat.min.[ext]',
});
