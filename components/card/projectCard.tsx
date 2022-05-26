import { Button } from 'antd'
import moment from 'moment'
import router from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PROJECT_ID_APPLICATION, PROJECT_ID_PROPOSAL } from '../../constants/routes'
import DefaultProfile from '../../public/profile-default.svg'
import { getUrl, isEmpty, numberWithCommas, projectAmount, replaceValue } from '../../utils/helper'

const ProjectCard = ({ project, lastCardElementRef }: any) => {
    const { t } = useTranslation();
    return (
        <div className="ft-project-card" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            <div className="section section1">
                <div className="left">
                    <div className="title hm-line-height">
                        {project.field}
                    </div>
                </div>
                <div className="right">
                    <Button onClick={() => router.push(getUrl(router.locale, PROJECT_ID_PROPOSAL.replace('%id%', project.id + "")))} className="ft-border-rounded-btn1"> {t('featureSearch.SeeDetails')}</Button>
                </div>
            </div>
            <div className="section section2">
                <div className="ft-tag-lists-outer">
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t('featureSearch.Location')}</span>
                        <span className="ft-val">{project?.location}</span>
                    </Button>
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t('featureSearch.PlanningStage')}</span>
                        <span className="ft-val">{project.current_planning_stage == "other" ? project.direct_input : t('dynamic.' + project.current_planning_stage)}</span>
                    </Button>
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t('featureSearch.Budget')}</span>
                        {project?.is_negotiable == "yes" ?
                            <span className="ft-val">{t('common.TBD')}</span>
                            :
                            <span className="ft-val">{numberWithCommas(projectAmount(project?.suggested_amount, router))}{t('common.won1')}</span>
                        }
                    </Button>
                    <Button className="ft-tag-lists">
                        <span className="ft-lbl">{t('featureSearch.Schedule')}</span>
                        <span className="ft-val">{project.schedule == "direct" ? `${moment(project.schedule_direct_start_date).format('YYYY.MM.DD')} - ${moment(project.schedule_direct_start_date).format('YYYY.MM.DD')}` : t("dynamic.Schedule." + project.schedule)}</span>
                    </Button>
                </div>
            </div>
            <div className="section section3">
                <div className="left">
                    <span className="ft-date">
                        {moment(project.created_at).format('YYYY.MM.DD')}
                    </span>
                </div>
                <div className="right" onClick={() => router.push(getUrl(router.locale, PROJECT_ID_APPLICATION.replace('%id%', project.id + "")))}>
                    <div className="profile-img-multiple hk-image-hover">
                        {project.project_applications_profile_images?.slice(0, 4).map((image: any, index: number) => {
                            return <img src={isEmpty(image) ? "/grayprofile.png" : image} style={{ zIndex: index + 1 }} />
                        })}
                    </div>
                    <div onClick={() => router.push(getUrl(router.locale, PROJECT_ID_APPLICATION.replace('%id%', project.id + "")))} className="applicate-total hk-applicant-hover">{project.count_project_applications} {t('seeProjectDetails.applicants')}</div>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard
