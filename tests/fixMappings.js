'use strict';

const chai = require( 'chai' );
const expect = chai.expect;
const mappings = require( './fixtures/mappings' );
const fixMappings = require( '../dist/rollup-plugin-real-babili' ).fixMappings;

describe( 'fixMappings', () => {
	it( 'is a function', () => {
		expect( fixMappings ).to.be.a( 'function' );
	} );

	it( 'fixes incorrect mappings', () => {
		const result = fixMappings( mappings.invalid );

		expect( result ).to.equal( mappings.valid );
	} );

	it( 'does not touch correct mappings', () => {
		const result = fixMappings( mappings.valid );

		expect( result ).to.equal( mappings.valid );
	} );
} );
