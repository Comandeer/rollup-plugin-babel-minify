import asyncGeneratorsPlugin from '@babel/plugin-syntax-async-generators';
import minify from '../../../../dist/rollup-plugin-babel-minify.es2015.js';

export default {
	input: 'index.js',
	plugins: [
		minify( {
			plugins: [
				asyncGeneratorsPlugin
			]
		} )
	],
	output: {
		sourcemap: true,
		file: 'output/bundle.js',
		format: 'es'
	}
};
