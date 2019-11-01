import {Board, RequestProps, Task, Tasks} from '../../types/kanbanflow'
import {kanbanGet, kanbanPost, createTaskParams} from './KBF'
import {getTasksByColumnAndSwimlaneParams, getTasksByColumnParams} from './types/requests'

const getBoard = () =>
	kanbanGet<Board>('board')

const getTaskByID = (id: Task['_id']) =>
	kanbanGet<Task>(`tasks/${id}`)

const getTaskDetailsById = <T extends RequestProps, K extends keyof T>
(id: Task['_id'], fetchOnlyProperty: K) =>
	kanbanGet<T[K]>(`tasks/${id}/${fetchOnlyProperty}`)

const getTasksByColumn = (params: getTasksByColumnParams) =>
	kanbanGet<Tasks>('tasks', params)

const getTasksByColumnAndSwimlane = (params: getTasksByColumnAndSwimlaneParams) =>
	kanbanGet<Tasks>('tasks', params)

const getAllTasksFromBoard = () =>
	kanbanGet<Tasks>('tasks')

////


const createTask =
	(params: createTaskParams) =>
	kanbanPost({params: params})

const createOrModifyTask =
	(params: createTaskParams, taskId?: Task['_id']) =>
	kanbanPost({params: params, apiKey: taskId})


export {
	getBoard,
	getTaskByID,
	getTasksByColumn,
	getTasksByColumnAndSwimlane,
	getAllTasksFromBoard,
	createTask,
	getTaskDetailsById,
	createOrModifyTask
}

