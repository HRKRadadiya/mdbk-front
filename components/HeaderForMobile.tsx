/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react';
import styles from '../styles/components/Header.module.css'
import Link from 'next/link'
import Image from 'next/image'
import blueLogo from '../public/blueNavbarLogo.svg'
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router'
import { getClientByMemberId } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import { useStore } from '../redux/store';
import { Nav, Button, Navbar, Container } from 'react-bootstrap';
import { useState } from 'react';
import { MEMBER_SWITCH_ACCOUNT } from '../constants/api';
import { ApiMemberPost } from '../service/api';

function HeaderForMobile({ }) {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getClientByMemberId())
    }, []);
    const clientList = useSelector((state: State) => state.client.client)
    const val = router.query && router.query.loginStateVal
    const loginState = val;
    const { type } = router.query;
    const companyState = router.query && router.query.companyStateVal
    const memberType = useSelector((state: State) => state.auth.userData.registration_type)
    const [switchType, setSwitchType] = useState<boolean>(true);

    const handleSwitch = () => {
        setSwitchType(!switchType)
        ApiMemberPost(MEMBER_SWITCH_ACCOUNT,
            { registration_type: memberType }
        ).then(async (response: any) => {
            if (response.data && response.success) {

            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }


    return (
        <Navbar bg="light" expand="md">
            <Container >
                <div className="menuwithnotification" >
                    <div className="header-notification mobilegone1">{loginState === 'true' && <img src="/bellIcon.svg" className={styles.mr10} />}
                    </div>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                </div>
                <Navbar.Collapse id="basic-navbar-nav">
                    <div className={`${router.locale == 'en' ? 'header-common in-english' : 'header-common'}`}>
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
                                    {loginState === 'true' && <button className={`${styles.button} nav-link d-flex justify-content-center align-items-center`}  >{switchType ? t('header.client') : t('header.SideCharacter')}<img src="/Polygon.svg" style={{ paddingLeft: "10px" }} /></button>}
                                </div>
                                <div className="header-action-right">
                                    {loginState === 'true' ? <> <img src="/reloadIcon.svg" />
                                        <a className={`${styles.topMenu}`} onClick={handleSwitch} href="#" style={{ color: "#00D6E3" }} >{switchType ? t('header.switchSideCharac') : t('header.switchClientCharac')}</a></>
                                        :
                                        <button className={`${styles.button} d-flex justify-content-center align-items-center`} style={{ marginTop: "0px" }}>{t('changePwd.login')}</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </Navbar.Collapse>
            </Container>
            <h1 className={`${styles.heading1} mobilegone1`}>{type === 'client' ? t('clientProfile.clientProfileStep1.enterProfile') : '부캐정보를 등록하세요'}</h1>
        </Navbar>
    )

}

export default HeaderForMobile