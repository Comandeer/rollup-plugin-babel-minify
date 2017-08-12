'use strict';

const readFileSync = require( 'fs' ).readFileSync;
const chai = require( 'chai' );
const expect = chai.expect;
const rollup = require( 'rollup' ).rollup;
const plugin = require( '../dist/rollup-plugin-babili' );
const babel = require( 'babel-core' );
const validateSourcemap = require( 'sourcemap-validator' );

const bundleOptions = {
	format: 'es'
};

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
			bundle.generate( bundleOptions ).then( ( result ) => {
				expect( result.code.trim() ).to.equal( babeledCode.code );
			} );
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
			bundle.generate( bundleOptions ).then( ( result ) => {
				expect( result.code.trim() ).to.equal( babeledCode.code );
			} );
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
			bundle.generate( bundleOptions ).then( ( result ) => {
				expect( result.code.trim() ).to.equal( babeledCode.code );
			} );
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
			bundle.generate( bundleOptions ).then( ( result ) => {
				expect( result.code ).to.match( /^\/\* hublabubla \*\// );
			} );
		} );
	} );

	it( 'adds banner inherited from bundle.generate', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			bundle.generate( Object.assign( {}, bundleOptions, {
				banner: '/* hublabubla */'
			} ) ).then( ( result ) => {
				expect( result.code ).to.match( /^\/\* hublabubla \*\// );
			} );
		} );
	} );

	it ( 'adds banner inherited from root configuration', () => {
		// while you can ask: WTF? banner is not an option for an rollup
		// function, this is how options from config file are passed
		return rollup( {
			entry: 'fixtures/index.js',
			banner: '/* hublabubla */',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			bundle.generate( bundleOptions ).then( ( result ) => {
				expect ( result.code ).to.match( /^\/\* hublabubla \*\// );
			} );
		} );
	} );

	it ( 'adds banner as a result of call if plugin banner option is fn itself', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: () => {
					return '/* hublabubla */';
				}
			} ) ],
		} ).then ( ( bundle ) => {
			bundle.generate( bundleOptions ).then( ( result ) => {
				expect ( result.code ).to.match( /^\/\* hublabubla \*\// );
			} );
		} );
	} );

	it( 'preserves comments alongside banner if no comments option is passed', () => {
		return rollup( {
			entry: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: '/* hublabubla */'
			} ) ],
		} ).then( ( bundle ) => {
			bundle.generate( bundleOptions ).then( ( result ) => {
				expect( result.code ).to.match( /^\/\* hublabubla \*\// );
				expect( result.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
			} );
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
			bundle.generate( bundleOptions ).then( ( result ) => {
				expect( result.code ).to.match( /^\/\* hublabubla \*\// );
				expect( result.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
			} );
		} );
	} );

	it( 'generates source map by default', () => {
		return rollup( {
			entry: 'fixtures/sourcemap.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			bundle.generate( Object.assign( {}, bundleOptions, {
				sourceMap: true
			} ) ).then( ( result ) => {
				expect( result.map ).to.not.equal( null );
				expect( () => {
					validateSourcemap( result.code, result.map );
				} ).not.to.throw();
			} );
		} );
	} );

	it( 'does not generate source map when the proper option is passed', () => {
		return rollup( {
			entry: 'fixtures/sourcemap.js',
			plugins: [ plugin( {
				sourceMap: false
			} ) ],
		} ).then( ( bundle ) => {
			bundle.generate( Object.assign( {}, bundleOptions, {
				sourceMap: false
			} ) ).then( ( result ) => {
				expect( result.map ).to.equal( null );
			} );
		} );
	} );

	it( 'generates source map for UMD bundle', () => {
		return rollup( {
			entry: 'fixtures/sourcemap.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			bundle.generate( {
				format: 'umd',
				moduleName: 'Test',
				sourceMap: true
			} ).then( ( result ) => {
				expect( result.map ).to.not.equal( null );
				expect( () => {
					validateSourcemap( result.code, result.map );
				} ).not.to.throw();
			} );
		} );
	} );

	it( 'generates source map for empty bundle', () => {
		return rollup( {
			entry: 'fixtures/empty.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			bundle.generate( {
				format: 'es',
				sourceMap: true
			} ).then( ( result ) => {
				expect( result.map ).to.not.equal( null );
			} );
		} );
	} );

	it( 'generates valid source map after heavy processing by fixMappings', () => {
		return rollup( {
			entry: 'fixtures/invalidMappings.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			bundle.generate( {
				format: 'es',
				sourceMap: true
			} ).then( ( result ) => {
				expect( result.map ).to.not.equal( null );
				expect( () => {
					validateSourcemap( result.code, result.map );
				} ).not.to.throw();
			} );
		} );
	} );
} );
