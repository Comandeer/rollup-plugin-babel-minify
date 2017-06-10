'use strict';

function filterBabiliOptions( options ) {
	const disallowedProperties = [
		'banner',
		'sourceMap',
		'comments'
	];
	const babiliOptions = {};

	Object.keys( options ).filter( ( option ) => {
		if ( disallowedProperties.indexOf( option ) === -1 ) {
			babiliOptions[ option ] = options[ option ];
		}
	} );

	return babiliOptions;
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

export { filterBabiliOptions };
export { isString };
export { isFn };
export { isFnOrString };
