import axios from 'axios'
import {Res, KBF2} from '../../types/kanbanflow'
import {getTasksByColumnParams} from './types/requests'

require('dotenv').config()
const token = process.env.KBF_TESTING_API_TOKEN

const genAPIkey = (token?: string) => {
	if (!token) throw 'Please provide an API token'
	return Buffer.from('apiToken:' + token).toString('base64')
}


interface KanbanGetParams {
	resource: string;
	params?: getTasksByColumnParams;
	apiKey?: ReturnType<typeof genAPIkey>;
}

export const kanbanGet =
	async <T>(resource: string,
	                      params?: getTasksByColumnParams,
	                      apiKey = genAPIkey(token)
	) => {
	const test = 'board'
		const res = await axios.get<T>(`https://kanbanflow.com/api/v1/${resource}`,
			{
				headers: {
					'Authorization': `Basic ${apiKey}`
				},
				params
			})
		
		return res.data
	}

// times(1, async () =>
// 		await kanbanGet('boards'),
// 	(err, results) =>
// 		console.log(results!.map((result: any) =>
// 			result, err)))

// kanbanGet('tasks')
// 	.then(console.log)
// 	.catch(console.log)
