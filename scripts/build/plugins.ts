import type { Plugin, PluginBuild } from 'esbuild';
import { compileAsync } from 'sass';

export function sassPlugin(): Plugin {
  return {
    name: 'sass',
    setup(build: PluginBuild) {
      build.onLoad({ filter: /\.scss$/ }, async ({ path }) => {
        const { css } = await compileAsync(path, {
          style: build.initialOptions.minify ? 'compressed' : 'expanded',
        });

        return {
          loader: 'text',
          contents: css,
        };
      });
    },
  };
}

export function svgPlugin(): Plugin {
  return {
    name: 'svg',
    setup(build: PluginBuild) {
      build.onLoad({ filter: /\.svg$/ }, async ({ path }) => {
        let contents = await Bun.file(path).text();

        if (build.initialOptions.minify) {
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
