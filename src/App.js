import React, {useState, useReducer, useEffect} from 'react';
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
			console.log('find state from payload:', state.find(task => task.id === payload.id));
			console.log(state.find(task => task.id === payload.id));
			state[state.findIndex(task => task.id === payload.id)] = {...payload};
			const newState = [...state];
			return newState;
		default:
			return state;
	}
}

const App = () => {
	const [updateTasks, dispatch] = useReducer(taskReducer, tasks);
	const [filtered, setFiltered] = useState([]);
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState('');
	const [enableFormUpdate, setEnableFormUpdate] = useState(false);
	const [taskForEditing, setTaskForEditing] = useState({});

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
		const filteredTasks = updateTasks.filter(task => Object.values(task).map(data => data).join('').includes(value));
		setFiltered(filteredTasks);
	}

	/**
	 * Handler update of the tasks
	 * @param {*} event 
	 */
	const handleUpdate = event => {
		event.preventDefault();
		let payload = {...taskForEditing, name: updatetTaskTitle, description: updateTaskDescription};
		dispatch({type:ActionTypes.UPDATE_TASK, payload});
	};

	/**
	 * Display the updateform.
	 * 
	 * @returns {JSX} displayForm
	 */
	const displayUpdateForm = () => {
		return (<div>
			<form onSubmit={handleUpdate}>
				<input type="text" className='title' placeholder='update titleName' onChange={(event) => setUpdatetTaskTitle(event.target.value)} />
				<input type="text" className='description' placeholder='update titleDescription' onChange={(event) => setUpdateTaskDescription(event.target.value)} />
				<button disabled={!checkUpdateValidation}>Update</button>
			</form>
		</div>)
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
			<i style={taskStyling} onClick={ updateTask(task) }>edit</i> | 
			<i style={taskStyling} onClick={ removeTask(task) }>remove</i>
		</li>
	}));

	//[todo] giannis handle update.
	const updateTask = (task) => (event) => {
		if(Object.keys(task).length) {
			setEnableFormUpdate(true);
			setTaskForEditing(task);
		}
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
		setTaskForEditing({});
		setEnableFormUpdate(false)
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
					<input type="text" className='title' placeholder='add titleName' onChange={(event) => {
						setTaskForEditing({})
						setEnableFormUpdate(false);
						setTaskTitle(event.target.value);
					}} />
					<input type="text" className='description' placeholder='add titleDescription' onChange={(event) => {
						setTaskForEditing({});
						setEnableFormUpdate(false);
						setTaskDescription(event.target.value);
					}} />
					<button disabled={!checkValidation}>submit</button>
				</form>
			</div>
			{constructResults()}
			{enableFormUpdate ? displayUpdateForm() : null}
		</div>
	);
}

export default App;
