import { useEffect, useState } from 'react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

const Splash = () => {
    const { t } = useTranslation();
    const [splsh1, setSplsh1] = useState(false)
    const [splsh2, setSplsh2] = useState(true)
    const [splsh3, setSplsh3] = useState(true)
    const [splashtimer, setSplashtimer] = useState(true)
    const [splsh4, setSplsh4] = useState(true)
    const [splsh5, setSplsh5] = useState(true)
    const dispatch = useDispatch();
    const [count, setCount] = useState(1)
    useEffect(() => {
        setInterval(() => {
            if (count == 1) {
                setSplsh1(true)
                setSplsh2(false)
                setCount(count + 1)
            } else if (count == 2) {
                setSplsh3(false)
                setCount(count + 1)
            } else if (count == 3) {
                setSplsh4(false)
                setCount(count + 1)
            } else if (count == 4) {
                setSplsh5(false)
                setCount(count + 1)
            } else if (count == 5) {
                setSplsh1(false)
                setCount(count + 1)
                setSplsh2(true)
                setSplsh3(true)
                setSplsh4(true)
                setSplsh5(true)
            } else if (count == 6) {
                // dispatch(splashScreen(true))
                setCount(count + 1)
                setSplashtimer(false)
            }
        }, 500)
    })
    return (
        // <div className={splashtimer ? "splashmain" : "splashshow"}>
        //     <img src="/h1.svg" className="splashimage" />
        //     <img src="/h2.svg" className="splashimage" />
        //     <h5 className="splashtext">{t('home.staff')}</h5>
        // </div>
        <div className={splashtimer ? "splashscreen" : "splashshow"}>
            <div className={splsh1 ? "textgone" : "splashmain"}>
                <img src="/splash/groupall.png" className="splashimage" />
                <h5 className="splashtext">{t('home.staff')}</h5>
            </div>
            <div className="twobytwo">
                <div className="onebyone">
                    <div className={splsh2 ? "textgone" : "splashtext"}>
                        <img src="/splash/group1.png" className="splashimage" />
                    </div>
                    <div className={splsh3 ? "textgone" : "splashtext"}>
                        <img src="/splash/group2.png" className="splashimage" />
                    </div>
                </div>
                <div className="onebyone">
                    <div className={splsh4 ? "textgone" : "splashtext"}>
                        <img src="/splash/group3.png" className="splashimage" />
                    </div>
                    <div className={splsh5 ? "textgone" : "splashtext"}>
                        <img src="/splash/group4.png" className="splashimage" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Splash
