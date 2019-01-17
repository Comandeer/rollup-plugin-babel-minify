import { expect } from 'chai';
import asyncGeneratorsPlugin from '@babel/plugin-syntax-async-generators';
import emitAssetPlugin from './helpers/emitAssetPlugin.js';
import createTransformTest from './helpers/createTransformTest.js';
import { getChunksNames } from './helpers/createTransformTest.js';
import { assertChunks } from './helpers/createTransformTest.js';
import { assertAssets } from './helpers/createTransformTest.js';
import { assertTranspiled } from './helpers/createTransformTest.js';
import { defaultBabelOptions } from './helpers/createTransformTest.js';
import plugin from '../src/index.js';

describe( 'plugin and its configuration', () => {
	it( 'is a function', () => {
		expect( plugin ).to.be.a( 'function' );
	} );

	it( 'minifies code just like babel-minify', () => {
		return createTransformTest().then( assertTranspiled );
	} );

	it( 'passes options to babel', () => {
		return createTransformTest( {
			fixture: 'sourcemap',
			babelOptions: {
				presets: [ [
					'minify', {
						removeConsole: true
					} ]
				]
			},
			rollupOptions: {
				plugins: [
					plugin( {
						removeConsole: true
					} )
				]
			}
		} ).then( assertTranspiled );
	} );

	// #137, #138
	it( 'allows passing additional plugins by name', () => {
		const pluginsOption = [ '@babel/plugin-syntax-async-generators' ];

		return createTransformTest( {
			fixture: 'asyncGenerators',
			babelOptions: Object.assign( {}, defaultBabelOptions, {
				plugins: pluginsOption
			} ),
			rollupOptions: {
				plugins: [
					plugin( {
						plugins: pluginsOption
					} )
				]
			}
		} ).then( assertTranspiled );
	} );

	// #137, #138
	it( 'allows passing additional plugins by instance', () => {
		const pluginsOption = [ asyncGeneratorsPlugin ];

		return createTransformTest( {
			fixture: 'asyncGenerators',
			babelOptions: Object.assign( {}, defaultBabelOptions, {
				plugins: pluginsOption
			} ),
			rollupOptions: {
				plugins: [
					plugin( {
						plugins: pluginsOption
					} )
				]
			}
		} ).then( assertTranspiled );
	} );

	// #139, #144
	it( 'generates chunks correctly', () => {
		return createTransformTest( {
			fixture: 'chunks',
			skipBabel: true
		} ).then( ( { bundle: { code }, chunks } ) => {
			const chunksNames = getChunksNames( code );

			assertChunks( chunks, chunksNames );
		} );
	} );

	// #139
	it( 'generates assets correctly', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					emitAssetPlugin(),
					plugin()
				]
			}
		} ).then( ( { chunks } ) => {
			assertAssets( chunks );
		} );
	} );
} );
