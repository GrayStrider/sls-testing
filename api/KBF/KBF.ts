import axios from 'axios'
import {Task, TaskNumber} from '../../types/kanbanflow'
import {getTasksByColumnParams} from './types/requests'

require('dotenv').config()
const token = process.env.KBF_TESTING_API_TOKEN

const genAPIkey = (token?: string) => {
	if (!token) throw 'Please provide an API token'
	return Buffer.from('apiToken:' + token).toString('base64')
}

export const kanbanGet =
	async <T>(resource: string,
	          params?: getTasksByColumnParams,
	          apiKey = genAPIkey(token)) => {
		const res = await axios.get<T>(`https://kanbanflow.com/api/v1/${resource}`,
			{
				headers: {
					'Authorization': `Basic ${apiKey}`
				},
				params
			})
		
		return res.data
	}

export type postReply = { taskId: string, taskNumber: TaskNumber }

export type postParams =
	Omit<Task, '_id' | 'totalSecondsSpent' | 'color' | 'description'>
	& Partial<Pick<Task, 'color' | 'description'>>

export async function kanbanPost(params: postParams, apiKey?: string): Promise<postReply>

export async function kanbanPost<T, K = postParams>(params: postParams, taskId?: Task['_id'], apiKey = genAPIkey(token)) {
	const res = await axios.post<T>(
		`https://kanbanflow.com/api/v1/tasks${taskId ? '/' + taskId : ''}`,
		params,
		{
			headers: {
				'Authorization': `Basic ${apiKey}`,
				'Content-type': 'application/json'
				
			}
		})
	return res.data
	
}
