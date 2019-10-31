import {Command, Commands, Task} from '../types/kanbanflow'
import {kanbanGet} from '../api/KBF'
import {Message} from 'discord.js'

const fetchTasks: Command = async ({columnId}, message) => {
	
	const [msg, tasks] = await Promise.all([
		message.channel.send('Fetching tasks..'),
		kanbanGet('tasks', {columnId}).then(res => res.data[0].tasks)
			.catch(reason => message.channel.send('Error while calling KBF API: ' + reason))
	]) as [Message, Task[]]
	
	await Promise.all([
		msg.delete(),
		message.channel.send(tasks.map(task => `- [ ] ${task.name}`))
	])
	
}
const fallback: Command = async (params, message) =>
	await message.channel.send(
		`Command not found! Arguments passed:
		${JSON.stringify(params, null, 3)}`
	)

export const commands: Commands = {
	fetchTasks,
	fallback
}
