import {Board, Task, Tasks} from '../../types/kanbanflow'
import {kanbanGet} from './KBF'

const getBoard = () => kanbanGet<Board>({resource: 'board'})
const getTaskByID = (id: Task['_id']) => kanbanGet<Task>({resource: `tasks/${id}`})
const getTasksByColumn = (params: getTasksByColumnAndSwimlaneParams) =>
	kanbanGet<Tasks>({resource: 'tasks', params: params})

interface byColumnId {
	columnId: string
}

interface byColumnName {
	columnName: string
}

interface byColumnIndex {
	columnIndex: number
}

type byColumn = byColumnId | byColumnName | byColumnIndex


export type getTasksByColumnAndSwimlaneParams = params


type one = (byColumn & dateGrouped)
type two = (byColumn & bySwimlane & dateGrouped)

interface BySwimlane { //todo one of, the same as the above but optional
	swimlaneId?: string
	swimlaneIndex?: string
	swimlaneName?: string
	
}


// type params =
// 	(byColumn3 /*& dateGrouped*/) |
// 	(byColumn3 & bySwimlane)

type params = (byColumn3 & bySwimlane) | byColumn3 //cannot remove swimlane


const test4:
	params
	= {columnName: '', swimlaneId: ''}

type bySwimlane = RequireOnlyOne<IBySwimlane,
	'swimlaneId' | 'swimlaneName' | 'swimlaneIndex'>

interface IByColumn {
	columnId: string
	columnName: string
	columnIndex: number
}

type byColumn3 = RequireOnlyOne<IByColumn,
	'columnId' | 'columnName' | 'columnIndex'>

type bySwimlaneTypes = bySwimlaneId | bySwimlaneName | bySwimlaneIndex

interface IBySwimlane {
	swimlaneId: string
	swimlaneName: string
	swimlaneIndex: number
}

interface bySwimlaneId {
	swimlaneId: string
}

interface bySwimlaneName {
	swimlaneName: string
}

interface bySwimlaneIndex {
	swimlaneIndex: number
}


interface dateGrouped {
	// Optional. Can only be used if column is date grouped. Task ID to start from in date grouped columns. Can not be combined with startGroupingDate.
	startTaskId?: string
	// Optional. Can only be used if column is date grouped. Valid format is YYYY-MM-DD, e.g. 2010-12-31. Can not be combined with startTaskId.
	startGroupingDate?: string
	// // Optional. Can only be used if column is date grouped. The maximum number of tasks to retrieve. The highest value that can be used is 100. Default: 20.
	limit?: number
	// Optional. Can only be used if column is date grouped. Determines in what order tasks should be searched for. Can be either asc (ascending) or desc (descending). Default: desc. Example: If using startGroupingDate=2010-12-31 and order=desc, it will get tasks for 2010-12-31 and earlier dates.
	order?: string
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
	Pick<T, Exclude<keyof T, Keys>>
	& {
	[K in Keys]-?:
	Required<Pick<T, K>>
	& Partial<Record<Exclude<Keys, K>, undefined>>
}[Keys]


type AllOrNone<T> = T | { [K in keyof T]?: never };

type MyType = AllOrNone<{
	message1: string;
	minLength1: number;
}> & AllOrNone<{
	message2: string;
	minLength2: number;
}>;

const test: MyType = {message1: '', minLength1: 3}

export {getBoard, getTaskByID, getTasksByColumn}

type swimlaneId = { swimlaneId: string }
type swimlaneName = { swimlaneName: string }
type swimlaneIndex = { swimlaneIndex: number }

