import React, { useState } from 'react'
import headerstyles from '../styles/components/Header.module.css'
import Link from 'next/link'
import Image from 'next/image'
import blueLogo from '../public/header.svg'
import themeHeaderLogo from '../public/theme-header-logo.svg'
import { useTranslation } from 'react-i18next'
import router, { Router, useRouter } from 'next/router'
// import Menu from 'rc-menu/lib/Menu'
// import { Dropdown } from 'react-bootstrap'
import { RightOutlined, } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { State } from '../redux/reducers/rootReducer'
import { ApiMemberPost } from '../service/api'
import { register_Type_Change } from '../redux/actions/memberAction'
import { KEYWORDS, ROUTES } from '../constants'
import { getUrl, isEmpty } from '../utils/helper'
import { BCOINGUIDE, MEMBER_CLIENT_SEARCH_PROJECT, MEMBER_SEARCH_PROJECT, PROJECT_SIDECHARACTER, PROJECT, PROJECT_ID_PROPOSAL, PROJECT_ID_APPLICATION, PROJECT_ID_EDIT, PROJECT_ID_CREATE, SIDECHARACTERPROFILE, PROFILE_REQUEST_CONTACT_INFOMRATION, SEARCH_SIDECHARACTER, CLIENTPROFILEPROFILE, PROFILE_REQUEST_INTERVIEW, PROJECT_ID_APPLY, REQUEST_ID_RECEIVE, REQUEST_ID_SENT, FORUM_AFTER_LOGIN, NOTIFICATIONS, PROJECT_ID_PROJECTAPPLICATION, FORUM_BEFORE_LOGIN } from '../constants/routes'
import { Modal as BootstrapModal } from 'react-bootstrap'
import { SEARCH_PROJECT } from '../constants/api'
import { useEffect } from 'react'


interface Iprops {
    handleSwitch: Function;
    whiteHeader: boolean;
    goToProfilePage: any;
    logout: any;
    goToMyPage: any;
    goToNotification: any;
}
// console.log("====", router.query.id)

