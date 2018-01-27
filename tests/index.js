import chai from 'chai';
import { readFileSync } from 'fs';
import { rollup } from 'rollup';
import { transform } from 'babel-core';
import validateSourcemap from 'sourcemap-validator';
import plugin from '../src/index.js';

const expect = chai.expect;

const bundleOptions = {
	format: 'es'
};

process.chdir( 'tests' );

describe( 'rollup-plugin-babel-minify', () => {
	it( 'is a function', () => {
		expect( plugin ).to.be.a( 'function' );
	} );

	it( 'minifies code just like babel-minify', () => {
		const path = 'fixtures/index.js';
		const code = readFileSync( path, 'utf8' );
		const babeledCode = transform( code, { presets: [ 'minify' ], comments: true } );

		return rollup( {
			input: path,
			plugins: [ plugin() ]
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code.trim() ).to.equal( babeledCode.code );
		} );
	} );

	it( 'passes options to babel', () => {
		const path = 'fixtures/sourcemap.js';
		const code = readFileSync( path );
		const babeledCode = transform( code, { presets: [ [ 'minify', {
			removeConsole: true
		} ] ] } );

		return rollup( {
			input: path,
			plugins: [ plugin( {
				removeConsole: true
			} ) ]
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code.trim() ).to.equal( babeledCode.code );
		} );
	} );

	it( 'removes comments', () => {
		const path = 'fixtures/index.js';
		const code = readFileSync( path );
		const babeledCode = transform( code, { presets: [ 'minify' ], comments: false } );

		return rollup( {
			input: path,
			plugins: [ plugin( {
				comments: false
			} ) ]
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code.trim() ).to.equal( babeledCode.code );
		} );
	} );

	it( 'adds banner even if comments are removed', () => {
		return rollup( {
			input: 'fixtures/index.js',
			plugins: [ plugin( {
				comments: false,
				banner: '/* hublabubla */'
			} ) ],
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'adds banner inherited from bundle.generate', () => {
		return rollup( {
			input: 'fixtures/index.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			return bundle.generate( Object.assign( {}, bundleOptions, {
				banner: '/* hublabubla */'
			} ) );
		} ).then( ( result ) => {
			expect( result.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'adds banner inherited from root configuration (legacy syntax)', () => {
		const bannerOptions = {
			banner: '/* hublabubla */'
		};
		const inputOptions = Object.assign( {
			input: 'fixtures/index.js',
			plugins: [ plugin() ],
		}, bannerOptions );
		const outputOptions = Object.assign( {}, bundleOptions, bannerOptions );

		return rollup( inputOptions ).then( ( bundle ) => {
			return bundle.generate( outputOptions );
		} ).then( ( result ) => {
			expect ( result.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'adds banner inherited from root configuration (new syntax)', () => {
		const bannerOptions = {
			output: {
				banner: '/* hublabubla */',
			}
		};
		const inputOptions = Object.assign( {
			input: 'fixtures/index.js',
			plugins: [ plugin() ],
		}, bannerOptions );
		const outputOptions = Object.assign( {}, bundleOptions, bannerOptions );

		return rollup( inputOptions ).then( ( bundle ) => {
			return bundle.generate( outputOptions );
		} ).then( ( result ) => {
			expect ( result.code ).to.match( /^\/\* hublabubla \*\// );
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
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect ( result.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'preserves comments alongside banner if no comments option is passed', () => {
		return rollup( {
			input: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: '/* hublabubla */'
			} ) ],
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code ).to.match( /^\/\* hublabubla \*\// );
			expect( result.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
		} );
	} );

	it( 'preserves comments alongside banner if comments option is set to true', () => {
		return rollup( {
			input: 'fixtures/index.js',
			plugins: [ plugin( {
				comments: true,
				banner: '/* hublabubla */'
			} ) ],
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code ).to.match( /^\/\* hublabubla \*\// );
			expect( result.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
		} );
	} );

	// #16
	it( 'adds new line after banner if appropriate option is passed', () => {
		return rollup( {
			input: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: '/* hublabubla */',
				bannerNewLine: true
			} ) ],
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code ).to.match( /^\/\* hublabubla \*\/\n[^\n]/ );
		} );
	} );

	// #16
	it( 'does not add new line after banner if appropriate option is not passed', () => {
		return rollup( {
			input: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: '/* hublabubla */'
			} ) ],
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code ).to.match( /^\/\* hublabubla \*\/[^\n]/ );
		} );
	} );

	// #16
	it( 'does not add new line after banner if appropriate option is set to false', () => {
		return rollup( {
			input: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: '/* hublabubla */',
				bannerNewLine: false
			} ) ],
		} ).then( ( bundle ) => {
			return bundle.generate( bundleOptions );
		} ).then( ( result ) => {
			expect( result.code ).to.match( /^\/\* hublabubla \*\/[^\n]/ );
		} );
	} );

	it( 'generates source map by default', () => {
		return rollup( {
			input: 'fixtures/sourcemap.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			return bundle.generate( Object.assign( {}, bundleOptions, {
				sourcemap: true
			} ) );
		} ).then( ( result ) => {
			expect( result.map ).to.not.equal( null );
			expect( () => {
				validateSourcemap( result.code, result.map );
			} ).not.to.throw();
		} );
	} );

	it( 'does not generate source map when the proper option is passed', () => {
		return rollup( {
			input: 'fixtures/sourcemap.js',
			plugins: [ plugin( {
				sourceMap: false
			} ) ],
		} ).then( ( bundle ) => {
			return bundle.generate( Object.assign( {}, bundleOptions, {
				sourcemap: false
			} ) );
		} ).then( ( result ) => {
			expect( result.map ).to.equal( null );
		} );
	} );

	it( 'generates source map for UMD bundle', () => {
		return rollup( {
			input: 'fixtures/sourcemap.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			return bundle.generate( {
				format: 'umd',
				name: 'Test',
				sourcemap: true
			} );
		} ).then( ( result ) => {
			expect( result.map ).to.not.equal( null );
			expect( () => {
				validateSourcemap( result.code, result.map );
			} ).not.to.throw();
		} );
	} );

	it( 'generates source map for empty bundle', () => {
		return rollup( {
			input: 'fixtures/empty.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			return bundle.generate( {
				format: 'es',
				sourcemap: true
			} );
		} ).then( ( result ) => {
			expect( result.map ).to.not.equal( null );
		} );
	} );

	it( 'generates valid source map after heavy processing by fixMappings', () => {
		return rollup( {
			input: 'fixtures/invalidMappings.js',
			plugins: [ plugin() ],
		} ).then( ( bundle ) => {
			return bundle.generate( {
				format: 'es',
				sourcemap: true
			} );
		} ).then( ( result ) => {
			expect( result.map ).to.not.equal( null );
			expect( () => {
				validateSourcemap( result.code, result.map );
			} ).not.to.throw();
		} );
	} );

	// #16
	it( 'generates valid source map for bundle with banner with empty line', () => {
		return rollup( {
			input: 'fixtures/index.js',
			plugins: [ plugin( {
				banner: '/* hublabubla */',
				bannerNewLine: true
			} ) ],
		} ).then( ( bundle ) => {
			return bundle.generate( {
				format: 'es',
				sourcemap: true
			} );
		} ).then( ( result ) => {
			expect( () => {
				validateSourcemap( result.code, result.map );
			} ).not.to.throw();
		} );
	} );
} );
