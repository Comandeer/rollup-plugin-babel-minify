import chai from 'chai';
import asyncGeneratorsPlugin from '@babel/plugin-syntax-async-generators';
import createTransformTest from './helpers/createTransformTest.js';
import { assertTranspiled } from './helpers/createTransformTest.js';
import { defaultBabelOptions } from './helpers/createTransformTest.js';
import plugin from '../src/index.js';

const expect = chai.expect;

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
} );
