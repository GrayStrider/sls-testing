import {Board, RequestProps, Task, Tasks} from '../../types/kanbanflow'
import {kanbanGet, kanbanPost, postParams} from './KBF'
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
	(params: postParams) =>
	kanbanPost(params)

const createOrModifyTask =
	(params: postParams, taskId?: Task['_id']) =>
	kanbanPost(params, taskId)


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

