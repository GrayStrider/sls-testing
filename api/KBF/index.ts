import axios from 'axios'
import {Mock} from 'ts-mockery'
import {Board, OtherTaskProperties, RequestProps, Task} from '../../types/kanbanflow'
import {dispatch} from './lib/axiosGeneric'
import {genAPIkey} from './lib/genApiKey'
import {AddParams, AddSubtaskParams, CreateParams, CreateParams2, CreateTaskParams, ImplementationParams, ModifySubtaskParams, postReply, UpdateParams} from './types/interfaces'
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
		getAll     : () =>
			dispatch<Task[]>('get', 'tasks'),
		get,
		getProperty,
		update,
		create     : (params: CreateParams2) =>
			dispatch<postReply>('post', 'tasks', params),
		deleteById
	},
	
}

function get(taskIds: string): Promise<Task>
function get(taskIds: string[]): Promise<Task[]>
function get(taskIds: string | string[]) {
	if (typeof taskIds === 'string') return dispatch<Task>('get', ['tasks', taskIds])
	return Promise.all([...taskIds.map((id) => dispatch<Task>('get', ['tasks', id]))])
}

function getProperty<K extends keyof RequestProps>(taskIds: string, property: K): Promise<RequestProps[K][]>
function getProperty<K extends keyof RequestProps>(taskIds: string[], property: K): Promise<RequestProps[K][]>
function getProperty<K extends keyof RequestProps>(taskIds: string | string[], property: K) {
	if (typeof taskIds === 'string') return dispatch<RequestProps[K][]>('get', ['tasks', taskIds, property])
	return Promise.all([...taskIds.map((id) => dispatch<RequestProps[K][]>('get', ['tasks', id, property])).flat()])
}

function update(taskIds: string, property: Partial<CreateTaskParams>): Promise<void>
function update(taskIds: string[], property: Partial<CreateTaskParams>): Promise<void>
function update(taskIds: string | string[], property: Partial<CreateTaskParams>): Promise<void> {
	if (typeof taskIds === 'string') return dispatch<void>('post', ['tasks', taskIds], property)
	
	return Promise.all([...taskIds.map((id) => dispatch('post', ['tasks', id], property))]) as unknown as Promise<void>
}


function deleteById(taskIds: string): Promise<void>
function deleteById(taskIds: string[]): Promise<void>
function deleteById(taskIds: string | string[]): Promise<void> {
	if (typeof taskIds === 'string') return dispatch<void>('delete', ['tasks', taskIds], )
	
	return Promise.all([...taskIds.map((id) => dispatch('delete', ['tasks', id], ))]) as unknown as Promise<void>
}


type Deletable = Pick<CreateTaskParams, 'subtasks' | 'labels' | 'dates' | 'collaborators'> & Pick<OtherTaskProperties, 'comments' | 'attachments'>
function deleteProperty(taskIds: string, property: keyof CreateTaskParams): Promise<void>
function deleteProperty(taskIds: string[], property: keyof CreateTaskParams): Promise<void>
function deleteProperty(taskIds: string | string[], property: keyof CreateTaskParams): Promise<void> {
	// const pathModifiers: Record<string, string> = {
	// 	subtasks: 'by-name',
	// 	labels: 'by-name',
	// 	dates: 'by-target-column-id'
	// }
	
	return new Promise<void>((resolve, reject) => resolve)
	

}
