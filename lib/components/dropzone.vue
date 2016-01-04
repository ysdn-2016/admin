<template>
	<div class="dropzone"
		@dragenter.stop.prevent
		@dragover.stop.prevent="dragOver"
		@drop.stop.prevent="drop">
		<input type="file" name="file" class="dropzone-file" multiple
		  v-if="!files.length"
			v-el:input
			@change="onFileSelect" />
		<div class="dropzone-help" v-if="!files.length">
			<img src="/assets/icon-image.svg" class="dropzone-help-icon" />
			<span class="dropzone-help-text">Drop images here</span>
		</div>
		<div class="dropzone-files" v-show="files.length">
			<thumbnail
				v-for="(index, file) in files"
				:index="index"
				@insert="onInsertContent"
				@delete="onDeleteFile"></thumbnail>
		</div>
	</div>
</template>

<script>

import api from '../api'
import auth from '../auth'

import Thumbnail from './thumbnail.vue'

const prevent = e => e.preventDefault()
const allowed = [
	'image/png',
	'image/gif',
	'image/jpg',
	'image/jpeg',
	'image/webp',
	'video/mp4',
	'video/ogv',
	'video/webm'
]

export default {

	name: 'Dropzone',

	components: {
		Thumbnail
	},

	props: {
		project: {
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
			errors: [],
			files: []
		}
	},

	computed: {
		thumbnails: function () {

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
			var file = this.files[index]
			console.log(file)
			this.files.splice(index, 1)
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
				this.files.push(file)
				api.assets.save(auth.user.id, this.project, file)
			})
		}

	}

}

</script>

<style>
</style>
