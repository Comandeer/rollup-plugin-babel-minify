'use strict';

import { getCommentContent } from '@comandeer/babel-plugin-banner/utils';
import fixMappings from './fixMappings';
const babel = require( 'babel-core' );

function babili( options = {} ) {
	return {
		name: 'babili',

		transformBundle( bundle ) {
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

			const { code, map } = babel.transform( bundle, babelConf );

			if ( map ) {
				map.mappings = fixMappings( map.mappings );
			}

			return {
				code,
				map
			};
		}
	};
}

babili.fixMappings = fixMappings;

export default babili;
