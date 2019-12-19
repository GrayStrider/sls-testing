require('dotenv').config()

export const genAPIkey = (token: string | undefined = process.env.KBF_TESTING_API_TOKEN) => {
	if (!token) throw 'Please provide an API token'
	return Buffer.from('apiToken:' + token).toString('base64')
}
