
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Progress } from 'antd';
import { State } from '../redux/reducers/rootReducer';
import { FC } from 'react';

interface Iprops {
    profilePercentage: number
}

const clientProfilePercentage = ({ profilePercentage }: Iprops) => {
    const { t } = useTranslation();

    return (
        profilePercentage >= 0 ? (
            <>
                <div className="row">
                    <div className="col-6 registration-indicator-left ft-indicator-per">
                        {(profilePercentage)}%
                    </div>
                    <div className="col-6 registration-indicator-right ft-indicator-right">
                        <span className="ft-required-dot"></span>
                        <span className="ml-10">{t('clientProfile.requiredField')}</span>
                    </div>
                </div>
                <div className="ft-register-progress">
                    <Progress percent={profilePercentage} showInfo={false} strokeColor="#00d6e3" />
                </div> </>
        ) : null)
}

export default clientProfilePercentage