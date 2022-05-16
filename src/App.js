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

	// this could have been received from from a response of a server.
	const [updateTasks, dispatch] = useReducer(taskReducer, tasks);
	const [filtered, setFiltered] = useState([]);
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState('');
	const [enableFormUpdate, setEnableFormUpdate] = useState(false);

	const [updatetTaskTitle, setUpdatetTaskTitle] = useState('');
	const [updateTaskDescription, setUpdateTaskDescription] = useState('');
	const checkUpdateValidation = updatetTaskTitle && updateTaskDescription;


	const checkValidation = taskTitle && taskDescription;

	const taskStyling = {
		textDecoration: 'underline',
		marginLeft: '5px',
		cursor: 'pointer'
	};

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

	const handleUpdate = task => event => {

	};

	/**
	 * Construct the list of tasks.
	 * 
	 * @param {array} tasks 
	 * @return {JSX}
	 */
	const extractList = (tasks = []) => ( tasks.map(task => {
		return <li key={task.id}>
			{task.name}: {task.description} 
			<i style={taskStyling} onClick={ updateTask(task) }>edit</i>
			
			{/*TODO giannis check how to update task*/}
			{enableFormUpdate && <div>
				<form onSubmit={handleUpdate}>
					<input type="text" className='title' placeholder='update titleName' onChange={(event) => setUpdatetTaskTitle(event.target.value)} />
					<input type="text" className='description' placeholder='update titleDescription' onChange={(event) => setUpdateTaskDescription(event.target.value)} />
					<button disabled={!checkUpdateValidation}>Update</button>
				</form>
			</div>}| 
			<i style={taskStyling} onClick={ removeTask(task) }>remove</i>
		</li>
	}));

	//[todo] giannis handle update.
	const updateTask = (task) => (event) => {
		console.log('CLICKED');
		console.log('name >>>', task);
		setEnableFormUpdate(true);
	}

	/**
	 * Remove a task from the todo list.
	 * 
	 * @param {object} task 
	 * @returns 
	 */
	const removeTask = (task) => (event) => {
		const payload = {...task};
		dispatch({type: ActionTypes.REMOVE_TASK, payload});
	};

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
			const payload = {id: uuidv4(), name: taskTitle, description: taskDescription};
			dispatch({ 'type': ActionTypes.ADD_TASK, payload });
		}
	}

	return (
		<div className='App'>
			Search a task: 
			<div style={{marginBottom:"10px"}}>
				<input type="text" className='taskname' placeholder='task name' onChange={handleInput} />
			</div>

			
			<div style={{marginBottom:"10px"}}>
				<h2>Add task:</h2>
				<form onSubmit={handleSubmit}>
					<input type="text" className='title' placeholder='add titleName' onChange={(event) => setTaskTitle(event.target.value)} />
					<input type="text" className='description' placeholder='add titleDescription' onChange={(event) => setTaskDescription(event.target.value)} />
					<button disabled={!checkValidation}>submit</button>
				</form>
			</div>

			{/* todo Giannis update and remore task */}
			{ /*<div style={{marginBottom:"10px"}}>
				<h2>Update task:</h2>
				<form onSubmit={handleUpdate}>
					<input type="text" className='title' placeholder='update titleName' onChange={(event) => setTaskTitle(event.target.value)} />
					<input type="text" className='description' placeholder='add titleDescription' onChange={(event) => setTaskDescription(event.target.value)} />
					<button disabled={!checkValidation}>submit</button>
				</form>
			</div> */}

			{constructResults()}
		</div>
	);
}

export default App;
