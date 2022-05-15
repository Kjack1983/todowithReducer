import React, {useState, useReducer} from 'react';
import { v4 as uuidv4 } from 'uuid';
import tasks from './tasks';

const ActionTypes = {
	ADD_TASK: 'ADD_TASK',
	REMOVE_TASK: 'REMOVE_TASK',
	UPDATE_TASK: 'UPDATE_TASK'
}

const initialState = [];
const taskReducer = (state = initialState, action) => {
	let {type, payload} = action;
	switch (type) {
		case ActionTypes.ADD_TASK:
			return [...state, payload];
		case ActionTypes.REMOVE_TASK:
			return state.filter(task => task.id !== payload.id);
		case ActionTypes.UPDATE_TASK:
			const updateTask = state.filter(task => task.id === payload.id);
			return updateTask;
		default:
			return state;
	}
}

function App() {
	const [updateTasks, dispatch] = useReducer(taskReducer, tasks);
	const [filtered, setFiltered] = useState([]);
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState('');
	const checkValidation = taskTitle && taskDescription;

	//[todo] giannis handle remove and update.
	const handleListElements = (id) => (name) => (event) => {
		console.log('CLICKED');
		console.log('event >>>>', event);
		console.log('id >>>>>', id);
		console.log('name >>>', name);

	}

	/**
	 * Filter tasks by input value.
	 * 
	 * @param {object} event
	 * @return void
	 */
	const handleInput = (event) => {
		let { target: { value } } = event;
		const filteredTasks = updateTasks.filter(task => task.name.includes(value) || task.description.includes(value));
		setFiltered(filteredTasks);
	}

	/**
	 * Construct the list of tasks.
	 * 
	 * @param {array} tasks 
	 * @return {JSX}
	 */
	const extractList = (tasks = []) => ( tasks.map(task => (
		<li key={task.id} onClick={ handleListElements(task.id)(task.name) }>{task.name}: {task.description}</li>)
	));

	/**
	 * Displays tasks.
	 *
	 * @return JSX list
	 */
	const constructResults = () => {
		if (filtered.length) {
			return extractList(filtered);
		} else {
			return extractList(updateTasks);
		}
	}

	/**
	 * Handles form submission.
	 * 
	 * @param {object} event
	 * @return void
	 */
	const handleSubmit = (event) => {
		// todo submit tasks
		event.preventDefault();
		if (checkValidation) {
			let payload = {id: uuidv4(), name: taskTitle, description: taskDescription};
			dispatch({
				'type': ActionTypes.ADD_TASK, 
				payload
			})
		}
	}

	return (
		<div className='App'>
			Search a task: 
			<div style={{marginBottom:"10px"}}>
				<input type="text" className='taskname' placeholder='task name' onChange={handleInput} />
			</div>

			<h2>Add task:</h2>
			<div style={{marginBottom:"10px"}}>
				<form onSubmit={handleSubmit}>
					<input type="text" className='title' placeholder='add titleName' onChange={(event) => setTaskTitle(event.target.value)} />
					<input type="text" className='description' placeholder='add titleDescription' onChange={(event) => setTaskDescription(event.target.value)} />
					<button disabled={!checkValidation}>submit</button>
				</form>
			</div>

			<h2>Update task:</h2>
			<div style={{marginBottom:"10px"}}>
				<form onSubmit={handleSubmit}>
					<input type="text" className='title' placeholder='add titleName' onChange={(event) => setTaskTitle(event.target.value)} />
					<input type="text" className='description' placeholder='add titleDescription' onChange={(event) => setTaskDescription(event.target.value)} />
					<button disabled={!checkValidation}>submit</button>
				</form>
			</div>

			{constructResults()}
		</div>
	);
}

export default App;
