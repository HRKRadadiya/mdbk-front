import React from 'react'
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppLayout } from '../../components';
import { Button, Select } from 'antd'
import { useTranslation } from 'react-i18next';


function Question() {
    const { t } = useTranslation();
    const { Option } = Select;

    return (
        <AppLayout title="Forum" whiteHeader={true}>
            <div className="fe-page-outer ft-forum-question-page">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <div className="ft-ptitle-main">
                            <h1 className='ft-ptitle'>
                                {t('featureSearch.Project')}
                            </h1>
                        </div>
                        <div className="ft-tabs-outer ptab">
                            <div className="ft-tab active">
                                {t('header.SearchProjects')}
                            </div>
                            <div className="ft-tab">
                                {t('project.SentProposals')}
                            </div>
                        </div>
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

export default Question
