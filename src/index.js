'use strict';

const babel = require( 'babel-core' );

export default function babili() {
	return {
		name: 'babili',

		transformBundle( code ) {
			return babel.transform( code, {
				presets: [ 'babili' ]
			} );
		}
	};
}
