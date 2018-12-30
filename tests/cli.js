import validateSourcemap from 'sourcemap-validator';
import chai from 'chai';
import executeRollupCmd from './helpers/executeRollupCmd.js';
import { assertArtifacts } from './helpers/executeRollupCmd.js';
import { getArtifacts } from './helpers/executeRollupCmd.js';
import { removeArtifacts } from './helpers/executeRollupCmd.js';

const expect = chai.expect;

describe( 'Rollup CLI', () => {
	beforeEach( removeArtifacts );
	afterEach( removeArtifacts );

	it( 'default settings', () => {
		return executeRollupCmd().then( () => {
			assertArtifacts();

			const { [ 'bundle.js' ]: code, [ 'bundle.js.map' ]: map } = getArtifacts();

			expect( code ).to.match( /\/\* Super non-important comment, which should be wiped out from existence \*\// );
			expect( map ).to.not.equal( null );
			expect( () => {
				validateSourcemap( code, map );
			} ).not.to.throw();
		} );
	} );

	it( 'comments: false + banner', () => {
		return executeRollupCmd( 'banner' ).then( () => {
			assertArtifacts();

			const { [ 'bundle.js' ]: code, [ 'bundle.js.map' ]: map } = getArtifacts();

			expect( code ).not.to.match( /\/\* Super non-important comment, which should be wiped out from existence \*\// );
			expect( code ).to.match( /^\/\* hublabubla \*\// );
			expect( map ).to.not.equal( null );
			expect( () => {
				validateSourcemap( code, map );
			} ).not.to.throw();
		} );
	} );

	it( 'banner inherited (new syntax)', () => {
		return executeRollupCmd( 'bannerInherit' ).then( () => {
			assertArtifacts();

			const { [ 'bundle.js' ]: code, [ 'bundle.js.map' ]: map } = getArtifacts();

			expect( code ).to.match( /^\/\* hublabubla \*\// );
			expect( map ).to.not.equal( null );
			expect( () => {
				validateSourcemap( code, map );
			} ).not.to.throw();
		} );
	} );
} );
