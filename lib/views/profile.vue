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
		<div class="form-field profile-biography-field">
			<label class="form-field-label" for="biography">About</label>
			<editor :content.sync="biography" placeholder="Write a little bit about yourself"></editor>
		</div>
		<div class="profile-social-links">
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
import router from '../router'

import Editor from '../components/editor.vue'

const isEmail = str => /\S+@\S+/i.test(str)
const isURL = str => new RegExp('(http|ftp|https)://', 'i').test(str)
const hasLength = str => !!str.trim().length

const error = err => {
	alert('An error occured. Open the console (⌘+opt+J), take a screen shot, and send it to Ross. (Sorry for the inconvenience)')
	console.error(err)
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
			biography: user.biography || '',
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
			if (hasLength(this.url) && !isURL(this.url)) return false
			// Fail if social is a URL, we just want the username
			if (hasLength(this.twitter) && isURL(this.twitter)) return false
			if (hasLength(this.instagram) && isURL(this.instagram)) return false
			if (hasLength(this.linkedin) && isURL(this.linkedin)) return false
			if (hasLength(this.dribbble) && isURL(this.dribbble)) return false
			if (hasLength(this.github) && isURL(this.github)) return false
			return true
		},
	},

	methods: {
		save () {
			if (!this.valid) return
			api.students.save(auth.user.id, {
				id: auth.user.id,
				name: this.name,
				email: this.email,
				biography: this.biography,
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
		}
	}

}

</script>
