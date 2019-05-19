import minify from '../../../../dist/rollup-plugin-babel-minify.es2015.js';
import emitAsset from '../../../helpers/emitAssetPlugin.js';

export default {
	input: 'index.js',
	plugins: [
		emitAsset(),
		minify()
	],
	output: {
		sourcemap: true,
		dir: 'output',
		format: 'es'
	}
};
