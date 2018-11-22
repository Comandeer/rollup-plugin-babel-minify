import chai from 'chai';
import dynamicImportPlugin from '@babel/plugin-syntax-dynamic-import';
import createTransformTest from './helpers/createTransformTest.js';
import { defaultBabelOptions } from './helpers/createTransformTest.js';
import plugin from '../src/index.js';

const expect = chai.expect;

describe( 'plugin and its configuration', () => {
	it( 'is a function', () => {
		expect( plugin ).to.be.a( 'function' );
	} );

	it( 'minifies code just like babel-minify', () => {
		return createTransformTest().then( ( { bundle, transpiled } ) => {
			expect( bundle.code.trim() ).to.equal( transpiled.code );
		} );
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
		} ).then( ( { bundle, transpiled } ) => {
			expect( bundle.code.trim() ).to.equal( transpiled.code );
		} );
	} );

	// #137, #138
	it( 'allows passing additional plugins by name', () => {
		const pluginsOption = [ '@babel/plugin-syntax-dynamic-import' ];

		return createTransformTest( {
			fixture: 'dynamicImport',
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
		} ).then( ( { bundle, transpiled } ) => {
			expect( bundle.code.trim() ).to.equal( transpiled.code );
		} );
	} );

	// #137, #138
	it( 'allows passing additional plugins by instance', () => {
		const pluginsOption = [ dynamicImportPlugin ];

		return createTransformTest( {
			fixture: 'dynamicImport',
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
		} ).then( ( { bundle, transpiled } ) => {
			expect( bundle.code.trim() ).to.equal( transpiled.code );
		} );
	} );
} );
