'use strict';

const readFileSync = require( 'fs' ).readFileSync;
const chai = require( 'chai' );
const expect = chai.expect;
const rollup = require( 'rollup' ).rollup;
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

	it( 'removes comments', () => {
		const path = 'fixtures/index.js';
		const code = readFileSync( path );
		const babeledCode = babel.transform( code, { presets: [ 'babili' ], comments: false } );

		return rollup( {
			entry: path,
			plugins: [ plugin( {
				comments: false
			} ) ]
		} ).then( ( bundle ) => {
			const result = bundle.generate();

			expect( result.code.trim() ).to.equal( babeledCode.code );
		} );
	} );

	it( 'adds banner even if comments are removed', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin( {
				comments: false,
				banner: '/* hublabubla */'
			} ) ],
		} ).then( ( bundle ) => {
			const result = bundle.generate();

			expect( result.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );
} );
