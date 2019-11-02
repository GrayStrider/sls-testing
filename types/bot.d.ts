import {Message} from 'discord.js'
import {KBFParamsGeneric} from './kanbanflow'

type ValidCommands = 'fetchTasks'
export type Commands = { [key in ValidCommands]: Command; }
export type Command = (message: Message, params?: KBFParamsGeneric) => void
