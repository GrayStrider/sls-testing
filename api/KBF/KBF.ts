import axios from 'axios'
import {KBF, KBFParamsGeneric} from '../../types/kanbanflow'
import {getTasksByColumnAndSwimlaneParams} from './requests'

require('dotenv').config()
const token = process.env.KBF_TESTING_API_TOKEN

const genAPIkey = (token?: string) => {
	if (!token) throw 'Please provide an API token'
	return Buffer.from('apiToken:' + token).toString('base64')
}


interface KanbanGetParams {
	resource: string;
	params?: getTasksByColumnAndSwimlaneParams;
	apiKey?: ReturnType<typeof genAPIkey>;
}

export const kanbanGet = async <T extends KBF>({resource, params, apiKey = genAPIkey(token)}: KanbanGetParams) => {
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
