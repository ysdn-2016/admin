
const replaceAll = (str, search, replace) => str.replace(new RegExp(search, 'gi'), replace)

export default function (input, assets) {
	if (!Array.isArray(assets)) {
		throw new Error('Must pass an array of assets')
	}
	assets.forEach(asset => {
		input = replaceAll(input, `\\(${asset.name}\\)`, `(${asset.url})`)
	})
	return input
}
