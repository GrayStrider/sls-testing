import axios from 'axios'

const key = '917d43a34d814658933f908901d625a6'
const key64 = Buffer.from('apiToken:' + key).toString('base64')

const response = async (base64_credentials: string, resource: string) => {

}


const kanbanGet = async (base64_credentials: string, resource: string, params?: { [key: string]: string }) =>
	await axios.get(`https://kanbanflow.com/api/v1/${resource}`,
		{
			headers: {
				'Authorization': `Basic ${base64_credentials}`
			},
			params
		})


kanbanGet(key64, 'tasks', {
	columnId: 'kW2QjCrlUgJg'
})
	.then((res) => console.log(res.data))
	.catch((err) => console.log(err.message))
