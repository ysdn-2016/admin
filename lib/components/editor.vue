<template>
	<div class="editor">
		<header class="editor-action-bar">
			<div class="editor-actions">
				<span @click.prevent="enableEditor" class="editor-action editor-markdown-action" :class="{ 'active': !previewing }">Write</span>
				<span @click.prevent="enablePreview" class="editor-action editor-preview-action" :class="{ 'active': previewing }">Preview</span>
			</div>
			<a class="editor-help-markdown" href="https://guides.github.com/features/mastering-markdown/#what" target="_blank">Markdown is supported</a>
		</header>
		<textarea placeholder="Enter a description of this project"
			 :rows="size"
			 v-el:editor
			 v-model="content"
			 v-show="!previewing">{{ contents }}</textarea>
		<div class="editor-preview" v-el:preview v-if="previewing" v-html="content | link_assets assets | markdown | default 'Nothing to preview'"></div>
	</div>
</template>

<script>

import autosize from 'autosize'
import fitvids from 'fitvids'

export default {

	name: 'Editor',

	props: {
		assets: {
			type: Array,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		size: {
			type: Number,
			default: 8
		}
	},

	data () {
		return {
			previewing: false
		}
	},

	ready () {
		autosize(this.$els.editor)
	},

	watch: {
		content: 'update',
		size: 'update',
		previewing: 'fit'
	},

	methods: {
		update () {
			autosize.update(this.$els.editor)
		},
		fit () {
			fitvids('.editor-preview')
		},
		enableEditor () {
			this.previewing = false
		},
		enablePreview () {
			this.previewing = true
		}
	}

}

</script>
