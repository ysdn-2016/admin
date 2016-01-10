
import Router from 'vue-router'

import auth from './auth'
import config from './config'

import {
	FAQView,
	CategoriesView,
	LoadingView,
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
	saveScrollPosition: false
})

router.map({
	'':             { name: 'home', component: HomeView, auth: true },
	'/project/new': { name: 'project:new', component: ProjectView, auth: true },
	'/project/:id': { name: 'project', component: ProjectView, auth: true },
	'/profile':     { name: 'profile', component: ProfileView, auth: true },

	'/loading':     { name: 'loading', component: LoadingView },
	'/faq':         { name: 'faq', component: FAQView },
	'/categories':  { name: 'categories', component: CategoriesView },
	'/login':       { name: 'login', component: LoginView },

	'/500':         { name: 'error', component: ErrorView },
	'*':            { component: NotFoundView }
})

router.beforeEach(t => {
	if (auth.user.authenticated) {
		if (t.to.path === '/login') {
			return t.redirect('/')
		}
		return t.next()
	}
	if (t.to.auth) {
		return t.redirect('/login')
	}
	t.next()
})

/**
 * Export `router`
 */
export default router
