function emitAssetPlugin() {
	return {
		name: 'emit-asset',

		buildStart() {
			const assetContent = 'I am an asset.';

			if ( this.emitFile ) {
				return this.emitFile( {
					type: 'asset',
					fileName: 'assets/asset-cc117f4a.js',
					source: assetContent
				} );
			}

			this.emitAsset( 'asset.js', assetContent );
		}
	};
}

export default emitAssetPlugin;
