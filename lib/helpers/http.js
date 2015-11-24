
'use strict'

import { Promise } from 'es6-promise'
import 'whatwg-fetch'

export function get (token, url) {
	let headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
	if (token) {
		headers['Authorization'] = token
	}
	return fetch(url, { headers })
		.then(res => {
			if (!res.ok) throw res
			return res
		})
		.catch(res => res.json())
		.then(res => res.json())
}

export function post (token, url, data) {
	let headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
	if (token) {
		headers['Authorization'] = token
	}
	let body = JSON.stringify(data)
	return fetch(url, { method: 'POST', headers, body })
		.then(res => {
			if (!res.ok) throw res
			return res
		})
		.catch(res => res.json())
		.then(res => res.json())
}

export function destroy (token, url) {
	let headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
	if (token) {
		headers['Authorization'] = token
	}
	return fetch(url, { method: 'DELETE', headers })
		.then(res => {
			if (!res.ok) throw res
			return res
		})
		.catch(res => res.json())
		.then(res => res.json())
}
