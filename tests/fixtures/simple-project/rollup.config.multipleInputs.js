import minify from '../../../dist/rollup-plugin-babel-minify.es2015.js';

export default {
	input: [
		'Test.js',
		'another.js'
	],
	plugins: [
		minify()
	],
	output: {
		banner: '/* hublabubla */',
		sourcemap: true,
		dir: 'bundle',
		format: 'es'
	}
};
