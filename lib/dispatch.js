
import barracks from 'barracks'

const dispatcher = barracks()
const store = []

dispatcher.on('error', err => console.error(err))

dispatcher.on('project:new', data => {
	// Create a new project
	console.log('New project created')
})

dispatcher.on('project:save', (data, wait) => {
	// Save project
	// if (projectDoesntAlreadyExist) return wait('project:new', data)
	console.log('Project updated')
})

dispatcher.on('user:save', data => {
	console.log('User updated')
})

export default dispatcher
