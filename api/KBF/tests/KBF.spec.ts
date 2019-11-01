import {AxiosResponse} from 'axios'
import {getBoard, getTaskByID, getTasksByColumn} from '../requests'

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

it('should return all tasks in the column', async () => {
	const res = await getTasksByColumn({columnId: 'Uqsc6jy2Cbl9'})
	expect(res.length).toBe(2) //2 swimlanes!
	expect(res.find((res) => res.columnId === 'Uqsc6jy2Cbl9')!
		.columnName).toBe('TEST')
})

it('should return a single task by id', async () => {
	const res = await getTaskByID('hh6RHiEw')
	expect(res.name).toBe('test_task')
})
