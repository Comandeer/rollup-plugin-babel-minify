import { readFileSync } from 'fs';

function getPackageInfo( path ) {
	const file = readFileSync( path );

	return JSON.parse( file );
}

export default getPackageInfo;
