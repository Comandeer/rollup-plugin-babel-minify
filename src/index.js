'use strict';

import { filterMinifyOptions } from './utils.js';
import { addNewLine } from './utils.js';
import { isFn } from './utils.js';
import { isFnOrString } from './utils.js';
import { checkNodeVersion } from './utils.js';
import depd from 'depd';
import minifyPreset from 'babel-preset-minify';
import bannerPlugin from '@comandeer/babel-plugin-banner';
import { getCommentContent } from '@comandeer/babel-plugin-banner/utils';
import { transform } from 'babel-core';

const deprecate = depd( 'rollup-plugin-babel-minify' );

function minify( options = {} ) {
	let rollupBanner;

	if ( !checkNodeVersion() ) {
		deprecate( 'This plugin will remove support for Node <6 in version 5.0.0.' );
	}

	return {
		name: 'babel-minify',

		options( { banner } ) {
			rollupBanner = banner;
		},

		transformBundle( bundle, { banner: bundleBanner } ) {
			const minifyOptions = filterMinifyOptions( options );
			const babelConf = {
				presets: [ [ minifyPreset, minifyOptions ] ],
				sourceMaps: typeof options.sourceMap !== 'undefined' ? Boolean( options.sourceMap ) : true,
				comments: typeof options.comments !== 'undefined' ? Boolean( options.comments ) : true
			};

			if ( isFnOrString( options.banner ) || isFnOrString ( bundleBanner ) || isFnOrString ( rollupBanner ) ) {
				let banner = options.banner || bundleBanner || rollupBanner;
				banner = isFn ( banner ) ? banner() : banner;
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

			let { code, map } = transform( bundle, babelConf );

			if ( options.bannerNewLine ) {
				( { code, map } = addNewLine( code ) );
			}

			return {
				code,
				map
			};
		}
	};
}

export default minify;
