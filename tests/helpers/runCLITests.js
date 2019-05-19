import { resolve as resolvePath } from 'path';
import { basename } from 'path';
import { readdirSync } from 'fs';
import { unlinkSync } from 'fs';
import { readFileSync } from 'fs';
import { statSync } from 'fs';
import { sync as rimraf } from 'rimraf';
import { expect } from 'chai';
import executeRollupCmd from './executeRollupCmd.js';

function removeArtifacts( dir ) {
	const fixtures = readdirSync( dir );

	fixtures.forEach( ( fixture ) => {
		try {
			const path = resolvePath( dir, fixture, './output' );
			const files = readdirSync( path );
			const pathInfo = statSync( path );

			files.forEach( ( file ) => {
				const filePath = resolvePath( path, file );

				if ( pathInfo.isDirectory() ) {
					return removeArtifacts( path );
				}

				unlinkSync( filePath );
			} );

			rimraf( path );
		} catch ( e ) {
			// Ignore error.
		}
	} );
}

function assertArtifacts( cwd ) {
	const outputPath = resolvePath( cwd, './output' );
	const expectedPath = resolvePath( cwd, './expected' );

	function processArtifacts( outputDirectory, expectedDirectory ) {
		const producedArtifacts = readdirSync( outputDirectory );
		const expectedArtifacts = readdirSync( expectedDirectory );

		expect( producedArtifacts ).to.deep.equal( expectedArtifacts );

		producedArtifacts.forEach( ( artifact ) => {
			const producedPath = resolvePath( outputDirectory, artifact );
			const expectedPath = resolvePath( expectedDirectory, artifact );
			const pathInfo = statSync( producedPath );

			if ( pathInfo.isDirectory() ) {
				return processArtifacts( producedPath, expectedPath );
			}

			const producedContent = readFileSync( producedPath, 'utf8' );
			const expectedContent = readFileSync( expectedPath, 'utf8' );

			expect( producedContent ).to.equal( expectedContent );
		} );
	}

	processArtifacts( outputPath, expectedPath );
}

function runTest( path, versions ) {
	versions.forEach( ( version ) => {
		it( `${ basename( path ) } (${ version })`, () => {
			return executeRollupCmd( path, version ).then( () => {
				assertArtifacts( path );
			} );
		} );
	} );
}

function runTestsFromDir( directory, versions ) {
	const fixtures = readdirSync( directory );

	fixtures.forEach( ( fixture ) => {
		runTest( resolvePath( directory, fixture ), versions );
	} );
}

function runCLITests( suiteName, directory, versions ) {
	describe( suiteName, () => {
		afterEach( () => {
			removeArtifacts( directory );
		} );

		runTestsFromDir( directory, versions );
	} );
}

export default runCLITests;
