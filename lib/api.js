
import 'whatwg-fetch'

import Promise from 'bluebird'

import config from './config'
import * as http from './helpers/http'

const base = config.api.base
const body = res => res.body

const api = (() => {
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
		},
		save (id, data) {
			return http.post(`${base}/students/${id}`, data)
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
		saveThumbnail (studentId, projectId, file) {
			const data = new FormData()
			data.append('file', file, file.name)
			return http.upload(`${base}/students/${studentId}/projects/${projectId}/thumbnail`, data)
				.then((xhr, res) => res)
		},
		get (studentId, projectId) {
			return http.get(`${base}/students/${studentId}/projects/${projectId}/`)
				.then(body)
		},
		save (studentId, data) {
			let projectId
			if (data.id) {
				projectId = data.id
			} else {
				throw new Error('projectId not set for api.projects.save')
			}
			const url = projectId
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
			const data = new FormData()
			data.append('file', file, file.name)
			return http.upload(`${base}/students/${studentId}/projects/${projectId}/assets`, data)
				.then((xhr, res) => res)
				.catch((xhr, res) => res)
		},
		setOrder (studentId, projectId, data) {
			const url = `${base}/students/${studentId}/projects/${projectId}/asset_order`
			return http.post(url, data)
				.then(body)
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
	// HACK: for some reason valid file submissions get thrown back as an error
	// So we override the catch and send back a valid response
	if (err.response.body.file && err.response.body.file.url) {
		return {
			status: 200,
			asset: err.response.body.file
		}
	}
	throw err.response.body
}
