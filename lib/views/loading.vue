
<template>

	<div class="loading">
		<div class="spinner"></div>
		<div class="loading-text">Loading...</div>
	</div>

</template>

<script>

export default {
	name: 'Loading',
	data () {
		return {}
	}
}

</script>

<style scoped>

.loading {
	margin: 12rem auto 0;
	margin: 40vh auto 0;
	text-align: center;
	-webkit-user-select: none;
	-moz-user-select: none;
	user-select: none;
	pointer-events: none;
}

.spinner {
	border: 4px #222 solid;
	border-left-color: transparent;
	border-bottom-color: transparent;
	border-radius: 50%;
	margin: 0 auto 2rem;
	width: 24px;
	height: 24px;
	animation: rotate 400ms ease infinite;
}

.loading-text {
	color: #aaa;
}

@keyframes rotate {
	from { transform: rotate(0deg); }
	to   { transform: rotate(360deg); }
}

</style>
