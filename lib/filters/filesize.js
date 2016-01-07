
const filesize = require('file-size')

const decimals = 0

export default function (str) {
	const bytes = parseInt(str, 10)
	return filesize(bytes, { fixed: decimals }).human('si')
}
