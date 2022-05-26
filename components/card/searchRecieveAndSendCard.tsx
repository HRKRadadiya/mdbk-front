/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Button } from 'antd';
import Image from 'next/image'
import DR from '../../public/downRectangle.svg'
import { useTranslation } from 'react-i18next';
import { getUrl, humanizeDate, isEmpty, phoneNumberMasking } from '../../utils/helper';
import ContactIcon from '../../public/contact-icon.svg'
import _ from 'lodash';
import { Modal as BootstrapModel } from 'react-bootstrap'
import moment from 'moment';
import { useState } from 'react';
import { ApiMemberPost } from '../../service/api';
import { MEMBER_LIKE_UNLIKE, REQUEST_ID_CHANGE_STATUS } from '../../constants/api';
import { LIKE_TYPE_CLIENT, LIKE_TYPE_SIDE_CHARACTER, PROJECT_EVENT } from '../../constants/keywords';
import { ROUTES } from '../../constants';
import router from 'next/router';
import { useEffect } from 'react';
import { State } from '../../redux/reducers/rootReducer';
import { useSelector } from 'react-redux';
import { BCOINGUIDE } from '../../constants/routes';

function SearchSecieveAndSendCard({ profile, keyvalue, recieveFilter, setRecieveFilter, sentFilter, setSentFilter, lastCardElementRef, member, setLikeFilter, likeFilter, setSearchFilter, searchFilter }: any) {
    console.log("profile", profile)
    const { t } = useTranslation();
    const [isCoin, setIsCoin] = useState(false)
    const [isLike, setIsLike] = useState(profile.like_flag)
    const professionOptions: any = [];
    const [projectApplicationStatus, setProjectApplicationStatus] = useState<any>()
    professionOptions[t('featureSearch.All')] = 'all';
    professionOptions[t('common.Development')] = 'development';
    professionOptions[t('common.Design')] = 'design';
    professionOptions[t('common.Marketing')] = 'marketing';
    professionOptions[t('common.Other')] = 'other';
    const userData = useSelector((state: State) => state.auth.userData)

    const [seeMoreExp, setSeeMoreExp] = useState(false)

    useEffect(() => {
        setProjectApplicationStatus(profile?.request.status)
    }, [profile])

    const gotoPurchase = () => {
        router.push(getUrl(router.locale, BCOINGUIDE))
    };

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
    !isEmpty(profile.experiences) ? profile.experiences.map((exp: any) => {
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
        if (!isEmpty(profile.desired_date)) {
            details.push({
                label: t("featureSearch.DesiredTime"),
                value: t("dynamic.desired_time." + profile.desired_time)
            })
        }
        if (!isEmpty(profile.desired_date)) {
            details.push({
                label: t("featureSearch.DesiredType"),
                value: t("dynamic.desired_project_type." + profile.desired_project_type)
            })
        }
        if (!isEmpty(profile.desired_date)) {
            details.push({
                label: t("featureSearch.Insurance"),
                value: t("dynamic.insurance_status." + profile.insurance_status)
            })
        }
        if (!isEmpty(profile.desired_date)) {
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
                setRecieveFilter({
                    ...recieveFilter,
                    page: 1
                })
                setSentFilter({
                    ...sentFilter,
                    page: 1
                })
                setLikeFilter({
                    ...likeFilter,
                    page: 1,
                    profile: data.like_type,
                    is_refresh: !likeFilter.is_refresh
                })
                setSearchFilter({
                    ...searchFilter,
                    is_refresh: !searchFilter.is_refresh
                })

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

    const handleRequest = async (e: React.MouseEvent<HTMLElement, MouseEvent>, key: string, id: number) => {
        await ApiMemberPost(REQUEST_ID_CHANGE_STATUS.replace('%id%', id + ""), {
            status: key,
            registration_type: userData?.registration_type
        })
            .then((response: any) => {
                if (response.data && response.success) {
                    key == PROJECT_EVENT.ACCEPTED ? setProjectApplicationStatus(PROJECT_EVENT.ACCEPTED) : setProjectApplicationStatus(PROJECT_EVENT.REJECTED)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
                if (error?.code == 400 && error?.error?.is_enough_coin == false && error?.error?.is_free_request == false) {
                    console.log("Error", error)
                    setIsCoin(true);
                }
            })
    }

    return (
        <div className="ft-search-card-wrapper sc-al at-search-wrapper" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            {profile && <div className="ft-search-card">
                <div className="section section1" >
                    <div className="top">
                        <div className="left" >
                            <div className="profile-img at-profile-img fe-pointer" onClick={() => {
                                keyvalue == "sent" ? router.push(getUrl(router.locale, ROUTES.REQUEST_ID_SENT.replace('%id%', profile.request.id + "")))
                                    : router.push(getUrl(router.locale, ROUTES.REQUEST_ID_RECEIVE.replace('%id%', profile.request.id + "")))
                            }}>
                                {isEmpty(profile.profile_picture) ? <img src="/grayuser.svg" /> : <img src={profile.profile_picture} />}
                            </div>
                            <div className="title-wrap">
                                <div className="title">
                                    <div className="long-content">
                                        <span className="nickname fe-pointer" onClick={() => {
                                            keyvalue == "sent" ? router.push(getUrl(router.locale, ROUTES.REQUEST_ID_SENT.replace('%id%', profile.request.id + "")))
                                                : router.push(getUrl(router.locale, ROUTES.REQUEST_ID_RECEIVE.replace('%id%', profile.request.id + "")))
                                        }}>{profile.nick_name}</span>

                                        {member == 2 ? <span className="exp"> {isEmpty(profile?.experiences) ? t('sideCharacterProfile.workExp.unExp') : totalInDate(total)}</span> : (profile.is_company == "no" ? null : <Button className="company">{t('featureSearch.Company')}</Button>)}
                                    </div>
                                    {profile.like_flag ? <img src="/heart.svg" className="heart-icon" onClick={(e) => handleLike(e, profile.id)} /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, profile.id)} className="heart-icon" />}


                                </div>
                                <div className="al-last-seen">{humanizeDate(new Date(profile.created_at), t)}</div>
                            </div>
                        </div>
                        <div className="right">
                            {projectApplicationStatus == PROJECT_EVENT.ACCEPTED ?
                                <>
                                    <a className="fe-contact-link">
                                        <Image src={ContactIcon} alt="Contact Icon" className="icon" />
                                        {(keyvalue == "sent" ?
                                            <span onClick={() => router.push(getUrl(router.locale, ROUTES.REQUEST_ID_SENT.replace('%id%', profile.request.id + "")))}>{isEmpty(profile?.phone) ? t('common.n_a') : phoneNumberMasking(profile?.phone, ".")}</span>
                                            :
                                            <span onClick={() => router.push(getUrl(router.locale, ROUTES.REQUEST_ID_RECEIVE.replace('%id%', profile.request.id + "")))}>{isEmpty(profile?.phone) ? t('common.n_a') : phoneNumberMasking(profile?.phone, ".")}</span>)
                                        }
                                    </a>
                                    {(keyvalue == "sent" ?
                                        <Button onClick={() => router.push(getUrl(router.locale, ROUTES.REQUEST_ID_SENT.replace('%id%', profile.request.id + "")))} className="ft-theme-light-btn ft-accepted">{t('featureSearch.Accepted')}</Button>
                                        :
                                        <Button className="ft-theme-light-btn ft-accepted" onClick={() => router.push(getUrl(router.locale, ROUTES.REQUEST_ID_RECEIVE.replace('%id%', profile.request.id + "")))}>{t('featureSearch.Accepted')}</Button>)
                                    }
                                </>
                                : null}
                            {projectApplicationStatus == PROJECT_EVENT.WAITING ?
                                (keyvalue == "sent" ?
                                    <Button onClick={() => router.push(getUrl(router.locale, ROUTES.REQUEST_ID_SENT.replace('%id%', profile.request.id + "")))} className="ft-grey-bodered-btn ft-rejected">{t('featureSearch.Waiting')}</Button>
                                    :
                                    <>
                                        <Button className="ft-border-rounded-btn1" onClick={(e) => handleRequest(e, PROJECT_EVENT.ACCEPTED, profile?.request?.id)}> {t('seeProjectDetails.Accept')}</Button>
                                    </>
                                ) : null
                            }
                            {projectApplicationStatus == PROJECT_EVENT.REJECTED ?
                                (keyvalue == "sent" ?
                                    <Button onClick={() => router.push(getUrl(router.locale, ROUTES.REQUEST_ID_SENT.replace('%id%', profile.request.id + "")))} className="ft-grey-rounded-btn ft-reject fe-gray-btn">{t('featureSearch.Rejected')}</Button>
                                    :
                                    <Button className="ft-grey-rounded-btn ft-reject fe-gray-btn" onClick={() => router.push(getUrl(router.locale, ROUTES.REQUEST_ID_RECEIVE.replace('%id%', profile.request.id + "")))}>{t('featureSearch.Rejected')}</Button>)
                                : null
                            }
                        </div>
                    </div>
                    <div className="al-tag-line">
                        {profile.introduction}
                    </div>
                </div>
                <div className="section section2">
                    <div className="ft-tag-lists-outer">
                        {fetchDetail().map((detail: any, i: number) =>
                            <Button key={i} className="ft-al-tag-lists">
                                <span className="ft-lbl">{detail.label}</span>
                                <span className="ft-val at-val-field-set">{detail.value}</span>
                            </Button>)}
                    </div>
                </div>
                {member == 2 ?
                    ((profile.is_experienced == "yes" && !isEmpty(profile?.experiences)) ?
                        <div className={seeMoreExp ? "section section3 see-more" : "section section3"}>
                            <div className="left">
                                <div className="ft-al-footer-title">
                                    {t('featureSearch.WorkExperience')}
                                </div>
                                <div className="ft-al-footer-value">
                                    {!isEmpty(profile?.experiences) &&
                                        (seeMoreExp ?
                                            profile?.experiences.map((exp: any) => (
                                                <div className="exp">
                                                    {`${exp.company_name}/${exp.position}/${totalInDate(monthDiff(new Date(moment(exp.employment_start_date).format("YYYY,MM")), (new Date((exp.employment_end_date == null || exp.employment_end_date == undefined) ? new Date() : new Date(moment(exp.employment_end_date).format("YYYY,MM"))))))}`
                                                    }
                                                </div>
                                            )) :
                                            <div className="exp">
                                                {`${profile.experiences[0].company_name}/${profile.experiences[0].position}/${totalInDate(monthDiff(new Date(moment(profile.experiences[0].employment_start_date).format("YYYY,MM")), ((profile?.experiences[0]?.employment_end_date == null || profile?.experiences[0]?.employment_end_date == undefined) ? new Date() : new Date(moment(profile?.experiences[0]?.employment_end_date).format("YYYY,MM")))))}`
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
                        </div> : null) : null}
            </div>
            }
            <BootstrapModel
                show={isCoin}
                onHide={() => setIsCoin(false)}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title> {t('requestpopup.NotEnough')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc">{t('requestpopup.Youdonothaveenough')}</div>
                    <div className="desc">{t('requestpopup.Pleaseagain')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button onClick={gotoPurchase} className="ft-pop-theme-btn">
                        {t('requestpopup.PurchaseBCoins')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>
        </div>
    )
}
export default SearchSecieveAndSendCard