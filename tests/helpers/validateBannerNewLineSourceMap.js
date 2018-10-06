import { decode } from 'sourcemap-codec';
import { expect } from 'chai';

function validateBannerNewLineSourceMap( { map, startLine = 1, offset = 0, totalLines = 2, isEmpty = false } = {} ) {
	const mappings = decode( map.mappings );
	let i = 0;

	expect( mappings ).to.have.lengthOf( totalLines );

	while ( i < startLine ) {
		expect( mappings[ i ] ).to.be.an( 'array' );
		expect( mappings[ i ] ).to.have.lengthOf( 0 );

		i++;
	}

	expect( mappings[ startLine ] ).to.be.an( 'array' );

	if ( !isEmpty ) {
		expect( mappings[ startLine ][ 0 ][ 0 ] ).to.equal( offset );
	}
}

export default validateBannerNewLineSourceMap;
