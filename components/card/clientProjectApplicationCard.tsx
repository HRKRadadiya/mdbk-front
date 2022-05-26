import { Button } from 'antd'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ContactIcon from '../../public/contact-icon.svg'
import { getUrl, isEmpty, phoneNumberMasking } from '../../utils/helper'
import Image from 'next/image'
import { PROJECT_EVENT } from '../../constants/keywords'
import { PROJECT_PROJECT_APPLICANT_CHANGE_STATUS } from '../../constants/api'
import { ApiMemberPost } from '../../service/api'
import { useState } from 'react'
import router from 'next/router'
import { PROJECT_ID_PROJECTAPPLICATION } from '../../constants/routes'

const ClientProjectApplicationCard = ({ project, lastCardElementRef, getProjectData }: any) => {
    const { t } = useTranslation();
    const [projectApplicationStatus, setProjectApplicationStatus] = useState(project.status)
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
    project.project_application_profile?.experiences.map((exp: any) => {
        let empStartDate = (exp.employment_end_date == null || exp.employment_end_date == undefined) ? new Date() : exp.employment_end_date;
        let empEndDate = exp.employment_start_date;

        total += monthDiff(new Date(moment(empEndDate).format("YYYY,MM")), new Date(moment(empStartDate).format("YYYY,MM")));
    })

    const handleProjectEvent = async (e: React.MouseEvent<HTMLElement, MouseEvent>, key: string, aid: number, project_id: number) => {
        await ApiMemberPost(PROJECT_PROJECT_APPLICANT_CHANGE_STATUS, {
            project_id: project_id,
            status: key,
            applicant_id: aid
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

    return (
        <div className="ft-app-card" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            <div className="section section1">
                <div className="top">
                    <div className="left">
                        <div className="profile-img">
                            <img src="/grayuser.svg" />
                        </div>
                        <div className="title-wrap">
                            <div className="title">{project.project_application_profile?.nick_name}</div>
                            <div className="experinece">{t('featureSearch.workExp')} {totalInDate(total)} </div>
                        </div>
                    </div>
                    <div className="right">
                        <Button onClick={() => router.push(getUrl(router.locale, PROJECT_ID_PROJECTAPPLICATION.replace('%id%', project.id + "")))} className="ft-border-rounded-btn1"> {t('featureSearch.SeeDetails')}</Button>
                    </div>
                </div>
                <div className="ft-app-desc">
                    {project.message?.message}
                </div>
            </div>
            <div className="section section2">
                <div className="left">
                    <div className="ft-footer-title">
                        {t('projectCreation.SuggestedAmount')}
                    </div>
                    <div className="ft-footer-value">
                        {console.log("--", project.is_negotiable)}
                        {getProjectData && getProjectData?.is_negotiable == "yes" ? t('projectCreation.Negotiable') : getProjectData && getProjectData?.suggested_amount}
                        {getProjectData && getProjectData?.is_negotiable == "yes" ? null : <span>{t('projectCreation.won')}</span>}
                    </div>
                </div>
                <div className="right">
                    {projectApplicationStatus == PROJECT_EVENT.ACCEPTED &&
                        <>
                            <a className="ft-contact-link">
                                <Image src={ContactIcon} alt="Contact Icon" className="icon" />
                                <span>{isEmpty(project.project_application_profile?.phone) ? t('common.n_a') : phoneNumberMasking(project.project_application_profile?.phone, ".")}</span>
                            </a>
                            <Button className="ft-theme-light-btn ft-accepted">{t('featureSearch.Accepted')}</Button>
                        </>
                    }
                    {projectApplicationStatus == PROJECT_EVENT.WAITING &&
                        <>  <Button onClick={(e) => handleProjectEvent(e, PROJECT_EVENT.REJECTED, project.applicant_id, project.project_id)} className="ft-grey-rounded-btn ft-reject">{t('seeProjectDetails.Reject')}</Button>
                            <Button onClick={(e) => handleProjectEvent(e, PROJECT_EVENT.ACCEPTED, project.applicant_id, project.project_id)} className="ft-default-rounded-btn1 ft-accept">{t('seeProjectDetails.Accept')}</Button>
                        </>
                    }
                    {projectApplicationStatus == PROJECT_EVENT.REJECTED &&
                        <Button className="ft-grey-bodered-btn ft-rejected">{t('featureSearch.Rejected')}</Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default ClientProjectApplicationCard
