import chai from 'chai';
import createTransformTest from './helpers/createTransformTest.js';
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
} );
