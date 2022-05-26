import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { splashScreen } from '../redux/actions/clientAction'
import { State } from '../redux/reducers/rootReducer'
import Splash from './Splash'
import { isMobile } from "react-device-detect";

interface PropsType {
    children: React.ReactNode,
}

const MainLayout: React.FC<PropsType> = ({ children }) => {

    const splashFlag = useSelector((state: State) => state.validation.splash);
    const dispatch = useDispatch()

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            if (isMobile) {
                let splashTimeout = setTimeout(() => {
                    clearTimeout(splashTimeout);
                    dispatch(splashScreen(true))
                }, 3500);
            } else {
                dispatch(splashScreen(true))
            }
        }
        return () => { isMounted = false };
    }, [splashFlag]);


    return (<>
        {splashFlag ? children : <Splash />}
    </>);
}

export default MainLayout
