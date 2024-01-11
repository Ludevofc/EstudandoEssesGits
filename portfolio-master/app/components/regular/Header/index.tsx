'use client'
import './styles.scss'
import Link from 'next/link'
import React from 'react'
import HomeIcon from '../../icons/HomeIcon';
import AboutIcon from '../../icons/AboutIcon';
import ProjectsIcon from '../../icons/ProjectsIcon';
import AtIcon from '../../icons/AtIcon';
import { useDeviceContext } from '../../../context/DeviceContext';
import BulbIcon from '../../icons/BulbIcon';
import GlobeIcon from '../../icons/GlobeIcon';
import { useLanguageContext } from '@/app/context/LanguageContext';

const Header = () => {
    const { isMobile } = useDeviceContext();
    const { texts, language, setLanguage } = useLanguageContext();

    const handleScroll = (e: any) => {
        e.preventDefault();

        const href = e.currentTarget.getAttribute('href');
        const targetId = href.split('#')[1];
        const element: any = document.getElementById(targetId);

        const position = isMobile ? element?.offsetTop : element?.offsetTop - document.body.clientHeight * 0.2;

        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    }

    const changeLanguage = () => {
        if(language == 'en') {
            setLanguage('pt')
        } else {
            setLanguage('en')
        }
    }

    return (
        <>
            <header className={`header-container ${isMobile && 'slideUp'}`}>
                <nav className='navigation'>
                    <ul className='list'>
                        <Link href='#home' onClick={handleScroll}>
                            <li className='item'>
                                <div className='cover'></div>
                                <div className='icon-container'><HomeIcon /></div>
                                <span className='name'>{texts.header.home}</span>
                            </li>
                        </Link>
                        <Link href='#about' onClick={handleScroll}>
                            <li className='item'>
                                <div className='cover'></div>
                                <div className='icon-container'><AboutIcon /></div>
                                <span className='name'>{texts.header.about}</span>
                            </li>
                        </Link>
                        <Link href='#projects' onClick={handleScroll}>
                            <li className='item'>
                                <div className='cover'></div>
                                <div className='icon-container'><ProjectsIcon /></div>
                                <span className='name'>{texts.header.projects}</span>
                            </li>
                        </Link>
                        <Link href='#contacts' onClick={handleScroll}>
                            <li className='item'>
                                <div className='cover'></div>
                                <div className='icon-container'><AtIcon /></div>
                                <span className='name'>{texts.header.contact}</span>
                            </li>
                        </Link>
                    </ul>
                </nav>
                {!isMobile && <div className='switch-container'>
                <div
                    onClick={() => {
                        const html = document.querySelector('html');
                        html?.classList.toggle('dark-mode');
                    }}
                    className='switch-button'><BulbIcon /></div>
                <div
                    onClick={changeLanguage}
                    className='switch-button'><GlobeIcon /></div>
            </div>}
            </header>
            {isMobile && <div className='switch-container'>
                <div
                    onClick={() => {
                        const html = document.querySelector('html');
                        html?.classList.toggle('dark-mode');
                    }}
                    className='switch-button'><BulbIcon /></div>
                <div
                    onClick={changeLanguage}
                    className='switch-button'><GlobeIcon /></div>
            </div>}
        </>
    )
}

export default Header