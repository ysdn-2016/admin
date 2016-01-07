
const marked = require('marked')

export default function (input) {
	return marked(input).replace(/<a/g, '<a target="_blank"')
}
