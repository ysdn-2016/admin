
<template>
	<div class="thumbnail"
		@dragenter.stop.prevent
		@dragover.stop.prevent="dragOver"
		@drop.stop.prevent="drop">
		<a :href="url" target="_blank" class="thumbnail-preview"
			:class="{ 'thumbnail-preview--has-image': hasUploadedImage }"
			:style="{ 'background-image': 'url(' + imageUrl + ')' }">
			<input type="file" name="thumbnail" v-el:input @change="onFileSelect" />
		</a>
		<div class="thumbnail-actions">
			<p>Upload an image to represent your project. Any aspect ratio is allowed&mdash;square, portrait, or landscape. Do what works best for your work!</p>
			<a href="#" class="button" @click.prevent="select">Upload Thumbnail</a>
			<p class="small">Thumbnails must meet our <a v-link="{ path: '/faq#what-kinds-of-files-can-i-upload' }" target="_blank">image requirements</a></p>
		</div>
	</div>
</template>

<script>

/**
 * CSS class names avoid .dropzone to avoid conflicting with the dropzone
 * Ideally, these should share a lot of code, but we want this to be quick.
 */

import api from '../api'
import auth from '../auth'
import config from '../config'
import validateFile from '../helpers/files'

const prevent = e => e.preventDefault()

export default {
	name: 'Thumbnail',

	data () {
		return {

		}
	},

	props: {
		file: {
			type: Object,
			required: true
		}
	},

	computed: {
		root () {
			return config.app.root
		},
		projectId() {
			return this.$route.params.id || this.$parent.id
		},
		hasUploadedImage () {
			return typeof this.file.url !== 'undefined'
		},
		url () {
			return this.file.url
		},
		imageUrl () {
			return this.file.url || this.imageIconSrc
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

		dragOver (e) {
			e.dataTransfer.dropEffect = 'copy'
		},

		drop (e)  {
			var data = e.dataTransfer
			var files = data.files
			this.handleFiles(files)
		},

		select () {
			this.$els.input.click()
		},

		handleFiles (files) {
			Array.from(files).forEach(file => {
				validate(file)
					.then(file => {
						if (!file) return
						this.save(file)
					})
			})
		},

		save (file) {
			console.log(file)
			return api.projects.saveThumbnail(auth.user.id, this.projectId, file)
				.then(res => this.file = res.file)
				.catch(imageSaveFailure)
		}

	}
}

function validate (file) {
	return validateFile(file)
		.catch(err => alert(err))
}

function imageSaveFailure (err) {
	console.log(err)
	alert('There was an error saving this image. Try again later, or contact Ross for help.')
}

</script>

<style scoped>

.thumbnail {
	display: flex;
	align-items: stretch;
}

input[type="file"] {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0.0;
	margin: 0;
	cursor: pointer;
}

.thumbnail-preview {
	flex: 1 0 45%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	background: #f9f9f9;
	background-repeat: no-repeat;
	background-position: center;
	border-radius: 4px;
	height: 260px;
}

.thumbnail-preview--has-image {
	background-size: contain;
}

.thumbnail-preview-placeholder-image {
	opacity: 0.5;
	-webkit-user-drag: none;
	-moz-user-drag: none;
	-ms-user-drag: none;
	user-drag: none;
}

.thumbnail-actions {
	flex: 1 0 55%;
	padding: 1rem 3rem;
	font-size: 14px;
	line-height: 1.5;
}

.thumbnail-actions a {
	border-bottom: 1px currentColor solid;
}

.thumbnail-actions .button {
	background: #404040;
	display: block;
	margin-top: 2rem;
	text-align: center;
}

.thumbnail-actions .small {
	font-size: 12px;
}

</style>
