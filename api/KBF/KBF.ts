import axios from 'axios'
import {SubTask, Task, TaskNumber} from '../../types/kanbanflow'
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

interface KanbanPost {
	apiKey?: string;
}

interface ModifyTask {
	taskId: Task['_id'];
	
}


interface CreateParams extends KanbanPost {
	params: createTaskParams;
}

interface UpdateParams extends KanbanPost, ModifyTask {
	params: Partial<createTaskParams>;
}


type AddOrModifyPropTypes = 'subtask'

export const AddParams: { [key in AddOrModifyPropTypes]: string } = {
	subtask: 'subtasks'
}


interface AddSubtaskParams extends KanbanPost, ModifyTask {
	params: Pick<SubTask, 'name'> & Partial<SubTask>;
	addParam: 'subtask'
}

interface ModifySubtaskParams extends KanbanPost, ModifyTask {
	params: Partial<SubTask>;
	modifyParam: AddOrModifyPropTypes
}

interface ImplementationParams extends KanbanPost {
	params: createTaskParams | Partial<createTaskParams>;
	taskId?: Task['_id'];
	addParam?: string
	modifyParam?: AddOrModifyPropTypes
}

// create
export async function kanbanPost({params, apiKey}: CreateParams): Promise<postReply>
// update
export async function kanbanPost({params, taskId, apiKey}: UpdateParams): Promise<void>
// add subtask
export async function kanbanPost({params, taskId, apiKey, addParam}: AddSubtaskParams): Promise<{ insertIndex: number }>
// modify subtask
export async function kanbanPost({params, taskId, apiKey, modifyParam}: ModifySubtaskParams): Promise<void>


// implementation
export async function kanbanPost({params, taskId, addParam, modifyParam, apiKey = genAPIkey(token)}: ImplementationParams) {
	let url = `https://kanbanflow.com/api/v1/tasks${taskId ? '/' + taskId : ''}`
	addParam === 'subtask' ? url += '/' + AddParams['subtask'] : url
	modifyParam ? url += '/' + AddParams[modifyParam] : url
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
