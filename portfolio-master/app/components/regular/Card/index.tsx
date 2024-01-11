import { type } from 'os'
import Border from '../../shapes/Border'
import './styles.scss'

type Props = {
    width: string
    height: string
    screenPosition?: string
    children?: React.ReactNode
}

export default function Card({ children, width, height, screenPosition }: Props) {
    return (
        <div
            style={{ width: `${width}`, height: `${height}`, alignSelf: `${screenPosition == 'right' ? 'flex-end' : screenPosition == 'left' ? 'flex-start' : 'center'}`}}
            className='card-container'>
            <div className="top-left-border">
                <Border corner='top-right' />
            </div>
            {children}
            <div className='bottom-right-border'>
                <Border corner='bottom-right' />
            </div>
        </div>
    )
}