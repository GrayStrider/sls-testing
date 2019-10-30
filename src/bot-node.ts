import {Client, Message} from 'discord.js'
import chalk from 'chalk'
import {kanbanGet, KBFParamsGeneric} from './KBF'

require('dotenv').config()

const log = console.log
const config = {
	prefix: '++'
}

interface Task {
	name: string
}

const commands: Commands = {
	
	fetchTasks: async ({columnId}, message) => {

		const [msg, tasks] = await Promise.all([
			message.channel.send('Fetching tasks..'),
			kanbanGet('tasks', {columnId}).then(res => res.data[0].tasks)
		]) as [Message, Task[]]

		await Promise.all([
			msg.delete(),
			message.channel.send(tasks.map(task => `- [ ] ${task.name}`))
		])
		
	},
	
	default: async (params, message) =>
		await message.channel.send('Command not found!')
}

export const initializeBot = async () => {
	const client = new Client()
	
	client.on('ready', () =>
		log('Ready!')
	)
	
	// client.on('debug', (event) => {
	// 	log(chalk.yellow('DEBUG:' + event))
	// })
	const ignoredErrors = ['Ignored message from bot']
	
	
	client.on('message', (message) => {
		try {
			commandHandler(message, commands)
		} catch (err) {
			if (ignoredErrors.includes(err)) {
			} else log(chalk.red(err))
		}
	})
	
	
	await client.login(process.env.DISCORD_BOT_API_TOKEN)
}

initializeBot()
	.catch((err) => log(chalk.red(err)))

type ValidCommands = 'fetchTasks'

type Commands = { [key in ValidCommands | 'default']: (params: KBFParamsGeneric, message: Message) => void }

const commandHandler = (message: Message, commands: Commands) => {
	const res = getParams(message)
	if (!res) return
	const {command, args} = res
	
	if (command in commands) {
		return commands[command](args, message)
	}
	
	throw /*new ParseError()*/ 'Unknown command'
	
}

const SEPARATOR = '='

const getParams = (message: Message): { command: keyof Commands, args: KBFParamsGeneric } => {
	
	if (message.author.bot) throw 'Ignored message from bot'
	if (message.content.indexOf(config.prefix) !== 0) throw 'Not a bot command'
	
	const argstr = message.content.slice(config.prefix.length).trim()
	if (!argstr) throw 'Empty command.'
	
	const args_array = argstr.split(/ +/g)
	const command = args_array.shift() as keyof Commands
	
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
