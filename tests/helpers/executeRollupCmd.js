import { exec } from 'child_process';
import { resolve as resolvePath } from 'path';

const rollup = resolvePath( __dirname, '..', '..', 'node_modules', '.bin', 'rollup' );

function getCmd( path, version ) {
	const executable = version === 'current' ? rollup : `npx rollup@${ version }`;
	return `${ executable } -c ${ resolvePath( path, 'config.js' ) }`;
}

function executeRollupCmd( path, version = 'current' ) {
	return new Promise( ( resolve, reject ) => {
		exec( getCmd( path, version ), {
			cwd: path
		}, ( error, stdout, stderr ) => {
			if ( error ) {
				reject( error );
			}

			resolve( { stdout, stderr } );
		} );
	} );
}

export default executeRollupCmd;
