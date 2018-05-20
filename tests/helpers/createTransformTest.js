import { readFileSync } from 'fs';
import { rollup } from 'rollup';
import { transform } from 'babel-core';
import plugin from '../../src/index.js';

const defaultFixture = 'index';
const defaultBabelOptions = {
	presets: [ 'minify' ],
	comments: true
};
const defaultRollupOptions = {
	plugins: [ plugin() ]
};
const defaultBundleOptions = {
	format: 'es'
};

function createTransformTest( {
	fixture = defaultFixture,
	babelOptions = defaultBabelOptions,
	rollupOptions = defaultRollupOptions,
	bundleOptions = defaultBundleOptions
} = {} ) {
	const path = `fixtures/${ fixture }.js`;
	const code = readFileSync( path, 'utf8' );
	const babeledCode = transform( code, babelOptions );

	rollupOptions.input = path;

	return rollup( rollupOptions ).then( ( bundle ) => {
		return bundle.generate( bundleOptions );
	} ).then( ( result ) => {
		return {
			bundle: result,
			transpiled: babeledCode
		};
	} );
}

export { defaultFixture };
export { defaultBabelOptions };
export { defaultRollupOptions };
export { defaultBundleOptions };
export default createTransformTest;
