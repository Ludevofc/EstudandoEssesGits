'use client'

import './page.scss'
import HomePage from './components/pages/HomePage'
import AboutPage from './components/pages/AboutPage'
import ProjectsPage from './components/pages/ProjectsPage'

export default function Home() {

  return (
    <>
    <HomePage />
    <AboutPage />
    <ProjectsPage />
    </>
  )
}
