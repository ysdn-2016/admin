
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

	const auth = token => {
		if (!token) {
			return Promise.reject(new Error('Must pass token to api#auth'))
		}
		http.setToken(token)
		return http.get(`${base}/whoami`)
	}

	const students = {
		all: ()   => http.get(`${base}/students/`),
		get: (id) => http.get(`${base}/students/${id}`)
	}

	const projects = {
		all (studentId) {
			return http.get(`${base}/students/${studentId}/projects/`)
		},
		get (studentId, projectId) {
			return http.get(`${base}/students/${studentId}/projects/${projectId}/`)
		},
		save (studentId, data) {
			var projectId
			if (data.id) projectId = data.id
			var url = projectId
				? `${base}/students/${studentId}/projects/${projectId}`
				: `${base}/students/${studentId}/projects`
			return http.post(url, data)
		},
		destroy (studentId, projectId) {
			return http.destroy(`${base}/students/${studentId}/projects/${projectId}/`)
		}
	}

	const assets = {
		all (studentId, projectId) {
			return http.get(`${base}/students/${studentId}/projects/${projectId}/assets`)
		},
		save (studentId, projectId, data) {
			// TODO: figure out how to do a multipart request from `fetch`
			return http.post(`${base}/students/${studentId}/projects/${projectId}/assets`)
		},
		destroy (studentId, projectId, assetId) {
				return http.destroy(`${base}/students/${studentId}/projects/${projectId}/assets/${assetId}`)
		}
	}

	return {
		auth,
		students,
		projects
	}

})()

export default api
