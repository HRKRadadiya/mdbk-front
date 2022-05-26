import { useRouter } from 'next/router';
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import headerstyles from '../styles/components/Header.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { MEMBER_SWITCH_ACCOUNT } from '../constants/api';
import { memberLogout, nike_name_Change, notify_change, Profile_Picture_Change, register_Type_Change } from '../redux/actions/memberAction';
import { State } from '../redux/reducers/rootReducer';
import { ApiMemberPost } from '../service/api';
import ClientHeader from './ClientHeader';
import { Menu, Dropdown, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { slide as Menu2 } from 'react-burger-menu'
import { CloseOutlined } from '@ant-design/icons'
import { MenuOutlined } from '@ant-design/icons'
import RightArrow from '../public/grey-right-angle.png'
import RightOutlinedImg from '../public/RightOutlined.svg'
import $ from 'jquery'

//images
import blueLogo from '../public/header.svg'
import themeHeaderLogo from '../public/theme-header-logo.svg'
import syncBlue from '../public/sync-blue.svg'
import { useTranslation } from 'react-i18next';
import { KEYWORDS, ROUTES, STORAGE_KEY } from '../constants';
import { getUrl, isEmpty } from '../utils/helper';
import Storage from '../service/storage';
import { BCOINGUIDE, CLIENTPROFILEPROFILE, PROJECT_ID_APPLICATION, FORUM_AFTER_LOGIN, FORUM_BEFORE_LOGIN, LOGIN, MEMBER_CLIENT_SEARCH_PROJECT, MEMBER_SEARCH_PROJECT, MYPAGE, NOTIFICATION, PROFILE_REQUEST_CONTACT_INFOMRATION, PROFILE_REQUEST_INTERVIEW, PROJECT, PROJECT_ID_APPLY, PROJECT_ID_CREATE, PROJECT_ID_EDIT, PROJECT_ID_PROJECTAPPLICATION, PROJECT_ID_PROPOSAL, PROJECT_SIDECHARACTER, REQUEST_ID_RECEIVE, REQUEST_ID_SENT, SEARCH_CLIENT, SEARCH_PROJECT, SEARCH_SIDECHARACTER, SIDECHARACTERPROFILE } from '../constants/routes';
import { useState } from 'react';
import { LOGIN_USER } from '../redux/types';
import { Modal as BootstrapModal } from 'react-bootstrap'
import { updateClientProfile } from '../redux/actions/clientProfileAction';
import { updateSideCharecterProfile } from '../redux/actions/sideCharacterAction';


interface IProps {
    whiteHeader?: boolean;
}

const CommonHeader: React.FC<IProps> = (props) => {

    const { whiteHeader = true } = props;

    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const memberName = useSelector((state: State) => state.auth.userData)
    const percentage = useSelector((state: State) => state.auth)
    const [visible, setVisible] = useState<any>(false);
    const token = Storage.get('token');
    const isLogin = (token != null || token != undefined) ? true : false
    const registrationType = useSelector<any>((state: State) => state.auth.userData?.registration_type)
    const memberid = useSelector((state: State) => state.auth.userData?.member?.id)
    const projectActive = (router.pathname == PROJECT_ID_CREATE || router.pathname == PROJECT || router.pathname == PROJECT_SIDECHARACTER || router.pathname == PROJECT_ID_PROPOSAL.replace("%id%", "[id]") || router.pathname == PROJECT_ID_PROJECTAPPLICATION.replace("%id%", "[id]") || router.pathname == PROJECT_ID_APPLICATION.replace("%id%", "[id]") || router.pathname == PROJECT_ID_EDIT.replace("%id%", "[id]") || router.pathname == PROJECT_ID_APPLY.replace("%id%", "[id]"))

    const searchSideActive = (router.pathname == MEMBER_CLIENT_SEARCH_PROJECT || router.pathname == MEMBER_SEARCH_PROJECT || (router?.query?.id == memberName?.member?.id ? "" : router.pathname == SIDECHARACTERPROFILE.replace("%id%", "[id]")) || router.pathname == PROFILE_REQUEST_CONTACT_INFOMRATION.replace("%id%", "[id]") || router.pathname == SEARCH_SIDECHARACTER || (router?.query?.id == memberName?.member?.id ? "" : router.pathname == CLIENTPROFILEPROFILE.replace("%id%", "[id]")) || router.pathname == PROFILE_REQUEST_INTERVIEW.replace("%id%", "[id]"))
        || router.pathname == REQUEST_ID_RECEIVE.replace("%id%", "[id]") || router.pathname == REQUEST_ID_SENT.replace("%id%", "[id]");

    // Fix Scrolling Issue While For Sidebar Menu
    var isMenuOpen = function (state: any) {
        if (state.isOpen) $('body').addClass('ismenu-open')
        else $('body').removeClass('ismenu-open');
        return state.isOpen;
    };

    // Switch Client To Side Char & Side Char To Client
    const handleSwitch = () => {
        ApiMemberPost(MEMBER_SWITCH_ACCOUNT,
            { registration_type: registrationType }
        ).then(async (response: any) => {
            if (response.data && response.success) {
                dispatch(register_Type_Change(response.data.registration_type))
                dispatch(nike_name_Change(response.data.profile.nick_name))
                dispatch(updateClientProfile(response.data?.profile_info?.client_profile))
                dispatch(updateSideCharecterProfile(response.data?.profile_info?.side_character_profile))
                dispatch(Profile_Picture_Change(response.data?.profile?.profile_picture))
                dispatch(notify_change(response.data?.total_un_read_notifications))
                router.push("/")
            }
        }).catch((error: any) => console.log("Error", error))
    }

    const handleRedirect = () => {
        router.push(getUrl(router.locale, LOGIN))
    }
    const handleOk = () => {
        logout();
        setVisible(false);
    }
    function goToProfilePage() {
        // client-profile
        // side-charac-profile

        // // edit path
        // profile/side-character
        // profile/client
        let url: string;
        if (registrationType == KEYWORDS.MEMBER.SIDE_CHARACTER) {
            if (percentage.sideCharProgress > 0) {
                url = ROUTES.SIDECHARACTERPROFILE.replace('%id%', memberid + "")
            } else {
                url = ROUTES.EDIT_SIDE_CHARACTER_PROFILE
            }
        } else {
            if (percentage.clientProgress > 0) {
                url = ROUTES.CLIENTPROFILEPROFILE.replace('%id%', memberid + "")
            } else {
                url = ROUTES.EDIT_CLIENT_PROFILE
            }
        }
        return router.push(getUrl(router.locale, url));
    }


    function logout() {
        dispatch(memberLogout())
        return router.push(getUrl(router.locale, '/'));
    }

    function goToMyPage() {
        return router.push(getUrl(router.locale, MYPAGE));
    }

    function goToNotification() {
        return router.push(getUrl(router.locale, NOTIFICATION));
    }

    // render sections
    let search = (router.pathname == SEARCH_SIDECHARACTER || router.pathname == SEARCH_CLIENT || router.pathname == SEARCH_PROJECT)

    const __renderDesktopMenu = () => {
        return (<>
            {(isLogin) ?
                <ClientHeader
                    handleSwitch={handleSwitch}
                    whiteHeader={whiteHeader}
                    goToProfilePage={goToProfilePage}
                    logout={logout}
                    goToMyPage={goToMyPage}
                    goToNotification={goToNotification} />
                // <SideCharecterHeader/>
                : <>
                    <div className={`header-common ft-without-login ${whiteHeader ? 'white-header' : ''}`}>
                        <div className="container">
                            <div className="ft-header-wrapper">
                                <div className="header-left">
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
                                                <Dropdown overlay={() => (<Menu className="ft-submenu-main">
                                                    <Menu.Item>
                                                        <Menu.Item >
                                                            <div className="row" onClick={() => router.push(getUrl(router.locale, SEARCH_SIDECHARACTER))}>
                                                                <div className="col-10">
                                                                    <div className="ft-submenu-title">{t('index.dropdown.val1')}</div>
                                                                    <div className="ft-submenu-subtitle">{t('index.dropdown.val2')}</div>
                                                                </div>
                                                                <div className="col-2 rowspan-2 d-flex justify-content-end align-self-center">
                                                                    <Image src={RightOutlinedImg} className="ft-right-arrow" />
                                                                </div>
                                                            </div>
                                                        </Menu.Item>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Menu.Item>
                                                            <div className="row" onClick={() => router.push(getUrl(router.locale, SEARCH_CLIENT))}>
                                                                <div className="col-10">
                                                                    <div className="ft-submenu-title">{t('index.dropdown.val3')}</div>
                                                                    <div className="ft-submenu-subtitle">{t('index.dropdown.val4')}</div>
                                                                </div>
                                                                <div className="col-2 rowspan-2 d-flex justify-content-end align-self-center">
                                                                    <Image src={RightOutlinedImg} className="ft-right-arrow" />
                                                                </div>
                                                            </div>
                                                        </Menu.Item>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Menu.Item>
                                                            <div className="row" onClick={() => router.push(getUrl(router.locale, SEARCH_PROJECT))}>
                                                                <div className="col-10">
                                                                    <div className="ft-submenu-title">{t('index.dropdown.val5')}</div>
                                                                    <div className="ft-submenu-subtitle">{t('index.dropdown.val6')}</div>
                                                                </div>
                                                                <div className="col-2 rowspan-2 d-flex justify-content-end align-self-center">
                                                                    <Image src={RightOutlinedImg} className="ft-right-arrow" />
                                                                </div>
                                                            </div>
                                                        </Menu.Item>
                                                    </Menu.Item>
                                                </Menu>)
                                                }>
                                                    <a className={`${headerstyles.topMenuWhite} nav-link ${search ? "fe-headeractive" : ""}`} > {t('home.search')}
                                                    </a>
                                                </Dropdown>
                                            </li>
                                            <li className="nav-item">
                                                <Dropdown overlay={() => (<Menu className="ft-submenu-main">
                                                    <Menu.Item>
                                                        <Menu.Item>
                                                            <div className="row" onClick={handleRedirect}>
                                                                <div className="col-10">
                                                                    <div className="ft-submenu-title">{t('index.postDropdown.val1')}</div>
                                                                    <div className="ft-submenu-subtitle">{t('index.postDropdown.val2')}</div>
                                                                </div>
                                                                <div className="col-2 rowspan-2 d-flex justify-content-end align-self-center">
                                                                    <Image src={RightOutlinedImg} className="ft-right-arrow" />
                                                                </div>
                                                            </div>
                                                        </Menu.Item>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Menu.Item>
                                                            <div className="row" onClick={handleRedirect}>
                                                                <div className="col-10">
                                                                    <div className="ft-submenu-title">{t('index.postDropdown.val3')}</div>
                                                                    <div className="ft-submenu-subtitle">{t('index.postDropdown.val4')}</div>
                                                                </div>
                                                                <div className="col-2 rowspan-2 d-flex justify-content-end align-self-center">
                                                                    <Image src={RightOutlinedImg} className="ft-right-arrow" />
                                                                </div>
                                                            </div>
                                                        </Menu.Item>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Menu.Item>
                                                            <div className="row" onClick={handleRedirect}>
                                                                <div className="col-10">
                                                                    <div className="ft-submenu-title">{t('index.postDropdown.val5')}</div>
                                                                    <div className="ft-submenu-subtitle">{t('index.postDropdown.val6')}</div>
                                                                </div>
                                                                <div className="col-2 rowspan-2 d-flex justify-content-end align-self-center">
                                                                    <Image src={RightOutlinedImg} className="ft-right-arrow" />
                                                                </div>
                                                            </div>
                                                        </Menu.Item>
                                                    </Menu.Item>
                                                </Menu>)
                                                }>
                                                    <a className={`${headerstyles.topMenuWhite} nav-link`}> {t('common.Post')}</a>
                                                </Dropdown>
                                            </li>
                                            <li className="nav-item">
                                                <a className={`${headerstyles.topMenuWhite} nav-link  ${router.pathname == FORUM_BEFORE_LOGIN ? "fe-headeractive" : ""}`} onClick={() => router.push(getUrl(router.locale, FORUM_BEFORE_LOGIN))}>{t('header.forum')}</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className={`${headerstyles.topMenuWhite} nav-link  ${router.pathname == BCOINGUIDE ? "fe-headeractive" : ""}`} onClick={() => router.push(getUrl(router.locale, BCOINGUIDE))}>{t('header.bCoin')}</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="header-right">
                                    <button className="get-start-btn" type="submit" onClick={() => { router.locale == "en" ? router.push(`${'/en/login'}`) : router.push(`${'/login'}`) }}>{t('home.start')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>)
    }

    const __renderMobileMenu = () => {
        return (<>
            <div id="outerMenuID" className={`mobile-menu ft-mobile-menu ${whiteHeader ? 'white-header' : ''}`}>
                <MenuOutlined />
                <Menu2 onStateChange={isMenuOpen} right pageWrapId={"pageWrap"} outerContainerId={"outerMenuID"} customCrossIcon={<CloseOutlined />}>
                    {isLogin ?
                        <div>
                            <div className="nickname">
                                <span className="label">{t('header.Nickname')}</span>
                                <span className="value">{memberName?.member?.nickname}</span>
                            </div>
                            <div className="name">
                                {isEmpty(memberName.member) ? "" : memberName.member.name} {registrationType == KEYWORDS.MEMBER.CLIENT ? t('header.client') : t('header.SideCharacter')}
                            </div>
                            <div className="menu-top">
                                <div className="link-wrap">
                                    <a onClick={goToProfilePage} >
                                        {t('header.MyProfile')}
                                        <Image src={RightArrow} className="ft-right-arrow" />
                                    </a>
                                </div>
                                <div className="link-wrap">
                                    <a onClick={goToMyPage} >
                                        {t('header.MyPage')}
                                        <Image src={RightArrow} className="ft-right-arrow" />
                                    </a>
                                </div>
                            </div>
                            <div className="menu-bottom">
                                <div className="ft-link-wrap">
                                    <a href="#" className={(searchSideActive) ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"} onClick={() => registrationType == KEYWORDS.MEMBER.SIDE_CHARACTER ? router.push(getUrl(router.locale, MEMBER_CLIENT_SEARCH_PROJECT)) : router.push(getUrl(router.locale, MEMBER_SEARCH_PROJECT))}>{registrationType == KEYWORDS.MEMBER.SIDE_CHARACTER ? t('header.SearchClients') : t('header.searchSideCharacter')}
                                    </a>
                                </div>
                                <div className="ft-link-wrap">
                                    <a onClick={() => registrationType == KEYWORDS.MEMBER.SIDE_CHARACTER ? router.push(getUrl(router.locale, PROJECT_SIDECHARACTER)) : router.push(getUrl(router.locale, PROJECT))} className={(projectActive) ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"}>{t('header.project')}</a>
                                </div>
                                <div className="ft-link-wrap">
                                    <a onClick={() => router.push(getUrl(router.locale, FORUM_AFTER_LOGIN))} className={router.pathname == FORUM_AFTER_LOGIN ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"} >{t('header.forum')}</a>
                                </div>
                                <div className="ft-link-wrap">
                                    <a onClick={() => router.push(getUrl(router.locale, BCOINGUIDE))} className={router.pathname == BCOINGUIDE ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"} >{t('header.bCoin')}</a>
                                </div>
                            </div>
                            <div className="switch-profile">
                                <a href="#" onClick={handleSwitch}>
                                    <img src={syncBlue.src} />
                                    <span>{registrationType == KEYWORDS.MEMBER.CLIENT ? t('header.switchSideCharac') : t('header.Switch_to_client')}</span>
                                </a>
                            </div>
                            <div className="logout">
                                <a onClick={() => setVisible(true)} className="ft-menu-link" >{t('header.LogOut')}</a>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="top-title">{t("header.Hello!")}</div>
                            <ul className="menu-link-drop">
                                <li className="nav-item">
                                    <div className="ft-link-wrap"><a onClick={() => router.push(getUrl(router.locale, SEARCH_SIDECHARACTER))} className={router.pathname == SEARCH_SIDECHARACTER ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"}>{t('index.dropdown.val1')}</a></div>
                                    <div className="ft-link-wrap"><a onClick={() => router.push(getUrl(router.locale, SEARCH_CLIENT))} className={router.pathname == SEARCH_CLIENT ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"}>{t("header.SearchClients")}</a></div>
                                    <div className="ft-link-wrap"><a onClick={() => router.push(getUrl(router.locale, SEARCH_PROJECT))} className={router.pathname == SEARCH_PROJECT ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"}>{t("header.SearchProjects")}</a></div>
                                </li>
                                <li className="nav-item">
                                    <div className="ft-link-wrap"><a onClick={handleRedirect} className="ft-menu-link">{t("header.PostasSideCharacter")}</a></div>
                                    <div className="ft-link-wrap"><a onClick={handleRedirect} className="ft-menu-link">{t("header.PostasClient")}</a></div>
                                    <div className="ft-link-wrap"><a onClick={handleRedirect} className="ft-menu-link">{t("header.PostaProject")}</a></div>
                                </li>
                                <li className="nav-item">
                                    <div className="ft-link-wrap"><a onClick={() => router.push(getUrl(router.locale, FORUM_BEFORE_LOGIN))} className={router.pathname == FORUM_BEFORE_LOGIN ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"}>{t("header.forum")}</a></div>
                                    <div className="ft-link-wrap"><a onClick={() => router.push(getUrl(router.locale, BCOINGUIDE))} className={router.pathname == BCOINGUIDE ? "ft-menu-link fe-mobileheaderactive" : "ft-menu-link"}>{t("header.bCoin")}</a></div>
                                </li>
                            </ul>
                            <div className="register">
                                <div className="ft-link-wrap"><a onClick={() => router.push(getUrl(router.locale, LOGIN))} className="ft-menu-link">{t("header.Register")}</a></div>
                            </div>
                        </div>
                    }
                </Menu2>
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
        </>)
    }

    return (
        <div className={`ft-header-main`}>
            <nav className="navbar">
                {__renderDesktopMenu()}
                {__renderMobileMenu()}
            </nav>
        </div>
    )
}

export default CommonHeader;