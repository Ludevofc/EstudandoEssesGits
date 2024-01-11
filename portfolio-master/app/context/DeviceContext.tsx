'use client';
import { useWindowSize } from '@react-hook/window-size';
import  { createContext, useContext, Dispatch, useState, useEffect } from 'react';

interface ContextProps {
    isMobile: boolean,
    setIsMobile: Dispatch<React.SetStateAction<boolean>>
}

const DeviceContext = createContext<ContextProps>({isMobile: false, setIsMobile: (): boolean => false});

export const DeviceContextProvider = ({children} : { children: React.ReactNode }) => {
    const deviceWidth = useWindowSize()[0];
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if(deviceWidth < 992) {
            setIsMobile(true);
            return;
        }

        setIsMobile(false);
    }, [deviceWidth]);

    return (
        <DeviceContext.Provider value={{isMobile, setIsMobile}}>
            {children}
        </DeviceContext.Provider>
    )
}

export const useDeviceContext = () => useContext(DeviceContext);