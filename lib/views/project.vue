<template>
	<form class="project-form" v-on:submit.prevent="save" v-show="loading">
		<header class="project-form-header">
			<div class="project-form-header-context">
				<a v-link="{ name: 'home' }" class="button">{{ published  ? 'Back' : 'Cancel' }}</a>
			</div>
			<div class="project-form-header-actions">

				<a @click.prevent="save" class="button primary" :class="{ 'disabled': !valid }">{{ saveButtonTitle }}</a>
			</div>
		</header>
		<div class="form-field project-draft-field" v-if="!published">
			<label><input v-model="draft" type="checkbox" /> Draft</label>
			<p class="form-field-note">Save this as a draft and come back to it later so it doesn't get published.</p>
		</div>
		<div class="form-field project-title-field" :class="{ 'error': validation.title.valid }">
			<label class="form-field-label"  for="title">Project Title</label>
			<input type="text" id="title" placeholder="Project Title..."
				v-model="title"
				v-validate="required, minLength: 3, maxLength: 50" />
			<div class="project-slug" v-if="validation.title.valid">
				<a href="{{ url }}" target="_blank">
					<span class="slug-domain">{{ domain }}/{{ user.name | slug }}/</span><!--
				--><span class="slug-path">{{ title | slug }}</span>
				</a>
			</div>
			<div v-if="showErrors">
				<span class="project-form-error" v-if="validation.title.duplicate">Another project with this title already exists</span>
				<span class="project-form-error" v-if="validation.title.required">Project title is required</span>
				<span class="project-form-error" v-if="validation.title.minLength">Project title is too short</span>
				<span class="project-form-error" v-if="validation.title.maxLength">Project title is too long</span>
			</div>
		</div>
		<div class="form-field project-contents-field">
			<label class="form-field-label">Project Contents</label>
			<div class="editor">
				<header class="editor-action-bar">
					<div class="editor-actions">
						<span @click.prevent="enableEditor" class="editor-action editor-markdown-action" :class="{ 'active': !previewing }">Write</span>
						<span @click.prevent="enablePreview" class="editor-action editor-preview-action" :class="{ 'active': previewing }">Preview</span>
					</div>
					<a class="editor-help-markdown" href="https://guides.github.com/features/mastering-markdown/#what" target="_blank">Markdown is supported</a>
				</header>
				<textarea placeholder="Enter a description of this project"
					 v-el="editor"
					 v-model="contents"
					 v-validate="required"
					 v-show="!previewing">{{ contents }}</textarea>
				<div class="editor-preview" v-show="previewing" v-html="contents | default 'Nothing to preview' | markdown"></div>
				<div v-if="showErrors">
					<span class="project-form-error" v-if="validation.contents.required">This can't be empty</span>
				</div>
			</div>
		</div>
		<div class="form-field project-assets-field">
			<label class="form-field-label">Project Assets</label>
			<dropzone :project="id" :files="files" @insert="insertImage"></dropzone>
		</div>
		<div class="form-field project-tags-field">
			<label for="category" class="form-field-label">Project Category</label>
			<select id="category">
				<option v-for="category in categories">{{ category }}</option>
			</select>
		</div>
		<div class="form-field form-advanced-actions" v-if="id">
			<a @click.prevent="delete">Delete Project</a>
		</div>
	</form>
</template>

<script>

import autosize from 'autosize'

import api from '../api'
import auth from '../auth'
import config from '../config'
import { router } from '../..'

import slug from '../filters/slug'

import Dropzone from '../components/dropzone.vue'

// TODO: on upload, maybe we can ping a Slack endpoint and trigger a deploy
// through a Slackbot of some kind?
export default {

	name: 'ProjectView',

	components: {
		Dropzone
	},

	data () {
		return {
			id: '',
			title: '',
			contents: '',
			owner_id: '',
			draft: false,
			files: [],
			assets: [],
			categories: [
				'Interactive',
				'Motion',
				'Packaging',
				'Information',
				'Branding',
				'Editorial',
				'Print'
			],
			loading: true,
			previewing: false,
			showErrors: false
		}
	},

	ready () {
		var editor = this.$els.editor
		autosize(editor)
		this.$watch('contents', (newValue, oldValue) => {
			autosize.update(editor)
		})
	},

	computed: {
		domain () {
			return config.domain
		},
		user () {
			return auth.user
		},
		url () {
			return `${this.domain}/${slug(this.user.name)}/${slug(this.title)}`
		},
		published () {
			return this.id && !this.draft
		},
		saveButtonTitle () {
			if (this.draft) return 'Save as a draft'
			if (!this.id) return 'Publish'
			return 'Save'
		}
	},

	methods: {
		save () {
			if (!this.valid) {
				this.showErrors = true
				return
			}
			api.projects.save(auth.user.id, {
				id: this.id,
				title: this.title,
				contents: this.contents,
				draft: this.draft
			}).then(res => {
				router.go({ name: 'project', params: { id: res.id }})
			}).catch(err => {
				alert(err.message)
			})
		},
		delete () {
			if (!this.id) return
			if (!confirm(`Are you sure you want to delete this project? There's no going back.`)) return
			api.projects.destroy(auth.user.id, this.id)
				.then(res => {
					router.go({ name: 'home' })
				})
				.catch(err => {
					alert(err.message)
				})
		},
		enableEditor () {
			this.previewing = false
		},
		enablePreview () {
			this.previewing = true
		},
		insertImage (path) {
			this.contents += `\n![](${path})`
			this.$els.editor.focus()
		}
	},

	route: {
		data ({ to }) {
			if (!to.params.id) {
				this.published = false
				// api.projects.save({
				// 	title: '',
				// 	contents: '',
				// 	draft: true
				// })
				return Promise.resolve({})
			}
			return api.projects.get(auth.user.id, to.params.id)
				.then(res => {
					this.published = true
					return res
				})
				.catch(err => console.error(err))
		},
		canActivate (transition) {
			return true
		},
		canDeactivate (transition) {
			return true
		}
	}

}
</script>

<style>
	.slug-domain {
		color: #ccc;
	}
</style>
