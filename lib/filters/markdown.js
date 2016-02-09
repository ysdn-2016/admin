
const marked = require('marked')
const sanitize = require('insane')

sanitize.defaults.allowedTags.push('iframe')
sanitize.defaults.allowedAttributes.iframe.push('width', 'height', 'webkitallowfullscreen', 'mozallowfullscreen')
sanitize.defaults.allowedClasses = {
	a: ['button'],
	div: ['contributors'],
	span: ['contributor-role', 'contributor-name']
}

export default function (input) {
	return sanitize(marked(input).replace(/<a/g, '<a target="_blank"'))
}
