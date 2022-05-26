import { useRouter } from 'next/router';
import React from 'react'
import { useTranslation } from 'react-i18next';
import styles from '../styles/Home.module.css'

export default function FullFooter() {

    const router = useRouter();
    const { t } = useTranslation();

    return (
        <footer className={`${router.locale == 'en' ? 'container-fluid pt-5 pb-4 pl-2 pr-2 footer-main ft-full-footer in-english' : 'container-fluid pt-5 pb-4 pl-2 pr-2 footer-main ft-full-footer'}`} style={{ backgroundColor: "#F1F1F1" }}>
            <div className=" ft-footer-inner ft-inside">
                <div className="footer-logo">
                    <img src="/footerLogo.svg" />
                </div>
                <div className="right">
                    <div className='main'>
                        <p>{t('home.footer.para1')}</p>
                        <p>{t('home.footer.para4')}</p>
                        <p>{t('home.footer.para6')}</p>
                        <p>{t('home.footer.para8')}</p>
                    </div>
                    <div className='sub-main'>
                        <div className='sub'>
                            <p className='first'>{t('home.CEO')}</p> <span className='value'>김준영</span>
                        </div>
                        <div className='sub'>
                            <p className='first'>{t('home.Business_Registration')}</p> <span className='value'>000-00-00000</span>
                        </div>
                        <div className='sub'>
                            <p className='first'>{t('home.footer.para9')}</p> <span className='value'>서울시 강남구</span>
                        </div>
                    </div>
                    <div className='sub-main'>
                        <div className='sub'>
                            <p className='first'>{t('home.Homepage')}</p> <span className='value'>www.modoobk..co.kr</span>
                        </div>
                        <div className='sub'>
                            <p className='first'>{t('common.email_address')}</p> <span className='value'>modoobk.e@gmail.com</span>
                        </div>
                    </div>
                    <p className="main-footer-copyright ft-bottom">
                        {t('home.footer.para1a')}
                    </p>
                </div>
            </div>
        </footer>
    )
}
