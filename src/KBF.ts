import axios from 'axios'
require('dotenv').config()

const key64 = Buffer.from('apiToken:' + process.env.KBF_API_TOKEN).toString('base64')

const response = async (base64_credentials: string, resource: string) => {

}


export type KBFParamsGeneric = { [key: string]: string }

export const kanbanGet = async (resource: string, params?: KBFParamsGeneric, base64_credentials: string = key64) =>
	await axios.get(`https://kanbanflow.com/api/v1/${resource}`,
		{
			headers: {
				'Authorization': `Basic ${base64_credentials}`
			},
			params
		})


// kanbanGet('tasks', {
// 	columnId: 'kW2QjCrlUgJg'
// }, key64)
// 	.then((res) => console.log(res.data[0].tasks))
// 	.catch((err) => console.log(err.message))
