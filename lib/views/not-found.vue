<template>
	<div class="not-found">
		<span class="not-found-header">404</span>
		<p>Maybe <a v-link="{ name: 'home' }">head back home?</a></p>
	</div>
</template>

<style scoped>
	.not-found {
		text-align: center;
	}
	.not-found-header {
		display: block;
		font-size: 20rem;
		text-align: center;
	}
	.not-found a {
		border-bottom: 1px #f00 solid;
	}
</style>
