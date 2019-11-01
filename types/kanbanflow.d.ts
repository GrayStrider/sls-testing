import {Message} from 'discord.js'

export type Tasks = TasksBySwimlane[]

export interface TasksBySwimlane {
	columnId: string
	columnName: string
	tasksLimited: boolean
	tasks: Task[]
	swimlaneId: string
	swimlaneName: string
	
}
export interface Task {
	_id: string
	name: string
}

type ValidCommands = 'fetchTasks'
export type Commands = { [key in ValidCommands]: Command; }
export type KBFParamsGeneric = { [key: string]: string }
export type Command = (message: Message, params?: KBFParamsGeneric) => void

export type KBF = Column | Board | Tasks | Task

interface Column {
	name: string
	uniqueId: string
}

interface Color {
	description?: string;
	name: string
	value: string //todo
}

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
