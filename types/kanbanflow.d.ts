import {Attachment, Message} from 'discord.js'

export type Tasks = TasksBySwimlane[]

export interface TasksBySwimlane {
	columnId: string
	columnName: string
	tasksLimited: boolean
	tasks: Task[]
	swimlaneId: string
	swimlaneName: string
	
}

interface TaskNumber {
	value: number
	prefix?: string
}

interface SubTask {
	name: string
	finished: boolean
	dueDateTimestamp?: string
	dueDateTimestampLocal?: string
	userId?: string
}

interface Label {
	name: string
	pinned: boolean
}

interface Collaborator {
	userId: string
}


export interface RequestProps {
	comments: Comment[]
	labels: Label[]
	dates: Date[]
	collaborators: Collaborator[]
	attachments: Attachment[]
	subtasks: SubTask[]
}

interface Comment {
	_id: string
	text: string
	authorUserId: string
	createdTimestamp: string
}

export interface Task {
	// The ID of the task.
	_id: string
	// The name of the task.
	name: string
	// The description of the task.
	description: string
	// The color of the task.
	color: ColorValue
	// The ID of the column the task is in.
	columnId: string
	// The total number of seconds spent on the task. Examples: 1 hour = 3600, 2 hours = 7200 etc.
	totalSecondsSpent: number
	// The total number of seconds estimated for the task. Examples: 1 hour = 3600, 2 hours = 7200 etc. Only included if estimation unit is set to Time.
	totalSecondsEstimate?: number
	// Estimated points for the task. Only included if estimation unit is set to Points.
	pointsEstimate?: number
	// The ID of the swimlane the task is in. Only included if the board has swimlanes.
	swimlaneId?: string
	// The index of the task in the column/swimlane or date group. Only included if includePosition is set. Note: The index is zero-based.
	position?: number | 'top' | 'bottom'
	// The task number consists of an integer value and an optional prefix.
	number?: TaskNumber
	// The responsible of the task.
	responsibleUserId?: string
	// The dates of the task. Only included if there are any items.
	dates?: Date[]
	// Only included if the column the task is in is date grouped. Format is YYYY-MM-DD. Example: 2015-12-31.
	groupingDate?: string | null | ''
	// The subtasks of the task. Only included if there are any items.
	subTasks?: SubTask[]
	// The labels of the task. Only included if there are any items
	labels?: Label[]
	// The collaborators of the task. Only included if there are any items.
	collaborators?: Collaborator[]
	
	
}

export interface OtherTaskProperties {
	comments: Comment[]
	attachments: Attachment[]
	'time-entries': TimeEntry[]
	relations: Relation[]
	
}


interface Attachment {
	_id: string
	provider: string,
	name: string,
	size: number,
	mimeType: string,
	link: string,
	linkExpiresTimestamp: string,
	createdTimestamp: string,
	createdByFullName: string
}

interface TimeEntry {

}

interface Relation {

}
type Status = 'active'

type DateType = 'dueDate'

interface Date {
	targetColumnId: string
	status: Status
	dateType: DateType
	dueTimestamp?: string
	dueTimestampLocal?: string

}
type ValidCommands = 'fetchTasks'

export type Commands = { [key in ValidCommands]: Command; }
export type KBFParamsGeneric = { [key: string]: string }



export type Command = (message: Message, params?: KBFParamsGeneric) => void

interface Column {
	name: string
	uniqueId: string
}

interface Color {
	description?: string;
	name: string
	value: ColorValue
}

type ColorValue = 'yellow' | 'white' | 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'cyan' | 'brown' | 'magenta'

interface Swimlane {
	name: string
	uniqueId: string
}
export interface Board {
	name: string
	columns: Column[]
	_id: string
	colors: Color[]
	swimlanes: Swimlane[]
}
