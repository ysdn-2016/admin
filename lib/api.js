
import 'whatwg-fetch'

import Emitter from 'component-emitter'
import { Promise } from 'es6-promise'

import auth from './auth'
import config from './config'
import { get, post } from './helpers/http'

const base = config.api.base

const api = (() => {

	let token
	let fetchWithToken

	const auth = t => {
		if (!t) {
			return Promise.reject(new Error('Must pass token to api#auth'))
		}
		token = t
		fetchWithToken = get.bind(null, token)
		return fetchWithToken(`${base}/auth`)
	}

	const students = {
		all: ()   => fetchWithToken(`${base}/students/`),
		get: (id) => fetchWithToken(`${base}/students/${id}`)
	}

	const projects = {
		all (studentId) {
			return fetchWithToken(`${base}/students/${studentId}/projects/`)
		},
		get (studentId, projectId) {
			return fetchWithToken(`${base}/students/${studentId}/projects/${projectId}/`)
		}
	}

	return {
		auth,
		students,
		projects
	}
})()

export default api
