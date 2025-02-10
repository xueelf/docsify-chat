import { build, type BuildOptions } from 'esbuild';
import { sassPlugin, svgPlugin } from './plugins';

const buildConfig: BuildOptions = {
  bundle: true,
  entryPoints: ['src/index.tsx'],
  plugins: [sassPlugin(), svgPlugin()],
};

await build({
  ...buildConfig,
  outfile: 'lib/docsify-chat.js',
});
await build({
  ...buildConfig,
  minify: true,
  outfile: 'lib/docsify-chat.min.js',
});
