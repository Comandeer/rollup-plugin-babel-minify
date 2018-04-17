import MagicString from 'magic-string';
import semver from 'semver';
import { VERSION as rollupVersion } from 'rollup';

function addNewLine( code ) {
	const magicString = new MagicString( code );
	const bannerEnd = code.indexOf( '*/' );

	magicString.appendRight( bannerEnd + 2, '\n' );

	const map = magicString.generateMap( {
		includeContent: true
	} );

	return {
		code: magicString.toString(),
		map
	};
}

function filterMinifyOptions( options ) {
	const disallowedProperties = [
		'banner',
		'bannerNewLine',
		'sourceMap',
		'comments'
	];
	const minifyOptions = {};

	Object.keys( options ).forEach( ( option ) => {
		if ( disallowedProperties.indexOf( option ) === -1 ) {
			minifyOptions[ option ] = options[ option ];
		}
	} );

	return minifyOptions;
}

function isString( v ) {
	return typeof v === 'string';
}

function isFn( v ) {
	return typeof v === 'function';
}

function isFnOrString( v ) {
	return isString( v ) || isFn( v );
}

function checkNodeVersion() {
	return semver.satisfies( process.version, '>=6.0.0' );
}

function checkRollupVersion() {
	return semver.satisfies( rollupVersion, '>=0.57.0' );
}

export { addNewLine };
export { filterMinifyOptions };
export { isString };
export { isFn };
export { isFnOrString };
export { checkNodeVersion };
export { checkRollupVersion };
