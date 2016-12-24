'use strict';

const babel = require( 'babel-core' );

export default function babili( options = {} ) {
	return {
		name: 'babili',

		transformBundle( code ) {
			return babel.transform( code, {
				presets: [ 'babili' ],
				comments: typeof options.comments !== 'undefined' ? Boolean( options.comments ) : true
			} );
		}
	};
}
