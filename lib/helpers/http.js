
'use strict'

import request from 'got'

let token = null

export function setToken (_token) {
	token = _token
}

export function get (url) {
	let opts = getOpts()
	return request(url, opts)
}

export function post (url, data) {
	let opts = getOpts()
	opts.body = JSON.stringify(data)
	return request.post(url, opts)
}

export function destroy (url) {
	let opts = getOpts()
	return request.delete(url, opts)
}

function getOpts () {
	let opts = {
		headers: {
			'Accepts': 'application/json',
			'Content-Type': 'application/json'
		},
		json: true
	}

	if (token) {
		opts.headers['Authorization'] = token
	}

	return opts
}
