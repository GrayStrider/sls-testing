import axios from 'axios'
import {KBFParamsGeneric} from '../../types/kanbanflow'

require('dotenv').config()
const token = process.env.KBF_TESTING_API_TOKEN

const genAPIkey = (token?: string) => {
	if (!token) throw 'Please provide an API token'
	return Buffer.from('apiToken:' + token).toString('base64')
}

export const kanbanGet = async (resource: string, params?: KBFParamsGeneric, apiKey: string = genAPIkey(token)) =>
	await axios.get(`https://kanbanflow.com/api/v1/${resource}`,
		{
			headers: {
				'Authorization': `Basic ${apiKey}`
			},
			params
		})

// times(1, async () =>
// 		await kanbanGet('boards'),
// 	(err, results) =>
// 		console.log(results!.map((result: any) =>
// 			result, err)))

// kanbanGet('tasks')
// 	.then(console.log)
// 	.catch(console.log)
