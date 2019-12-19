import axios from 'axios'
import {Mock} from 'ts-mockery'
import {Board, Task} from '../../types/kanbanflow'
import {dispatch, headers} from './lib/axiosGeneric'
import {genAPIkey} from './lib/genApiKey'
import {AddParams, AddSubtaskParams, CreateParams, CreateParams2, createTaskParams, ImplementationParams, ModifySubtaskParams, postReply, UpdateParams} from './types/interfaces'
import {getTasksByColumnParams} from './types/requests'

export const kanbanGet = async <T>(resource: string, params?: getTasksByColumnParams): Promise<T> => {
	const url = `https://kanbanflow.com/api/v1/${resource}`
	const headers = {
		'Authorization': `Basic ${genAPIkey()}`
	}
	const {data} = await axios.get<T>(url, {headers, params}
	)
	
	return data
}


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
export async function kanbanPost({params, taskId, addParam, modifyParam,}: ImplementationParams) {
	
	let url = `https://kanbanflow.com/api/v1/tasks`
	
	taskId ? url += '/' + taskId : url
	addParam === 'subtask' ? url += '/' + AddParams['subtask'] : url
	modifyParam ? url += '/' + AddParams[modifyParam] : url
	
	const headers = {
		'Authorization': `Basic ${genAPIkey()}`,
		'Content-type': 'application/json'
		
	}
	
	
	const {data} = await axios.post(
		url, params, {headers})
	return data
	
}

export const KBF = {
	board: () =>
		dispatch<Board>('get', 'board'),
	tasks: {
		getAll : () =>
			dispatch<Task[]>('get', 'tasks'),
		getById: (taskId: string) =>
			dispatch<Task>('get', ['tasks', taskId]),
		update : (taskId: string, props: Partial<createTaskParams>) =>
			dispatch<void>('post', ['tasks', taskId], props),
		create : (params: CreateParams2) =>
			// dispatch<postReply>('post', 'tasks', params)
			axios({method: 'post', url: 'https://kanbanflow.com/api/v1/tasks', data: params, headers}) as unknown as Promise<postReply>
	},
}
