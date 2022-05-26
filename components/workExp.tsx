import React from 'react';
import styles from '../styles/components/Rating.module.css'
import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useState } from 'react';
import { isEmpty } from '../utils/helper';

function WorkExp({ type, memberSideData }: any) {
    const { t } = useTranslation();
    const { experiences } = memberSideData;

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
    isEmpty(experiences) ? t('sideCharacterProfile.workExp.unExp') : experiences.map((exp: any) => {
        let empStartDate = (exp.employment_end_date == null || exp.employment_end_date == undefined) ? new Date() : exp.employment_end_date;
        let empEndDate = exp.employment_start_date;
        total += monthDiff(new Date(moment(empEndDate).format("YYYY,MM")), new Date(moment(empStartDate).format("YYYY,MM")));
    })

    return (
        <div className="profrate-inner basic-info">
            <div className="row">
                <div className="col-md-12 proinr-title">{t('sideCharacterProfile.WorkExperience')}</div>
            </div>
            <div className="row ">
                <div className="col-md-6 col-6 alnleft proinr-left proinr-cmn py-0 total-expb">{t('sideCharacterProfile.TotalExperience')}</div>
                <div className="col-md-6 col-6 alnright proinr-right proinr-cmn py-0 total-exp at-total-exp">{isEmpty(experiences) ? t('sideCharacterProfile.workExp.unExp') : totalInDate(total)}</div>
            </div>
            <div className="row ">

                {!isEmpty(experiences) ? experiences.map((exp: any, index: number) => (
                    <>
                        <div className="col-6  alnleft proinr-left proinr-cmn py-0 mt-0 total-experience-count">{t('common.experience')} {index + 1}</div>
                        <div className="col-6  alnleft proinr-left mt-0 ">
                            <div className="row">
                                <div className="col-md-12 alnright proinr-right proinr-cmn py-0 total-experience-count">{exp.company_name}</div>
                                <div className="col-md-12 alnright proinr-right proinr-cmn py-0">{moment(exp.employment_start_date).format('YYYY.MM')} - {(exp.employment_end_date == null || exp.employment_end_date == undefined) ? t('common.Present') : moment(exp.employment_end_date).format('YYYY.MM')}({totalInDate(monthDiff(new Date(moment(exp.employment_start_date).format("YYYY,MM")), (new Date((exp.employment_end_date == null || exp.employment_end_date == undefined) ? new Date() : new Date(moment(exp.employment_end_date).format("YYYY,MM"))))))})</div>
                                <div className="col-md-12 alnright proinr-right proinr-cmn py-0">{exp.position}</div>
                                <div className="col-md-12 alnright proinr-right proinr-cmn py-0">{exp.profession}</div>
                                <div className="col-md-12">
                                    {experiences.length - 1 == index ? null : <div className="profrate-inner-devider at-devider-exp"></div>}
                                </div>
                            </div>
                        </div>
                    </>
                )) : null}

                <div className="col-md-12">
                    <div className="profrate-inner-devider at-work-end"></div>
                </div>
            </div>
        </div>
    )
}
export default WorkExp