
<template>
	<!-- <section class="callout notice">
		<p>Next website update is in 4 days, on <strong>Friday at 5pm.</strong><br/>Have any changes uploaded before then!</p>
	</section> -->
	<div class="profile-preview">
		<div class="profile-preview-information">
			<div class="profile-preview-name">{{ user.name }}</div>
			<div class="profile-preview-email">{{ user.email }}</div>
		</div>
		<div class="profile-preview-actions">
			<a v-link="{ name: 'profile' }" class="button">Edit Profile</a>
		</div>
	</div>
	<section class="projects-list">
		<header class="projects-list-header">
			<span class="projects-list-title">Projects</span>
			<a v-link="{ name: 'project:new' }" v-if="projects.length && projects.length < 8" class="button">New Project</a>
		</header>
		<div class="projects">
			<div class="project-create-nux" v-if="!projects.length">
				<p class="project-create-prompt">You don't have any projects uploaded yet.</p>
				<a v-link="{ name: 'project:new' }" class="button">Add a Project</a>
			</div>
			<div class="project-preview" v-for="project in projects" v-if="!!projects.length">
				<a v-link="{ name: 'project', params: { id: project.id }}" class="project-preview-title">
					<span>{{ project.title }}</span>
					<span class="project-preview-badge" v-if="project.draft">Draft</span>
				</a>
				<a class="project-preview-slug" href="{{ domain }}/{{ user.name | slug }}/{{ project.title | slug }}" target="_blank">{{ domain }}/{{ user.name | slug }}/{{ project.title | slug }}</a>
			</div>
		</div>
	</section>
</template>

<script>

import api from '../api'
import auth from '../auth'
import config from '../config'

export default {
	name: 'HomeView',

	data () {
		return {
			user: auth.user,
			projects: []
		}
	},

	computed: {
		domain () {
			return config.domain
		}
	},

	route: {
		canActivate () {
			return auth.user.authenticated
		},

		data ({ to }) {
			return {
				projects: api.projects.all(auth.user.id)
			}
		}
	}
}
</script>
