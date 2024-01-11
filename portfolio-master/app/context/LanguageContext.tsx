'use client';
import  { createContext, useContext, Dispatch, useState, useEffect } from 'react';
import languagesJson from '../../public/configs/languages.json';
import repositorysJson from '../../public/configs/repositorys.json';

interface ContextProps {
    language: string,
    setLanguage: Dispatch<React.SetStateAction<string>>,
    texts: any,
    repositorys: any
}

const LanguageContext = createContext<ContextProps>({language: 'en', setLanguage: (): string => 'en', texts: languagesJson.en, repositorys: repositorysJson.en});

export const LanguageContextProvider = ({children} : { children: React.ReactNode }) => {
    const [language, setLanguage] = useState('en');
    const [texts, setTexts] = useState(languagesJson.en);
    const [repositorys, setRepositorys] = useState(repositorysJson.en);

    useEffect(() => {
        if(language == 'en') {
            setTexts(languagesJson.en);
            setRepositorys(repositorysJson.en);
            return;
        }

        setTexts(languagesJson.pt);
        setRepositorys(repositorysJson.pt);
    }, [language]);

    return (
        <LanguageContext.Provider value={{language, setLanguage, texts, repositorys}}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguageContext = () => useContext(LanguageContext);