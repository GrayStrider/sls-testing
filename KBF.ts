import axios from 'axios'

const key = '917d43a34d814658933f908901d625a6'
const key64 = Buffer.from('apiToken:' + key).toString('base64')

const getKBF = async (base64_credentials: string, resource: string) => {
	const response = await axios.get(`https://kanbanflow.com/api/v1/${resource}`,
		{
			headers: {
				'Authorization': `Basic ${base64_credentials}`
			}
		})
	
	return response
}

getKBF(key64, 'users')
	.then((res) => console.log(res.data))
	.catch((err) => console.log(err.message))
