import PlusIcon from '../../icons/PlusIcon/PlusIcon'
import './Button.scss'

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

const Button = ({text, onClick} : ButtonProps) => {
  return (
    <button className='button' onClick={onClick}>
        {text}
        <PlusIcon />
    </button>
  )
}

export default Button