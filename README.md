# rollup-plugin-real-babili [![Build Status](https://travis-ci.org/Comandeer/rollup-plugin-real-babili.svg?branch=master)](https://travis-ci.org/Comandeer/rollup-plugin-real-babili) [![Dependency Status](https://david-dm.org/Comandeer/rollup-plugin-real-babili.svg)](https://david-dm.org/Comandeer/rollup-plugin-real-babili) [![devDependency Status](https://david-dm.org/Comandeer/rollup-plugin-real-babili/dev-status.svg)](https://david-dm.org/Comandeer/rollup-plugin-real-babili#info=devDependencies)

Allows using [Babili minifier](https://github.com/babel/babili) with Rollup.

## Installation

```bash
npm install rollup-plugin-real-babili [--save-dev]
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

## License

See [LICENSE](./LICENSE) file for details.
