
import './lib/helpers/polyfill'

import Vue from 'vue'
import Router from 'vue-router'
import HTTP from 'vue-resource'
import Validator from 'vue-validator'
import AsyncData from 'vue-async-data'

import App from './lib/app.vue'
import HomeView from './lib/views/home.vue'
import LoginView from './lib/views/login.vue'
import ProjectView from './lib/views/project.vue'
import ProfileView from './lib/views/profile.vue'
import NotFoundView from './lib/views/not-found.vue'
import ErrorView from './lib/views/error.vue'

import slug from './lib/filters/slug'
import defaults from './lib/filters/default'
import markdown from './lib/filters/markdown'
import filesize from './lib/filters/filesize'
import firstname from './lib/filters/firstname'

import auth from './lib/auth'

Vue.use(Router)
Vue.use(AsyncData)
Vue.use(HTTP)

Vue.config.debug = true

Vue.filter('slug', slug)
Vue.filter('default', defaults)
Vue.filter('markdown', markdown)
Vue.filter('filesize', filesize)
Vue.filter('firstname', firstname)

export const router = new Router({
	// history: true,
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

auth.check()
  .then(user => {
    router.start(App, 'app')
  })
  .catch(err => {
    console.error(err)
    router.start(App, 'app')
    router.go('/500')
  })
