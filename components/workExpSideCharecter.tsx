import moment from 'moment';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { isEmpty } from '../utils/helper'

const WorkExpSideCharecter = ({ experience }: any) => {
    const { t } = useTranslation();
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
    isEmpty(experience) ? t('sideCharacterProfile.workExp.unExp') : experience.map((exp: any) => {
        let empStartDate = (exp.employment_end_date == null || exp.employment_end_date == undefined) ? new Date() : exp.employment_end_date;
        let empEndDate = exp.employment_start_date;
        total += monthDiff(new Date(moment(empEndDate).format("YYYY,MM")), new Date(moment(empStartDate).format("YYYY,MM")));
    })

    return (
        <div className="part-two">
            <h2 className="ftpa-title">{t('sideCharacterProfile.WorkExperience')}</h2>
            <div className="ft-info-wrapper">
                <div className="title">{t('sideCharacterProfile.TotalExperience')}</div>
                <div className="value">{isEmpty(experience) ? t('sideCharacterProfile.workExp.unExp') : totalInDate(total)}</div>
            </div>
            {!isEmpty(experience) ? experience.map((exp: any, index: number) => (
                <>
                    <div className={`ft-info-wrapper ft-exp-all ${index != 0 ? "more-exp" : ""}`}>
                        <div className="title">{t('common.experience')} {index + 1}</div>
                        <div className="exp">
                            <div>{exp.company_name}</div>
                            <div>{moment(exp.employment_start_date).format('YYYY.MM')} - {(exp.employment_end_date == null || exp.employment_end_date == undefined) ? t('common.Present') : moment(exp.employment_end_date).format('YYYY.MM')}({totalInDate(monthDiff(new Date(moment(exp.employment_start_date).format("YYYY,MM")), (new Date((exp.employment_end_date == null || exp.employment_end_date == undefined) ? new Date() : new Date(moment(exp.employment_end_date).format("YYYY,MM"))))))})
                            </div>
                            <div>{exp.position}</div>
                            <div>{exp.profession}</div>
                        </div>
                    </div>
                </>
            )) : null}
        </div>
    )
}

export default WorkExpSideCharecter
