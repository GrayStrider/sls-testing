import * as Discord from 'discord.js'
import {Message} from 'discord.js'
import chalk from 'chalk'
import {kanbanGet, KBFParamsGeneric} from './KBF'

const TOKEN = ''

const log = console.log
const debug = (msg: string | number | (string | number)[]) => console.log(chalk.red(`DEBUG[${msg}]`))
const config = {
	prefix: '++'
}

export const initializeBot = async () => {
	const client = new Discord.Client()
	const messages: string[] = []
	
	client.on('ready', () =>
		log('Ready!')
	)
	
	client.on('debug', (event) => {
		messages.push(event)
		log(chalk.yellow('DEBUG:' + event))
	})
	
	client.on('message', (message) =>
		commandHandler(message, commands)
			.catch((err: Error) => {
				if (err instanceof ParseError) {
					message.channel.send('Unknown command.')
				}
			})
	)
	
	const commands: Commands = {
		fetchTasks: async ({columnId}, message) => {
			const msg = await message.channel.send('Fetching tasks..') as Message
			const res = await kanbanGet('tasks', {columnId})
			const {tasks} = res.data[0]
			await msg.delete()
			return await message.channel.send(tasks.map((task: any) => `- [ ] ${task.name}`))
			
		},
		default: async (params, message) =>
			await message.channel.send('Command not found!')
	}
	await client.login(TOKEN)
	// return messages
}

initializeBot()
	.then((data) => {
		log(data)
		// process.exit()
	})
	.catch((err) => log(chalk.red(err)))

type ValidCommands = 'fetchTasks'

type Commands = { [key in ValidCommands | 'default']: (params: KBFParamsGeneric, message: Message) => void }

class ParseError extends Error {
	constructor() {
		super()
		this.name = 'ParseError'
	}
}

const commandHandler = async (message: Message, commands: Commands) => {
	const res = getParams(message)
	if (!res) return
	const {command, args} = res
	
	if (command in commands) {
		return commands[command](args, message)
	}
	
	throw new ParseError()
	
}

const SEPARATOR = '='
type Command = keyof Commands
const getParams = (message: Message): undefined | { command: Command, args: KBFParamsGeneric } => {
	
	if (message.author.bot) return
	if (message.content.indexOf(config.prefix) !== 0) return
	
	const argstr = message.content.slice(config.prefix.length).trim()
	if (!argstr) return
	const args_array = argstr.split(/ +/g)
	
	const trycommand = args_array.shift()
	if (trycommand === undefined) return
	const command = trycommand as Command
	
	const args = args_array.reduce((prev, curr) => {
		const entry = curr.split(SEPARATOR)
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
