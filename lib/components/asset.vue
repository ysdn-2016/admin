<template>
	<div class="dropzone-file">
		<div class="dropzone-file-preview"
			:style="{ 'background-image': 'url(' + url + ')' }"></div>
		<div class="dropzone-file-meta">
			<span class="dropzone-file-name">{{ name }}</span>
			<span class="dropzone-file-dimensions" v-if="loading">Loading...</span>
			<span class="dropzone-file-dimensions" v-if="!loading">{{ width }}x{{ height }}</span>
			<span class="dropzone-file-size" :class="sizeClass" v-if="!loading">{{ size | filesize }}</span>
		</div>
		<div class="dropzone-file-actions">
			<a href="#" class="dropzone-action dropzone-action-insert" v-if="showInsertButton === true" @click.prevent="insert">Add to Description</a>
			<a :href="url" class="dropzone-action dropzone-action-view" target="_blank">Preview</a>
			<a href="#" class="dropzone-action dropzone-action-delete" @click.prevent="delete">Delete</a>
		</div>
		<div class="dropzone-drag-zones">
			<div class="dropzone-drag-zone-above"></div>
			<div class="dropzone-drag-zone-below"></div>
		</div>
	</div>
</template>

<script>

import * as http from '../helpers/http'

const MB = 1000000

export default {

	name: 'Asset',

	props: {
		showInsertButton: {
			type: Boolean,
			required: true
		},
		asset: {
			type: Object,
			required: true
		},
		index: {
			type: Number,
			required: true
		}
	},

	data () {
		return {
			size: -1,
			width: -1,
			height: -1,
			loading: true
		}
	},

	/**
	 * Get image width, height, and file size
	 */
	asyncData: function (resolve, reject) {
		var img = new Image()
		img.onload = () => {
			let width = img.width
			let height = img.height
			http.head(this.asset.url)
				.then(res => {
					let size = parseInt(res.headers['content-length'], 10)
					resolve({
						width,
						height,
						size,
						loading: false
					})
				})
				.catch(err => {
					resolve({
						width,
						height,
						size: 0,
						loading: false
					})
				})
		}
		img.src = this.asset.url
	},

	computed: {
		file: function () {
			return this.$parent.files[this.index]
		},
		name: function () {
			return this.asset.name
		},
		url: function () {
			return this.asset.url
		},
		sizeClass: function () {
			if (this.size > (1.7 * MB)) return 'massive'
			if (this.size > (1.2 * MB)) return 'large'
			if (this.size > (0.5 * MB)) return 'medium'
			return ''
		}
	},

	methods: {
		preview () {
			this.$emit('preview', this.url)
		},
		insert () {
			this.$emit('insert', this.name)
		},
		delete () {
			this.$emit('delete', this.index)
		}
	}

}

</script>

<style>
</style>
