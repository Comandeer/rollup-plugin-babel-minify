'use strict';

import babiliPreset from 'babel-preset-babili';
import bannerPlugin from '@comandeer/babel-plugin-banner';
import { getCommentContent } from '@comandeer/babel-plugin-banner/utils';
import { transform } from 'babel-core';

function babili( options = {} ) {
	let _banner;

	return {
		name: 'babili',

		options( { banner } ) {
			_banner = banner;
		},

		transformBundle( bundle ) {
			const babelConf = {
				presets: [ [ babiliPreset, options ] ],
				sourceMaps: typeof options.sourceMap !== 'undefined' ? Boolean( options.sourceMap ) : true,
				comments: typeof options.comments !== 'undefined' ? Boolean( options.comments ) : true
			};

			if ( typeof options.banner === 'string' || typeof _banner === 'string' ) {
				const banner = options.banner || _banner;
				const bannerContent = getCommentContent( banner );
				let isAlreadyInserted = false;

				babelConf.plugins = [
					[ bannerPlugin, {
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

			const { code, map } = transform( bundle, babelConf );

			return {
				code,
				map
			};
		}
	};
}

export default babili;
