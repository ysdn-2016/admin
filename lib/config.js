
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

		domain: 'staging.ysdn2016.com',

		allowedFileMimeTypes: [
			'image/png',
			'image/gif',
			'image/jpg',
			'image/jpeg',
			'image/webp'
		],
		maxProjectCount: 5,
		maxFileSize: 3 * MB,
		maxFileSizeHuman: '2.5MB',
		minImageDimensions: 1200,

		maxProfileIntroductionCharacterCount: 100,
		maxProfileBiographyCharacterCount: 450,
		maxProfileSideNoteCharacterCount: 150,

		maxStandardProjectCharacterCount: 500,
		maxCaseStudyCharacterCount: undefined,

		minSideNoteCount: 2,
		maxSideNoteCount: 4
	},
	content: {
		sideNotes: [
			{
				id: 'looking-for',
				label: 'Looking For',
				help: 'What kind of opportunity are you looking for after you graduate? Freelance? Full-time? In what field?'
			},
			{
				id: 'awards-achievements',
				label: 'Awards / Achievements',
				help: 'What awards or achievements did you accomplish during your years at YSDN?'
			},
			{
				id: 'inspiration',
				label: 'Inspiration',
				help: 'How or where do you get your inspiration?'
			},
			{
				id: 'watch',
				label: 'Watch',
				help: 'What are some of your favourite films, documentaries, or interviews that you would like to recommend to the creative industry?'
			},
			{
				id: 'read',
				label: 'Read',
				help: 'What are some of your favourite books, magazines, or websites that you would like to recommend to the creative industry?'
			},
			{
				id: 'audio',
				label: 'Audio',
				help: 'What are some of your favourite music and podcasts that you would would like to recommend to the creative industry?'
			},
			{
				id: 'setup',
				label: 'Setup',
				help: 'What are some of your favourite tools for design work?'
			}
		],
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
