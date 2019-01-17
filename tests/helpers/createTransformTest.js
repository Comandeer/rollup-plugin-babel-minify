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
	const transpiled = skipBabel !== true ? transform( code, babelOptions ) : null;

	rollupOptions.input = path;

	return rollup( rollupOptions ).then( ( bundle ) => {
		return bundle.generate( bundleOptions );
	} ).then( ( { output: [ bundle, ...chunks ] } ) => {
		return {
			bundle,
			chunks,
			transpiled
		};
	} );
}

function assertTranspiled( { bundle, transpiled } ) {
	expect( bundle.code.trim() ).to.equal( transpiled.code );
}

function getChunksNames( code ) {
	const imports = code.match( /import\("(.+?)"\)/g );

	if ( !imports ) {
		return [];
	}

	return imports.map( ( chunk ) => {
		return chunk.replace( /import\("(.+?)"\)/, '$1' ).replace( /^\.\//, '' );
	} );
}

function assertChunks( chunks = [], expected = [] ) {
	const used = [];

	chunks.forEach( ( { fileName } ) => {
		expect( fileName ).to.be.oneOf( expected );

		used.push( fileName );
	} );

	expect( used ).to.have.members( expected );
}

function assertAssets( chunks = [] ) {
	const assets = chunks.reduce( ( count, chunk ) => {
		if ( !chunk || !chunk.fileName.match( /^assets\/asset-/ ) ) {
			return count;
		}

		return ++count;
	}, 0 );

	expect( chunks.length ).to.equal( assets );
}

export { defaultFixture };
export { defaultBabelOptions };
export { defaultRollupOptions };
export { defaultBundleOptions };
export { assertTranspiled };
export { getChunksNames };
export { assertChunks };
export { assertAssets };
export default createTransformTest;
