'use strict';

function filterMinifyOptions( options ) {
	const disallowedProperties = [
		'banner',
		'sourceMap',
		'comments'
	];
	const minifyOptions = {};

	Object.keys( options ).filter( ( option ) => {
		if ( disallowedProperties.indexOf( option ) === -1 ) {
			minifyOptions[ option ] = options[ option ];
		}
	} );

	return minifyOptions;
}

function isString( v ) {
	return v != null && typeof v === 'string';
}

function isFn( v ) {
	return v != null && typeof v === 'function';
}

function isFnOrString( v ) {
	return isString( v ) || isFn( v );
}

export { filterMinifyOptions };
export { isString };
export { isFn };
export { isFnOrString };
