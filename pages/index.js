import { Inter } from 'next/font/google'
import Task from './Task'
import { Raleway } from 'next/font/google'
import { useEffect, useState } from 'react';
import { getAllTodos, updateTask, addTask, updateTaskList, deleteTask } from './api/hello';

const raleway = Raleway({
  weight: '400',
  subsets: ['latin'],
});


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [percentageCompleted, setPercentageCompleted] = useState(0);

  useEffect(() => {
    const fetchTodos = async () => {
      const allTodo = await getAllTodos();
      setTasks(allTodo);
      console.log(allTodo);
    };

    fetchTodos();
  }, []);


  const handleTaskCompletion = (id) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === id) {
          return { ...task, status: !task.status };
        } else {
          return task;
        }
      });
      updateTaskList(updatedTasks);
      return updatedTasks;
    });
  }

  const handleAddTask = async () => {
    if (newTask.trim() !== '') {
      const addedTask = await addTask(newTask);
      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setNewTask('');
    }
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id)
      .then(() => console.log(`Deleted task with id: ${taskId}`))
      .catch((error) => console.error(`Error: ${error}`));;
    setTasks((prevTasks) => {
      return prevTasks.filter((task) => task.id !== id);
    });
  }

  const calculatePercentageCompleted = async () => {
    const completedTasksCount = tasks.filter((task) => task.status).length;
    const totalTasksCount = tasks.length;
    const percentage = (totalTasksCount > 0)
      ? (completedTasksCount / totalTasksCount) * 100
      : 0;
    setPercentageCompleted(percentage);
    for (let task of tasks) {
      await updateTask(task);
    }
  }


  return (
    <div className={raleway.className}>
  <div className='flex flex-row items-center justify-center mb-4'>
    <p className='text-xxl'>{`${percentageCompleted}% completed`}</p>
    <button onClick={calculatePercentageCompleted}>Calculate Percentage</button>  
  </div>
  <div>
    <input
      type="text"
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
      className='w-1/3'
    />
    <button onClick={handleAddTask}>Add Task</button>
  </div>
  {tasks.map((task) => (
    <Task
      key={task.id}
      task={task}
      onTaskCompletion={handleTaskCompletion}
      onDelete={handleDeleteTask}
    />
  ))}
</div>
  )
}
