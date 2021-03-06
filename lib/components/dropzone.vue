<template>
	<div class="dropzone" :class="{ 'dropzone--has-files': assets.length }"
		@dragenter.stop.prevent
		@dragover.stop.prevent="dragOver"
		@drop.stop.prevent="drop">
		<div class="dropzone-files" v-show="assets.length">
			<asset
				v-for="(index, asset) in assets"
				v-draggable="assets"
				:asset="asset"
				:index="index"
				:show-insert-button="showInsertButton"
				@delete="onDeleteFile"
				@insert="onInsertContent"></asset>
		</div>
		<div class="dropzone-prompt" v-show="assets.length < limit">
			<div class="dropzone-help" v-show="!saving">
				<img :src="imageIconSrc" class="dropzone-help-icon" />
				<span class="dropzone-help-text">{{ prompt }}</span>
			</div>
			<div class="dropzone-help" v-show="saving">
				<span class="dropzone-spinner"></span>
				<span class="dropzone-help-text">Saving...</span>
			</div>
			<input type="file" name="file" class="dropzone-file" multiple
				v-el:input
				@change="onFileSelect" />
		</div>
		<div class="dropzone-over-limit" v-show="assets.length >= limit">
			<p>You've reached your upload limit.<br/>Questions? <a href="https://www.facebook.com/messages/100007107395716" target="_blank">Shoot us a message.</a></p>
		</div>
	</div>
</template>

<script>

import api from '../api'
import auth from '../auth'
import config from '../config'
import router from '../router'

import validateFile from '../helpers/files'
import moveArrayItem from '../helpers/move-array-item'

import Asset from './asset.vue'

const prevent = e => e.preventDefault()

export default {

	name: 'Dropzone',

	components: {
		Asset
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
			saving: false,
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

	events: {
		sort (args) {
			moveArrayItem(this.assets, args.from, args.to)
			api.assets.setOrder(auth.user.id, this.projectId, this.assets)
				.catch(error('There was an error updating the asset order. Try again later, or contact Ross for help.'))
		}
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
			var files = e.dataTransfer.files
			this.handleFiles(files)
		},

		handleFiles (files) {
			this.saving = true
			const tasks = Array.from(files).map(file => {
				return validate(file).then(file => this.save(file))
			})
			Promise.all(tasks).then(() => {
				this.saving = false
			}).catch(err => {
				this.saving = false
				console.warn('Dropzone#handleFiles threw an error')
				console.error(err.stack)
			})
		},

		save (file) {
			return api.assets.save(auth.user.id, this.projectId, file)
				.then(res => {
					this.assets.push(res.asset)
				})
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

function error (message) {
	return () => {
		alert(message)
		return
	}
}



</script>

<style>
</style>
