
<template>
	<div class="faq">
		<h2>FAQ</h2>
		<div class="question" v-if="!user.authenticated">
			<h3>It's asking for a password? I didn't get any password...</h3>
			<p>Your login details should've been emailed to you in early January. We sent them out to everyone's email based on the class list, so make sure you're checking the right inbox.</p>
			<p>If you've looked and you still can't find your password, ping <a href="https://www.facebook.com/messages/100007107395716">Ross</a> or <a href="https://www.facebook.com/messages/791492565">Taylor</a> on Facebook and we'll help you out.</p>
		</div>
		<div class="question">
			<h3>How do I use this thing?</h3>
			<p>We've put together <a href="http://facebook.com/">a little screencast</a> to walk you through the process of uploading a project.</p>
		</div>
		<div class="question">
			<h3>What kinds of files can I upload?</h3>
			<p>We currently accept PNG, JPG, and GIF images. (We also support WEBP if you're feeling fancy.)</p>
			<p>Like any good web project, you should be keeping the size of your images small. We block uploads over 5MB, but in all seriousness, you shouldn't have any images larger than 1MB.</p>
			<p>If you need help keeping file sizes down, we suggest you look into tools like <a href="https://imageoptim.com/">ImageOptim</a>, which losslessly compress your images.</p>
		</div>
		<div class="question">
			<h3>I have a video/motion piece. What should I do?</h3>
			<p>Upload the video to <a href="http://vimeo.com/">Vimeo</a>—you'll need to make an account if you don't already have one. You'll need the video to be public.</p>
			<p>Once it's uploaded, copy the embed code. You can do this by going to the video page, and clicking on the share button.</p>
		</div>
	</div>
</template>

<script>

import auth from '../auth'

export default {
	name: 'FAQ',
	data () {
		return {
			user: auth.user,
			colors: [
				'#f47f50',
				'#e9c317',
				'#ef4862',
				'#5ac2b4',
				'#7abee0'
			]
		}
	},
	ready () {
		Array.prototype.forEach.call(document.querySelectorAll('.faq a'), (el, i) => {
			el.style.color = this.colors[i % this.colors.length]
		})
	}
}

</script>

<style scoped>

h2 {
	margin: 4rem 0;
	font-size: 48px;
	text-align: center;
}

.question {
	margin: 0 0 4rem;
}

.question p {
	line-height: 1.5;
}

.question a {
	color: #5ac2b4;
	border-bottom: 1px currentColor solid;
}

</style>
