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
				:show-insert-button="showInsertButton"
				@delete="onDeleteFile"
				@insert="onInsertContent"></thumbnail>
		</div>
		<div class="dropzone-prompt" v-show="assets.length < limit">
			<div class="dropzone-help">
				<img :src="imageIconSrc" class="dropzone-help-icon" />
				<span class="dropzone-help-text">{{ prompt }}</span>
			</div>
			<input type="file" name="file" class="dropzone-file" multiple
				v-el:input
				@change="onFileSelect" />
		</div>
		<div class="dropzone-over-limit" v-show="assets.length >= limit">
			<p>You've reached your upload limit.<br/>Need more? <a href="https://www.facebook.com/messages/100007107395716" target="_blank">Let us know.</a></p>
		</div>
	</div>
</template>

<script>

import api from '../api'
import auth from '../auth'
import config from '../config'
import router from '../router'

import Thumbnail from './thumbnail.vue'

const prevent = e => e.preventDefault()

export default {

	name: 'Dropzone',

	components: {
		Thumbnail
	},

	props: {
		assets: {
			type: Array,
			default: () => []
		},
		prompt: {
			type: String,
			default: 'Drop images here'
		},
		showInsertButton: {
			type: Boolean,
			default: false,
			required: false
		},
		limit: {
			type: Number,
			default: 5
		}
	},

	data () {
		return {
			errors: []
		}
	},

	computed: {
		root () {
			return config.app.root
		},
		projectId() {
			return this.$route.params.id || this.$parent.id
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

		onPreviewFile (url) {
			this.$emit('preview', url)
		},

		onInsertContent (path) {
			this.$emit('insert', path)
		},

		onDeleteFile (index) {
			var asset = this.assets[index]
			api.assets.destroy(auth.user.id, this.projectId, asset.id)
				.then(() => this.assets.splice(index, 1))
				.catch(error('There was an error deleting the last image. Try again later, or contact Ross for help.'))
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
				if (config.api.allowedFileMimeTypes.indexOf(mime) === -1) {
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
					alert(`We can't accept files that are larger than ${config.api.maxFileSizeHuman}. Look at the FAQ if you need help reducing the size of your images.`)
					return
				}
				getImageDimensionsFromFile(file)
					.catch(error('There was an error. Mind pinging Ross on Facebook. Tell him: the call to getImageDimensionsFromFile in dropzone.vue failed.'))
					.then(dimensions => validateDimensions(dimensions)
							.then(() => api.assets.save(auth.user.id, this.projectId, file)
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
