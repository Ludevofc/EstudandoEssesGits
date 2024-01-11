import './App.scss'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Button from './components/common/Button/Button'
import Header from './components/common/Header/Header'
import Input from './components/common/Input/Input'
import TaskList from './components/common/TaskList/TaskList'
import NoTask from './components/common/NoTask/NoTask'

interface Task {
  id: string;
  description: string;
  isDone: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const doneTasks = tasks.filter((task) => task.isDone)

  const [taskDescription, setTaskDescription] = useState<string>('')

  const addTask = (description: string) => {
    const newTask: Task = {
      id: uuidv4(),
      description: description,
      isDone: false
    }

    setTaskDescription('')
    setTasks([...tasks, newTask])
  }

  const updateDoneTasks = (taskId: string) => {
    setTasks(tasks.map((task) => {
      return task.id === taskId ? {...task, isDone: !task.isDone} : task
    }))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  return (
    <>
      <Header />
      <div className="new-task-container">
        <Input value={taskDescription} onChange={setTaskDescription}/>
        <Button text='Criar' onClick={() => addTask(taskDescription)} />
      </div>
      <main className='tasks-container'>
        <div className='tasks-infos'>
          <div className='info created'>
            <p>Tarefas criadas</p>
            <span>{tasks.length}</span>
          </div>
          <div className='info completed'>
            <p>Concluídas</p>
            {tasks.length > 0 ? <span>{doneTasks.length} de {tasks.length}</span> : <span>0</span>}
          </div>
        </div>
        {tasks.length > 0 ? <TaskList tasks={tasks} onChangeDoneState={updateDoneTasks} onDeleteTask={deleteTask}/> : <NoTask />}
      </main>
    </>
  )
}

export default App
