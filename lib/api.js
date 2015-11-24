
import 'whatwg-fetch'

import Emitter from 'component-emitter'
import { Promise } from 'es6-promise'

import auth from './auth'
import config from './config'
import * as http from './helpers/http'

const base = config.api.base

const api = (() => {

	let token
	let get
	let post
	let destroy

	const auth = t => {
		if (!t) {
			return Promise.reject(new Error('Must pass token to api#auth'))
		}
		token = t
		get = http.get.bind(null, token)
		post = http.post.bind(null, token)
		destroy = http.destroy.bind(null, token)
		return get(`${base}/auth`)
	}

	const students = {
		all: ()   => get(`${base}/students/`),
		get: (id) => get(`${base}/students/${id}`)
	}

	const projects = {
		all (studentId) {
			return get(`${base}/students/${studentId}/projects/`)
		},
		get (studentId, projectId) {
			return get(`${base}/students/${studentId}/projects/${projectId}/`)
		},
		save (studentId, data) {
			var projectId
			if (data.id) projectId = data.id
			var url = projectId
				? `${base}/students/${studentId}/projects/${projectId}`
				: `${base}/students/${studentId}/projects`
			return post(url, data)
		},
		destroy (studentId, projectId) {
			return destroy(`${base}/students/${studentId}/projects/${projectId}/`)
		}
	}

	return {
		auth,
		students,
		projects
	}

})()

export default api
