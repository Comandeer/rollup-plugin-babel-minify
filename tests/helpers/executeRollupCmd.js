import { exec } from 'child_process';
import { unlinkSync } from 'fs';
import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import { resolve } from 'path';
import chai from 'chai';

const expect = chai.expect;

const rollup = resolve( __dirname, '..', '..', 'node_modules', '.bin', 'rollup' );
const rollupCwd = resolve( __dirname, '..', 'fixtures', 'simple-project' );
const defaultArtifacts = [
	'bundle.js',
	'bundle.js.map'
];

function getCmd( config = 'default' ) {
	return `${ rollup } -c rollup.config.${ config }.js`;
}

function executeRollupCmd( config = 'default' ) {
	return new Promise( ( resolve, reject ) => {
		exec( getCmd( config ), {
			cwd: rollupCwd
		}, ( error, stdout, stderr ) => {
			if ( error ) {
				reject( error );
			}
			resolve( { stdout, stderr } );
		} );
	} );
}

function removeArtifacts( artifacts = defaultArtifacts ) {
	artifacts.forEach( ( artifact ) => {
		try {
			const path = resolve( rollupCwd, artifact );

			unlinkSync( path );
		} catch ( e ) {
			// Ignore error.
		}
	} );
}

function assertArtifacts( artifacts = defaultArtifacts ) {
	artifacts.forEach( ( artifact ) => {
		const path = resolve( rollupCwd, artifact );

		expect( existsSync( path ) ).to.equal( true );
	} );
}

function getArtifacts( artifacts = defaultArtifacts ) {
	const result = {};

	artifacts.forEach( ( artifact ) => {
		const path = resolve( rollupCwd, artifact );

		result[ artifact ] = readFileSync( path, 'utf8' );
	} );

	return result;
}

export { defaultArtifacts };
export { removeArtifacts };
export { assertArtifacts };
export { getArtifacts };
export default executeRollupCmd;
