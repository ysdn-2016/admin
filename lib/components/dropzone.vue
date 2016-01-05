<template>
	<div class="dropzone" :class="{ 'hasFiles': assets.length }"
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
				<img src="assets/icon-image.svg" class="dropzone-help-icon" />
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
				.catch(err => console.log(err.stack))
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
				api.assets.save(auth.user.id, this.project_id, file)
					.then(res => this.assets.push(res.asset))
			})
		}

	}

}

</script>

<style>
</style>
