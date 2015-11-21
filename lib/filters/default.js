
export default function (val, def) {
	if (typeof val !== 'undefined' && val.length > 0) return val
	return def
}
