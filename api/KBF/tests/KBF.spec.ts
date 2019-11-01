import {AxiosResponse} from 'axios'
import {getBoard} from '../getBoard'

let res2: AxiosResponse

it('should fetch valid board data', async () => {
	const res = await getBoard()
	expect(res._id).toBe('is54ys')
	expect(res.name).toBe('GH> KBF TS')
	expect(res.columns
		.find((col) => col.uniqueId === 'Uqsc6jy2Cbl9')!
		.name).toBe('TEST')
	expect(res.colors
		.find((color) => color.value === 'white' && color.description === 'desc')!
		.name).toBe('White')
	expect(res.swimlanes
		.find((col) => col.uniqueId === 'V8pP3mn7NcSG')!
		.name).toBe('A'
	)
	
})
