import React from 'react'
import { useTranslation } from 'react-i18next';

function NotFound() {
    const { t } = useTranslation();
    return (
        <>
            <div className="ft-not-found-outer at-not-found">
                <div className="ft-not-found-wrap">
                    <img src="./not-found.svg"></img>
                    <div className="msg">
                        {t('common.project.Noprojects')}
                        {t('common.project.Pleaseproposal')}
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotFound
