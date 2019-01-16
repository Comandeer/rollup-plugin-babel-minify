import { exec } from 'child_process';
import { unlinkSync } from 'fs';
import { readFileSync } from 'fs';
import { readdirSync } from 'fs';
import { existsSync } from 'fs';
import { statSync } from 'fs';
import { resolve } from 'path';
import { dirname } from 'path';
import { sync as rimraf } from 'rimraf';
import chai from 'chai';

const expect = chai.expect;

const rollup = resolve( __dirname, '..', '..', 'node_modules', '.bin', 'rollup' );
const rollupCwd = resolve( __dirname, '..', 'fixtures', 'simple-project' );
const defaultAssetsDirectory = resolve( __dirname, '..', 'fixtures', 'simple-project', 'bundle', 'assets' );
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
			const info = statSync( path );

			if ( info.isDirectory() ) {
				return rimraf( path );
			}

			unlinkSync( path );
		} catch ( e ) {
			// Ignore error.
		}
	} );
}

function assertArtifacts( artifacts = defaultArtifacts ) {
	artifacts.forEach( ( artifact ) => {
		const path = resolve( rollupCwd, artifact );

		expect( existsSync( path ), `Artifact ${ path } exists` ).to.equal( true );
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

function getChunksNames( artifacts = defaultArtifacts, withMaps = true ) {
	const content = getArtifacts( artifacts );

	return Object.keys( content ).map( ( artifact ) => {
		const path = dirname( artifact );
		const imports = content[ artifact ].match( /import\("(.+?)"\)/g );

		if ( !imports ) {
			return [];
		}

		const chunks = imports.map( ( chunk ) => {
			return `${ path }/${ chunk.replace( /import\("(.+?)"\)/, '$1' ) }`;
		} );

		if ( withMaps ) {
			chunks.push( ...chunks.map( ( chunk ) => {
				return `${ chunk }.map`;
			} ) );
		}

		return chunks;
	} ).reduce( ( chunks, chunk ) => {
		return chunks.concat( chunk );
	}, [] );
}

function getAssets( dir = defaultAssetsDirectory ) {
	return readdirSync( dir ).reduce( ( assets, path ) => {
		const absolutePath = resolve( dir, path );
		const info = statSync( absolutePath );

		if ( !info.isFile() ) {
			return assets;
		}

		assets[ path ] = readFileSync( absolutePath, 'utf8' );

		return assets;
	}, {} );
}

function assertAssets( assets = {}, banner = new RegExp( '' ) ) {
	return Object.keys( assets ).forEach( ( assetName ) => {
		const asset = assets[ assetName ];

		expect( asset ).not.to.match( banner );
	} );
}

export { defaultArtifacts };
export { removeArtifacts };
export { assertArtifacts };
export { getArtifacts };
export { getChunksNames };
export { getAssets };
export { assertAssets };
export default executeRollupCmd;
