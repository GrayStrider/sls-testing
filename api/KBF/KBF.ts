import axios from 'axios'
import {AddParams, AddSubtaskParams, CreateParams, ImplementationParams, ModifySubtaskParams, postReply, UpdateParams} from './types/interfaces'
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

// returns all tasks for the board with provided API key
// export async function get(res: 'tasks'): Promise<any>
// export async function get(res: 'board', params: {boarId: string}): Promise<any>

interface Resources {
	tasks: { task: string }
	board: { data: number[] }
}

interface Params {
	tasks: { taskId: string }
	board: never
}

type keys = keyof Resources & keyof Params

export function get<T extends keys = 'tasks'>(res: T, params: Params[T]): Promise<Resources[T]>
export function get<T extends keys = 'board'>(res: T): Promise<Resources[T]>

export async function get<T extends keys>(res: T, params?: Params[T]): Promise<Resources[keyof Resources]> {
	
	// doesnt infer the narrowing, so need assertion
	if (res === 'tasks') return {task: 'foo'}
	
	return {data: [10, 11]}
}

get('board')
	.then(({data}) => data.map(Math.trunc))
get('tasks', {taskId: ''})
	.then(({task}) => task.toUpperCase())


// create
export async function kanbanPost(
	{params, apiKey}: CreateParams): Promise<postReply>
// update
export async function kanbanPost(
	{params, taskId, apiKey}: UpdateParams): Promise<void>
// add subtask
export async function kanbanPost(
	{params, taskId, apiKey, addParam}: AddSubtaskParams): Promise<{ insertIndex: number }>
// modify subtask
export async function kanbanPost(
	{params, taskId, apiKey, modifyParam}: ModifySubtaskParams): Promise<void>


// implementation 🎉🎉🎉
export async function kanbanPost(
	{
		params, taskId, addParam, modifyParam,
		apiKey = genAPIkey(token)
	}: ImplementationParams) {
	
	let url = `https://kanbanflow.com/api/v1/tasks`
	
	taskId ? url += '/' + taskId : url
	addParam === 'subtask' ? url += '/' + AddParams['subtask'] : url
	modifyParam ? url += '/' + AddParams[modifyParam] : url
	
	const headers = {
		'Authorization': `Basic ${apiKey}`,
		'Content-type': 'application/json'
		
	}
	
	
	const res = await axios.post(
		url, params, {headers})
	return res.data
	
}
