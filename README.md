# rollup-plugin-babel-minify

[![Build Status](https://github.com/Comandeer/rollup-plugin-babel-minify/workflows/CI/badge.svg)](https://github.com/Comandeer/rollup-plugin-babel-minify/actions) [![codecov](https://codecov.io/gh/Comandeer/rollup-plugin-babel-minify/branch/master/graph/badge.svg)](https://codecov.io/gh/Comandeer/rollup-plugin-babel-minify) [![Dependency Status](https://david-dm.org/Comandeer/rollup-plugin-babel-minify.svg)](https://david-dm.org/Comandeer/rollup-plugin-babel-minify) [![devDependencies Status](https://david-dm.org/Comandeer/rollup-plugin-babel-minify/dev-status.svg)](https://david-dm.org/Comandeer/rollup-plugin-babel-minify?type=dev) [![npm](https://img.shields.io/npm/v/rollup-plugin-babel-minify.svg)](https://www.npmjs.com/package/rollup-plugin-babel-minify)

Allows using [babel-minify](https://github.com/babel/minify) with [Rollup](https://rollupjs.org/guide/en).

## ☠️ Project is deprecated! ☠️

Version 10.0.0, released on 2020-03-14, will be the last version of the project, as [`babel-minify` is basically dead](https://github.com/babel/minify/issues/952). Please consider using [`rollup-plugin-terser`](https://www.npmjs.com/package/rollup-plugin-terser) instead.

## Installation

```bash
npm install rollup-plugin-babel-minify [--save-dev]
```

## Usage

```javascript
import { rollup } from 'rollup';
import minify from 'rollup-plugin-babel-minify';

rollup( {
	input: './src/index.js',
	plugins: [
		minify( {
			// Options for babel-minify.
		} )
	]
} );
```

For the list of options, check [babel-minify preset's docs](https://github.com/babel/minify/blob/master/packages/babel-preset-minify/README.md#options).

There are additional options:

* `comments` (default: `true`): indicates if comments should be preserved in source;
* `banner` (default: `undefined`): the comment which should be prepended to the transformed bundle;
* `bannerNewLine` (since 4.0.0, default: `false`): indicates if the banner comment should be followed by a new line;
* `sourceMap` (default: `true`): indicates if sourcemap should be generated;
* `plugins` (since 6.2.0): indicates which Babel plugins should be loaded alongside [minify preset](https://github.com/babel/minify/tree/master/packages/babel-preset-minify); two plugins are loaded by default:
	* [`@comandeer/babel-plugin-banner`](https://www.npmjs.com/package/@comandeer/babel-plugin-banner),
	* [`@babel/plugin-syntax-dynamic-import`](https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import) (since 7.0.0).

Check [API docs](https://comandeer.github.io/rollup-plugin-babel-minify) for more detailed description.

## License

See [LICENSE](./LICENSE) file for details.
