import TaskIcon from '../../icons/TaskIcon/TaskIcon'
import './NoTask.scss'

const NoTask = () => {
    return (
        <div className='notask'>
            <TaskIcon />
            <div className="notask-info">
                <h2 className='title'>Você ainda não tem tarefas cadastradas</h2>
                <p className='subtitle'>Crie tarefas e organize seus itens a fazer</p>
            </div>
        </div>
    )
}

export default NoTask