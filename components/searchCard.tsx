/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Button } from 'antd';
import Image from 'next/image'
import DR from '../public/downRectangle.svg'
import { useTranslation } from 'react-i18next';
import { getUrl, humanizeDate, isEmpty } from '../utils/helper';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { ApiMemberPost } from '../service/api';
import { MEMBER_LIKE_UNLIKE } from '../constants/api';
import { LIKE_TYPE_CLIENT, LIKE_TYPE_SIDE_CHARACTER } from '../constants/keywords';
import { ROUTES } from '../constants';
import router from 'next/router';
import { useEffect } from 'react';
import { State } from '../redux/reducers/rootReducer';
import { useSelector } from 'react-redux';

function SearchCard({ profile, lastCardElementRef, recieveFilter, setRecieveFilter, sentFilter, setSentFilter, member, setLikeFilter, likeFilter, setSearchFilter, searchFilter }: any) {
    const labels = ['직종', '분야', '지역', '희망일자', '희망시간', '희망형태',
        '대보험', '근무형태']
    const val = ['개발', 'IT/웹개발/웹서비스기획', '서울시 마포구, 서울시 양천구', '주중/주말', '저녁', '단기 프로젝트', '필요', '상주']
    const { t } = useTranslation();
    const [isLike, setIsLike] = useState(profile.like_flag)
    const professionOptions: any = [];
    professionOptions[t('featureSearch.All')] = 'all';
    professionOptions[t('common.Development')] = 'development';
    professionOptions[t('common.Design')] = 'design';
    professionOptions[t('common.Marketing')] = 'marketing';
    professionOptions[t('common.Other')] = 'other';
    const userData = useSelector((state: State) => state.auth.userData)

    const [seeMoreExp, setSeeMoreExp] = useState(false)

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

    let total: any = 0
    !isEmpty(profile?.experiences) ? profile?.experiences.map((exp: any) => {
        let empStartDate = (exp.employment_end_date == null || exp.employment_end_date == undefined) ? new Date() : exp.employment_end_date;
        let empEndDate = exp.employment_start_date;
        total += monthDiff(new Date(moment(empEndDate).format("YYYY,MM")), new Date(moment(empStartDate).format("YYYY,MM")));
    }) : null

    const fetchDetail = () => {
        const details = [
            {
                label: t("featureSearch.Profession"),
                value: getProfession(profile.profession).join(", ")
            },
            {
                label: t("featureSearch.Field"),
                value: profile.fields
            },
            {
                label: t("featureSearch.Location"),
                value: profile.locations.join(", ")
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

    const handleLike = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: number) => {
        let data: any;
        {
            member == 2 ?
                data = {
                    like_type: LIKE_TYPE_SIDE_CHARACTER,
                    source_id: id
                }
                :
                data = {
                    like_type: LIKE_TYPE_CLIENT,
                    source_id: id
                }
        }
        await ApiMemberPost(MEMBER_LIKE_UNLIKE, data).then(async (response: any) => {
            if (response.data && response.success) {
                setIsLike(!isLike)
                // setLikeFilter({
                //     ...likeFilter,
                //     page: 1,
                //     profile: data.like_type,
                //     is_refresh: !likeFilter.is_refresh
                // })
                // setSearchFilter({
                //     ...searchFilter,
                //     page: 1,
                //     is_refresh: !searchFilter.is_refresh
                // })
                // setRecieveFilter({
                //     ...recieveFilter,
                //     page: 1
                // })
                // setSentFilter({
                //     ...sentFilter,
                //     page: 1
                // })
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    const handleSeeMore = () => {
        setSeeMoreExp(!seeMoreExp)
    }



    return (
        <div className="ft-search-card-wrapper sc-al" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            {profile && <div className="ft-search-card">
                <div className="section section1">
                    <div className="top">
                        <div className="left">
                            <div className="profile-img at-profile-img">
                                {isEmpty(profile.profile_picture) ? <img src="/grayuser.svg" /> : <img src={profile.profile_picture} />}
                            </div>
                            <div className="title-wrap">
                                <div className="title">
                                    <div className="long-content">
                                        <span className="nickname">{profile.nick_name}</span>

                                        {member == 2 ? <span className="exp"> {isEmpty(profile?.experiences) ? t('sideCharacterProfile.workExp.unExp') : totalInDate(total)}</span> : (profile.is_company == "no" ? null : <Button className="company">{t('featureSearch.Company')}</Button>)}
                                    </div>
                                    {isLike ? <img src="/heart.svg" className="heart-icon at-content" onClick={(e) => handleLike(e, profile.id)} /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, profile.id)} className="heart-icon at-content" />}


                                </div>
                                <div className="al-last-seen">{humanizeDate(new Date(profile.created_at), t)}</div>
                            </div>
                        </div>
                        <div className="right">
                            <Button className="ft-border-rounded-btn1" onClick={() => {
                                {
                                    member == 2 ? router.push(getUrl(router.locale, ROUTES.SIDECHARACTERPROFILE.replace('%id%', profile.member_id + "")))
                                        : router.push(getUrl(router.locale, ROUTES.CLIENTPROFILEPROFILE.replace('%id%', profile.member_id + "")))
                                }
                            }}> {t('featureSearch.SeeDetails')}</Button>
                            <Button disabled={profile.is_already_requested} onClick={() => userData?.registration_type == 1 ? router.push(getUrl(router.locale, ROUTES.PROFILE_REQUEST_CONTACT_INFOMRATION.replace('%id%', profile.id + "")))
                                : router.push(getUrl(router.locale, ROUTES.PROFILE_REQUEST_INTERVIEW.replace('%id%', profile.id + "")))} className={`ft-default-rounded-btn1 ${profile.is_already_requested ? "disable" : ""} ml-10`}>{userData?.registration_type == 1 ? t('featureSearch.RequestContactInformation') : t('featureSearch.RequestInterview')}</Button>
                        </div>
                    </div>
                    <div className="al-tag-line at-word-fixed">
                        {profile.introduction}
                    </div>
                </div>
                <div className="section section2">
                    <div className="ft-tag-lists-outer hm-tag-lists-outer">
                        {fetchDetail().map((detail: any, i: number) =>
                            <Button key={i} className="ft-al-tag-lists">
                                <span className="ft-lbl">{detail.label}</span>
                                <span className="ft-val">{detail.value}</span>
                            </Button>)}
                    </div>
                </div>

                {member == 2 ?
                    (((profile.is_experienced == "yes" && !isEmpty(profile?.experiences)) && !isEmpty(profile?.experiences)) ?
                        <div className={seeMoreExp ? "section section3 see-more" : "section section3"}>
                            <div className="left">
                                <div className="ft-al-footer-title">
                                    {t('featureSearch.WorkExperience')}
                                </div>
                                <div className="ft-al-footer-value at-footer-title">
                                    {!isEmpty(profile?.experiences) &&
                                        (seeMoreExp ?
                                            profile?.experiences.map((exp: any) => (
                                                <div className="exp">
                                                    {`${exp.company_name}/${exp.position}/${totalInDate(monthDiff(new Date(moment(exp.employment_start_date).format("YYYY,MM")), (new Date((exp.employment_end_date == null || exp.employment_end_date == undefined) ? new Date() : new Date(moment(exp.employment_end_date).format("YYYY,MM"))))))}`
                                                    }
                                                </div>
                                            )) :
                                            <div className="exp">
                                                {`${profile?.experiences[0]?.company_name}/${profile?.experiences[0]?.position}/${totalInDate(monthDiff(new Date(moment(profile?.experiences[0]?.employment_start_date).format("YYYY,MM")), ((profile?.experiences[0]?.employment_end_date == null || profile?.experiences[0]?.employment_end_date == undefined) ? new Date() : new Date(moment(profile?.experiences[0]?.employment_end_date).format("YYYY,MM")))))}`
                                                }
                                            </div>
                                        )
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
                        </div> : null) :
                    !isEmpty(profile?.project) ? (<div className={seeMoreExp ? "section section3 see-more" : "section section3"}>
                        <div className="left">
                            <div className="ft-al-footer-title">
                                {t('featureSearch.Project')}
                            </div>
                            <div className="ft-al-footer-value at-footer-title">
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
                                {/* <div className="exp">
                                    {!isEmpty(profile?.project) && profile?.project?.field}
                                </div> */}
                            </div>
                        </div>
                        <div className="right  at-see-more">
                            {(profile?.project?.length == 1 || profile?.project?.length == 0) ? null : <a onClick={handleSeeMore} className="ft-see-more-btn">
                                <span>{t('featureSearch.Seemore')}</span>
                                <Image src={DR} alt="Down Icon" className="icon" />
                            </a>
                            }
                        </div>
                    </div>)
                        : null
                }
            </div>
            }
        </div>
    )
}
export default SearchCard