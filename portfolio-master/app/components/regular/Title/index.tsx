import './styles.scss'

type Props = {
    title: string
    subtitle: string
    screenPosition?: string
}

const Title = ({title, subtitle, screenPosition} : Props) => {
  return (
    <div className={`title-container ${screenPosition == 'right' ? 'slideInRTL' : 'slideInLTR'}`} style={{textAlign: `${screenPosition == 'right' ? 'end' : 'start'}`, alignSelf: `${screenPosition == 'right' ? 'flex-end' : 'flex-start'}`}}>
        <h1 className='title'>{title}</h1>
        <h2 className='subtitle'>{subtitle}</h2>
    </div>
  )
}

export default Title