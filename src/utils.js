import MagicString from 'magic-string';

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

export { addNewLine };
export { filterMinifyOptions };
export { isString };
export { isFn };
export { isFnOrString };
