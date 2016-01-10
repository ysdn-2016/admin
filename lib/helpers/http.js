
'use strict'

import request from 'got'
import req from 'qwest'

let token = null

export function setToken (_token) {
	token = _token
}

export function get (url) {
	const opts = getOpts()
	return request(url, opts)
}

export function head (url) {
	return request.head(url)
}

export function post (url, data) {
	const opts = getOpts()
	opts.body = JSON.stringify(data)
	return request.post(url, opts)
}

export function upload (url, data) {
	const opts = {
		dataType: 'formdata',
		responseType: 'json',
		headers: {
			'Accepts': 'application/json',
			'Authorization': token
		}
	}
	return req.post(url, data, opts)
}

export function destroy (url) {
	const opts = getOpts()
	return request.delete(url, opts)
}

function getOpts () {
	const opts = {
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
