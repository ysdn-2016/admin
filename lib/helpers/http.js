
'use strict'

import request from 'got'
import req from 'qwest'

let token = null
let base = ''

req.limit(4)

export function setToken (_token) {
	token = _token
}

export function setBase (_base) {
	base = _base
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

export function upload (url, data) {
	let opts = {
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
