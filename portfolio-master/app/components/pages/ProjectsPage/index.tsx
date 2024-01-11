import './styles.scss'
import ProjectCard from '../../regular/ProjectCard'
import Card from '../../regular/Card'
import { useDeviceContext } from '@/app/context/DeviceContext'
import Title from '../../regular/Title'
import { useInView } from 'react-intersection-observer'
import { useLanguageContext } from '@/app/context/LanguageContext'

type Repository = {
    id: number
    title: string
    subtitle: string
    description: string
    imageUrl: string
    githubUrl: string
    previewUrl: string
}

const ProjectsPage = () => {
    const { isMobile } = useDeviceContext();
    const { texts, repositorys } = useLanguageContext();

    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: true
      })

    return (
        <section ref={ref} className={`projects-container ${inView && 'slideInLTR'}`} id='projects'>
            <Title title={texts.projects.title} subtitle={texts.projects.subtitle} />
            {isMobile &&
                <Card width='100%' height='fit-content'>
                    <ProjectCard />
                </Card>}
            {!isMobile && <div className='projects-list'>
                {repositorys.map((repo: Repository) => {
                    return (
                        <Card key={repo.id} width='500px' height='fit-content'>
                            <ProjectCard repository={repo} />
                        </Card>
                    )
                })}
            </div>}
        </section>
    )
}

export default ProjectsPage