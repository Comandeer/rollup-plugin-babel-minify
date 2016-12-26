'use strict';

import { getCommentContent } from '@comandeer/babel-plugin-banner/utils';
const babel = require( 'babel-core' );

export default function babili( options = {} ) {
	return {
		name: 'babili',

		transformBundle( code ) {
			const babelConf = {
				presets: [ 'babili' ],
				sourceMaps: typeof options.sourceMap !== 'undefined' ? Boolean( options.sourceMap ) : true,
				comments: typeof options.comments !== 'undefined' ? Boolean( options.comments ) : true
			};

			if ( typeof options.banner === 'string' ) {
				const banner = options.banner;
				const bannerContent = getCommentContent( banner );
				let isAlreadyInserted = false;

				babelConf.plugins = [
					[ '@comandeer/babel-plugin-banner', {
						banner
					} ]
				];

				if ( !babelConf.comments ) {
					babelConf.shouldPrintComment = ( comment ) => {
						if ( !isAlreadyInserted && comment === bannerContent ) {
							isAlreadyInserted = true;

							return true;
						}

						return false;
					};
				}
			}

			return babel.transform( code, babelConf );
		}
	};
}
