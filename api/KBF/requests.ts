import {Board, RequestProps, Task, Tasks, TaskNumber} from '../../types/kanbanflow'
import {kanbanGet, kanbanPost} from './KBF'
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


export type postParams =
	Omit<Task, '_id' | 'totalSecondsSpent' | 'color' | 'description'>
	& Partial<Pick<Task, 'color' | 'description'>>

const createTask =
	(params: postParams) =>
	kanbanPost<{taskId: string, taskNumber: TaskNumber}>(params)

const createOrModifyTask =
	(params: postParams, taskId?: Task['_id']) =>
	kanbanPost<{taskId: string, taskNumber: TaskNumber}>(params, taskId)


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

