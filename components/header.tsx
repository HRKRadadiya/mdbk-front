/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react';
import styles from '../styles/components/Header.module.css'
import Link from 'next/link'
import Image from 'next/image'
import blueLogo from '../public/blueNavbarLogo.svg'
import { useTranslation } from 'next-i18next';
import { Button } from 'antd';
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';

function Header({ }) {
    const { t } = useTranslation();
    const router = useRouter();
    const clientList = useSelector((state: State) => state.client.client)
    const val = router.query && router.query.loginStateVal
    const loginState = 'true';
    const companyState = router.query && router.query.companyStateVal
    return (
        <div className={`${router.locale == 'en' ? 'header-common in-english' : 'header-common'}`}>
            <div className="container mobilegone">
                {companyState === "true" && <Button className="hdr-left-btn for-search-company">...</Button>}
                <div className={companyState === "true" ? `header-common-inner for-search-company` : `header-common-inner`}>
                    <div className="header-logo">
                        <Link href='/'>
                            <a href="#" className="navbar-brand d-flex align-items-center">
                                <Image src={blueLogo} alt="Blue Navbar Logo" />
                            </a>
                        </Link>
                    </div>
                    <div className="header-menu">
                        <ul className="navbar-nav m-auto">
                            <li className="nav-item">
                                <Link href='/'>
                                    <a className={`${styles.secondMenu} nav-link`} href="#">{loginState === 'true' ? t('header.searchSideCharacter')
                                        : t('home.search')}</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href='/'>
                                    <a className={`${styles.topMenu} nav-link`} href="#">{loginState === 'true' ? t('header.project') : t('home.post')}</a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a className={`${styles.topMenu} nav-link`} href="#">{t('header.forum')}</a>
                            </li>
                            <li className="nav-item">
                                <a className={`${styles.topMenu} ${styles.mr20} nav-link`} href="#">{t('header.bCoin')}</a>
                            </li>
                        </ul>
                    </div>
                    <div className="header-profile">
                        <div className="header-notification">{loginState === 'true' && <img src="/bellIcon.svg" className={styles.mr10} />}
                        </div>
                        <div className="header-avtar-section">
                            <span className="avtar-image">
                                {loginState === 'true' && <img src="/userPlaceholder.svg" />}
                            </span>
                            <span className="avtar-name">
                                {/* nickname */}
                                <a className={`${styles.topMenu} ${styles.mr10} nav-link`} href="#" style={{ color: "#16181C" }}>{loginState === 'true' ? (clientList && clientList ? clientList : "Passion") : null}</a>
                            </span>
                        </div>
                    </div>
                    <div className="header-action for-search-company">
                        <div className="header-action-left">
                            {loginState === 'true' && <button className={`${styles.button} nav-link d-flex justify-content-center align-items-center`}  >{t('header.client')}<img src="/Polygon.svg" style={{ paddingLeft: "10px" }} /></button>}
                        </div>
                        <div className="header-action-right">
                            {loginState === 'true' ? <> <img src="/reloadIcon.svg" />
                                <a className={`${styles.topMenu}`} href="#" style={{ color: "#00D6E3" }} >{t('header.switchSideCharac')}</a></>
                                :
                                <button className={`${styles.button} d-flex justify-content-center align-items-center`} style={{ marginTop: "0px" }}>{t('changePwd.login')}</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Header