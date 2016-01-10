
/* globals Raven: false */

import './lib/helpers/polyfill'

import './lib/vue'
import './lib/config'

import auth from './lib/auth'
import router from './lib/router'

import App from './lib/app.vue'

function init (err) {
	router.start(App, 'app')
	if (err) {
		console.log(err)
		Raven.captureException(err)
		router.go({ name: 'error' })
	}
}

auth.check()
	.then(init)
	.catch(init)
