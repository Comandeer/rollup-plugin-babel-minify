'use strict';

const { readFileSync } = require( 'fs' );
const chai = require( 'chai' );
const expect = chai.expect;
const { rollup } = require( 'rollup' );
const plugin = require( '../dist/rollup-plugin-real-babili' );
const babel = require( 'babel-core' );

process.chdir( 'tests' );

describe( 'rollup-plugin-real-babili', () => {
	it( 'is a function', () => {
		expect( plugin ).to.be.a( 'function' );
	} );

	it( 'minifies code just like Babili', () => {
		const path = 'fixtures/index.js';
		const code = readFileSync( path, 'utf8' );
		const babeledCode = babel.transform( code, { presets: [ 'babili' ] } );

		return rollup( {
			entry: path,
			plugins: [ plugin() ]
		} ).then( ( bundle ) => {
			const result = bundle.generate();

			expect( result.code.trim() ).to.equal( babeledCode.code );
		} );
	} );
} );
