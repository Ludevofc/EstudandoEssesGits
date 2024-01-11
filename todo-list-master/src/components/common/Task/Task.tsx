import TrashIcon from '../../icons/TrashIcon/TrashIcon'
import './Task.scss'

interface TaskProps {
    description: string;
    isDone: boolean;
    onChangeDoneState?: () => void;
    onDeleteTask: () => void;
}

const Task = ({description, isDone, onChangeDoneState, onDeleteTask} : TaskProps) => {
  return (
    <div className='task'>
        <div className="check-container">
            <input className='check-button' type="checkbox" name="done" id="done" onChange={onChangeDoneState}/>
            <div className='checkmark'></div>
        </div>
        <div className="description-container">
            <p className='description' style={{textDecoration: `${isDone ? 'line-through' : 'none'}`, color: `${isDone ? 'var(--gray-300)' : ''}`}}>{description}</p>
        </div>
        <div className="trash" onClick={onDeleteTask}>
            <TrashIcon />
        </div>
    </div>
  )
}

export default Task