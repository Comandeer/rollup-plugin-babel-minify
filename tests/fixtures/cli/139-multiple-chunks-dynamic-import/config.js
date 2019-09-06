import minify from '../../../../dist/rollup-plugin-babel-minify.es2015.js';

export default {
	input: 'chunks.js',
	plugins: [
		minify()
	],
	output: {
		chunkFileNames: 'chunk-generated.js',
		banner: '/* hublabubla */',
		sourcemap: true,
		dir: 'output',
		format: 'es'
	}
};
