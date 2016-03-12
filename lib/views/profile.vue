<template>

	<form class="profile-form" @submit.prevent="save" :class="{ 'loading': loading }">
		<header class="project-form-header">
			<div class="project-form-header-context">
				<a v-link="{ name: 'home' }" class="button">Cancel</a>
			</div>
			<div class="project-form-header-actions">
				<a @click.prevent="save" class="button primary" :class="{ 'disabled': !valid }">Save</a>
			</div>
		</header>
		<div class="form-field profile-name-field">
			<label class="form-field-label" for="name">Name</label>
			<input type="text" id="name" :value="name" disabled />
		</div>
		<div class="form-field profile-email-field">
			<label class="form-field-label" for="email">Email</label>
			<input type="text" id="email" v-model="email" />
			<div class="field-help-text">
				<p>This email will be used on the site to let people contact you. It is also the email you log in with.<br/>Changing this will change your login information.</p>
			</div>
		</div>
		<div class="form-field profile-email-field">
			<label class="form-field-label" for="intro">Brief Introduction</label>
			<editor :content.sync="introduction" :limit="maxIntroLength" :size="2" placeholder="Who are you? Share one or two lines about yourself."></editor>
			<div class="field-help-text">
				<p>This text will be shown on <a href="http://{{ domain }}/{{ name | slug }}" target="_blank">your profile</a> and alongside your picture on any projects.</p>
			</div>
		</div>
		<div class="form-field profile-biography-field">
			<label class="form-field-label" for="biography">Biography</label>
			<editor :content.sync="biography" :limit="maxBioLength" :size="6" placeholder="What is your story? Share your journey as a designer, what you’re interested in, or what you hope to do after you graduate."></editor>
			<div class="field-help-text">
				<p>This text will only be shown on <a href="http://{{ domain }}/{{ name | slug }}" target="_blank">your profile</a>.</p>
			</div>
		</div>
		<div class="form-field profile-social-links">
			<!-- Uploaded CV -->
			<label class="form-field-label">Social Links</label>
			<div class="form-field-row">
				<div class="form-field form-field-thin">
					<label class="form-field-label" for="url">URL</label>
					<input type="text" id="url" v-model="url" placeholder="http://yoursite.com" />
				</div>
				<div class="form-field form-field-thin">
					<label class="form-field-label" for="twitter">Twitter</label>
					<input type="text" id="twitter" v-model="twitter" placeholder="username" />
				</div>
				<div class="form-field form-field-thin">
					<label class="form-field-label" for="instagram">Instagram</label>
					<input type="text" id="instagram" v-model="instagram" placeholder="username" />
				</div>
				<div class="form-field form-field-thin">
					<label class="form-field-label" for="linkedin">LinkedIn</label>
					<input type="text" id="linkedin" v-model="linkedin" placeholder="username" />
				</div>
				<div class="form-field form-field-thin">
					<label class="form-field-label" for="dribbble">Dribbble</label>
					<input type="text" id="dribbble" v-model="dribbble" placeholder="username" />
				</div>
				<div class="form-field form-field-thin">
					<label class="form-field-label" for="github">GitHub</label>
					<input type="text" id="github" v-model="github" placeholder="username" />
				</div>
			</div>
			<div class="field-help-text">
				<p>Provide a full link (http://yoursite.com) to your website, and your username for the other networks.<br/>Are we missing an important network? <a href="https://www.facebook.com/messages/100007107395716">Let us know</a>.</p>
			</div>
		</div>
		<div class="form-field profile-side-notes">
			<label class="form-field-label">Side Notes</label>
			<div class="field-help-text profile-side-notes-help-text">
				<p>Side notes are extra pieces of information on <a href="http://{{ domain }}/{{ name | slug }}" target="_blank">your profile</a> that you'd like to share with site visitors.<br>Pick 2&ndash;4 categories to be shown on your profile.</p>
			</div>
			<div class="profile-side-notes-options">
				<div class="profile-side-notes-option" v-for="note in sideNotes" :class="{ 'profile-side-notes-option--disabled': isSideNoteOptionDisabled(note) }">
					<div class="profile-side-notes-option-header">
						<div class="profile-side-notes-option-checkbox"
							:class="{ 'profile-side-notes-option-checkbox--enabled': note.enabled }"
							@click.prevent="toggleNote(note)"></div>
						<div class="profile-side-notes-option-description">
							<div class="profile-side-notes-option-label" @click.prevent="toggleNote(note)">{{ note.label }}</div>
							<div class="profile-side-notes-option-help">{{ findSideNoteConfig(note).help }}</div>
						</div>
					</div>
					<div class="profile-side-notes-option-editor" v-if="note.enabled">
						<editor :content.sync="note.contents" :size="2" :limit="maxSideNoteLength" placeholder="Write&hellip;" :controls="false"></editor>
					</div>
				</div>
			</div>
		</div>
		<footer class="project-form-footer">
			<div class="project-form-footer-context">
				<a v-link="{ name: 'home' }" class="button">Cancel</a>
			</div>
			<div class="project-form-footer-actions">
				<a @click.prevent="save" class="button primary" :class="{ 'disabled': !valid }">Save</a>
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

import markdownCharacterCount from '../helpers/markdown-character-count'

import Editor from '../components/editor.vue'

const isEmail = str => /\S+@\S+/i.test(str)
const isURL = str => new RegExp('(http|ftp|https)://', 'i').test(str)
const hasLength = str => !!str.trim().length
const clone = arr => arr.slice()

const error = err => {
	alert('An error occured. Open the console (⌘+opt+J), take a screen shot, and send it to Ross. (Sorry for the inconvenience)')
	console.error(err)
}

const defaultSideNotes = () => {
	const allSideNotes = clone(config.content.sideNotes)
	const defaults = allSideNotes.map(note => {
		return {
			id: note.id,
			label: note.label,
			contents: '',
			enabled: false
		}
	})
	return defaults
}

export default {

	name: 'ProfileView',

	components: {
		Editor
	},

	data () {
		var user = auth.user
		return {
			name: user.name,
			email: user.email,
			url: user.url,
			introduction: user.introduction || '',
			biography: user.biography || '',
			sideNotes: user.sideNotes || defaultSideNotes(),
			url: user.url || '',
			twitter: user.twitter || '',
			instagram: user.instagram || '',
			linkedin: user.linkedin || '',
			dribbble: user.dribbble || '',
			github: user.github || ''
		}
	},

	computed: {
		valid () {
			if (!hasLength(this.email)) return false
			if (!isEmail(this.email)) return false

			// Social Links
			if (hasLength(this.url) && !isURL(this.url)) return false
			if (hasLength(this.twitter) && isURL(this.twitter)) return false
			if (hasLength(this.instagram) && isURL(this.instagram)) return false
			if (hasLength(this.linkedin) && isURL(this.linkedin)) return false
			if (hasLength(this.dribbble) && isURL(this.dribbble)) return false
			if (hasLength(this.github) && isURL(this.github)) return false

			// Side Notes
			const enabledSideNotesCount = this.sideNotes.filter(n => n.enabled).length
			if (enabledSideNotesCount > config.api.maxSideNoteCount) return false
			const hasBlankButEnabledSideNote = this.sideNotes.some(n => n.enabled && !hasLength(n.contents))
			const hasSideNoteLongerThanCharacterCount = this.sideNotes.some(n => n.enabled && markdownCharacterCount(n.contents) > config.api.maxProfileSideNoteCharacterCount)
			if (hasBlankButEnabledSideNote) return false
			if (hasSideNoteLongerThanCharacterCount) return false

			return true
		},

		maxIntroLength () {
			return config.api.maxProfileIntroductionCharacterCount
		},
		maxBioLength () {
			return config.api.maxProfileBiographyCharacterCount
		},
		maxSideNoteLength () {
			return config.api.maxProfileSideNoteCharacterCount
		},

		hasMaximumSideNoteCount () {
			const enabledSideNotesCount = this.sideNotes.filter(n => n.enabled).length
			const maxSideNoteCount = config.api.maxSideNoteCount
			return enabledSideNotesCount >= maxSideNoteCount
		},

		domain () {
			return config.api.domain
		}
	},

	methods: {
		save () {
			if (!this.valid) return
			api.students.save(auth.user.id, {
				id: auth.user.id,
				name: this.name,
				email: this.email,
				introduction: this.introduction,
				biography: this.biography,
				sideNotes: this.sideNotes,
				url: this.url,
				twitter: this.twitter,
				instagram: this.instagram,
				linkedin: this.linkedin,
				dribbble: this.dribbble,
				github: this.github
			}).then(res => {
				extend(auth.user, res)
				auth.user.authenticated = true
				router.go({ name: 'home' })
			}).catch(error)
		},

		isSideNoteOptionDisabled (note) {
			if (!this.hasMaximumSideNoteCount) return false
			if (note.enabled) return false
			return true
		},

		findSideNoteConfig (note) {
			return config.content.sideNotes.find(n => note.id === n.id)
		},

		toggleNote (note) {
			const enabledCount = this.sideNotes.filter(n => n.enabled).length
			const futureCount = enabledCount + (note.enabled ? -1 : 1)
			if (futureCount > config.api.maxSideNoteCount) return
			note.enabled = !note.enabled
		}
	}

}

</script>
