import validateSourcemap from 'sourcemap-validator';
import chai from 'chai';
import executeRollupCmd from './helpers/executeRollupCmd.js';
import { getChunksNames } from './helpers/executeRollupCmd.js';
import { assertArtifacts } from './helpers/executeRollupCmd.js';
import { getArtifacts } from './helpers/executeRollupCmd.js';
import { removeArtifacts } from './helpers/executeRollupCmd.js';

const expect = chai.expect;

describe( 'Rollup CLI', () => {
	beforeEach( removeArtifacts );
	afterEach( removeArtifacts );
	afterEach( () => {
		removeArtifacts( [
			'bundle'
		] );
	} );

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

	it( 'banner inherited', () => {
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

	it( 'multiple chunks (dynamic import)', () => {
		const artifacts = [
			'bundle/chunks.js',
			'bundle/chunks.js.map'
		];

		return executeRollupCmd( 'chunks' ).then( () => {
			assertArtifacts( artifacts );
		} ).then( () => {
			const chunks = getChunksNames( artifacts );

			assertArtifacts( chunks );
		} );
	} );

	it( 'multiple chunks (multiple inputs)', () => {
		const artifacts = [
			'bundle/Test.js',
			'bundle/Test.js.map',
			'bundle/another.js',
			'bundle/another.js.map'
		];

		return executeRollupCmd( 'multipleInputs' ).then( () => {
			assertArtifacts( artifacts );
		} ).then( () => {
			const chunks = getChunksNames( artifacts );

			assertArtifacts( chunks );
		} );
	} );
} );
