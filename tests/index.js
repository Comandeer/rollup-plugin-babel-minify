'use strict';

const chai = require( 'chai' );
const expect = chai.expect;
const rollup = require( 'rollup' );
const plugin = require( '../dist/rollup-plugin-real-babili' );
const cwd = process.cwd();

describe( 'rollup-plugin-real-babili', () => {
	it( 'is a function', () => {
		expect( plugin ).to.be.a( 'function' );
	} );
} );
