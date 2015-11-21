
const substitutions = {
	'Michael': 'Mike',
	'Shirley': 'Shirls',
	'Nathan': 'Nate',
	'Lucy': 'Lucy Goose'
}

export default function (input) {
	var first = input.split(' ').slice(0, 1).join(' ')
	if (substitutions[first]) return substitutions[first]
	return first
}
