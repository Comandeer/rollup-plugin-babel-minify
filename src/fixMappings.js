'use strict';

import { encode, decode } from 'sourcemap-codec';

function fixMappings( mappings ) {
	if ( typeof mappings !== 'string' ) {
		return '';
	}

	mappings = decode( mappings );
	const lastLine = mappings[ 0 ][ mappings[ 0 ].length - 1 ];

	// If the last line has only one segment with only one item,
	// just drop the whole line.
	if ( lastLine.length === 1 ) {
		mappings[ 0 ].pop();
	}

	return encode( mappings );
}

export default fixMappings;
