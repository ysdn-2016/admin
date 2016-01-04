<template>
	<div class="not-found">
		<span class="not-found-header">Shoot</span>
		<p>Encountered an error. We've logged this error and will take a look.</p>
		<p class="small">You can <a href="https://www.facebook.com/messages/100007107395716" target="_blank">ping Ross on FB</a> if you need more help.</p>
	</div>
</template>

<style scoped>
	.not-found {
		text-align: center;
	}
	.not-found-header {
		display: block;
		font-size: 16rem;
		margin: 0.25em 0;
		text-align: center;
	}
	.not-found p {
		margin: 0 auto;
		max-width: 30em;
		line-height: 1.9;
	}
	.not-found .small {
		font-size: 0.75em;
	}
	.not-found a {
		border-bottom: 1px #f00 solid;
	}
</style>
