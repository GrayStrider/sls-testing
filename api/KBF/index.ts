import axios from 'axios'
import {AddParams, AddSubtaskParams, CreateParams, ImplementationParams, ModifySubtaskParams, postReply, UpdateParams} from './types/interfaces'
import {getTasksByColumnParams} from './types/requests'
import {genAPIkey} from './utils'
import {Board, Task, Tasks} from '../../types/kanbanflow'

require('dotenv').config()

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

export const KBF = () => {
	let URL = `https://kanbanflow.com/api/v1/`
	const headers = {
		'Authorization': `Basic ${genAPIkey()}`,
		'Content-type': 'application/json'
	}

	return {
		board: {
			async get(): Promise<Board> {
				URL += `board`
				const {data} = await axios.get(URL, {headers})
				return data
			}
		},
		
		async tasks(): Promise<Tasks> {
		
		},
		
		task: (taskId: string) => ({
			async get(): Promise<Task> {
				URL += `tasks/${taskId}`
				const {data} = await axios.get(URL, {headers})
				return data
			},
			
			async update(params: UpdateParams): Promise<void> {
				URL += `tasks/${taskId}`
				await axios.post(URL, params, {headers})
			}
		}),

		async createTask(params: CreateParams): Promise<postReply> {
			URL += `tasks`
			const {data} = await axios.post(URL, params, {headers})
			return data
		}
	}
}
