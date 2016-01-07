<template>
	<div class="dropzone" :class="{ 'dropzone--has-files': assets.length }"
		@dragenter.stop.prevent
		@dragover.stop.prevent="dragOver"
		@drop.stop.prevent="drop">
		<div class="dropzone-files" v-show="assets.length">
			<thumbnail
				v-for="(index, asset) in assets"
				:asset="asset"
				:index="index"
				@delete="onDeleteFile"></thumbnail>
		</div>
		<div class="dropzone-prompt">
			<div class="dropzone-help">
				<img :src="imageIconSrc" class="dropzone-help-icon" />
				<span class="dropzone-help-text">Drop images here</span>
			</div>
			<input type="file" name="file" class="dropzone-file" multiple
				v-el:input
				@change="onFileSelect" />
		</div>
	</div>
</template>

<script>

import api from '../api'
import auth from '../auth'
import config from '../config'

import Thumbnail from './thumbnail.vue'

const prevent = e => e.preventDefault()
const allowed = [
	'image/png',
	'image/gif',
	'image/jpg',
	'image/jpeg',
	'image/webp'
]

export default {

	name: 'Dropzone',

	components: {
		Thumbnail
	},

	props: {
		project_id: {
			type: String,
			required: true
		},
		assets: {
			type: Array,
			required: true
		}
	},

	data () {
		return {
			files: [],
			errors: []
		}
	},

	computed: {
		root () {
			return config.app.root
		},
		imageIconSrc () {
			return `${this.root}/assets/icon-image.svg`
		}
	},

	ready () {
		window.addEventListener('dragover', prevent)
		window.addEventListener('drop', prevent)
	},

	detached () {
		window.removeEventListener('dragover', prevent)
		window.removeEventListener('drop', prevent)
	},

	methods: {

		onFileSelect () {
			var files = this.$els.input.files
			this.handleFiles(files)
		},

		onDeleteFile (index) {
			var asset = this.assets[index]
			api.assets.destroy(auth.user.id, this.project_id, asset.id)
				.then(() => this.assets.splice(index, 1))
				.catch(error('There was an error deleting the last image. Try again later, or contact Ross for help.'))
		},

		onPreviewFile (url) {
			this.$emit('preview', url)
		},

		onInsertContent (path) {
			this.$emit('insert', path)
		},

		dragOver (e) {
			e.dataTransfer.dropEffect = 'copy'
		},

		drop (e)  {
			var data = e.dataTransfer
			var files = data.files
			this.handleFiles(files)
		},

		handleFiles (files) {
			Array.from(files).forEach(file => {
				var mime = file.type
				if (mime == void 0) {
					alert(`Unknown file type`)
					return
				}
				if (allowed.indexOf(mime) === -1) {
					var name = file.name
					var ext = mime.length < 1 ? name.split('.').pop() : mime.split('/').pop()
					if (ext === name) {
						alert(`Unknown file type`)
						return
					}
					alert(`File type ${ext} is not allowed`)
					return
				}
				if (file.size > config.api.maxFileSize) {
					alert(`We can't accept files that are larger than 1MB. Look at the FAQ if you need help reducing the size of your images.`)
					return
				}
				getImageDimensionsFromFile(file)
					.catch(error('There was an error. Mind pinging Ross on Facebook. Tell him: the call to getImageDimensionsFromFile in dropzone.vue failed.'))
					.then(dimensions => validateDimensions(dimensions)
							.then(() => api.assets.save(auth.user.id, this.project_id, file)
								.then(res => this.assets.push(res.asset)))
							.catch(err => {
								console.log(err)
								error('There was an error saving this image. Try again later, or contact Ross for help.')
							}))
					.catch(error('Your image is not large enough. Images need a minumum width of 800px'))
			})
		}

	}

}

function error (message) {
	return () => {
		alert(message)
		return
	}
}

function validateDimensions (dimensions) {
	if (dimensions.width < config.api.minImageDimensions) {
		throw new Error('Image not wide enough')
	}
	return Promise.resolve(true)
}

function getImageDimensionsFromFile (file) {
	var reader = new FileReader()
	var image = new Image()
	return new Promise((resolve, reject) => {
		reader.onload = function (event) {
			image.onload = function () {
				resolve({
					width: image.width,
					height: image.height
				})
			}
			image.onerror = function () {
				reject('Invalid file type')
			}
			image.src = event.target.result
		}
		reader.readAsDataURL(file)
	})
}

</script>

<style>
</style>
