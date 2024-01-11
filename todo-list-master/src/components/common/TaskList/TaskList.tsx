import './TaskList.scss'
import Task from '../Task/Task'

interface Task {
    id: string;
    description: string;
    isDone: boolean;
}

interface TaskListProps {
    tasks: Task[];
    onChangeDoneState: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
}

const TaskList = ({tasks, onChangeDoneState, onDeleteTask} : TaskListProps) => {
    return (
        <div className='task-list'>
            {tasks.map((task) => {
                return (<Task key={task.id} description={task.description} isDone={task.isDone} onChangeDoneState={() => onChangeDoneState(task.id)} onDeleteTask={() => onDeleteTask(task.id)}/>)
            })}
        </div>
    )
}

export default TaskList