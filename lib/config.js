
const domain = 'http://ysdn2016.com'
const env = process.env.NODE_ENV || 'development'


export default {
	domain,
	env,
	api: {
		base: 'http://159.203.25.109:19320'
	},
	content: {
		categories: {
			'Interactive': [
				{ id: 'web', label: 'Web Design', group: 'interactive' },
				{ id: 'mobile', label: 'Mobile Design', group: 'interactive' },
				{ id: 'physical', label: 'Physical Computing', group: 'interactive' },
			],
			'Information': [
				{ id: 'infographic', label: 'Infographic', group: 'information' },
				{ id: 'wayfinding', label: 'Wayfinding', group: 'information' },
			],
			'Communication': [
				{ id: 'branding', label: 'Branding', group: 'communication' },
				{ id: 'motion', label: 'Motion Design', group: 'communication' },
				{ id: 'editorial', label: 'Editorial Design', group: 'communication' },
			],
			'Miscellaneous': [
				{ id: 'experiential', label: 'Experiential', group: 'miscellaneous' }
			]
		}
	}
}
