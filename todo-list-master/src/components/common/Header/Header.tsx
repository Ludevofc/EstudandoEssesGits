import RocketIcon from '../../icons/RocketIcon/RocketIcon'
import './Header.scss'

const Header = () => {
  return (
    <header className="header-container">
        <div className="logo-container">
            <RocketIcon />
            <h1 className="title">to<strong className="bold">do</strong></h1>
        </div>
    </header>
  )
}

export default Header