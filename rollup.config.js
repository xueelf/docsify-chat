import json from '@rollup/plugin-json';
import sass from 'rollup-plugin-sass';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    { file: 'lib/docsify-chat.js', format: 'iife' },
    { file: 'lib/docsify-chat.min.js', format: 'iife', plugins: [terser()] },
  ],
  plugins: [
    json(),
    sass({
      insert: true,
    }),
  ],
};
