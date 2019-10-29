import {APIGatewayProxyHandler} from "aws-lambda";

export const sayHelloGet: APIGatewayProxyHandler = async () => ({
	statusCode: 200,
	body: 'hello!'
})

export const sayHelloPost: APIGatewayProxyHandler = async (event) => ({
	statusCode: 200,
	body: JSON.stringify(event)
})
