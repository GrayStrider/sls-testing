const TOKEN = 'NjM4NjgwNjQxNzM4NzY4NDE5.XbhIqw.DP5SLqPksUxRNqMjJhrUxaD5K0o'
import * as Discord from 'discord.js'
import chalk from 'chalk'

const log = console.log
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
	
	client.on('message', (message) => {
			log(chalk.cyanBright(message.content))
			
			if (message.author.bot) return
			if (message.content.indexOf(config.prefix) !== 0) return
			
			const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
			const command = args[0] !== '' ? args.shift()!.toLowerCase() : 'default'
			
			console.log(args, command)
			message.reply([command, args])
		}
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
