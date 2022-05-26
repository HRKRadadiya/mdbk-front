/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import headerstyles from '../styles/components/Header.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { Menu, Dropdown } from 'antd';
import { RightOutlined, } from '@ant-design/icons';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import blueLogo from '../public/header.svg'
import sliderImg from '../public/home-slider.png'
import syncBlue from '../public/sync-blue.svg'
import Router from 'next/router'
import { slide as Menu2 } from 'react-burger-menu'
import { CloseOutlined } from '@ant-design/icons'
import { MenuOutlined } from '@ant-design/icons'
import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import MainLayout from '../components/MainLayout';
import Splash from '../components/Splash';
import { useState, useEffect } from 'react';
import ClientHeader from '../components/ClientHeader';
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import { ApiMemberPost } from '../service/api';
import { API_VERSION, BASE_URL, MEMBER_IS_VALID_TOKEN, MEMBER_SWITCH_ACCOUNT } from '../constants/api';
import { memberLogout, register_Type_Change } from '../redux/actions/memberAction';
import { AppLayout } from '../components';
import { KEYWORDS, ROUTES } from '../constants';
import { getUrl } from '../utils/helper';
import { TOKEN } from '../constants/storagekey';
import Storage from '../service/storage';
import { CLIENTPROFILEPROFILE, FORUM_AFTER_LOGIN, MEMBER_CLIENT_SEARCH_PROJECT, MEMBER_SEARCH_PROJECT, PROJECT, PROJECT_SIDECHARACTER, SIDECHARACTERPROFILE } from '../constants/routes';
import axios from 'axios';

