import {commandHandler} from './lib/commandHandler'
import {Client} from 'discord.js'
import chalk from 'chalk'
import {commands} from '../config/commands'
import * as config from '../config/settings.json'

require('dotenv').config()

const log = console.log

export const initializeBot = async () => {
	const client = new Client()
	
	client.on('ready', () => log('Ready!'))
	
	client.on('message', (message) => {
		try {
			commandHandler(message, commands)
		} catch (err) {
			if (!config.ignoredErrors.includes(err)) message.channel.send(err)
		}
	})
	
	
	await client.login(process.env.DISCORD_BOT_API_TOKEN)
}

initializeBot()
	.catch((err) => log(chalk.red(err)))

