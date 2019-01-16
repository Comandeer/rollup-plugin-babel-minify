import minify from '../../../dist/rollup-plugin-babel-minify.es2015.js';

function emitAsset() {
	return {
		name: 'emit-asset',

		buildStart() {
			this.emitAsset( 'asset', 'I am an asset.' );
		}
	}
}

export default {
	input: 'index.js',
	plugins: [
		emitAsset(),
		minify()
	],
	output: {
		sourcemap: true,
		dir: 'bundle',
		format: 'es'
	}
};
