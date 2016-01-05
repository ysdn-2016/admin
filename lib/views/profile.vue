<template>

	<p>Hold your horses. {{ user.email === 'michelle.hm.lee@gmail.com' ? '🍗🍗🍗' : '🐎 🐎 🐎' }}</p>
	<p>This section is coming soon.</p>

	<div class="profile-social-links">
		<!-- Uploaded CV -->
		<!-- Portfolio Links -->
		<!-- Social Links -->
	</div>

</template>

<script>

import auth from '../auth'

export default {

	name: 'ProfileView',

	data () {
		return {
			user: auth.user
		}
	}

}

</script>
