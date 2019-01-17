import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { rollup } from 'rollup';
import { transform } from '@babel/core';
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

function getFixturePath( fixtureName ) {
	return resolve( __dirname, '..', 'fixtures', `${ fixtureName }.js` );
}

function createTransformTest( {
	fixture = defaultFixture,
	skipBabel = false,
	babelOptions = defaultBabelOptions,
	rollupOptions = defaultRollupOptions,
	bundleOptions = defaultBundleOptions
} = {} ) {
	const path = getFixturePath( fixture );
	const code = readFileSync( path, 'utf8' );
	const babeledCode = skipBabel !== true ? transform( code, babelOptions ) : null;

	rollupOptions.input = path;

	return rollup( rollupOptions ).then( ( bundle ) => {
		return bundle.generate( bundleOptions );
	} ).then( ( { output: [ result ] } ) => {
		return {
			bundle: result,
			transpiled: babeledCode
		};
	} );
}

function assertTranspiled( { bundle, transpiled } ) {
	expect( bundle.code.trim() ).to.equal( transpiled.code );
}

export { defaultFixture };
export { defaultBabelOptions };
export { defaultRollupOptions };
export { defaultBundleOptions };
export { assertTranspiled };
export default createTransformTest;
