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

export type createTaskParams =
	Omit<Task, '_id' | 'totalSecondsSpent' | 'color' | 'description'>
	& Partial<Pick<Task, 'color' | 'description'>>

// create
export async function kanbanPost(
	params: createTaskParams, apiKey?: string): Promise<postReply>

// update
export async function kanbanPost(
	params: Partial<createTaskParams>, taskId: Task['_id'], apiKey?: string): Promise<void>

// add property
export async function kanbanPost(
	params: Partial<createTaskParams>, taskId: Task['_id'], apiKey?: string): Promise<void>

// implementation
export async function kanbanPost(
	params: createTaskParams | Partial<createTaskParams>, taskId?: Task['_id'], apiKey = genAPIkey(token)) {
	const url = `https://kanbanflow.com/api/v1/tasks${taskId ? '/' + taskId : ''}`
	const res = await axios.post(
		url,
		params,
		{
			headers: {
				'Authorization': `Basic ${apiKey}`,
				'Content-type': 'application/json'
				
			}
		})
	return res.data
	
}
