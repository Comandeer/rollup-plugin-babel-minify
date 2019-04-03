import Test from './Test.js';

import( './another.js' ).then( () => {
	/* Super non-important comment, which should be wiped out from existence */
	new Test( another() );
} );
