import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import coin from '../public/coin.png'
import { GetServerSideProps } from 'next'

import Image from 'next/image'
import { RightOutlined } from '@ant-design/icons'
import { AppLayout } from '../components';
import { ApiMemberGet, ApiMemberPost, ApiMemberPut } from '../service/api';
import { MEMBER_CHANGE_NOTIFICATION_SETTING, MEMBER_MY_PROFILE } from '../constants/api';
import router from 'next/router';
import { getUrl, numberWithCommas } from '../utils/helper';
import { ROUTES } from '../constants';
import { useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import { isEmpty } from '../utils/helper'


function MyPage() {
    const { t } = useTranslation();
    const [memberProfileData, setMemberProfileData] = useState<any>()
    const registration_type = useSelector((state: State) => state.auth.userData.registration_type)
    const [isNotification, setIsNotification] = useState<boolean>()
    const currentLanguage: any = router.locale;
    const [languageSetting, setLanguageSetting] = useState<string | undefined>(currentLanguage)
    const getData = async () => {
        await ApiMemberGet(MEMBER_MY_PROFILE, { registration_type })
            .then((response: any) => {
                if (response.data && response.success) {
                    setMemberProfileData(response.data.member)
                    setIsNotification(response.data.member.is_notification)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    const handleLanguageSetting = () => {
        let changeLanguage = currentLanguage == "kr" ? "en" : "kr"
        console.log(window.location.href.replace(currentLanguage, changeLanguage));
        window.location.href = window.location.href.replace(currentLanguage, changeLanguage);
    }

    useEffect(() => {
        getData()
    }, [setMemberProfileData])


    const handleSwitch = async (checked: any) => {
        setIsNotification(!isNotification)
        await ApiMemberPost(MEMBER_CHANGE_NOTIFICATION_SETTING, { status: checked.target.checked })
            .then((response: any) => {
                if (response.data && response.success) {
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
                setIsNotification(!isNotification)
            })
    }

    return (
        <AppLayout title={t('myPages.title')} whiteHeader={true}>
            {memberProfileData && <div className="my-page jumbotron fe-page-outer ft-my-page">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <div className="ft-custom-contain">
                            <h1 className='ft-heading'>
                                {t('myPages.title')}
                            </h1>
                            <div className="ft-profile-wrap">
                                <div className="ft-pro-sec1">
                                    <img className="ft-profile-img" src={memberProfileData.profile_picture != null ? memberProfileData.profile_picture : "/grayuser.svg"} alt="User Image" />
                                    <div className="ft-profile-detail">
                                        <div className="left">
                                            <div className="top">
                                                <span className="ft-name">{memberProfileData.name}</span>
                                                {!isEmpty(memberProfileData.nick_name) ?
                                                    <>
                                                        <span className="ft-nickname">{t('memberProfile.Nickname')}</span>
                                                        <span className="at-ft-nickname">{memberProfileData.nick_name}</span>
                                                    </>
                                                    : null}
                                            </div>
                                            <div className="ft-email">
                                                {memberProfileData.email}
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div> <RightOutlined onClick={() => router.push(getUrl(router.locale, ROUTES.INFOMATIONSETTING))} className="ft-right-angle" /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ft-pages-detail">
                                    <div className="ft-page" style={{ cursor: "pointer" }} onClick={() => router.push(getUrl(router.locale, ROUTES.BCOINGUIDE))}>
                                        <div className="title">{t('myPages.bCoinstore')}</div>
                                        <div className="right"> <RightOutlined className="ft-right-angle" /></div>
                                    </div>
                                </div>
                                <div className="ft-pages-detail">
                                    <div className="ft-page" style={{ cursor: "pointer" }} onClick={() => router.push(getUrl(router.locale, ROUTES.PURCHASEHISTORY))}>
                                        <div className="title">{t('myPages.purchasehistory')}</div>
                                        <div className="right">
                                            <Button className={`ft-coins-btn`}>
                                                <Image src={coin} alt="User Image" />{numberWithCommas(memberProfileData?.available_coin || 0)} {t('myPages.button')}</Button>
                                            <div><RightOutlined className="ft-right-angle" /></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ft-pages-detail">
                                    <div className="ft-page">
                                        <div className="title">{t('myPages.notificationSetting')}</div>
                                        <div className="right">
                                            <label className="ft-switch" htmlFor="checkbox">
                                                <input type="checkbox" id="checkbox" checked={isNotification} onChange={handleSwitch} />
                                                <div className="ft-slider ft-round"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="ft-pages-detail">
                                    <div className="ft-page">
                                        <div className="title">{t('myPages.languageSetting')}</div>
                                        <div className="right">
                                            <Button className={`ft-lang-btn`} onClick={handleLanguageSetting}>{languageSetting == "en" ? t('myPages.english') : t('myPages.korean')}</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            }
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default MyPage