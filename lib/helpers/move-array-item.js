
export default function (arr, from, to) {
	arr.splice(to, 0, arr.splice(from, 1)[0])
}
