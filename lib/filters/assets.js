
export default function (input, assets) {
	if (!Array.isArray(assets)) {
		throw new Error('Must pass an array of assets')
	}
	assets.forEach(asset => {
		const name = new RegExp(asset.name, 'g')
		input = input.replace(name, asset.url)
	})
	return input
}
