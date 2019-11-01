import {Board, Task, Tasks} from '../../types/kanbanflow'
import {kanbanGet} from './KBF'
import {getTasksByColumnAndSwimlaneParams, getTasksByColumnParams} from './types/requests'

const getBoard = () =>
	kanbanGet<Board>({resource: 'board'})

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

type TSpecificPropertiesDuplicated = typeof specificPropertiesAlreadyPresentOnFullTaskFetch[number];

export type TSpecificProperties = typeof specificPropertiesNotPresentOnFullTaskFetch[number];

const getTaskDataByID =
	(id: Task['_id'], fetchOnlyProperty?:
		TSpecificPropertiesDuplicated
		| TSpecificProperties
	) =>
		fetchOnlyProperty
			? kanbanGet<Task>({resource: `tasks/${id}/${fetchOnlyProperty}`})
			: kanbanGet<Task>({resource: `tasks/${id}`})

const getSubtasksByTaskID = (id: Task['_id']) =>
	kanbanGet<Task>({resource: `tasks/${id}/subtasks`})

const getTasksByColumn = (params: getTasksByColumnParams) =>
	kanbanGet<Tasks>({resource: 'tasks', params: params})

const getTasksByColumnAndSwimlane = (params: getTasksByColumnAndSwimlaneParams) =>
	kanbanGet<Tasks>({resource: 'tasks', params: params})

const getAllTasksFromBoard = () =>
	kanbanGet<Tasks>({resource: 'tasks'})

export {
	getBoard,
	getTaskDataByID,
	getTasksByColumn,
	getTasksByColumnAndSwimlane,
	getAllTasksFromBoard,
	getSubtasksByTaskID
}
