import axios from 'axios'
import {genAPIkey} from './genApiKey'

let API_URL = `https://kanbanflow.com/api/v1/`
export const headers = {
	'Authorization': `Basic ${genAPIkey()}`,
	'Content-type' : 'application/json'
}
export const dispatch = async <T>(
	method: 'get' | 'post',
	path: string | string[],
	params?: any) => {
	
	const {data} = await axios({
		method,
		url: generatePath(path),
		headers, data: params
	})
	return data as Promise<T>
}

const generatePath = (path: string | string[]) =>
	API_URL += typeof path === 'string' ? path : path.join('/')
