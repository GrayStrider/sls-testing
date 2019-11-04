import axios from 'axios'
import {Board, SubTask, Task, Tasks} from '../../types/kanbanflow'
import {AddParams, AddSubtaskParams, CreateParams, ImplementationParams, ModifySubtaskParams, postReply, UpdateParams} from './types/interfaces'
import {getTasksByColumnParams} from './types/requests'
import {genAPIkey, token} from './utils'

require('dotenv').config()

export const kanbanGet = async <T>(resource: string, params?: getTasksByColumnParams, apiKey = genAPIkey(token)) => {
	const {data} = await axios.get<T>(`https://kanbanflow.com/api/v1/${resource}`,
		{
			headers: {
				'Authorization': `Basic ${apiKey}`
			},
			params
		})
	
	return data
}

// todo interface instead of overloading
interface Get {
	tasks: (taskId: string) => Promise<Tasks>
	board: () => Promise<Board>
	subtasks: (taskId: string) => Promise<SubTask[]>
}



interface Resources {
	tasks: { task: string }
	board: { data: number[] }
}

interface Params {
	tasks: { taskId: string, columnIndex: number }
	board: never
}

type keys = keyof Resources & keyof Params

const tasks = 'tasks'

export function get<T extends keys = 'tasks'>(res: 'tasks', params: Params[T]): Promise<Resources[T]>
export function get<T extends keys = 'board'>(res: 'board'): Promise<Resources[T]>

export async function get<T extends keys>(res: T, params?: Params[T]): Promise<Resources[T]> {
	
	// doesnt infer the narrowing, so need assertion
	if (res === 'tasks') return {task: 'foo'} as Resources[T]
	
	return {data: [10, 11]} as Resources[T]
}

get('board').then(({data}) => data.map(Math.trunc))
get('tasks', {taskId: '', columnIndex: 4}).then(({task}) => task.toUpperCase())


export function getTasks() {

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
	
	
	const {data} = await axios.post(
		url, params, {headers})
	return data
	
}

interface KBF {
	board(): {
		get(): Promise<Board>
	}
	task(taskId: string): {
		get(): Promise<Task>
		update(params: UpdateParams): Promise<void>
		addProperty: {
			subtask(params: AddSubtaskParams): Promise<{ insertIndex: number }>
		}
		updateProperty: {
			subtask(params: ModifySubtaskParams): Promise<void>
		}
	}
	
	createTask(params: CreateParams): Promise<postReply>
}

