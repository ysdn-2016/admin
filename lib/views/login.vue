<template>
	<form class="login-form" @submit.prevent="login">
		<p class="login-form-error callout error" v-if="error.message">{{ error.message }}</p>
		<input type="email" class="login-form-email" :placeholder="Email" v-model="email" />
		<input type="password" class="login-form-password" placeholder="Password" v-model="password" />
		<a class="button primary login-button" type="submit" @click.prevent="login">Log In</a>
		<p class="login-form-help">Forgot your password? Post in <a href="https://ysdn-2016.slack.com/messages/off-site-dev/" target="_blank">#offsite-dev</a> and we can help you out.</p>
	</form>
</template>

<script>

import auth from '../auth'

export default {

	name: 'LoginView',

	data () {
		return {
			email: '',
			password: '',
			error: {}
		}
	},

	methods: {
		login () {
			var email = this.email
			var password = this.password
			auth.login(this, { email, password }, { name: 'home' })
		}
	}

}

</script>
