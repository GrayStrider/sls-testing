import axios from 'axios'
import nock from 'nock'
import {genAPIkey} from './genApiKey'
const API_URL = `https://kanbanflow.com/api/v1/`
const headers = {
	'Authorization': `Basic ${genAPIkey()}`,
	'Content-type' : 'application/json'
}

nock(API_URL)
	.get('/board')
	.reply(200, {})


export const dispatch = async <T>(
	method: 'get' | 'post',
	path: string | string[],
	params?: any) => {
	const config = {
		method,
		url          : generatePath(path),
		headers, data: params
	}
	const {data} = await axios(config)
	return data as T
}

const generatePath = (path: string | string[]) =>
	API_URL + (typeof path === 'string' ? path : path.join('/'))

dispatch('get', 'board')
.then(console.log)
