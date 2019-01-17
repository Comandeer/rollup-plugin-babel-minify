function emitAssetPlugin() {
	return {
		name: 'emit-asset',

		buildStart() {
			this.emitAsset( 'asset.js', 'I am an asset.' );
		}
	};
}

export default emitAssetPlugin;
