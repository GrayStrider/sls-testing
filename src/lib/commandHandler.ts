import {Message} from 'discord.js'
import * as config from '../../config/settings.json'
import {Commands} from '../../types/bot'

export const commandHandler = async (message: Message, commands: Commands) => {
	
	if (message.author.bot) throw 'Ignored message from bot'
	if (message.content.indexOf(config.botTriggerPrefix) !== 0) throw 'Not a bot command'
	
	const argstr = message.content.slice(config.botTriggerPrefix.length).trim()
	if (!argstr) throw 'Empty command.'
	
	const args_array = argstr.split(/ +/g)
	const command = args_array.shift() as keyof Commands
	if (!(command in commands)) throw `Command "${command}" not found.`
	
	const args = args_array.length === 0 ? undefined : args_array.reduce((acc, curr) => {
		const entry = curr.split(config.argsSeparator)
		if (entry.length !== 2) return {
			...acc,
			[entry[0]]: entry[0]
		}
		
		return {
			...acc,
			[entry[0]]: entry[1]
		}
	}, {})
	
	return commands[command](message, args)
}
