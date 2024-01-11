import { useInView } from 'react-intersection-observer'
import Card from '../../regular/Card'
import Title from '../../regular/Title'
import './styles.scss'
import { useLanguageContext } from '@/app/context/LanguageContext'

const AboutPage = () => {
    const { texts } = useLanguageContext();

    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: true
      })
      
  return (
    <section ref={ref} className={`about-container ${inView && 'slideInRTL'}`} id='about'>
        <Title title={texts.about.title} subtitle={texts.about.subtitle} screenPosition='right' />
        <Card width='100%' height='fit-content' screenPosition='left'>
          <p className='text'>{texts.about.bio}</p>
        </Card>
      </section>
  )
}

export default AboutPage