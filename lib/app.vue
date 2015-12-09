<style scoped>
</style>

<template>
	<header class="header">
		<a class="header-title" v-link="{ name: 'home' }">YSDN 2016 Admin</a>
		<div v-if="user.authenticated">
			<span class="header-user">{{ user.name | firstname }}</span>
			<a class="header-logout" v-if="user.authenticated" @click="logout">Logout</a>
		</div>
	</header>
	<main class="main">
		<router-view></router-view>
	</main>
</template>

<script>

import auth from './auth'

export default {

	name: 'App',

	data () {
		return {
			user: auth.user
		}
	},

	methods: {
		logout () {
			auth.logout()
		}
	}

}
</script>
