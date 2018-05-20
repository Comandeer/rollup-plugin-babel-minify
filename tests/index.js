import chai from 'chai';
import validateSourcemap from 'sourcemap-validator';
import createTransformTest from './helpers/createTransformTest.js';
import { defaultBabelOptions } from './helpers/createTransformTest.js';
import { defaultRollupOptions } from './helpers/createTransformTest.js';
import { defaultBundleOptions } from './helpers/createTransformTest.js';
import plugin from '../src/index.js';

const expect = chai.expect;

process.chdir( 'tests' );

describe( 'rollup-plugin-babel-minify', () => {
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

	it( 'removes comments', () => {
		return createTransformTest( {
			babelOptions: Object.assign( {}, defaultBabelOptions, {
				comments: false
			} ),
			rollupOptions: {
				plugins: [
					plugin( {
						comments: false
					} )
				]
			}
		} ).then( ( { bundle, transpiled } ) => {
			expect( bundle.code.trim() ).to.equal( transpiled.code );
		} );
	} );

	it( 'adds banner even if comments are removed', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						comments: false,
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'adds banner inherited from bundle.generate', () => {
		return createTransformTest( {
			bundleOptions: Object.assign( {}, defaultBundleOptions, {
				banner: '/* hublabubla */'
			} )
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'adds banner inherited from root configuration', () => {
		const bannerOptions = {
			output: {
				banner: '/* hublabubla */'
			}
		};
		const rollupOptions = Object.assign( defaultRollupOptions, bannerOptions );
		const bundleOptions = Object.assign( {}, defaultBundleOptions, bannerOptions );

		return createTransformTest( {
			rollupOptions,
			bundleOptions
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it ( 'adds banner as a result of call if plugin banner option is fn itself', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: () => {
							return '/* hublabubla */';
						}
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'preserves comments alongside banner if no comments option is passed', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
			expect( bundle.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
		} );
	} );

	it( 'preserves comments alongside banner if comments option is set to true', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						comments: true,
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
			expect( bundle.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
		} );
	} );

	// #16
	it( 'adds new line after banner if appropriate option is passed', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */',
						bannerNewLine: true
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\/\n[^\n]/ );
		} );
	} );

	// #16
	it( 'does not add new line after banner if appropriate option is not passed', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\/[^\n]/ );
		} );
	} );

	// #16
	it( 'does not add new line after banner if appropriate option is set to false', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */',
						bannerNewLine: false
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\/[^\n]/ );
		} );
	} );

	it( 'generates source map by default', () => {
		return createTransformTest( {
			fixture: 'sourcemap',
			bundleOptions: Object.assign( {}, defaultBundleOptions, {
				sourcemap: true
			} )
		} ).then( ( { bundle: { map, code } } ) => {
			expect( map ).to.not.equal( null );
			expect( () => {
				validateSourcemap( code, map );
			} ).not.to.throw();
		} );
	} );

	it( 'does not generate source map when the proper option is passed', () => {
		return createTransformTest( {
			fixture: 'sourcemap',
			rollupOptions: {
				plugins: [
					plugin( {
						sourceMap: false
					} )
				]
			},
			bundleOptions: Object.assign( {}, defaultBundleOptions, {
				sourcemap: false
			} )
		} ).then( ( { bundle: { map } } ) => {
			// It seems that Rollup tends to behave differently on different versions of
			// Node.js, returning null on Node 8+ and undefined otherwise.
			expect( map ).to.satisfy( ( value ) => {
				return value === undefined || value === null;
			} );
		} );
	} );

	it( 'generates source map for UMD bundle', () => {
		return createTransformTest( {
			bundleOptions: {
				format: 'umd',
				name: 'Test',
				sourcemap: true
			}
		} ).then( ( { bundle: { map, code } } ) => {
			expect( map ).to.not.equal( null );
			expect( () => {
				validateSourcemap( code, map );
			} ).not.to.throw();
		} );
	} );

	it( 'generates source map for empty bundle', () => {
		return createTransformTest( {
			fixture: 'empty',
			bundleOptions: Object.assign( {}, defaultBundleOptions, {
				sourcemap: true
			} )
		} ).then( ( { bundle: { map } } ) => {
			expect( map ).to.not.equal( null );
		} );
	} );

	// #16
	it( 'generates valid source map for bundle with banner with empty line', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */',
						bannerNewLine: true
					} )
				]
			},
			bundleOptions: Object.assign( {}, defaultBundleOptions, {
				sourcemap: true
			} )
		} ).then( ( { bundle: { code, map } } ) => {
			expect( () => {
				validateSourcemap( code, map );
			} ).not.to.throw();
		} );
	} );
} );
