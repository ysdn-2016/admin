
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
		base: 'https://api.ysdn2016.com',
		// base: 'http://localhost:5000',
		allowedFileMimeTypes: [
			'image/png',
			'image/gif',
			'image/jpg',
			'image/jpeg',
			'image/webp'
		],
		maxFileSize: 3 * MB,
		maxFileSizeHuman: '2.5MB',
		minImageDimensions: 1200
	},
	content: {
		categories: {
			'Communication': [
				{ id: 'graphic-design', label: 'Graphic Design', group: 'communication' },
				{ id: 'branding', label: 'Branding', group: 'communication' },
				{ id: 'type-design', label: 'Type Design', group: 'communication' },
				{ id: 'editorial', label: 'Editorial Design', group: 'communication' },
				{ id: 'book', label: 'Book Design', group: 'communication' }
			],
			'Information': [
				{ id: 'information-design', label: 'Information Design', group: 'information' },
				{ id: 'data-visualization', label: 'Data Visualization', group: 'information' }
			],
			'Interactive & Motion': [
				{ id: 'motion', label: 'Motion Design', group: 'communication' },
				{ id: 'web', label: 'Web Design', group: 'interactive' },
				{ id: 'mobile', label: 'Mobile Design', group: 'interactive' },
				{ id: 'physical-computing', label: 'Physical Computing', group: 'interactive' },
				{ id: 'digital-product', label: 'Digital Product Design', group: 'interactive' }
			],
			'Physical': [
				{ id: 'experiential', label: 'Experiential', group: 'physical' },
				{ id: 'service', label: 'Service Design', group: 'physical' },
				{ id: 'packaging', label: 'Packaging Design', group: 'physical' },
				{ id: 'physical-product', label: 'Physical Product Design', group: 'physical' }
			]
		}
	}
}
