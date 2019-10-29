import {APIGatewayProxyHandler} from "aws-lambda";
import * as Discord from 'discord.js'

export const sayHelloGet: APIGatewayProxyHandler = async () => ({
	statusCode: 200,
	body: 'hello!'
})

export const sayHelloPost: APIGatewayProxyHandler = async (event) => ({
	statusCode: 200,
	body: JSON.stringify(event.body)
})

const TOKEN = ''

export const initializeBot: APIGatewayProxyHandler = async () => {
	const client = new Discord.Client();
	const messages: string[] = []
	
	client.on(
		'debug', (event) =>
			messages.push(event)
	);
	
	await client.login(TOKEN);
	
	return {
		statusCode: 200,
		body: JSON.stringify(messages)
	}
}
