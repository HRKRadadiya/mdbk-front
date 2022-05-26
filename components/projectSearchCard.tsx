import React from 'react';
import { Button } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { getUrl, humanizeDate, isEmpty, numberWithCommas } from '../utils/helper';
import _ from 'lodash';
import { LOGIN } from '../constants/routes';


function ProjectSearchCardBeforeLogin({ profile, lastCardElementRef, member }: any) {
    const router = useRouter()
    const { t } = useTranslation();
    const val = router.query && router.query.cmpny
    const professionOptions: any = [];
    professionOptions[t('common.Development')] = 'development';
    professionOptions[t('common.Design')] = 'design';
    professionOptions[t('common.Marketing')] = 'marketing';
    professionOptions[t('common.Other')] = 'other';

    const fetchDetail = () => {
        const details = [
            {
                label: t("featureSearch.Location"),
                value: profile.location
            },
            {
                label: t("featureSearch.PlanningStage"),
                value: t("dynamic." + profile.current_planning_stage)
            },
            {
                label: t("featureSearch.Budget"),
                value: profile.suggested_amount == "0" ? t("projectCreation.Negotiable") : numberWithCommas(profile.suggested_amount)
            },
            {
                label: t("featureSearch.Schedule"),
                value: `${moment(profile?.schedule_direct_start_date).format('YYYY.MM.DD')} - ${moment(profile?.schedule_direct_end_date).format('YYYY.MM.DD')}`
            },
        ];
        return details;
    }

    const handleRedirect = () => {
        router.push(getUrl(router.locale, LOGIN))
    }


    return (
        <div className="ft-search-card" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            <div className="section section1">
                <div className="top">
                    <div className="left">
                        <div className="title">
                            {profile?.client_profile?.nick_name}
                        </div>
                        <div className="last-seen at-seeDetail-btn">{humanizeDate(new Date(profile.created_at), t)}</div>
                    </div>
                    <div className="right">
                        <Button className="ft-border-rounded-btn at-seeDetail-btn" onClick={handleRedirect}> {t('search.detail')}</Button>
                    </div>
                </div>
                <div className="tag-line at-word-fixed">{profile?.work_related_details}</div>
            </div>
            <div className="section section2">
                <div className="ft-tag-lists-outer">
                    {fetchDetail().map((detail: any, i: number) => {
                        return (
                            <Button key={i} className="ft-tag-lists">
                                <span className="ft-lbl">{detail.label}</span>
                                <span className="ft-val">{detail.value}</span>
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ProjectSearchCardBeforeLogin