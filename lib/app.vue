<style scoped>
</style>

<template>
	<header class="header">
		<a class="header-title" v-link="{ name: 'home' }">YSDN 2016 Admin</a>
		<div class="header-actions">
			<a class="header-home" v-link="{ name: 'home' }">Home</a>
			<a class="header-faq" v-link="{ name: 'faq' }">FAQ</a>
			<a class="header-login" @click="login" v-if="!user.authenticated">Log In</a>
			<div class="header-user" v-if="user.authenticated">
				<span class="header-user-name">{{ user.name | firstname }}</span>
				<a class="header-logout" @click="logout">Log Out</a>
			</div>
		</div>
	</header>
	<main class="main">
		<router-view></router-view>
	</main>
</template>

<script>

import auth from './auth'
import router from './router'

export default {

	name: 'App',

	data () {
		return {
			user: auth.user
		}
	},

	methods: {
		login () {
			router.go({ name: 'login' })
		},
		logout () {
			auth.logout()
		}
	}

}
</script>

<style>

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 2rem auto 3rem;
	max-width: 40rem;
}

.header-title {
	font-weight: bold;
}

.header-actions {
	display: flex;
}

.header-actions a {
	cursor: pointer;
	margin-left: 1rem;
}

.header-user {
	margin-left: 2rem;
}

.header-user-name {
	color: #aaa;
	font-size: 12px;
	font-weight: normal;
	vertical-align: middle;
	-webkit-user-select: none;
	user-select: none;
}

.header-logout {
	cursor: pointer;
	margin-left: 1rem;
}

</style>
