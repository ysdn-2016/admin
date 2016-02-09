
const marked = require('marked')
const sanitize = require('insane')

sanitize.defaults.allowedTags.push('iframe')
sanitize.defaults.allowedAttributes.iframe.push('width', 'height', 'webkitallowfullscreen', 'mozallowfullscreen')
sanitize.defaults.allowedClasses.a.push('button')
sanitize.defaults.allowedClasses.div.push('contributors')
sanitize.defaults.allowedClasses.span.push('contributor-role', 'contributor-name')

export default function (input) {
	return sanitize(marked(input).replace(/<a/g, '<a target="_blank"'))
}
