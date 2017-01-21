# rollup-plugin-babili [![Build Status](https://travis-ci.org/Comandeer/rollup-plugin-babili.svg?branch=master)](https://travis-ci.org/Comandeer/rollup-plugin-babili) [![Dependency Status](https://david-dm.org/Comandeer/rollup-plugin-babili.svg)](https://david-dm.org/Comandeer/rollup-plugin-babili) [![devDependency Status](https://david-dm.org/Comandeer/rollup-plugin-babili/dev-status.svg)](https://david-dm.org/Comandeer/rollup-plugin-babili#info=devDependencies)

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

For the list of options, check [Babili's docs](https://github.com/babel/babili/blob/master/README.md).

There are two additional options:

* `comments` (default: `true`): indicates if comments should be preserved in source
* `banner` (default: `undefined`): the comment which should be prepended to the transformed bundle

## License

See [LICENSE](./LICENSE) file for details.
