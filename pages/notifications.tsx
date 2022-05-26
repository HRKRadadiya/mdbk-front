import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import coin from '../public/coin.png'
import { GetServerSideProps } from 'next'

import Image from 'next/image'
import { RightOutlined } from '@ant-design/icons'
import { AppLayout } from '../components';
import { ApiMemberGet, ApiMemberPost } from '../service/api';
import { MEMBER_CHANGE_NOTIFICATION_SETTING, MEMBER_MY_PROFILE, MEMBER_NOTIFICATIONS } from '../constants/api';
import router from 'next/router';
import { getUrl, isEmpty } from '../utils/helper';
import { ROUTES } from '../constants';
import { AnyIfEmpty, useDispatch, useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import useAllNotification from '../hooks/useAllNotification'
import moment from 'moment';
import { notify_change } from '../redux/actions/memberAction';
import { FORUM_AFTER_LOGIN, PROJECT_ID_PROJECTAPPLICATION, PROJECT_SIDECHARACTER, REQUEST_ID_RECEIVE, REQUEST_ID_SENT } from '../constants/routes';

function NotificationPage() {
    const { t } = useTranslation();
    const authUser = useSelector((state: State) => state.auth.userData)
    const userData = useSelector((state: State) => state.auth.userData)
    const [searchFilter, setSearchFilter] = useState({
        page: 1,
        registration_type: userData?.registration_type
    })
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(notify_change(0))
    }, [])

    const { loading, error, getAllNotify, hasMore } = useAllNotification(searchFilter)

    const handleRedirect = (type: string, meta: any) => {
        if (type == "received_interview_request" || type == "received_contact_information_request") {
            router.push(getUrl(router.locale, REQUEST_ID_RECEIVE.replace("%id%", meta?.request_id + "")))
        } else if (type == "user_applied_for_project") {
            router.push(getUrl(router.locale, PROJECT_ID_PROJECTAPPLICATION.replace("%id%", meta?.project_application_id + "")))
        } else if (type == "user_answered_on_your_forum_question" || type == "user_commented_on_your_forum_answered") {
            router.push(getUrl(router.locale, `${FORUM_AFTER_LOGIN}?rId=${meta?.answer_id}`))
        } else if (type == "contact_information_request_accepted" || type == "contact_information_request_rejected" || type == "interview_request_accepted" || type == "interview_request_rejected") {
            router.push(getUrl(router.locale, REQUEST_ID_SENT.replace("%id%", meta?.request_id + "")))
        } else if (type == "your_project_application_accepted") {
            router.push(getUrl(router.locale, `${PROJECT_SIDECHARACTER}?tab=send`))
        }
    }

    return (
        <AppLayout title={t('common.notifications')} whiteHeader={true}>
            <div className="my-page jumbotron fe-page-outer ft-notification-page">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <div className="ft-custom-contain">
                            <h1 className='ft-heading'>
                                {t('common.notifications')}
                            </h1>
                            <div className="ft-notification-wrap">
                                <div className="ft-pro-sec1 notification-list">
                                    {getAllNotify &&
                                        getAllNotify.length == 0 ?
                                        <div className={`notification-item`}>
                                            <div className="msg ">{t('notification.nonotify')}</div>
                                            <div className="right-element"></div>
                                        </div>
                                        :
                                        getAllNotify.map((notification: any, index: number) => (
                                            <div key={"notification" + index} className={`notification-item ${notification?.is_read == "yes" ? "" : "new"}`} onClick={() => handleRedirect(notification?.notification_type, JSON.parse(notification?.meta))}>
                                                <div className="msg at-msg-pointer">{t('notification.' + notification?.notification_type)}</div>
                                                <div className="right-element">{moment(notification.createdAt).format("YYYY.MM.DD")}</div>
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default NotificationPage