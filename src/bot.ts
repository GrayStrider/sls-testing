import {APIGatewayProxyHandler} from 'aws-lambda'
import {Client} from 'discord.js'

require('dotenv').config()

export const sayHelloGet: APIGatewayProxyHandler = async () => ({
	statusCode: 200,
	body: 'hello!'
})

export const sayHelloPost: APIGatewayProxyHandler = async (event) => ({
	statusCode: 200,
	body: JSON.stringify(event.body)
})


export const initializeBot: APIGatewayProxyHandler = async () => {
	const client = new Client()
	const messages: string[] = []
	
	client.on(
		'debug', (event) =>
			messages.push(event)
	)
	
	await client.login(process.env.DISCORD_BOT_API_TOKEN)
	
	return {
		statusCode: 200,
		body: JSON.stringify(messages)
	}
}
