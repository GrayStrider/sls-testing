import {Message} from 'discord.js'

export interface Task {
	name: string
}

type ValidCommands = 'fetchTasks'
export type Commands = { [key in ValidCommands]: Command; }
export type KBFParamsGeneric = { [key: string]: string }
export type Command = (message: Message, params?: KBFParamsGeneric) => void
