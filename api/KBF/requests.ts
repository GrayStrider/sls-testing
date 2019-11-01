import {Board, OtherTaskProperties, RequestProps, Task, Tasks} from '../../types/kanbanflow'
import {kanbanGet} from './KBF'
import {getTasksByColumnAndSwimlaneParams, getTasksByColumnParams} from './types/requests'

const getBoard = () =>
	kanbanGet<Board>('board')


export const specificPropertiesAlreadyPresentOnFullTaskFetch = [
	'subtasks',
	'labels',
	'dates'
] as const

export const specificPropertiesNotPresentOnFullTaskFetch = [
	'collaborators',
	'comments',
	'attachments',
	'time-entries',
	'relations'
] as const


export type TSpecificPropertiesDuplicated =
// Task['subTasks'] | Task['labels'] | Task['dates']
	Pick<Task, 'subTasks' | 'labels' | 'dates'>


export type TSpecificProperties = Pick<Task, 'collaborators'>
	& OtherTaskProperties
// Task['collaborators'] |
// OtherTaskProperties['comments'] |
// OtherTaskProperties['attachments']
//


const getTaskByID = (id: Task['_id']) =>
	kanbanGet<Task>(`tasks/${id}`)

const getTaskDetailsById = <T extends RequestProps, K extends keyof T>
	(id: Task['_id'], fetchOnlyProperty: K) =>
		kanbanGet<T[K]>(`tasks/${id}/${fetchOnlyProperty}`)

const getSubtasksByTaskID = (id: Task['_id']) =>
	kanbanGet<Task>(`tasks/${id}/subtasks`)

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
	getSubtasksByTaskID,
	getTaskDetailsById
}

const test = () => kanbanGet('tasks')
