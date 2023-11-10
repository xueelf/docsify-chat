import * as sass from 'sass';
import * as esbuild from 'esbuild';
import { readFile } from 'node:fs/promises';

/**
 * 生成 style 模块
 *
 * @param {string} css - css 文本
 * @returns 模块文本
 */
function styleModule(css) {
  return `
    const css = \`${css}\`;
    const styleElement = document.createElement('style');
    styleElement.textContent = css;

    document.head.appendChild(styleElement);
  `;
}

function svgPlugin() {
  /**
   * @type {esbuild.Plugin}
   */
  const svgPlugin = {
    name: 'svg',
    setup(build) {
      build.onLoad({ filter: /\.svg$/ }, async args => {
        const raw_svg = await readFile(args.path, 'utf-8');
        const svg = raw_svg.replace(/(\n|\s{2})/g, '');

        return {
          contents: svg,
          loader: 'text',
        };
      });
    },
  };
  return svgPlugin;
}

function sassPlugin() {
  /**
   * @type {esbuild.Plugin}
   */
  const sassPlugin = {
    name: 'sass',
    setup(build) {
      build.onLoad({ filter: /\.scss$/ }, async args => {
        const { css } = await sass.compileAsync(args.path, {
          style: 'compressed',
        });

        return {
          contents: styleModule(css),
        };
      });
    },
  };
  return sassPlugin;
}

/**
 * @type {esbuild.BuildOptions}
 */
const buildOptions = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  plugins: [sassPlugin(), svgPlugin()],
};

await esbuild.build({
  ...buildOptions,
  outfile: 'lib/docsify-chat.js',
});

await esbuild.build({
  ...buildOptions,
  minify: true,
  outfile: 'lib/docsify-chat.min.js',
});

console.log('✨🐢🚀✨');
