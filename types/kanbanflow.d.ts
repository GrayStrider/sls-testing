import {Message} from 'discord.js'

export interface Task {
	name: string
}

type ValidCommands = 'fetchTasks'
export type Commands = { [key in ValidCommands]: Command; } & { fallback: Command; }
export type KBFParamsGeneric = { [key: string]: string }
export type Command = (params: KBFParamsGeneric, message: Message) => void
