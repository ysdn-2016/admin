
<template>
	<div class="faq">
		<h2>FAQ</h2>
		<div id="asking-for-a-password" class="question" v-show="!user.authenticated">
			<h3>It's asking for a password? I didn't get any password...</h3>
			<p>Your login details should've been emailed to you in early January. We sent them out to everyone's email based on the class list, so make sure you're checking the right inbox.</p>
			<p>If you've looked and you still can't find your password, ping <a href="https://www.facebook.com/messages/100007107395716">Ross</a> or <a href="https://www.facebook.com/messages/791492565">Taylor</a> on Facebook and we'll help you out.</p>
		</div>
		<div id="how-do-i-use-this-thing" class="question">
			<h3>How do I use this thing?</h3>
			<p>We've put together <a href="http://ysdn-gradshow.s3.amazonaws.com/screengrabs/guide.mp4">a little screencast</a> to walk you through the process of uploading a project.</p>
		</div>
		<div id="how-many-projects-do-i-need" class="question">
			<h3>How many projects do I need to upload?</h3>
			<p>We're asking that all students submit <em>at least</em> three projects. One of these three projects should be a case study. The other two may be regular projects or case studies—the choice is yours.</p>
		</div>
		<div id="whats-the-difference-between-project-types" class="question">
			<h3>What's the difference between a standard project and a case study?</h3>
			<p>A standard project is a set of images showing your work, coupled with a brief description. Case studies on the other hand are in-depth reviews of your work.</p>
			<p>Beyond the semantic importance, the two types of projects will look differently on the site. Case studies will be long scrolling pages, akin to <a href="http://www.bigspaceship.com/case-study/past-present/">pages like this</a>, where as standard projects will be a slideshow or short gallery display. (This is still being finalized, we'll share details when we can.)</p>
		</div>
		<div id="what-kinds-of-files-can-i-upload" class="question">
			<h3>What kinds of files can I upload?</h3>
			<p>We currently accept PNG, JPG, and GIF images. (We also support WEBP if you're feeling fancy.)</p>
			<p>All images should be <strong>at least {{ minImageDimensions }} pixels in width</strong>, and any height. This is intentionally large to accomodate retina devices. We will be resizing images down as needed on our end.</p>
			<p>Like any good web project, you should be keeping the size of your images small. <strong>We block uploads over {{ maxFileSizeHuman }}.</strong> If you need help keeping file sizes down, we suggest you look into tools like <a href="https://imageoptim.com/">ImageOptim</a>, which losslessly compress your images.</p>
		</div>
		<div id="i-have-a-video-motion-piece" class="question">
			<h3>I have a video/motion piece. What should I do?</h3>
			<p>There's also <a href="http://ysdn-gradshow.s3.amazonaws.com/screengrabs/video-project.mp4">a screencast for that</a>. 😀</p>
			<p>Upload the video to <a href="http://vimeo.com/">Vimeo</a>—you'll need to make an account if you don't already have one. Once it's uploaded, <a href="https://vimeo.com/help/faq/sharing-videos/embedding-videos#how-do-i-embed-a-video-on-another-site">copy the embed code for the video</a>. You can paste that code straight into your project description, and the video will show up in the preview and on the end site.</p>
		</div>
		<div id="my-project-doesnt-really-fit" class="question">
			<h3>My project doesn't really fit into any of the categories. What should I do?</h3>
			<p>We've chosen the categories to accomodate all of the work you might produce in YSDN. In fact, we've <a v-link="{ name: 'categories' }">mapped every course to a category</a> as a rough guide. Keep in mind, the point of categorizing work is not to perfectly describe it, but help people can discover your work when grouped with similar pieces. Just go with the most fitting one.</p>
			<p>That said, if you really feel like we're missing a category, <a href="https://www.facebook.com/messages/100007107395716">let us know</a>.</p>
		</div>
	</div>
</template>

<script>

import auth from '../auth'
import config from '../config'

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
	computed: {
		minImageDimensions () {
			return config.api.minImageDimensions
		},
		maxFileSizeHuman () {
			return config.api.maxFileSizeHuman
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

.question + .question {
	padding-top: 3rem;
}

.question p {
	line-height: 1.5;
}

.question a {
	color: #5ac2b4;
	border-bottom: 1px currentColor solid;
}

</style>
