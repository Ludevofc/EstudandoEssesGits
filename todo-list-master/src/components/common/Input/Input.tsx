import './Input.scss'

interface InputProps {
    value: string;
    onChange: (value: string) => void;
}

const Input = ({value, onChange} : InputProps) => {

  return (
    <input className='input' type="text" placeholder='Adicione uma nova tarefa' value={value} onChange={(event) => onChange(event.target.value)}/>
  )
}

export default Input