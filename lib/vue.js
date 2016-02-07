
import Vue from 'vue'
import Router from 'vue-router'
// import HTTP from 'vue-resource'
import AsyncData from 'vue-async-data'
import Draggable from './directives/draggable'

import config from './config'

import slug from './filters/slug'
import assets from './filters/assets'
import defaults from './filters/default'
import markdown from './filters/markdown'
import filesize from './filters/filesize'
import firstname from './filters/firstname'

/**
 * Configure Vue plugins
 */
Vue.use(Router)
Vue.use(AsyncData)
Vue.use(Draggable)
// Vue.use(HTTP)

/**
 * Configure Vue filters
 */
Vue.filter('slug', slug)
Vue.filter('default', defaults)
Vue.filter('markdown', markdown)
Vue.filter('filesize', filesize)
Vue.filter('firstname', firstname)
Vue.filter('link_assets', assets)

/**
 * Set development mode
 */
if (config.env === 'development') {
	Vue.config.debug = true
}

/**
 * Export `Vue`
 */
export default Vue
