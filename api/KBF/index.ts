import axios from 'axios'
import {Mock} from 'ts-mockery'
import {Board, Task} from '../../types/kanbanflow'
import {dispatch} from './lib/axiosGeneric'
import {genAPIkey} from './lib/genApiKey'
import {AddParams, AddSubtaskParams, CreateParams, createTaskParams, ImplementationParams, ModifySubtaskParams, postReply, UpdateParams} from './types/interfaces'
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

export function KBF() {
	let API_URL = `https://kanbanflow.com/api/v1/`
	const headers = {
		'Authorization': `Basic ${genAPIkey()}`,
		'Content-type': 'application/json'
	}
	const postData = <T>(URL: string, params?: any) =>
		axios.post<T>(API_URL += URL, params, {headers}).then((res) => res.data)
	const getData = <T>(URL: string) =>
		axios.get<T>(API_URL += URL, {headers}).then((res) => res.data)
	
	return {
		board: {
			get: () => dispatch<Board>('get', 'board')
		},
		tasks: () => Mock.of<Promise<Task[]>>(),
		task: (taskId: string) => ({
			get: () => getData<Task>(`tasks/${taskId}`),
			update: (params: Partial<createTaskParams>) =>
				postData<void>(`tasks/${taskId}`, params)
		}),
		createTask: (params: CreateParams) =>
			postData<postReply>(`tasks`, params)
	}
}
