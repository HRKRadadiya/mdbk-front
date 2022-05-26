import { Button, Form, Input, Select } from 'antd';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import router from 'next/router';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../../components'
import checkCircle from '../../../public/check-circle.svg'
import checkCircleFill from '../../../public/check-circle-fill.svg'
import { useEffect } from 'react';
import { ApiMemberGet, ApiMemberPost } from '../../../service/api';
import { MEMBER_LIKE_UNLIKE, MEMBER_REPORT_UNREPORT, PROJECT_PROJECT_APPLICANT_CHANGE_STATUS, PROJECT_PROJECT_APPLICATION_DETAILS } from '../../../constants/api';
import { isEmpty, phoneNumberMasking } from '../../../utils/helper';
import { LIKE_TYPE_SIDE_CHARACTER, PROJECT_EVENT } from '../../../constants/keywords';
import WorkExpSideCharecter from '../../../components/workExpSideCharecter';
import { KEYWORDS } from '../../../constants';
import { useSelector } from 'react-redux';
import { State } from '../../../redux/reducers/rootReducer';

function projectApplication() {
    const { t } = useTranslation();
    const { Option } = Select
    const [amountDisable, setAmountDisable] = useState(false)
    const [isLike, setIsLike] = useState<boolean>()
    const [likeCounter, setLikeCounter] = useState<number>(0)
    const { id }: any = router.query
    const [reportCounter, setReportCounter] = useState<number>(0)
    const [projectApplicationStatus, setProjectApplicationStatus] = useState("")
    const [sideCharecterDetails, setSideCharecterDetails] = useState<any>()
    const memberid = useSelector((state: State) => state.auth.userData?.member?.id)

    const getSideCharecterDetail = async () => {
        await ApiMemberGet(`${PROJECT_PROJECT_APPLICATION_DETAILS}/${id}`)
            .then(async (response: any) => {
                if (response.data && response.success) {
                    setProjectApplicationStatus(response.data.status)
                    setSideCharecterDetails(response.data)
                    setReportCounter(response.data.report_count)
                    setLikeCounter(response.data.total_likes)
                    setIsLike(response.data.like_flag)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    useEffect(() => {
        getSideCharecterDetail()
    }, [])

    const handleReport = async (id: number) => {
        const data = {
            report_type: LIKE_TYPE_SIDE_CHARACTER,
            source_id: id
        }
        await ApiMemberPost(MEMBER_REPORT_UNREPORT, data)
            .then((response: any) => {
                if (response.data && response.success) {
                    setReportCounter(response.data.report_flag ? reportCounter + 1 : reportCounter - 1)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    const handleProjectEvent = async (e: React.MouseEvent<HTMLElement, MouseEvent>, key: string, aid: number, pid: number) => {
        await ApiMemberPost(PROJECT_PROJECT_APPLICANT_CHANGE_STATUS, {
            project_id: pid,
            status: key,
            applicant_id: aid,
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
            })
    }

    const starPatten = () => {
        return [1, 2, 3, 4].map(() => (
            <img src="/contectnumber.png" />
        ))
    }

    const is_Empty = (val: any) => {
        return isEmpty(val) ? t('common.n_a') : val
    }

    const handleLike = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: number) => {
        let data = {
            like_type: LIKE_TYPE_SIDE_CHARACTER,
            source_id: id
        }
        await ApiMemberPost(MEMBER_LIKE_UNLIKE, data).then(async (response: any) => {
            if (response.data && response.success) {
                setIsLike(!isLike)
                setLikeCounter(response.data.like_flag ? likeCounter + 1 : likeCounter - 1)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    return (
        <AppLayout title="Apply for projects" whiteHeader={true}>
            <div className="fe-page-outer ft-project-app-page">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <h1 className='ft-heading'>
                            {t('project.projectApp')}
                        </h1>
                        {sideCharecterDetails &&
                            <div className="ft-apply-block ft-pa-card">
                                <div className="top">
                                    <div className="ft-report-count">
                                        <span>{reportCounter}</span>
                                        <img onClick={(id) => handleReport(sideCharecterDetails.applicant_id)} src="/white-report-icon.svg" className="ft-icon" alt="Report Icon" />
                                    </div>
                                    {isEmpty(sideCharecterDetails?.project_application_profile?.profile_picture) ? <img src="/grayuser.svg" className="ft-apply-profile" /> : <img src={sideCharecterDetails?.project_application_profile?.profile_picture} className="ft-apply-profile" />
                                    }
                                    <div className="detail">
                                        <div className="name">{is_Empty(sideCharecterDetails?.project_application_profile?.nick_name)}</div>
                                        <div className="count">
                                            {id == memberid ? ((<img src="/heart.svg" className="heart-icon" alt="Heart Icon" />)) :
                                                (isLike ? <img src="/heart.svg" onClick={(e) => handleLike(e, sideCharecterDetails.id)} className="heart-icon" alt="Heart Icon" /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, sideCharecterDetails.id)} className="heart-icon" alt="Heart Icon" />)}
                                            <span>{likeCounter}</span>
                                        </div>
                                    </div>
                                    <div className="desc">
                                        {sideCharecterDetails?.message?.message}
                                    </div>
                                    <div className="ft-sec-bottom">
                                        <div className="left">{t("dynamic." + sideCharecterDetails?.wage_type)}</div>
                                        <div className="right">
                                            {/* <div className="ne">협의가능</div> */}
                                            <div className="price">
                                                {sideCharecterDetails.is_negotiable == "yes" ? t('projectCreation.Negotiable') : sideCharecterDetails.suggested_amount}
                                                {sideCharecterDetails.is_negotiable == "yes" ? null : <span>{t('projectCreation.won')}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom">
                                    <div className="part-one">
                                        <h2 className="ftpa-title">{t('sideCharacterProfile.BasicInformation')}</h2>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.PhoneNumber')}</div>
                                            {(!isEmpty(sideCharecterDetails?.status) ?
                                                sideCharecterDetails?.status == KEYWORDS.PROJECT_EVENT.ACCEPTED ?
                                                    <div className="value">{isEmpty(sideCharecterDetails?.project_application_profile?.phone) ? t('common.n_a') : phoneNumberMasking(sideCharecterDetails?.project_application_profile?.phone, "-")}</div> :
                                                    <div className="value fe-phonenumber-hide">{isEmpty(sideCharecterDetails?.project_application_profile?.phone) ? t('common.n_a') : sideCharecterDetails?.project_application_profile?.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>

                                                :
                                                <div className="value fe-phonenumber-hide">{isEmpty(sideCharecterDetails?.project_application_profile?.phone) ? t('common.n_a') : sideCharecterDetails?.project_application_profile?.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>)
                                            }
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.Profession')}</div>
                                            <div className="value">{is_Empty(sideCharecterDetails?.project_application_profile?.profession.map((value: any) => {
                                                return t('dynamic.profession.' + value)
                                            }).join(", "))}</div>
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.Field')}</div>
                                            <div className="value">{is_Empty(sideCharecterDetails?.project_application_profile?.fields)}</div>
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.Location')}</div>
                                            <div className="value">{is_Empty(sideCharecterDetails?.project_application_profile?.locations)}</div>
                                        </div>
                                    </div>
                                    {sideCharecterDetails?.project_application_profile?.is_experienced == "no" ?
                                        (<div className="part-two">
                                            <h2 className="ftpa-title">{t('sideCharacterProfile.WorkExperience')}</h2>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.TotalExperience')}</div>
                                                <div className="value">{t('sideCharacterProfile.workExp.unExp')}</div>
                                            </div>
                                        </div>)
                                        : <WorkExpSideCharecter experience={sideCharecterDetails?.project_application_profile?.experiences} />
                                    }

                                    <div className="part-three">
                                        <h2 className="ftpa-title">{t('sideCharacterProfile.ActivityInformation')}</h2>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.DesiredDate')}</div>
                                            <div className="value">{sideCharecterDetails.project_application_profile.desired_date == null ? t('common.n_a') : t('dynamic.desired_date.' + sideCharecterDetails.project_application_profile.desired_date)} </div>

                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.DesiredTime')}</div>
                                            <div className="value">{sideCharecterDetails.project_application_profile.desired_time == null ? t('common.n_a') : t('dynamic.desired_time.' + sideCharecterDetails.project_application_profile.desired_time)}</div>
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.DesiredProjectType')}</div>
                                            <div className="value">{sideCharecterDetails.project_application_profile.desired_project_type == null ? t('common.n_a') : t('dynamic.desired_project_type.' + sideCharecterDetails.project_application_profile.desired_project_type)}</div>
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.Insurance')}</div>
                                            <div className="value">{sideCharecterDetails.project_application_profile.insurance_status == null ? t('common.n_a') : t('dynamic.insurance_status.' + sideCharecterDetails.project_application_profile.insurance_status)}</div>
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.DesiredWorkType')}</div>
                                            <div className="value">{sideCharecterDetails.project_application_profile.desired_work_type == null ? t('common.n_a') : t('dynamic.desired_work_type.' + sideCharecterDetails.project_application_profile.desired_work_type)}</div>
                                        </div>
                                    </div>

                                    <div className="ft-pa-btn-wrap">
                                        {projectApplicationStatus == PROJECT_EVENT.WAITING &&
                                            <>
                                                <Button onClick={(e) => handleProjectEvent(e, PROJECT_EVENT.REJECTED, sideCharecterDetails.applicant_id, sideCharecterDetails.project_id)} className="ft-border-btn1 ft-pa-reject-btn">
                                                    {t('seeProjectDetails.Reject')}
                                                </Button>
                                                <Button onClick={(e) => handleProjectEvent(e, PROJECT_EVENT.ACCEPTED, sideCharecterDetails.applicant_id, sideCharecterDetails.project_id)} className="ft-default-theme-btn1 ft-pa-accept-btn">
                                                    {t('seeProjectDetails.Accept')}
                                                </Button>
                                            </>}
                                        {projectApplicationStatus == PROJECT_EVENT.REJECTED &&
                                            <Button className="ft-grey-border-btn1 ft-pa-rejected-btn">
                                                {t('featureSearch.Rejected')}
                                            </Button>
                                        }
                                        {projectApplicationStatus == PROJECT_EVENT.ACCEPTED &&
                                            <Button className="ft-light-theme-btn1 ft-pa-accepted-btn">
                                                {t('featureSearch.Accepted')}
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default projectApplication
