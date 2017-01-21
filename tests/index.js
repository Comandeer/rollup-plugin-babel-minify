'use strict';

const readFileSync = require( 'fs' ).readFileSync;
const chai = require( 'chai' );
const expect = chai.expect;
const rollup = require( 'rollup' ).rollup;
const plugin = require( '../dist/rollup-plugin-babili' );
const babel = require( 'babel-core' );

process.chdir( 'tests' );

describe( 'rollup-plugin-babili', () => {
	it( 'is a function', () => {
		expect( plugin ).to.be.a( 'function' );
	} );

	it( 'minifies code just like Babili', () => {
		const path = 'fixtures/index.js';
		const code = readFileSync( path, 'utf8' );
		const babeledCode = babel.transform( code, { presets: [ 'babili' ], comments: true } );

		return rollup( {
			entry: path,
			plugins: [ plugin() ]
		} ).then( ( bundle ) => {
			const result = bundle.generate();

			expect( result.code.trim() ).to.equal( babeledCode.code );
		} );
	} );

	it( 'passes options to babel', () => {
		const path = 'fixtures/sourcemap.js';
		const code = readFileSync( path );
		const babeledCode = babel.transform( code, { presets: [ [ 'babili', {
			removeConsole: true
		} ] ] } );

		return rollup( {
			entry: path,
			plugins: [ plugin( {
				removeConsole: true
			} ) ]
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

	it( 'adds banner inherited from bundle.generate', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			const result = bundle.generate( {
				banner: '/* hublabubla */'
			} );

			expect( result.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'prefers banner from own options over one inherited from bundle.generate', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: '/* ROLLUP RULEZ */'
			} ) ],
		} ).then( ( bundle ) => {
			const result = bundle.generate( {
				banner: '/* hublabubla */'
			} );

			expect( result.code ).to.match( /^\/\* ROLLUP RULEZ \*\// );
			expect( result.code ).not.to.match( /^\/\* hublabubla \*\// );
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
			entry: 'fixtures/sourcemap.js',
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
			entry: 'fixtures/sourcemap.js',
			plugins: [ plugin( {
				sourceMap: false
			} ) ],
		} ).then( ( bundle ) => {
			const result = bundle.generate( {
				sourceMap: false
			} );

			expect( result.map ).to.equal( null );
		} );
	} );

	it( 'generates source map for UMD bundle', () => {
		return rollup( {
			entry: 'fixtures/sourcemap.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			const result = bundle.generate( {
				format: 'umd',
				moduleName: 'Test',
				sourceMap: true
			} );

			expect( result.map ).to.not.equal( null );
		} );
	} );

	it( 'generates source map for empty bundle', () => {
		return rollup( {
			entry: 'fixtures/empty.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			const result = bundle.generate( {
				format: 'es',
				sourceMap: true
			} );

			expect( result.map ).to.not.equal( null );
		} );
	} );
} );
