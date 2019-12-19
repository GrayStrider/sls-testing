import {Board, RequestProps, Task, Tasks} from '../../types/kanbanflow'
import {kanbanGet, kanbanPost} from './index'
import {createTaskParams} from './types/interfaces'
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


export {
	getBoard,
	getTaskByID,
	getTasksByColumn,
	getTasksByColumnAndSwimlane,
	getAllTasksFromBoard,
	getTaskDetailsById,
}