const Home: NextPage = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const token = Storage.get(TOKEN)
	const userData = useSelector((state: State) => state.auth.userData)
	const dispatch = useDispatch()
	const [validToken, setValidToken] = useState(false)

	useEffect(() => {
		let tempToken = Storage.get(TOKEN);
		if (tempToken == null || tempToken == undefined) {
			setValidToken(true)
		} else {
			isValidToken()
		}
	}, [])

	const isValidToken = async () => {
		await axios.post(BASE_URL + API_VERSION + MEMBER_IS_VALID_TOKEN, {}, {
			headers: {
				Authorization: token,
				'Content-Type': "application/json",
			}
		})
			.then((response: any) => {
				setValidToken(true);
			})
			.catch(error => {
				console.log("error", error)
				if (error?.response?.status === 401) {
					dispatch(memberLogout())
					router.push(getUrl(router.locale, '/'));
				} else {
					setValidToken(true);
				}
			})
	}

	return (
		<>
			{validToken &&
				<AppLayout title={t('home.search')} whiteHeader={false} footerType={KEYWORDS.APP_FOOTER_TYPE.full}>
					<div id="">
						<section className="ft-main-slider">
							<img src={sliderImg.src} alt="" className="slider-img"></img>
							<div className="slider-content hm-slider-content">
								<h1 className={`${styles.fontStyle} ${styles.heading} ft-slider-head`}>
									<img src="/h1.svg" />
								</h1>
								<h3 className={`${styles.fontStyle} ${styles.subHeading} ft-slider-subhead`}>
									<img src="/h2.svg" />
								</h3>
								<h3 className={`${styles.subContent} ft-slider-staff`}>{t('home.staff')}</h3>
							</div>
						</section>
					</div>
					<div className={`ft-home-content top`}>
						<div className={`ft-content-outer`}>
							<div className="content-inner">
								<div className="desc-main">
									<p className={`${styles.search} ft-title`}>
										{t('home.first.para4')}
									</p>
									<p className={`${styles.para} ft-desc`}>
										<div className="at-para-sub">{t('home.first.para1')}</div>
										<div>{t('home.first.para1a')}</div>
									</p>
									<p className={`${styles.paraTwo} ft-subdesc`}>
										<div>{t('home.first.para2')}</div>
										<div>{t('home.first.para2a')}</div>
									</p>
									<p className={`${styles.paraThree} ft-content-btn at-cursor-tab`} onClick={() => (token == null || token == undefined) ? router.push(getUrl(router.locale, ROUTES.SEARCH_SIDECHARACTER)) : (userData.registration_type == KEYWORDS.MEMBER.SIDE_CHARACTER ? router.push(getUrl(router.locale, MEMBER_CLIENT_SEARCH_PROJECT)) : router.push(getUrl(router.locale, MEMBER_SEARCH_PROJECT)))}>
										{(token == null || token == undefined) ? t('home.search') : (userData.registration_type == KEYWORDS.MEMBER.SIDE_CHARACTER ? t('header.SearchClients') : t('header.searchSideCharacter'))} &gt;
									</p>
								</div>
								<div className="icon-wrap right">
									<div className="ft-desk-element">
										<img src="/Group1-desk.svg" />
									</div>
									<div className="ft-mb-element">
										<img src="/Group1-mobile.svg" />
									</div>
								</div>
							</div>
						</div>

						<div className={`ft-content-outer`}>
							<div className="content-inner">
								<div className="icon-wrap left">
									<div className="ft-desk-element">
										<img src="/Group2-desk.svg" />
									</div>
									<div className="ft-mb-element">
										<img src="/Group2-mobile.svg" />
									</div>
								</div>
								<div className="desc-main">
									<p className={`${styles.talk} ft-title at-color-talk`}> {t('home.second.para4')}</p>
									<p className={`${styles.paraEnd} ft-desc`}>
										<div className="at-para-sub">{t('home.second.para1')}</div>
										<div>{t('home.second.para1a')}</div>
									</p>
									<p className={`${styles.paraTwoEnd} ft-subdesc`}>
										<div>{t('home.second.para2')}</div>
										<div>{t('home.second.para2a')}</div>
									</p>
									<p className={`${styles.paraThreeEnd} ft-content-btn at-cursor-tab`} onClick={() => (token == null || token == undefined) ? router.push(getUrl(router.locale, ROUTES.FORUM_BEFORE_LOGIN)) : router.push(getUrl(router.locale, FORUM_AFTER_LOGIN))}>
										{t('common.GotoForum')} &gt;
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className={`ft-home-content bottom`} >
						<div className={`ft-content-outer`}>
							<div className="content-inner">
								<div className="desc-main">
									<p className={`${styles.profile} ft-title`}>
										{t('home.third.para1')}
									</p>
									<p className={`${styles.para} ft-desc`}>
										<div className="at-para-sub">{t('home.third.para2')}</div>
										<div>{t('home.third.para2a')}</div>
									</p>
									<p className={`${styles.paraThree} ft-subdesc at-font-style-fixed`}>
										<div>{t('home.third.para3')}</div>
										<div>{t('home.third.para3a')}</div>
									</p>
									<p className={`${styles.paraThree} ft-content-btn at-cursor-tab`} onClick={() => (token == null || token == undefined) ? router.push(getUrl(router.locale, ROUTES.LOGIN)) : (userData.registration_type == KEYWORDS.MEMBER.CLIENT ? router.push(getUrl(router.locale, CLIENTPROFILEPROFILE.replace("%id%", userData.member.id + ""))) : router.push(getUrl(router.locale, SIDECHARACTERPROFILE.replace("%id%", userData.member.id + ""))))}>
										{t('common.Makeprofile')} &gt;
									</p>
								</div>
								<div className="icon-wrap right">
									<div className="ft-desk-element">
										<img src="/Group4-desk.svg" />
									</div>
									<div className="ft-mb-element">
										<img src="/Group4-mobile.svg" />
									</div>
								</div>
							</div>
						</div>

						<div className={`ft-content-outer`}>
							<div className="content-inner">
								<div className="icon-wrap left">
									<div className="ft-desk-element">
										<img src="/Group5-desk.svg" />
									</div>
									<div className="ft-mb-element">
										<img src="/Group5-mobile.svg" />
									</div>
								</div>
								<div className="desc-main">
									<p className={`${styles.talk} ft-title`}> {t('home.forth.para1')}</p>
									<p className={`${styles.paraEnd} ft-desc`}>
										<div className="at-para-sub">{t('home.forth.para2')}</div>
										<div>{t('home.forth.para2a')}</div>
									</p>
									<p className={`${styles.paraTwoEnd} ft-subdesc`}>
										<div>{t('home.forth.para3')}</div>
										<div>{t('home.forth.para3a')}</div>
									</p>
									<p className={`${styles.paraThreeEnd} ft-content-btn at-cursor-tab`} onClick={() => (token == null || token == undefined) ? router.push(getUrl(router.locale, ROUTES.LOGIN)) : (userData.registration_type == KEYWORDS.MEMBER.SIDE_CHARACTER ? router.push(getUrl(router.locale, PROJECT_SIDECHARACTER)) : router.push(getUrl(router.locale, PROJECT)))}>
										{(token == null || token == undefined) ? t('common.Postproject') : (userData.registration_type == KEYWORDS.MEMBER.SIDE_CHARACTER ? t('common.Findproject') : t('common.Postproject'))}&gt;
									</p>
								</div>
							</div>
						</div>
					</div>
				</AppLayout>
			}
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common']))
	}
});


export default Home