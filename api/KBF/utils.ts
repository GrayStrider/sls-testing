export const token = process.env.KBF_TESTING_API_TOKEN
export const genAPIkey = (token?: string) => {
	if (!token) throw 'Please provide an API token'
	return Buffer.from('apiToken:' + token).toString('base64')
}
