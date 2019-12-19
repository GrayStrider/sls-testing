import axios from 'axios'
import {genAPIkey} from './genApiKey'

let API_URL = `https://kanbanflow.com/api/v1/`
const headers = {
	'Authorization': `Basic ${genAPIkey()}`,
	'Content-type' : 'application/json'
}
export const dispatch = <T>(
	method: 'get' | 'post',
	path: string | string[],
	params?: any) =>
	
	axios({
		method,
		url: generatePath(path),
		headers, params
	}) as unknown as Promise<T>

const generatePath = (path: string | string[]) =>
	API_URL += typeof path === 'string' ? path : path.join('/')
