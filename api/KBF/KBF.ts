import {times} from 'async'
import axios from 'axios'
import {KBFParamsGeneric} from '../../types/kanbanflow'

require('dotenv').config()
const token = process.env.KBF_API_TOKEN

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

times(10, async () =>
		await kanbanGet('tasks'),
	(err, results) =>
		console.log(results!.map((result: any) =>
			result.data[0].columnName)))
