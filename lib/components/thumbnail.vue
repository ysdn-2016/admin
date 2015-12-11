<template>
	<div class="dropzone-file">
		<div class="dropzone-file-preview" :style="{ 'background-image': 'url(' + url + ')' }"
			@click.prevent="preview"></div>
		<div class="dropzone-file-meta">
			<span class="dropzone-file-name">{{ name }}</span>
			<span class="dropzone-file-dimensions" v-if="loading">Loading...</span>
			<span class="dropzone-file-dimensions" v-if="!loading">{{ width }}x{{ height }}</span>
			<span class="dropzone-file-size" :class="sizeClass" v-if="!loading">{{ size | filesize }}</span>
		</div>
		<div class="dropzone-file-actions">
			<a href="#" class="dropzone-action dropzone-action-insert" @click.prevent="insert">Insert</a>
			<a href="#" class="dropzone-action dropzone-action-delete" @click.prevent="delete">Delete</a>
		</div>
	</div>
</template>

<script>

const MB = 1000000

export default {

	name: 'Thumbnail',

	props: {
		index: {
			type: Number,
			required: true
		}
	},

	data () {
		return {
			id: '',
			mime: '',
			name: '',
			path: '',
			url: '',
			width: -1,
			height: -1,
			loading: true
		}
	},

	asyncData: function (resolve, reject) {
		var reader = new FileReader()
		reader.onloadend = e => {
			var img = new Image()
			img.onload = () => {
				resolve({
					url: reader.result,
					width: img.width,
					height: img.height,
					loading: false
				})
			}
			img.src = reader.result
		}
		reader.onerror = err => reject(err)
		reader.readAsDataURL(this.file)
	},

	computed: {
		file: function () {
			return this.$parent.files[this.index]
		},
		name: function () {
			return this.file.name
		},
		size: function () {
			return this.file.size
		},
		sizeClass: function () {
			if (this.size > (8 * MB)) return 'massive'
			if (this.size > (3 * MB)) return 'large'
			if (this.size > (1 * MB)) return 'medium'
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
