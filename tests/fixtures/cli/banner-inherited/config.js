import minify from '../../../../dist/rollup-plugin-babel-minify.es2015.js';

export default {
	input: 'index.js',
	plugins: [
		minify()
	],
	output: {
		banner: '/* hublabubla */',
		sourcemap: true,
		file: 'output/bundle.js',
		format: 'es'
	}
};
