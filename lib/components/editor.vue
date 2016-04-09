<template>
	<div class="editor" :class="{ 'editor--no-controls': !controls, 'editor--character-limit': limit, 'editor--character-limit-error': limitError }">
		<header class="editor-action-bar" v-if="controls">
			<div class="editor-actions">
				<span @click.prevent="enableEditor" class="editor-action editor-markdown-action" :class="{ 'active': !previewing }">Write</span>
				<span @click.prevent="enablePreview" class="editor-action editor-preview-action" :class="{ 'active': previewing }">Preview</span>
			</div>
			<a class="editor-help-markdown" href="https://dl.dropboxusercontent.com/u/68882376/md-example.htm" target="_blank">Markdown is supported</a>
		</header>
		<textarea :placeholder="placeholder"
			 :rows="size"
			 v-el:editor
			 v-model="content"
			 v-show="!previewing"
			 @keyup="limitLength"
			 @blur="limitLength">{{ contents }}</textarea>
		<div class="editor-limit" v-if="limit" v-show="!previewing"><span class="editor-limit-number" title="Remaining characters">{{ remainingCharacterCount }}</span></div>
		<div class="editor-preview" v-el:preview v-if="previewing" v-html="renderedContent | markdown | default 'Nothing to preview'"></div>
	</div>
</template>

<script>

import autosize from 'autosize'
import fitvids from 'fitvids'

import linkAssets from '../filters/assets'
import markdownCharacterCount from '../helpers/markdown-character-count'

export default {

	name: 'Editor',

	props: {
		assets: {
			type: Array,
			default: () => []
		},
		content: {
			type: String,
			required: true
		},
		placeholder: {
			type: String,
			default: ''
		},
		controls: {
			type: Boolean,
			default: true
		},
		size: {
			type: Number,
			default: 8
		},
		limit: {}
	},

	data () {
		return {
			previewing: false,
			limitError: false
		}
	},

	ready () {
		autosize(this.$els.editor)
	},

	computed: {
		renderedContent () {
			if (!this.assets.length) return this.content
			return linkAssets(this.content, this.assets)
		},
		remainingCharacterCount () {
			if (!this.limit) return
			return this.limit - markdownCharacterCount(this.content)
		}
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
		},
		limitLength (e) {
			this.limitError = false
			if (!this.limit) return
			if (markdownCharacterCount(this.content) <= this.limit) return
			this.limitError = true
		}
	}

}

</script>
