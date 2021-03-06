import minifyPreset from 'babel-preset-minify';
import bannerPlugin from '@comandeer/babel-plugin-banner';
import importPlugin from '@babel/plugin-syntax-dynamic-import';
import { getCommentContent } from '@comandeer/babel-plugin-banner';
import { transform } from '@babel/core';
import { filterMinifyOptions } from './utils.js';
import { addNewLine } from './utils.js';
import { isFn } from './utils.js';
import { isFnOrString } from './utils.js';

/**
 * Rollup's plugin adding the ability to use babel-minify with Rollup.
 *
 * @module rollup-plugin-babel-minify
 */

/**
 * Function performing the actual minification.
 *
 * @param {module:rollup-plugin-babel-minify.MinifyOptions} [options={}] Plugin's options.
 * @returns {module:rollup-plugin-babel-minify.MinifyPlugin} Rollup plugin.
 */
function minify( options = {} ) {
	let bundleBanner;

	return {
		name: 'babel-minify',

		outputOptions( outputOptions ) {
			const result = Object.assign( {}, outputOptions );
			bundleBanner = result.banner;

			delete result.banner;

			return result;
		},

		renderChunk( bundle ) {
			const minifyOptions = filterMinifyOptions( options );
			const babelConf = {
				presets: [ [ minifyPreset, minifyOptions ] ],
				sourceMaps: typeof options.sourceMap !== 'undefined' ? Boolean( options.sourceMap ) : true,
				comments: typeof options.comments !== 'undefined' ? Boolean( options.comments ) : true,
				plugins: Array.isArray( options.plugins ) ? options.plugins.concat( [ importPlugin ] ) : [ importPlugin ]
			};
			let banner;

			if ( isFnOrString( options.banner ) || isFnOrString ( bundleBanner ) ) {
				banner = options.banner || bundleBanner;
				banner = isFn ( banner ) ? banner() : banner;
				const bannerContent = getCommentContent( banner );
				let isAlreadyInserted = false;

				babelConf.plugins = babelConf.plugins.concat( [
					[ bannerPlugin, {
						banner
					} ]
				] );

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
				( { code, map } = addNewLine( code, map, banner ) );
			}

			return {
				code,
				map
			};
		}
	};
}

export default minify;
