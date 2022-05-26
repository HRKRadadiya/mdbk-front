import { Button } from 'antd'
import { useState } from 'react'
import moment from 'moment'
import router from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MEMBER_LIKE_UNLIKE } from '../../constants/api'
import { PROJECT_ID_APPLICATION } from '../../constants/routes'
import DefaultProfile from '../../public/profile-default.svg'
import ContactIcon from '../../public/contact-icon.svg'
import Image from 'next/image'
import { ApiMemberPost } from '../../service/api'
import { getUrl, humanizeDate, isEmpty, numberWithCommas, projectAmount } from '../../utils/helper'
import { LIKE_TYPE_CLIENT, PROJECT, PROJECT_EVENT } from '../../constants/keywords'
import { ROUTES } from '../../constants'

const ClientProjectCard = ({ project, lastCardElementRef, setProjectFilter, projectFilter, clientList }: any) => {
    const { t } = useTranslation();

    const [isLike, setIsLike] = useState(project.like_flag)

    const handleLike = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: number) => {
        let data: any;
        data = {
            like_type: PROJECT,
            source_id: id
        }
        // }
        await ApiMemberPost(MEMBER_LIKE_UNLIKE, data).then(async (response: any) => {
            if (response.data && response.success) {
                setIsLike(response.data.like_flag)
                setProjectFilter({
                    ...projectFilter,
                    is_refresh: !projectFilter.is_refresh,
                })
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    return (
        <div className="ft-app-card ft-sc-project-card" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            <div className="section section1">
                <div className="top">
                    <div className="left">
                        <div className="profile-img fe-profile-image-round" onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))}>
                            {isEmpty(project?.client_profile?.profile_picture) ? <img src="/grayuser.svg" /> : <img src={project?.client_profile?.profile_picture} />}
                        </div>
                        <div className="title-wrap">
                            <div className="title" onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))}>{project?.client_profile?.nick_name}</div>
                            {project?.client_profile?.is_company == "yes" ? <Button className="fe-company-btn">{t('featureSearch.Company')}</Button> : null}
                            {isLike ? <img src="/heart.svg" className="heart-icon" onClick={(e) => handleLike(e, project?.id)} /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, project?.id)} className="heart-icon" />}
                            <div className="experinece">{humanizeDate(new Date(project?.created_at), t)}</div>
                        </div>
                    </div>
                    <div className="right">
                        {clientList == "Client" ?
                            ((project?.project_application != null || project?.project_application != undefined) ?
                                (<>
                                    {project?.project_application?.status == PROJECT_EVENT.ACCEPTED &&
                                        <>
                                            <a className="ft-contact-link">
                                                <Image src={ContactIcon} alt="Contact Icon" className="icon" />
                                                <span>{project?.client_profile?.phone}</span>
                                            </a>
                                            <Button onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))} className="ft-theme-light-btn ft-accepted">{t('featureSearch.Accepted')}</Button>
                                        </>
                                    }
                                    {project?.project_application?.status == PROJECT_EVENT.REJECTED &&
                                        <Button onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))} className="ft-grey-light-btn ft-rejected at-rej-btn">{t('featureSearch.Rejected')}</Button>
                                    }

                                    {project?.project_application?.status == PROJECT_EVENT.WAITING &&
                                        <Button onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))} className="ft-grey-bodered-btn ft-pending">{t('featureSearch.Pending')}</Button>
                                    }
                                </>)
                                :
                                (<>
                                    <Button className="ft-border-rounded-btn1" onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))}> {t('featureSearch.SeeDetails')}</Button>
                                    <Button onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_APPLY.replace('%id%', project?.id + "")))} className="ft-default-rounded-btn1">{t('featureSearch.ApplyforProject')}</Button>
                                </>)
                            )
                            :
                            (
                                <>
                                    {project?.project_application?.status == PROJECT_EVENT.ACCEPTED &&
                                        <>
                                            <a className="ft-contact-link">
                                                <Image src={ContactIcon} alt="Contact Icon" className="icon" />
                                                <span>{project?.client_profile?.phone}</span>
                                            </a>
                                            <Button onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))} className="ft-theme-light-btn ft-accepted">{t('featureSearch.Accepted')}</Button>
                                        </>
                                    }
                                    {project?.project_application?.status == PROJECT_EVENT.REJECTED &&
                                        <Button onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))} className="ft-grey-light-btn ft-rejected at-rej-btn">{t('featureSearch.Rejected')}</Button>
                                    }

                                    {project?.project_application?.status == PROJECT_EVENT.WAITING &&
                                        <Button onClick={() => router.push(getUrl(router.locale, ROUTES.PROJECT_ID_PROPOSAL.replace('%id%', project?.id + "")))} className="ft-grey-bodered-btn ft-pending">{t('featureSearch.Pending')}</Button>
                                    }
                                </>
                            )
                        }
                    </div>
                </div>
                <div className="ft-app-desc">
                    {project?.client_profile?.introduction}
                </div>
            </div>
            <div className="section section2">
                <div className="ft-tag-lists-outer hm-tag-lists-outer">
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t("featureSearch.Location")}</span>
                        <span className="ft-val">{project?.location}</span>
                    </Button>
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t('featureSearch.PlanningStage')}</span>
                        <span className="ft-val">{project?.current_planning_stage == "other" ? project?.direct_input : t('dynamic.' + project?.current_planning_stage)}</span>
                    </Button>
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t('featureSearch.Budget')}</span>
                        {project?.is_negotiable == "yes" ?
                            <span className="ft-val">{t('common.TBD')}</span>
                            :
                            <span className="ft-val">{numberWithCommas(project?.suggested_amount)}{t('common.won1')}</span>
                        }
                    </Button>
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t('featureSearch.Schedule')}</span>
                        <span className="ft-val">{project?.schedule == "direct" ? `${moment(project?.schedule_direct_start_date).format('YYYY.MM.DD')} - ${moment(project?.schedule_direct_end_date).format('YYYY.MM.DD')}` : t("dynamic.Schedule." + project?.schedule)}</span>
                    </Button>
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t('featureSearch.Field')}</span>
                        <span className="ft-val">{project?.field}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ClientProjectCard