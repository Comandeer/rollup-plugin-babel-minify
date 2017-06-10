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

export { filterBabiliOptions };
