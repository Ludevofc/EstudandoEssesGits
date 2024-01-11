import './styles.scss'
import ProfileImage from '../../regular/ProfileImage'
import Title from '../../regular/Title'
import { useLanguageContext } from '@/app/context/LanguageContext';

const HomePage = () => {
    const { language, texts } = useLanguageContext();

    return (
        <section className='home-container' id='home'>
            <Title title={texts.home.title} subtitle={texts.home.subtitle} />
            <ProfileImage />
            <div className='description-container'>
                <h3 className='description'>
                    {language == 'en' ? 
                    <>I&apos;m 22 springs old, and i have <br /> <strong className='bold'>+2 years</strong> of experience building <br /> amazing <strong className='bold'>user experiences</strong></>
                    : 
                    <>Tenho 22 primaveras, e tenho <br /> <strong className='bold'>+2 anos</strong> de experiência construindo <br /> incríveis <strong className='bold'>experiências de usuário</strong></>
                    }</h3>
            </div>
        </section>
    )
}

export default HomePage