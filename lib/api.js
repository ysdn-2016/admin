
import 'whatwg-fetch'

import Emitter from 'component-emitter'
import { Promise } from 'es6-promise'

import auth from './auth'
import config from './config'
import * as http from './helpers/http'

const base = config.api.base
const body = res => res.body

// TODO: add memoizing of results

const api = (() => {

	let token
	let get
	let post
	let destroy

	const auth = token => {
		if (!token) {
			return Promise.reject(new Error('Must pass token to api#auth'))
		}
		http.setToken(token)
		return http.get(`${base}/whoami`)
			.then(body)
	}

	const students = {
		all () {
			return http.get(`${base}/students/`)
				.then(body)
		},
		get (id) {
			return http.get(`${base}/students/${id}`)
				.then(body)
		}
	}

	const projects = {
		all (studentId) {
			return http.get(`${base}/students/${studentId}/projects/`)
				.then(body)
				.then(res => res.filter(project => project.temporary !== true))
		},
		temporary (studentId) {
			return http.get(`${base}/students/${studentId}/projects/temporary`)
				.then(body)
		},
		get (studentId, projectId) {
			return http.get(`${base}/students/${studentId}/projects/${projectId}/`)
				.then(body)
		},
		save (studentId, data) {
			var projectId
			console.log(data, data.id)
			if (data.id) projectId = data.id
			var url = projectId
				? `${base}/students/${studentId}/projects/${projectId}`
				: `${base}/students/${studentId}/projects`
			return http.post(url, data)
				.then(body)
				.catch(handleProjectError)
		},
		destroy (studentId, projectId) {
			return http.destroy(`${base}/students/${studentId}/projects/${projectId}/`)
				.then(body)
		}
	}

	const assets = {
		all (studentId, projectId) {
			return http.get(`${base}/students/${studentId}/projects/${projectId}/assets`)
				.then(body)
		},
		save (studentId, projectId, file) {
			var data = new FormData()
			data.append('file', file, file.name)
			return http.upload(`${base}/students/${studentId}/projects/${projectId}/assets`, data)
				.then((xhr, res) => res)
		},
		destroy (studentId, projectId, assetId) {
			return http.destroy(`${base}/students/${studentId}/projects/${projectId}/assets/${assetId}`)
				.then(body)
		}
	}

	return {
		auth,
		students,
		projects,
		assets
	}

})()

export default api


/**
 * Handle project save errors
 */
function handleProjectError (err) {
	throw err.response.body
}
