import {Message} from 'discord.js'
import {kanbanGet} from '../api/KBF/KBF'
import {Command, Commands, Task} from '../types/kanbanflow'

const fetchTasks: Command = async (message, params) => {
	const [msg, tasks] = await Promise.all([
		message.channel.send('Fetching tasks..'),
		kanbanGet({resource: 'tasks', params: params}).then(res => res.data[0].tasks)
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
