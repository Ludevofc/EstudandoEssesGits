"use client"
import './styles.scss'
import { useDeviceContext } from '../../../context/DeviceContext'
import ArrowIcon from "../../icons/ArrowIcon"
import { isMobile } from 'react-device-detect'
import { useEffect, useState } from 'react'
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

type Props = {
    repository?: Repository
}

const ProjectCard = ({repository} : Props) => {
    const { isMobile } = useDeviceContext();
    const { repositorys } = useLanguageContext();
    const [currentRepository, setCurrentRepository] = useState(repositorys[0]);
    
    const updateCurrentRepository = () => {
        if(currentRepository.id == repositorys.length) {
            setCurrentRepository(repositorys[0]);
            return;
        }

        const nextRepository : Repository = repositorys.find((repo: Repository) => repo.id == currentRepository.id + 1);
        setCurrentRepository(nextRepository);
    }

    if(isMobile) return (
        <>
            <div className="project-image-container">
                <img className='image' src={currentRepository?.imageUrl} alt="Foto de um Notebook" />
                <div className='title-container'><h1 className='title'>{currentRepository?.title} <br /> {currentRepository?.subtitle}</h1></div>
            </div>
            <p className='project-description'>{currentRepository?.description}</p>
            <div className='action-container'>
                <div className='buttons-container'>
                    {currentRepository?.githubUrl && 
                    <a 
                    href={currentRepository?.githubUrl}
                    target='_blank'
                    className='action-button'>GitHub</a>}
                    {currentRepository?.previewUrl && 
                    <a 
                    href={currentRepository?.previewUrl}
                    target='_blank'
                    className='action-button'>Preview</a>}
                </div>
                <button 
                onClick={updateCurrentRepository}
                className='next-button'><ArrowIcon /></button>
            </div>
        </>
    )

    if(!isMobile) return (
        <>
            <div className="project-image-container">
                <img className='image' src={repository?.imageUrl} alt="Foto de um Notebook" />
                <div className='title-container'><h1 className='title'>{repository?.title} <br /> {repository?.subtitle}</h1></div>
            </div>
            <p className='project-description'>{repository?.description}</p>
            <div className='action-container'>
                <div className='buttons-container'>
                    {repository?.githubUrl && 
                    <a 
                    href={repository?.githubUrl}
                    target='_blank'
                    className='action-button'>GitHub</a>}
                    {repository?.previewUrl && 
                    <a 
                    href={repository?.previewUrl}
                    target='_blank'
                    className='action-button'>Preview</a>}
                </div>
            </div>
        </>
    )
}

export default ProjectCard