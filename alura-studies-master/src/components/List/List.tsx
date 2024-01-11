import React from 'react'
import style from './List.module.scss'

const List = () => {
    const tasks = [{
        name: 'React',
        time: '02:00:00'
    },
    {
        name: 'JavaScript',
        time: '01:00:00'
    }, 
    {
        name: 'TypeScript',
        time: '03:00:00'
    }]
  return (
    <aside className={style.listTasks}>
        <h2> Estudos do dia </h2>
        <ul>
            {tasks.map((task, index) => (
                <li key={index} className={style.item}>
                    <h3>{task.name}</h3>
                    <span>{task.time}</span>
                </li>
            ))}
        </ul>
    </aside>
  )
}

export default List