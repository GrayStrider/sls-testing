import * as Discord from 'discord.js'
import {Message} from 'discord.js'
import chalk from 'chalk'
import {kanbanGet, KBFParamsGeneric} from './KBF'

const TOKEN = 'NjM4NjgwNjQxNzM4NzY4NDE5.XbhIqw.DP5SLqPksUxRNqMjJhrUxaD5K0o'

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
	
	client.on('message', (message) => commandHandler(message)
	)
	
	await client.login(TOKEN)
	// return messages
}

initializeBot()
	.then((data) => {
		log(data)
		// process.exit()
	})
	.catch((err) => log(chalk.red(err)))

interface Commands {
	[key: string]: (params: KBFParamsGeneric) => {}
}

const commands: Commands = {
	'fetchTasks': ({columnId}) => kanbanGet('tasks', {columnId})
}

const commandHandler = (message: Message) => {
	const res = getParams(message)
	if (!res) return
	const [command, args] = res
	console.log(command, args)

	
}

const SEPARATOR = '='
const getParams = (message: Message) => {
	
	if (message.author.bot) return
	if (message.content.indexOf(config.prefix) !== 0) return
	
	const argstr = message.content.slice(config.prefix.length).trim()
	if (!argstr) return
	const args_array = argstr.split(/ +/g)
	
	const command = args_array.shift()
	if (command === undefined) return
	
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
	
	return [command, args]
}
