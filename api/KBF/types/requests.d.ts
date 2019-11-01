import {RequireOnlyOne} from '../../../types/types'

export type getTasksByColumnParams = byColumn & dateGrouped
export type getTasksByColumnAndSwimlaneParams =
	(byColumn & bySwimlane) & dateGrouped

interface IByColumn {
	columnId: string
	columnName: string
	columnIndex: number
}

interface IBySwimlane {
	swimlaneId: string
	swimlaneName: string
	swimlaneIndex: number
}

type byColumn = RequireOnlyOne<IByColumn,
	'columnId' | 'columnName' | 'columnIndex'>
type bySwimlane = RequireOnlyOne<IBySwimlane,
	'swimlaneId' | 'swimlaneName' | 'swimlaneIndex'>

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
