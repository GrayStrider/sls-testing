import {Message} from 'discord.js'
import {Commands} from '../../types/kanbanflow'
import {paramResolver} from './paramResolver'

export const commandHandler = async (message: Message, commands: Commands) => {
	const {command, args} = paramResolver(message)
	
	return (command in commands)
		? commands[command](args, message)
		: commands.fallback(args, message)
	
}
