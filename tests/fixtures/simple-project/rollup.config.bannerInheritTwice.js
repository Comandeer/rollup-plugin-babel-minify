import minify from '../../../dist/rollup-plugin-babel-minify.es2015.js';

export default {
	input: 'index.js',
	plugins: [
		// Plugin adding banner dynamically is used to ensure that test passes due to fix,
		// not due to the fact that plugin does not insert banner on its own, causing that
		// banner is inserted only once (by Rollup).
		{
			outputOptions( outputOptions ) {
				return Object.assign( {}, outputOptions, {
					banner: '/* hublabubla */'
				} );
			}
		},

		minify()
	],
	output: {
		sourcemap: true,
		file: 'bundle.js',
		format: 'es'
	}
};
