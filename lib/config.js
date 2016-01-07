
const domain = 'http://ysdn2016.com'
const env = process.env.NODE_ENV || 'development'

const MB = 1048576

export default {
	domain,
	env,
	app: {
		history: true,
		root: env === 'production' ? '/admin' : ''
	},
	api: {
		base: 'http://159.203.25.109:3502',
		// base: 'http://localhost:5000',
		maxFileSize: 3 * MB,
		minImageDimensions: 1200
	},
	content: {
		categories: {
			'Communication': [
				{ id: 'branding', label: 'Branding', group: 'communication' },
				{ id: 'motion', label: 'Motion Design', group: 'communication' },
				{ id: 'editorial', label: 'Editorial Design', group: 'communication' },
				{ id: 'book', label: 'Book Design', group: 'communication' },
				{ id: 'type-design', label: 'Type Design', group: 'communication' },
				{ id: 'illustration', label: 'Illustration', group: 'communication' }
			],
			'Interactive': [
				{ id: 'web', label: 'Web Design', group: 'interactive' },
				{ id: 'mobile', label: 'Mobile Design', group: 'interactive' },
				{ id: 'physical-computing', label: 'Physical Computing', group: 'interactive' },
				{ id: 'digital-product', label: 'Product Design', group: 'interactive' }
			],
			'Information': [
				{ id: 'information-design', label: 'Information Design', group: 'information' },
				{ id: 'data-visualization', label: 'Data Visualization', group: 'information' }
			],
			'Physical': [
				{ id: 'experiential', label: 'Experiential', group: 'physical' },
				{ id: 'service', label: 'Service Design', group: 'physical' },
				{ id: 'packaging', label: 'Packaging Design', group: 'physical' },
				{ id: 'physical-product', label: 'Production Design', group: 'physical' }
			]
		}
	}
}
