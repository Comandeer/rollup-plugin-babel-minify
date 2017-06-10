'use strict';

import { filterBabiliOptions } from './utils.js';
import babiliPreset from 'babel-preset-babili';
import bannerPlugin from '@comandeer/babel-plugin-banner';
import { getCommentContent } from '@comandeer/babel-plugin-banner/utils';
import { transform } from 'babel-core';

// NOTE: lodash or something else more precise can be an option here
const isString = ( v ) => {
	return v != null && typeof v === 'string';
};
const isFn = ( v ) => {
	return v != null && typeof v === 'function';
};
const isFnOrString = ( v ) => {
	return isString( v ) || isFn( v );
};

function babili( options = {} ) {
	let rollupBanner;

	return {
		name: 'babili',

		options( { banner } ) {
			rollupBanner = banner;
		},

		transformBundle( bundle ) {
			const babiliOptions = filterBabiliOptions( options );
			const babelConf = {
				presets: [ [ babiliPreset, babiliOptions ] ],
				sourceMaps: typeof options.sourceMap !== 'undefined' ? Boolean( options.sourceMap ) : true,
				comments: typeof options.comments !== 'undefined' ? Boolean( options.comments ) : true
			};

			if ( isFnOrString( options.banner ) || isFnOrString ( rollupBanner ) ) {
				let banner = options.banner || rollupBanner;
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

			const { code, map } = transform( bundle, babelConf );

			return {
				code,
				map
			};
		}
	};
}

export default babili;
