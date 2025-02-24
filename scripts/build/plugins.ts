import type { BunPlugin, PluginBuilder } from 'bun';
import { compileAsync } from 'sass';

export function sassPlugin(): BunPlugin {
  return {
    name: 'sass',
    setup(builder: PluginBuilder) {
      builder.onLoad({ filter: /\.scss$/ }, async ({ path }) => {
        const { css } = await compileAsync(path, {
          style: builder.config.minify ? 'compressed' : 'expanded',
        });

        return {
          loader: 'text',
          contents: css,
        };
      });
    },
  };
}

export function svgPlugin(): BunPlugin {
  return {
    name: 'svg',
    setup(builder: PluginBuilder) {
      builder.onLoad({ filter: /\.svg$/ }, async ({ path }) => {
        let contents = await Bun.file(path).text();

        if (builder.config.minify) {
          contents = contents.replace(/\n(\s{2})*/g, '');
        }
        return {
          loader: 'text',
          contents,
        };
      });
    },
  };
}
