
import Router from 'vue-router'

import auth from './auth'
import config from './config'

import {
	FAQView,
	LoginView,
	HomeView,
	ProjectView,
	ProfileView,
	NotFoundView,
	ErrorView
} from './views'

const router = new Router({
	root: config.app.root,
	history: config.app.history,
	saveScrollPosition: true
})

const privateRoutes = [
	'/project/new',
	'/project/:id',
	'/profile',
	'/'
]

router.map({
	'/': { name: 'home', component: HomeView },
	'/500': { name: 'error', component: ErrorView },
	'/faq': { name: 'faq', component: FAQView },
	'/login': { name: 'login', component: LoginView },
	'/project/new': { name: 'project:new', component: ProjectView },
	'/project/:id': { name: 'project', component: ProjectView },
	'/profile': { name: 'profile', component: ProfileView },
	'*': { component: NotFoundView }
})

router.beforeEach(t => {
	if (auth.user.authenticated) {
		if (t.to.path === '/login') {
			return t.redirect('/')
		}
		return t.next()
	}
	if (privateRoutes.indexOf(t.to.path) !== -1) {
		return t.redirect('/login')
	}
	t.next()
})

/**
 * Export `router`
 */
export default router
