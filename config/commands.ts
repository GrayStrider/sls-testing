import {Message} from 'discord.js'
import {KBF} from '../api/KBF'
import {Command, Commands} from '../types/bot'
import {Task} from '../types/kanbanflow'

const fetchTasks: Command = async (message, params) => {
	const [msg, tasks] = await Promise.all([
		message.channel.send('Fetching tasks..'),
		KBF.tasks.getAll().then((tasks) => tasks)
			.catch(reason => message.channel.send('Error while calling KBF API: ' + reason))
	]) as [Message, Task[]]
	if (!tasks.length) throw 'No tasks fetched with these parameters.'
	
	await Promise.all([
		msg.delete(),
		message.channel.send(tasks.map(task => `- [ ] ${task.name}`))
	])
	
}

export const commands: Commands = {
	fetchTasks,
}
