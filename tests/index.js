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

	it( 'preserves comments alongside banner if no comments option is passed', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: '/* hublabubla */'
			} ) ],
		} ).then( ( bundle ) => {
			const result = bundle.generate();

			expect( result.code ).to.match( /^\/\* hublabubla \*\// );
			expect( result.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
		} );
	} );

	it( 'preserves comments alongside banner if comments option is set to true', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin( {
				comments: true,
				banner: '/* hublabubla */'
			} ) ],
		} ).then( ( bundle ) => {
			const result = bundle.generate();

			expect( result.code ).to.match( /^\/\* hublabubla \*\// );
			expect( result.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
		} );
	} );

	it( 'generates source map by default', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			const result = bundle.generate( {
				sourceMap: true
			} );

			expect( result.map ).to.not.equal( null );
		} );
	} );

	it( 'does not generate source map when the proper option is passed', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin( {
				sourceMap: false
			} ) ],
		} ).then( ( bundle ) => {
			const result = bundle.generate( {
				sourceMap: false
			} );

			expect( result.map ).to.equal( null );
		} );
	} )
} );
