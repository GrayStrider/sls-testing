import {Message} from 'discord.js'
import {Commands} from '../../types/kanbanflow'
import {paramResolver} from './paramResolver'

export const commandHandler = (message: Message, commands: Commands) => {
	const res = paramResolver(message)
	if (!res) return
	const {command, args} = res
	
	if (command in commands) {
		return commands[command](args, message)
	}
	
	throw 'Unknown command.'
	
}
