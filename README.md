# rollup-plugin-babili [![Build Status](https://travis-ci.org/Comandeer/rollup-plugin-babili.svg?branch=master)](https://travis-ci.org/Comandeer/rollup-plugin-babili) [![Dependency Status](https://david-dm.org/Comandeer/rollup-plugin-babili.svg)](https://david-dm.org/Comandeer/rollup-plugin-babili) [![devDependencies Status](https://david-dm.org/Comandeer/rollup-plugin-babili/dev-status.svg)](https://david-dm.org/Comandeer/rollup-plugin-babili?type=dev) [![npm](https://img.shields.io/npm/v/rollup-plugin-babili.svg)](https://www.npmjs.com/package/rollup-plugin-babili)

Allows using [Babili minifier](https://github.com/babel/babili) with Rollup.

## Installation

```bash
npm install rollup-plugin-babili [--save-dev]
```

## Usage

```javascript
import { rollup } from 'rollup';
import babili from 'rollup-plugin-babili';

rollup( {
	entry: './src/index.js',
	plugins: [
		babili( {
			// Options for Babili.
		} )
	]
} );
```

For the list of options, check [Babili Preset's docs](https://github.com/babel/babili/blob/master/packages/babel-preset-babili/README.md#options).

There are additional options:

* `comments` (default: `true`): indicates if comments should be preserved in source
* `banner` (default: `undefined`): the comment which should be prepended to the transformed bundle
* `sourceMap` (default: `true`): indicates if sourcemap should be generated

## License

See [LICENSE](./LICENSE) file for details.
