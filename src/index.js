import { filterMinifyOptions } from './utils.js';
import { addNewLine } from './utils.js';
import { isFn } from './utils.js';
import { isFnOrString } from './utils.js';
import minifyPreset from 'babel-preset-minify';
import bannerPlugin from '@comandeer/babel-plugin-banner';
import { getCommentContent } from '@comandeer/babel-plugin-banner';
import { transform } from '@babel/core';
import { encode as encodeSourceMap } from 'sourcemap-codec';
import { decode as decodeSourceMap } from 'sourcemap-codec';

function minify( options = {} ) {
	return {
		name: 'babel-minify',

		transformBundle( bundle, { banner: bundleBanner } ) {
			const minifyOptions = filterMinifyOptions( options );
			const babelConf = {
				presets: [ [ minifyPreset, minifyOptions ] ],
				sourceMaps: typeof options.sourceMap !== 'undefined' ? Boolean( options.sourceMap ) : true,
				comments: typeof options.comments !== 'undefined' ? Boolean( options.comments ) : true
			};
			let banner;

			if ( isFnOrString( options.banner ) || isFnOrString ( bundleBanner ) ) {
				banner = options.banner || bundleBanner;
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

			let { code, map } = transform( bundle, babelConf ); // eslint-disable-line prefer-const

			if ( options.bannerNewLine ) {
				( { code } = addNewLine( code ) );

				const mappings = decodeSourceMap( map.mappings );

				let codeStart = banner.match( /\n/g );
				codeStart = codeStart ? codeStart.length + 1 : 1;

				let whitespaceAtStart = code.replace( `${ banner }\n`, '' ).match( /^(\s)+/g );
				whitespaceAtStart = whitespaceAtStart ? whitespaceAtStart.length : 0;

				mappings.unshift( [] );

				if ( Array.isArray( mappings[ codeStart ] ) && mappings[ codeStart ].length ) {
					const offset = mappings[ codeStart ][ 0 ][ 0 ] - whitespaceAtStart;

					mappings[ codeStart ].forEach( ( segment ) => {
						segment[ 0 ] -= offset;
					} );
				}

				map.mappings = encodeSourceMap( mappings );
			}

			return {
				code,
				map
			};
		}
	};
}

export default minify;
