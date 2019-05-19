import { resolve as resolvePath } from 'path';
import getPackageInfo  from './helpers/getPackageInfo.js';
import runCLITests from './helpers/runCLITests.js';

const packagePath = resolvePath( __dirname, '..', 'package.json' );
const { peerDependencies: { rollup: semver } } = getPackageInfo( packagePath );
const minVersion = semver.replace( /[<^>=]/gi, '' );

runCLITests( 'Rollup CLI', `${ __dirname }/fixtures/cli`, [ minVersion, 'current', 'latest' ] );
