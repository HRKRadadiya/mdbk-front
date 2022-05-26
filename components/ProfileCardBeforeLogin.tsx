import React from 'react';
import { Button } from 'antd'
import Image from 'next/image'
import DR from '../public/downRectangle.svg'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { getUrl, humanizeDate, isEmpty } from '../utils/helper';
import _ from 'lodash';
import { useRef } from 'react';
import { useEffect } from 'react';
import { LOGIN } from '../constants/routes';
import { useState } from 'react';


function ProfileCardBeforeLogin({ profile, lastCardElementRef, member }: any) {
    const router = useRouter()
    const { t } = useTranslation();
    const val = router.query && router.query.cmpny
    const professionOptions: any = [];
    professionOptions[t('common.Development')] = 'development';
    professionOptions[t('common.Design')] = 'design';
    professionOptions[t('common.Marketing')] = 'marketing';
    professionOptions[t('common.Other')] = 'other';
    const [seeMoreExp, setSeeMoreExp] = useState(false)

    const handleSeeMore = () => {
        console.log("Error");
        setSeeMoreExp(!seeMoreExp)
    }

    function getProfession(profession: any) {
        let _professionOptions: any = _.invert(professionOptions);
        return profession.map((key: string, value: number) => _professionOptions[key]);
    }

    const totalInDate = (date: any) => {
        if (date < 12) {
            return `${Math.floor(date)} ${t('workExperienceDate.newMonths')}`
        } else {
            let expInYears = Math.floor(date / 12);
            let expMonths = expInYears * 12;
            let remainingMonths = date - expMonths;

            let yearsStr = `${t('workExperienceDate.newYear')}`;
            let monthStr = `${t('workExperienceDate.newMonths')}`;
            if (expInYears > 1) {
                yearsStr = `${t('workExperienceDate.newYear')}`
            }
            if (remainingMonths > 1) {
                monthStr = `${t('workExperienceDate.newMonths')}`
            }
            if (remainingMonths > 0) {
                return `${Math.floor(expInYears)} ${yearsStr} ${Math.floor(remainingMonths)} ${monthStr}`
            } else {
                return `${Math.floor(expInYears)} ${yearsStr}`
            }
        }
    }
    function monthDiff(dateFrom: any, dateTo: any) {
        return dateTo.getMonth() - dateFrom.getMonth() +
            (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    }

    const fetchDetail = () => {
        const details = [
            {
                label: t("featureSearch.Profession"),
                value: getProfession(profile.profession).join(', '),
            },
            {
                label: t("featureSearch.Field"),
                value: profile.fields
            },
            {
                label: t("featureSearch.Location"),
                value: profile.locations.join(', ')
            },
        ];

        if (!isEmpty(profile.desired_date)) {
            details.push({
                label: t("featureSearch.DesiredDate"),
                value: t("dynamic.desired_date." + profile.desired_date)
            })
        }
        if (!isEmpty(profile.desired_time)) {
            details.push({
                label: t("featureSearch.DesiredTime"),
                value: t("dynamic.desired_time." + profile.desired_time)
            })
        }
        if (!isEmpty(profile.desired_project_type)) {
            details.push({
                label: t("featureSearch.DesiredType"),
                value: t("dynamic.desired_project_type." + profile.desired_project_type)
            })
        }
        if (!isEmpty(profile.insurance_status)) {
            details.push({
                label: t("featureSearch.Insurance"),
                value: t("dynamic.insurance_status." + profile.insurance_status)
            })
        }
        if (!isEmpty(profile.desired_work_type)) {
            details.push({
                label: t("featureSearch.WorkType"),
                value: t("dynamic.desired_work_type." + profile.desired_work_type)
            })
        }
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
                            {profile.nick_name} {member == 2 ? null : (profile.company == null ? null : <Button className="fe-company-btn">{t('featureSearch.Company')}</Button>)}
                        </div>
                        <div className="last-seen at-seeDetail-btn">{humanizeDate(new Date(profile.created_at), t)}</div>
                    </div>
                    <div className="right">
                        <Button className="ft-border-rounded-btn at-seeDetail-btn" onClick={handleRedirect}> {t('search.detail')}</Button>
                    </div>
                </div>
                <div className="tag-line">{profile.introduction}</div>
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
            {member == 2 ?
                (<div className={seeMoreExp ? "section section3 see-more" : "section section3"}>
                    <div className="left">
                        <div className="ft-footer-title">
                            {t('featureSearch.WorkExperience')}
                        </div>
                        <div className="ft-footer-value at-ft-exp">
                            {!isEmpty(profile?.experiences) ?
                                (seeMoreExp ?
                                    profile?.experiences.map((exp: any) => (
                                        <div className="exp">
                                            {`${exp.company_name}/${exp.position}/${totalInDate(monthDiff(new Date(moment(exp.employment_start_date).format("YYYY,MM")), new Date(moment(exp.employment_end_date).format("YYYY,MM"))))}`
                                            }
                                        </div>
                                    )) :
                                    <div className="exp">
                                        {`${profile.experiences[0].company_name}/${profile.experiences[0].position}/${totalInDate(monthDiff(new Date(moment(profile.experiences[0].employment_start_date).format("YYYY,MM")), new Date(moment(profile.experiences[0].employment_end_date).format("YYYY,MM"))))}`
                                        }
                                    </div>
                                )
                                : <div className="exp">
                                    {t('sideCharacterProfile.workExp.unExp')}
                                </div>

                            }
                        </div>
                    </div>
                    <div className="right at-see-more">
                        {(profile?.experiences?.length == 1 || profile?.experiences?.length == 0) ? null : <a onClick={handleSeeMore} className="ft-see-more-btn">
                            <span>{t('featureSearch.Seemore')}</span>
                            <Image src={DR} alt="Down Icon" className="icon" />
                        </a>
                        }
                    </div>
                </div>)
                :
                (!isEmpty(profile?.project) ? <div className={seeMoreExp ? "section section3 see-more" : "section section3"}>
                    <div className="left">
                        <div className="ft-footer-title">
                            {t('featureSearch.Project')}
                        </div>
                        <div className="ft-footer-value at-ft-exp">
                            {!isEmpty(profile?.project) &&
                                (seeMoreExp ?
                                    profile?.project.map((projectlist: any) => (
                                        <div className="exp">
                                            {projectlist?.field}
                                        </div>
                                    )) :
                                    <div className="exp">
                                        {profile?.project[0]?.field}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="right at-see-more">
                        {(profile?.project?.length == 1 || profile?.project?.length == 0) ? null : <a onClick={handleSeeMore} className="ft-see-more-btn">
                            <span>{t('featureSearch.Seemore')}</span>
                            <Image src={DR} alt="Down Icon" className="icon" />
                        </a>
                        }
                    </div>
                </div> : null)
            }
        </div>
    )
}

export default ProfileCardBeforeLogin