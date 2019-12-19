import axios from 'axios'
import {type} from 'os'
import {Mock} from 'ts-mockery'
import {Board, RequestProps, Task} from '../../types/kanbanflow'
import {dispatch} from './lib/axiosGeneric'
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
		'Content-type' : 'application/json'
		
	}
	
	
	const {data} = await axios.post(
		url, params, {headers})
	return data
	
}

export const KBF = {
	board: () =>
		dispatch<Board>('get', 'board'),
	tasks: {
		getAll: () =>
			dispatch<Task[]>('get', 'tasks'),
		getById,
		getPropertyById,
		update,
		create: (params: CreateParams2) =>
			dispatch<postReply>('post', 'tasks', params)
	},
}

function getById(taskIds: string): Promise<Task>
function getById(taskIds: string[]): Promise<Task[]>
function getById(taskIds: string | string[]) {
	if (typeof taskIds === 'string') return dispatch<Task>('get', ['tasks', taskIds])
	return Promise.all([...taskIds.map((id) => dispatch<Task>('get', ['tasks', id]))])
}

function getPropertyById<K extends keyof RequestProps>(taskIds: string, property: K): Promise<RequestProps[K][]>
function getPropertyById<K extends keyof RequestProps>(taskIds: string[], property: K): Promise<RequestProps[K][]>
function getPropertyById<K extends keyof RequestProps>(taskIds: string | string[], property: K) {
	if (typeof taskIds === 'string') return dispatch<RequestProps[K][]>('get', ['tasks', taskIds, property])
	return Promise.all([...taskIds.map((id) => dispatch<RequestProps[K][]>('get', ['tasks', id, property])).flat()])
}

function update(taskIds: string, properties: Partial<createTaskParams>): Promise<void>
function update(taskIds: string[], properties: Partial<createTaskParams>): Promise<void>
function update(taskIds: string | string[], properties: Partial<createTaskParams>): Promise<void> {
	if (typeof taskIds === 'string') return dispatch<void>('post', ['tasks', taskIds], properties)
	return Promise.all([...taskIds.map((id) => dispatch('post', ['tasks', id], properties))]) as unknown as Promise<void>
}
