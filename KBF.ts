import axios, {AxiosError} from 'axios'

const key = '917d43a34d814658933f908901d625a6'
const APIKEY64 = new Buffer(key).toString('base64')

const getKBF = async (credentials: string, resource: string) => {
	const response = await axios.get(`https://kanbanflow.com/api/v1/${resource}?apiToken=${credentials}`)
	
	return response
}

getKBF(key, 'users')
	.then(console.log)
	.catch((err: AxiosError) => console.log(err.message))
