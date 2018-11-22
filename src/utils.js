import { encode as encodeSourceMap } from 'sourcemap-codec';
import { decode as decodeSourceMap } from 'sourcemap-codec';

function addNewLine( code, map, banner ) {
	map = Object.assign( {}, map );

	code = code.replace( banner, `${ banner }\n` );

	const mappings = decodeSourceMap( map.mappings );

	let codeStart = banner.match( /\n/g );
	codeStart = codeStart ? codeStart.length + 1 : 1;

	let whitespaceAtStart = code.replace( `${ banner }\n`, '' ).match( /^(\s)+/g );
	whitespaceAtStart = whitespaceAtStart ? whitespaceAtStart.length : 0;

	mappings.unshift( [] );

	if ( Array.isArray( mappings[ codeStart ] ) && mappings[ codeStart ].length ) {
		const offset = mappings[ codeStart ][ 0 ][ 0 ] - whitespaceAtStart;

		mappings[ codeStart ].forEach( ( segment ) => {
			segment[ 0 ] -= offset;
		} );
	}

	map.mappings = encodeSourceMap( mappings );

	return {
		code,
		map
	};
}

function filterMinifyOptions( options ) {
	const disallowedProperties = [
		'banner',
		'bannerNewLine',
		'sourceMap',
		'comments',
		'plugins'
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

export { addNewLine };
export { filterMinifyOptions };
export { isString };
export { isFn };
export { isFnOrString };
