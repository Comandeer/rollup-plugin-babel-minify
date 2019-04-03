import { exec } from 'child_process';
import { resolve as resolvePath } from 'path';

const rollup = resolvePath( __dirname, '..', '..', 'node_modules', '.bin', 'rollup' );

function getCmd( path ) {
	return `${ rollup } -c ${ resolvePath( path, 'config.js' ) }`;
}

function executeRollupCmd( path ) {
	return new Promise( ( resolve, reject ) => {
		exec( getCmd( path ), {
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
