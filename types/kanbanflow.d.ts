import {Message} from 'discord.js'

export type Tasks = Task[]

export interface Task {
	name: string
}

type ValidCommands = 'fetchTasks'
export type Commands = { [key in ValidCommands]: Command; }
export type KBFParamsGeneric = { [key: string]: string }
export type Command = (message: Message, params?: KBFParamsGeneric) => void

export type KBF = Column | Board | Tasks

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
