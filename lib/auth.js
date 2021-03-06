
/* globals Raven: false */

'use strict'

import extend from 'extend'

import router from './router'
import api from './api'

const TOKEN = 'ysdn_token'
const USER = 'ysdn_user'

const hash = (email, password) => btoa(`${email}:${password}`)
const basic = ({ email, password }) => `Basic ${hash(email, password)}`

const errors = {
	401: {
		message: 'Enter your email and password'
	},
	403: {
		message: 'Invalid email or password'
	}
}

const auth = (() => {
	let user = {}
	let loggingIn = false

	if (localStorage.getItem(USER)) {
		user = localStorage.getItem(USER)
	}

	user.authenticated = false

	function login (vue, credentials, redirect) {
		loggingIn = true
		localStorage.setItem(TOKEN, basic(credentials))
		check().then(() => {
			loggingIn = false
			router.go(redirect)
		}).catch(err => {
			loggingIn = false
			vue.error = errors[err.status || 403]
		})
	}

	function logout () {
		localStorage.removeItem(TOKEN)
		user.authenticated = false
		router.go('/login')
	}

	/**
	 * Checks to see if the user is authenticated.
	 * Throws an error if the answer is no.
	 *
	 * @returns Promise(undefined)
	 */
	function check () {
		const localToken = localStorage.getItem(TOKEN)
		const localUser = localStorage.getItem(USER)
		if (localToken === null) return Promise.resolve(false)
		if (localUser !== null) return Promise.resolve(localUser)
		return api.auth(localToken)
			.then(setUserCredentials)
			.catch(blockAuthentication)

		function setUserCredentials (whoami) {
			if (!whoami) throw new Error('Invalid credentials')
			extend(user, whoami)
			Raven.setUserContext({
				email: user.email,
				id: user.id
			})
			user.authenticated = true
		}

		function blockAuthentication (err) {
			user.authenticated = false
			// Pass the error up if we're logging in
			if (loggingIn) throw err
			switch (err.statusCode) {
				case 401:
				case 403:
					router.redirect('/login')
					break
				default:
					throw err
			}
		}
	}

	return {
		user,
		check,
		login,
		logout
	}
})()

export default auth
