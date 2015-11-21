
const marked = require('marked')

export default function (input) {
	// TODO: find a way to swap out any images with their S3 urls
	return marked(input)
}
