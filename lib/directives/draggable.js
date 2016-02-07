
const siblings = el => Array.prototype.filter.call(el.parentNode.children, child => child !== el)
const index = el => Array.prototype.indexOf.call(el.parentNode.children, el)

// Global state. We can get away with this because users can only ever perform
// one drag action at a time
const state = {
	from: undefined,
	to: undefined
}

export default function plugin (Vue) {
	const _ = Vue.util

	Vue.directive('draggable', {
		twoWay: true,
		bind () {
			const el = this.el

			this.dragStart = dragStart.bind(this)
			this.dragEnd = dragEnd.bind(this)
			this.dragEnter = dragEnter.bind(this)
			this.dragOver = dragOver.bind(this)
			this.drop = drop.bind(this)

			_.on(el, 'dragstart', this.dragStart)
			_.on(el, 'dragend', this.dragEnd)

			_.on(el, 'dragenter', this.dragEnter)
			_.on(el, 'dragover', this.dragOver)
			_.on(el, 'drop', this.drop)

			el.setAttribute('draggable', '')
		},

		unbind () {
			const el = this.el

			el.removeAttribute('draggable')

			_.off(el, 'dragstart', this.dragStart)
			_.off(el, 'dragend', this.dragEnd)

			_.off(el, 'dragenter', this.dragEnter)
			_.off(el, 'dragover', this.dragOver)
		}
	})
}

function dragStart () {
	this.el.setAttribute('is-dragged', '')
	state.from = index(this.el)
}

function dragEnd () {
	this.el.removeAttribute('is-dragged')
	this.el.removeAttribute('is-dragged-over')
	siblings(this.el).forEach(sibling => sibling.removeAttribute('is-dragged-over'))
	state.from = undefined
	state.to = undefined
}

function dragEnter () {
	siblings(this.el).forEach(sibling => sibling.removeAttribute('is-dragged-over'))
	this.el.setAttribute('is-dragged-over', '')
	state.to = index(this.el)
}

function dragOver (e) {
	e.preventDefault()
	e.dataTransfer.dropEffect = 'move'
}

function drop (e) {
	e.stopPropagation()
	if (state.from === state.to) return

	this.vm.$emit('sort', { from: state.from, to: state.to })
}
