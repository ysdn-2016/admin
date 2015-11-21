
const slugify = require('slugify')

export default function (input) {
	return slugify(input).toLowerCase()
}
