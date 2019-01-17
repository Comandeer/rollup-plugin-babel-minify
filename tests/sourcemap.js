import chai from 'chai';
import validateSourcemap from 'sourcemap-validator';
import emitAssetPlugin from './helpers/emitAssetPlugin.js';
import validateBannerNewLineSourceMap from './helpers/validateBannerNewLineSourceMap.js';
import createTransformTest from './helpers/createTransformTest.js';
import { getChunksNames } from './helpers/createTransformTest.js';
import { assertChunks } from './helpers/createTransformTest.js';
import { assertAssets } from './helpers/createTransformTest.js';
import { defaultBundleOptions } from './helpers/createTransformTest.js';
import plugin from '../src/index.js';

const expect = chai.expect;

describe( 'source maps support', () => {
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

	// #16, 133
	it( 'generates valid source map for bundle with banner with empty line', () => {
		return createTransformTest( {
			fixture: 'withoutCommentAtStart',
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

			validateBannerNewLineSourceMap( {
				map
			} );
		} );
	} );

	// 133
	it( 'generates valid source map for bundle with multiline banner with empty line', () => {
		return createTransformTest( {
			fixture: 'withoutCommentAtStart',
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hu\nbla\nbub\nla */',
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

			validateBannerNewLineSourceMap( {
				map,
				startLine: 4,
				totalLines: 5
			} );
		} );
	} );

	// #133
	it( 'generates valid source map for bundle with banner with empty line and whitespace before code', () => {
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

			validateBannerNewLineSourceMap( {
				map,
				startLine: 1,
				offset: 1
			} );
		} );
	} );

	// 133
	it( 'generates valid source map for bundle with multiline banner with empty line and whitespace before code', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hu\nbla\nbub\nla */',
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

			validateBannerNewLineSourceMap( {
				map,
				startLine: 4,
				totalLines: 5,
				offset: 1
			} );
		} );
	} );

	// #133
	it( 'generates source map for empty bundle with banner with empty line', () => {
		return createTransformTest( {
			fixture: 'empty',
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
		} ).then( ( { bundle: { map } } ) => {
			expect( map ).to.not.equal( null );

			validateBannerNewLineSourceMap( {
				map,
				isEmpty: true
			} );
		} );
	} );

	// #139, #144
	it( 'generates sourcemaps for chunks', () => {
		return createTransformTest( {
			fixture: 'chunks',
			skipBabel: true,
			bundleOptions: Object.assign( {}, defaultBundleOptions, {
				sourcemap: true
			} )
		} ).then( ( { bundle: { code }, chunks } ) => {
			const chunksNames = getChunksNames( code );

			assertChunks( chunks, chunksNames );

			chunks.forEach( ( { code, map } ) => {
				expect( map ).to.not.equal( null );
				expect( () => {
					validateSourcemap( code, map );
				} ).not.to.throw();
			} );
		} );
	} );

	// #139
	it( 'does not generate sourcemaps for assets', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					emitAssetPlugin(),
					plugin()
				]
			},
			bundleOptions: Object.assign( {}, defaultBundleOptions, {
				sourcemap: true
			} )
		} ).then( ( { chunks } ) => {
			assertAssets( chunks );

			chunks.forEach( ( { map } ) => {
				expect( map ).to.equal( undefined );
			} );
		} );
	} );
} );
