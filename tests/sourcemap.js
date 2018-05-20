import chai from 'chai';
import validateSourcemap from 'sourcemap-validator';
import createTransformTest from './helpers/createTransformTest.js';
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
