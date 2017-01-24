'use strict';

import { encode, decode } from 'sourcemap-codec';

function fixMappings( mappings ) {
	if ( typeof mappings !== 'string' ) {
		return '';
	}

	mappings = decode( mappings );

	mappings[ 0 ].forEach( ( line, index ) => {
		// If the line has only one segment with only one item,
		// just drop the whole line.
		if ( line && line.length === 1 ) {
			mappings[ 0 ].splice( index, 1 );
		}
	} );

	return encode( mappings );
}

export default fixMappings;
