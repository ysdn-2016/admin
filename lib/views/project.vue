<template>
	<form class="project-form" v-on:submit.prevent="save" :class="{ 'loading': loading }">
		<header class="project-form-header">
			<div class="project-form-header-context">
				<a v-link="{ name: 'home' }" class="button">{{ published  ? 'Back' : 'Cancel' }}</a>
			</div>
			<div class="project-form-header-actions">
				<a @click.prevent="save" class="button primary" :class="{ 'disabled': !valid }">{{ saveButtonTitle }}</a>
			</div>
		</header>
		<div class="form-field project-draft-field">
			<label><input v-model="draft" type="checkbox" disabled /> Draft</label>
			<p class="form-field-note">All posts are temporarily in draft mode until the site is live.</p>
		</div>
		<div class="form-field project-title-field">
			<label class="form-field-label"  for="title">Title</label>
			<input type="text" id="title" placeholder="Project Title..." v-model="title" />
			<div class="project-slug" v-if="title.length">
				<a href="{{ url }}" target="_blank" v-if="published">
					<span class="slug-domain">{{ domain }}/{{ user.name | slug }}/</span><!--
				--><span class="slug-path">{{ title | slug }}</span>
				</a>
			</div>
		</div>
		<div class="form-field project-tags-field">
			<label for="category" class="form-field-label">Project Category</label>
			<select id="category" v-model="category">
				<option disabled selected value="">Select a category</option>
				<option disabled value="">&nbsp;</option>
				<optgroup v-for="(name, group) in categories" :label="name">
					<option v-for="category in group" :value="category.id">{{ category.label }}</option>
				</optgroup>
			</select>
		</div>
		<div class="form-field project-assets-field">
			<label class="form-field-label">Assets</label>
			<dropzone :project_id="id" :files="files" :assets="assets" @insert="insertImage"></dropzone>
		</div>
		<div class="form-field project-contents-field">
			<label class="form-field-label">Description</label>
			<editor :content.sync="contents">
		</div>
		<div class="form-field form-advanced-actions" v-if="id">
			<a @click.prevent="delete">Delete Project</a>
		</div>
	</form>
</template>

<script>

import extend from 'extend'

import api from '../api'
import auth from '../auth'
import config from '../config'
import { router } from '../..'

import slug from '../filters/slug'

import Dropzone from '../components/dropzone.vue'
import Editor from '../components/editor.vue'

const error = err => {
	alert('An error occured. Open the console (⌘+opt+J), take a screen shot, and send it to Ross. (Sorry for the inconvenience)')
	console.error(err)
}

// TODO: on upload, maybe we can ping a Slack endpoint and trigger a deploy
// through a Slackbot of some kind?
export default {

	name: 'ProjectView',

	components: {
		Dropzone,
		Editor
	},

	data () {
		return {
			id: '',
			title: '',
			contents: '',
			owner_id: '',
			draft: true,
			files: [],
			assets: [],
			categories: extend({}, config.content.categories),
			category: '',
			loading: true,
			published: false,
			temporary: false,
			showErrors: false
		}
	},

	computed: {
		valid () {
			return this.title.trim().length &&
				this.contents.trim().length &&
				this.category.trim().length
		},
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
			return !this.temporary
		},
		saveButtonTitle () {
			if (this.draft) return 'Save as a draft'
			if (!this.id) return 'Publish'
			return 'Save'
		}
	},

	methods: {
		save () {
			if (!valid) return
			api.projects.save(auth.user.id, {
				id: this.id,
				title: this.title,
				contents: this.contents,
				category: this.category,
				draft: this.draft,
				assets: this.assets
			}).then(res => {
				console.log(res)
				router.go({ name: 'project', params: { id: res.id }})
			}).catch(error)
		},
		delete () {
			if (!this.id) return
			if (!confirm(`Are you sure you want to delete this project? There's no going back.`)) return
			api.projects.destroy(auth.user.id, this.id).then(res => {
				router.go({ name: 'home' })
			}).catch(error)
		},
		insertImage (path) {
			this.contents += `\n![Alt text](${path})`
		}
	},

	route: {
		data ({ to }) {
			if (!to.params.id) {
				return api.projects.temporary(auth.user.id)
					.then(res => {
						this.loading = false
						return res
					})
			}
			return api.projects.get(auth.user.id, to.params.id)
				.then(res => {
					this.published = true
					this.loading = false
					return res
				})
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
