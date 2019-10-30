import {Message} from 'discord.js'
import {Commands, KBFParamsGeneric} from '../../types/kanbanflow'
import * as config from '../../config/settings.json'

/**
 * parse and return command and parameters
 * @param message
 */
export const paramResolver = (message: Message): { command: keyof Commands, args: KBFParamsGeneric } => {
	
	if (message.author.bot) throw 'Ignored message from bot'
	if (message.content.indexOf(config.botTriggerPrefix) !== 0) throw 'Not a bot command'
	
	const argstr = message.content.slice(config.botTriggerPrefix.length).trim()
	if (!argstr) throw 'Empty command.'
	
	const args_array = argstr.split(/ +/g)
	const command = args_array.shift() as keyof Commands
	
	const args = args_array.reduce((prev, curr) => {
		const entry = curr.split(config.argsSeparator)
		if (entry.length !== 2) return {
			...prev,
			...{[entry[0]]: entry[0]}
		}
		
		return {
			...prev,
			...{[entry[0]]: entry[1]}
		}
	}, {})
	
	return {command, args}
}
