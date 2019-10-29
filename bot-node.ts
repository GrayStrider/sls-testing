const TOKEN = 'NjM4NjgwNjQxNzM4NzY4NDE5.XbhIqw.DP5SLqPksUxRNqMjJhrUxaD5K0o'
import * as Discord from 'discord.js'

export const initializeBot = async () => {
	const client = new Discord.Client();
	const messages: string[] = []
	
	client.on('ready', () =>
		console.log('Ready!')
	);
	
	client.on(
		'debug', (event) => {
			messages.push(event)
			// console.log('DEBUG:' + event);
		});
	
	await client.login(TOKEN);
	return messages
	
}

const main = async () => {
	const messages = await initializeBot()
	console.log(messages)
	process.exit()
}

main()
	.catch(console.log)
