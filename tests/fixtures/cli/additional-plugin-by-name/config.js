import minify from '../../../../dist/rollup-plugin-babel-minify.es2015.js';

export default {
	input: 'index.js',
	plugins: [
		minify( {
			plugins: [
				'@babel/plugin-syntax-async-generators'
			]
		} )
	],
	output: {
		sourcemap: true,
		file: 'output/bundle.js',
		format: 'es'
	}
};
