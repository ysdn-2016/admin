
import markdown from '../filters/markdown'

export default function (str) {
	const html = markdown(str)
	const el = document.createElement('div')
	el.innerHTML = html
	const content = el.innerText || el.textContent
	const length = content.length
	return length
}
