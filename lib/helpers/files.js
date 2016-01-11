
import config from '../config'

const ERR_UNKNOWN_FILE_TYPE = `Unknown file type`
const ERR_INVALID_FILE_TYPE = `We don't accept this type of file. Look at the FAQ for details.`
const ERR_FILE_TOO_LARGE = `We can't accept files that are larger than ${config.api.maxFileSizeHuman}. Look at the FAQ if you need help reducing the size of your images.`
const ERR_FILE_TOO_SMALL = `Your image is not large enough. Images need a minumum width of 800px`
const ERR_CANT_READ_SIZE = `We couldn't read the dimensions of your image. Try re-saving and re-uploading it.`

const error = err => alert(err)

/**
 * Validates a given file object
 *
 * @returns Promise<File>
 */
export default function validate (file) {
	return validateMetadata(file)
		.then(getDimensions)
		.then(validateDimensions)
		// NB: The following line propagates any error messages up, so they can be
		// handled at the UI level
		.catch(err => Promise.reject(err))
}

/**
 * Validates file metadata
 */
function validateMetadata (file) {
	const name = file.name
	const mime = file.type
	const ext = mime.length < 1 ? name.split('.').pop() : mime.split('/').pop()

	if (mime == void 0) {
		return Promise.reject(ERR_UNKNOWN_FILE_TYPE)
	}

	if (config.api.allowedFileMimeTypes.indexOf(mime) === -1) {
		if (ext === name) {
			return Promise.reject(ERR_UNKNOWN_FILE_TYPE)
		}
		return Promise.reject(ERR_INVALID_FILE_TYPE)
	}

	if (file.size > config.api.maxFileSize) {
		return Promise.reject(ERR_FILE_TOO_LARGE)
	}

	return Promise.resolve(file)
}

/**
 * Validates file dimensions
 */
function validateDimensions (file) {
	if (file.width < config.api.minImageDimensions) {
		return Promise.reject(ERR_FILE_TOO_SMALL)
	}
	return Promise.resolve(file.result)
}

/**
 * Gets image dimensions from File object
 */
function getDimensions (file) {
	var reader = new FileReader()
	var image = new Image()
	return new Promise((resolve, reject) => {
		reader.onload = function (event) {
			image.onload = function () {
				resolve({
					result: file,
					width: image.width,
					height: image.height
				})
			}
			image.onerror = function () {
				reject(ERR_CANT_READ_SIZE)
			}
			image.src = event.target.result
		}
		reader.readAsDataURL(file)
	})
}
