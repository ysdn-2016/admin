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
		<div class="form-field project-title-field">
			<label class="form-field-label"  for="title">Title</label>
			<input type="text" id="title" placeholder="Project Title..." v-model="title" maxlength="40" />
			<div class="project-slug" v-if="title.length">
				<a href="{{ url }}" target="_blank" v-if="published">
					<span class="slug-domain">{{ domain }}/{{ user.name | slug }}/</span><!--
				--><span class="slug-path">{{ title | slug }}</span>
				</a>
			</div>
		</div>
		<div class="form-field project-tags-field">
			<header class="form-field-header">
				<label for="category" class="form-field-label">Category</label>
				<a class="form-field-help-text" v-link="{ path: '/faq#my-project-doesnt-really-fit' }" target="_blank">Need help picking a category?</a>
			</header>
			<select id="category" v-model="category">
				<option disabled selected value="">Select a category</option>
				<option disabled value="">&nbsp;</option>
				<optgroup v-for="(name, group) in categories" :label="name">
					<option v-for="category in group" :value="category.id">{{ category.label }}</option>
				</optgroup>
			</select>
		</div>
		<div class="form-field project-thumbnail-field">
			<header class="form-field-header">
				<label class="form-field-label">Thumbnail</label>
				<a class="form-field-help-text" v-link="{ path: '/faq#what-makes-a-good-thumbnail' }" target="_blank">What makes a good thumbnail?</a>
			</header>
			<thumbnail :file.sync="thumbnail"></thumbnail>
		</div>
		<div class="form-field project-type-field">
			<header class="form-field-header">
				<label class="form-field-label">Project Type</label>
				<a class="form-field-help-text" v-link="{ path: '/faq#whats-the-difference-between-project-types' }" target="_blank">What's the difference?</a>
			</header>
			<div class="option-project-type-list">
				<div class="option-project-type" :class="{ 'option-project-type--selected': type === ProjectTypes.STANDARD }" @click.prevent="setProjectTypeStandard">
					<div class="option-project-type-title">Standard Project</div>
					<div class="option-project-type-note">Selection of images with a brief description.</div>
				</div>
				<div class="option-project-type" :class="{ 'option-project-type--selected': type === ProjectTypes.CASE_STUDY }" @click.prevent="setProjectTypeCaseStudy">
					<div class="option-project-type-title">Case Study</div>
					<div class="option-project-type-note">In-depth overview of a project.</div>
				</div>
			</div>
		</div>
		<div class="form-field project-contents-field">
			<label class="form-field-label">Description</label>
			<editor :assets="assets" :content.sync="contents" placeholder="Enter a description of this project" :size="type === ProjectTypes.CASE_STUDY ? 20 : 8" :limit="type === ProjectTypes.CASE_STUDY ? caseStudyMaxCharacters : standardProjectMaxCharacter">
		</div>
		<div class="form-field project-assets-field">
			<header class="form-field-header">
				<label class="form-field-label">{{ type === ProjectTypes.CASE_STUDY ? 'Assets' : 'Images' }}</label>
				<a class="form-field-help-text" v-link="{ path: '/faq#what-kinds-of-files-can-i-upload' }" target="_blank">What files can be uploaded?</a>
			</header>
			<dropzone :show-insert-button="type === ProjectTypes.CASE_STUDY" :assets="assets" :limit="12" @insert="insertImage"></dropzone>
		</div>
		<footer class="project-form-footer">
			<div class="project-form-footer-context">
				<a v-link="{ name: 'home' }" class="button">{{ published  ? 'Back' : 'Cancel' }}</a>
			</div>
			<a @click.prevent="delete" class="button destructive" v-if="published">Delete Project</a>
			<div class="project-form-footer-actions">
				<a @click.prevent="save" class="button primary" :class="{ 'disabled': !valid }">{{ saveButtonTitle }}</a>
			</div>
		</footer>
	</form>
</template>

<script>

import extend from 'extend'

import api from '../api'
import auth from '../auth'
import config from '../config'
import router from '../router'

import slug from '../filters/slug'
import markdownCharCount from '../helpers/markdown-character-count'

import {
	ProjectTypes
} from '../constants'

import Dropzone from '../components/dropzone.vue'
import Editor from '../components/editor.vue'
import Thumbnail from '../components/thumbnail.vue'

const error = err => {
	alert('There was an error while saving. Back up your text and try again in 5 minutes. If the issue still persists, Open the console (⌘+opt+J), take a screen shot, and send it to Ross. (Sorry for the inconvenience)')
	console.error(err)
}

const hasLength = str => str.trim().length > 0

export default {

	name: 'ProjectView',

	components: {
		Dropzone,
		Editor,
		Thumbnail
	},

	data () {
		return {
			id: '',
			type: ProjectTypes.STANDARD,
			title: '',
			contents: '',
			owner_id: '',
			draft: true,
			thumbnail: {},
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
		ProjectTypes () {
			return ProjectTypes
		},
		valid () {
			if (!hasLength(this.title)) return false
			if (!hasLength(this.contents)) return false
			if (!hasLength(this.category)) return false
			if (!this.thumbnail || !this.thumbnail.url) return false
			if (!hasLength(this.contents)) return false
			if (this.type === ProjectTypes.STANDARD && markdownCharCount(this.contents.length) > this.standardProjectMaxCharacter) return false
			if (this.type === ProjectTypes.CASE_STUDY && markdownCharCount(this.contents.length) > this.caseStudyMaxCharacters) return false

			return true
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
			// if (this.draft) return 'Save as a draft'
			// if (!this.id) return 'Publish'
			// return 'Save'
			return 'Save'
		},
		standardProjectMaxCharacter () {
			return config.api.maxStandardProjectCharacterCount
		},
		caseStudyMaxCharacters () {
			return config.api.maxCaseStudyCharacterCount
		}
	},

	methods: {
		setProjectTypeStandard () {
			this.type = ProjectTypes.STANDARD
		},
		setProjectTypeCaseStudy () {
			this.type = ProjectTypes.CASE_STUDY
		},
		insertImage (path) {
			this.contents += `\n\n![](${path})`
		},
		save () {
			if (!this.valid) {
				alert('The form has errors. Fix them to save this project.')
				return
			}
			api.projects.save(auth.user.id, {
				id: this.id,
				type: this.type,
				title: this.title,
				thumbnail: this.thumbnail,
				contents: this.contents,
				category: this.category,
				draft: this.draft,
				assets: this.assets
			}).then(res => {
				router.go({ name: 'home' })
			}).catch(error)
		},
		delete () {
			if (!this.id) return
			if (!confirm(`Are you sure you want to delete this project? There's no going back.`)) return
			api.projects.destroy(auth.user.id, this.id).then(res => {
				router.go({ name: 'home' })
			}).catch(error)
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
