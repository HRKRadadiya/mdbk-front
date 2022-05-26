import React from 'react';
import styles from '../styles/components/Gift.module.css'
import GiftBox from '../public/GiftBox.svg'
import Image from 'next/image'
import { useTranslation } from 'react-i18next';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';

function BannerBoxConatiner() {
    const { t } = useTranslation();
    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);
    return (
        <div className="ft-gift-box">
            <div className="left-txt">
                <div><span className="ft-bold"> {t('featureSearch.Registeryourprofile')} </span> <span className="ml-8">
                    {(width < 640) ? t('featureSearch.80more') : t('featureSearch.80ormorecomplete')} </span></div>
                <div><span className="mr-2"> {(width < 640) ? t('featureSearch.when_you_complete') : null}</span> <span className="ft-bold"> {t('featureSearch.BonusCash')} </span> <span className="ml-8">{t('featureSearch.Payments!')}</span></div>
            </div>
            <div className="right-img">
                <Image src={GiftBox} alt="GiftBox" />
            </div>
        </div>
    )
}
export default BannerBoxConatiner