const ClientHeader = ({ handleSwitch, whiteHeader, goToProfilePage, logout, goToMyPage, goToNotification }: Iprops) => {
    const [width, setWidth] = useState(window.innerWidth);
    const dispatch = useDispatch()
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);
    const router = useRouter();
    const { t } = useTranslation();
    const isLogin = useSelector<any>((state: State) => state.auth.userData.token != undefined ? true : false);
    const userData: any = useSelector<any>((state: State) => state.auth.userData)
    const [visible, setVisible] = useState<any>(false);
    const projectActive = (router.pathname == PROJECT_ID_CREATE || router.pathname == PROJECT || router.pathname == PROJECT_SIDECHARACTER || router.pathname == PROJECT_ID_PROPOSAL.replace("%id%", "[id]") || router.pathname == PROJECT_ID_PROJECTAPPLICATION.replace("%id%", "[id]") || router.pathname == PROJECT_ID_APPLICATION.replace("%id%", "[id]") || router.pathname == PROJECT_ID_EDIT.replace("%id%", "[id]") || router.pathname == PROJECT_ID_APPLY.replace("%id%", "[id]"))

    const forumActive = (router.pathname == FORUM_AFTER_LOGIN)

    const searchSideActive = (router.pathname == MEMBER_CLIENT_SEARCH_PROJECT || router.pathname == MEMBER_SEARCH_PROJECT || (router?.query?.id == userData?.member?.id ? "" : router.pathname == SIDECHARACTERPROFILE.replace("%id%", "[id]")) || router.pathname == PROFILE_REQUEST_CONTACT_INFOMRATION.replace("%id%", "[id]") || router.pathname == SEARCH_SIDECHARACTER || (router?.query?.id == userData?.member?.id ? "" : router.pathname == CLIENTPROFILEPROFILE.replace("%id%", "[id]")) || router.pathname == PROFILE_REQUEST_INTERVIEW.replace("%id%", "[id]"))
        || router.pathname == REQUEST_ID_RECEIVE.replace("%id%", "[id]") || router.pathname == REQUEST_ID_SENT.replace("%id%", "[id]");

    const handleOk = () => {
        logout();
        setVisible(false);
    }
    const profileMenu = (
        <Menu className="ft-profile-menu">
            <Menu.Item onClick={goToProfilePage}>
                {t('header.MyProfile')}
            </Menu.Item>
            <Menu.Item onClick={goToMyPage}>
                {t('header.MyPage')}
            </Menu.Item>
            <div className="ft-logout-link">
                <Menu.Item onClick={() => setVisible(true)}>
                    {t('header.LogOut')}
                </Menu.Item>
            </div>
        </Menu>
    );


    return (
        <>
            <div className={`header-common ft-with-login ${whiteHeader ? 'white-header' : ''}`}>
                <div className="container">
                    <div className="outer">
                        <div className="left">
                            <div className="header-logo">
                                <Link href='/'>
                                    <a href="#" className="navbar-brand d-flex align-items-center">
                                        {whiteHeader ?
                                            <Image src={themeHeaderLogo} alt="Theme Navbar Logo" />
                                            :
                                            <Image src={blueLogo} alt="Blue Navbar Logo" />
                                        }
                                    </a>
                                </Link>
                            </div>
                            <div className="header-menu">
                                <ul className="navbar-nav m-auto">
                                    <li className="nav-item">
                                        <a
                                            className={`${headerstyles.topMenuWhite} nav-link ${searchSideActive ? "fe-headeractive" : ""}`}
                                            onClick={() => userData.registration_type == KEYWORDS.MEMBER.SIDE_CHARACTER ? router.push(getUrl(router.locale, MEMBER_CLIENT_SEARCH_PROJECT)) : router.push(getUrl(router.locale, MEMBER_SEARCH_PROJECT))}>{userData.registration_type == KEYWORDS.MEMBER.SIDE_CHARACTER ? t('search.searchClient') : t('header.searchSideCharacter')}
                                        </a>
                                        {/* </Dropdown> */}
                                    </li>
                                    <li className="nav-item">
                                        <a className={`${headerstyles.topMenuWhite} nav-link ${projectActive ? "fe-headeractive" : ""}`} onClick={() => userData.registration_type == KEYWORDS.MEMBER.SIDE_CHARACTER ? router.push(getUrl(router.locale, PROJECT_SIDECHARACTER)) : router.push(getUrl(router.locale, PROJECT))}> {t('header.project')}</a>
                                        {/* </Dropdown> */}
                                    </li>
                                    <li className="nav-item">
                                        <a className={`${headerstyles.topMenuWhite} nav-link ${forumActive ? "fe-headeractive" : ""}`} onClick={() => router.push(getUrl(router.locale, FORUM_AFTER_LOGIN))}>{t('header.forum')}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={`${headerstyles.topMenuWhite} nav-link ${router.pathname == BCOINGUIDE ? "fe-headeractive" : ""}`} onClick={() => router.push(getUrl(router.locale, BCOINGUIDE))}>{t('header.bCoin')}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="right">
                            <div className="header-profile">
                                <div className={`header-notification ${userData?.member?.notify > 0 ? "fe-notify" : ""}`} onClick={goToNotification}>
                                    {whiteHeader ?
                                        <img src={userData?.member?.notify > 0 ? "/black_notify.svg" : "/black-bell.svg"} onClick={() => router.push(getUrl(router.locale, NOTIFICATIONS))} className={headerstyles.mr10} />
                                        :
                                        (width < 640) ? <img src={userData?.member?.notify > 0 ? "/black_notify.svg" : "/black-bell.svg"} className={`${headerstyles.mr10} `} /> : <img src={userData?.member?.notify > 0 ? "/white_notify.svg" : "/whitebell.svg"} className={`${headerstyles.mr10} `} />
                                    }
                                </div>
                                <div className="header-avtar-section">
                                    <span className="avtar-image at-profile-img">
                                        {whiteHeader ?
                                            <img src={!isEmpty(userData.member?.profile_picture) ? userData.member?.profile_picture : "/blueProfile.png"} style={{ height: "30px", width: "30px" }} />
                                            :
                                            <img src={!isEmpty(userData.member?.profile_picture) ? userData.member?.profile_picture : "/grayuser.svg"} style={{ height: "30px", width: "30px" }} />
                                        }
                                    </span>
                                    <span className="avtar-name">
                                        <a className={`${headerstyles.topMenuWhite} ${headerstyles.mr10} nav-link `} href="#" style={{ color: "#16181C" }}> {isEmpty(userData.member?.nickname) ? userData.member?.name : userData.member?.nickname}</a>
                                    </span>
                                </div>
                            </div>
                            <div className="header-action ">
                                <div className="header-action-left">
                                    <Dropdown overlay={profileMenu} trigger={['click']}>
                                        <button className={`${headerstyles.buttonWhite} nav-link d-flex justify-content-center align-items-center`} >{userData.registration_type == KEYWORDS.MEMBER.CLIENT ? t('header.client') : t('header.SideCharacter')}
                                            {whiteHeader ?
                                                <img src="/PolygonTheme.svg" style={{ paddingLeft: "10px" }} />
                                                :
                                                <img src="/PolygonWhite.svg" style={{ paddingLeft: "10px" }} />
                                            }
                                        </button>
                                    </Dropdown>
                                </div>
                                <div className="header-action-right">
                                    <>
                                        {whiteHeader ?
                                            <img src="/refreshTheme.svg" />
                                            :
                                            <img src="/refreshWhite.svg" />
                                        }
                                        <a className={`${headerstyles.topMenuWhite}`} onClick={() => handleSwitch()} href="#" style={{ color: "#00D6E3" }} >{userData.registration_type == KEYWORDS.MEMBER.CLIENT ? t('header.switchSideCharac') : t('header.Switch_to_client')}</a>
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BootstrapModal
                show={visible}
                onHide={() => setVisible(false)}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-logout-Complete "
                centered
            >
                <BootstrapModal.Header closeButton className="ft-pop-header">
                    <BootstrapModal.Title>{t("header.LogOut")}</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body className="ft-pop-body">
                    <div className="desc">{t("logout.subTitle")}</div>
                </BootstrapModal.Body>
                <BootstrapModal.Footer className="ft-pop-footer">
                    <div className="ft-footer-btns ft-two-btn">
                        <Button className="ft-pop-border-btn" onClick={handleOk}>
                            {t("proposalDeletion.yes")}
                        </Button>
                        <Button className="ft-pop-theme-btn" onClick={() => setVisible(false)}>
                            {t("accountDeletion.no")}
                        </Button>
                    </div>
                </BootstrapModal.Footer>
            </BootstrapModal>
        </>
    )
}

export default ClientHeader
