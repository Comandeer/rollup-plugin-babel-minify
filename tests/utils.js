import { expect } from 'chai';
import { addNewLine } from '../src/utils.js';
import { filterMinifyOptions } from '../src/utils.js';
import { isString } from '../src/utils.js';
import { isFn } from '../src/utils.js';
import { isFnOrString } from '../src/utils.js';

describe( 'utils', () => {
	describe( 'addNewLine', () => {
		it( 'is a function', () => {
			expect( addNewLine ).to.be.a( 'function' );
		} );

		it( 'returns code with added newline', () => {
			const { code } = addNewLine( '/* banner */test', {
				mappings: []
			}, '/* banner */' );

			expect( code ).to.match( /^\/\* banner \*\/\n[^\n]/ );
		} );
	} );

	describe( 'filterMinifyOptions', () => {
		it( 'is a function', () => {
			expect( filterMinifyOptions ).to.be.a( 'function' );
		} );

		it( 'filters unwanted options', () => {
			const options = {
				banner: '/* test */',
				bannerNewLine: true,
				sourceMap: true,
				comments: true,
				plugins: []
			};
			const filtered = filterMinifyOptions( options );

			expect( filtered ).to.be.empty;
		} );
	} );

	describe( 'isString', () => {
		it( 'is a function', () => {
			expect( isString ).to.be.a( 'function' );
		} );

		it( 'returns correct value', () => {
			const invalids = [
				1,
				null,
				undefined,
				function() {},
				[],
				{}
			];
			const valids = [
				'test',
				''
			];

			invalids.forEach( ( invalid ) => {
				expect( isString( invalid ) ).to.equal( false );
			} );

			valids.forEach( ( valid ) => {
				expect( isString( valid ) ).to.equal( true );
			} );
		} );
	} );

	describe( 'isFn', () => {
		it( 'is a function', () => {
			expect( isFn ).to.be.a( 'function' );
		} );

		it( 'returns correct value', () => {
			const invalids = [
				1,
				null,
				undefined,
				[],
				{},
				'test'
			];
			const valids = [
				function() {},
				() => {},
				new Function()
			];

			invalids.forEach( ( invalid ) => {
				expect( isFn( invalid ) ).to.equal( false );
			} );

			valids.forEach( ( valid ) => {
				expect( isFn( valid ) ).to.equal( true );
			} );
		} );
	} );

	describe( 'isFnOrString', () => {
		it( 'is a function', () => {
			expect( isFnOrString ).to.be.a( 'function' );
		} );

		it( 'returns correct value', () => {
			const invalids = [
				1,
				null,
				undefined,
				[],
				{}
			];
			const valids = [
				function() {},
				() => {},
				new Function(),
				'test',
				''
			];

			invalids.forEach( ( invalid ) => {
				expect( isFnOrString( invalid ) ).to.equal( false );
			} );

			valids.forEach( ( valid ) => {
				expect( isFnOrString( valid ) ).to.equal( true );
			} );
		} );
	} );
} );
