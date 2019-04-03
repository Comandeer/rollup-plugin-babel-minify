import minify from '../../../../dist/rollup-plugin-babel-minify.es2015.js';

export default {
	input: 'chunks.js',
	plugins: [
		minify()
	],
	output: {
		banner: '/* hublabubla */',
		sourcemap: true,
		dir: 'output',
		format: 'es'
	}
};
