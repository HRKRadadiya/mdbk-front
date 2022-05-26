
import React, { useState } from 'react'
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../../components';
import { Button } from 'antd'
import ContactIcon from '../../../public/contact-icon.svg'
import Image from 'next/image'
import { useRef } from 'react';
import useProjectApplicationData from '../../../hooks/useAllProjectApplication';
import { useCallback } from 'react';
import ClientProjectApplicationCard from '../../../components/card/clientProjectApplicationCard';
import router from 'next/router';
import { PROJECT_ID_PROPOSAL } from '../../../constants/routes';
import { getUrl } from '../../../utils/helper';

function index() {

    const { t } = useTranslation();
    const cards = Array.from(Array(3).keys());
    const observer = useRef<any>()
    const [projectApplicationFilter, setProjectApplicationFilter] = useState({
        page: 1
    })
    const { id } = router.query;
    const {
        loadingProjectApplication, errorProjectApplication, getAllProjectApplication, hasMoreProjectApplication, getProjectData
    } = useProjectApplicationData(projectApplicationFilter)

    const lastCardElementRefProject = useCallback((node) => {
        if (loadingProjectApplication) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreProjectApplication) {
                setProjectApplicationFilter({ ...projectApplicationFilter, page: projectApplicationFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingProjectApplication, hasMoreProjectApplication])

    return (
        <AppLayout title="Project" whiteHeader={true}>
            <div className="fe-page-outer ft-project-application-page ft-mobile-box-view">
                <div className="ft-footer-static">
                    {getAllProjectApplication &&
                        <div className="ft-page-container ft-mbox">
                            <div className="ft-top-box">
                                <div className="ft-subtitle-main">
                                    <h1 className='ft-sub-title'>
                                        {getProjectData && getProjectData?.field}
                                    </h1>
                                    <div className="right">
                                        <Button onClick={() => { router.push(getUrl(router.locale, PROJECT_ID_PROPOSAL.replace('%id%', id + ""))) }} className="ft-deafult-btn2">{t('project.seeMyProposal')}</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="ft-app-card-wrapper">
                                {getAllProjectApplication.map((project: any, index: number) => {
                                    if (getAllProjectApplication.length === index + 1) {
                                        return (
                                            <ClientProjectApplicationCard key={index} project={project} lastCardElementRef={lastCardElementRefProject} getProjectData={getProjectData} />
                                        )
                                    } else {
                                        return (
                                            <ClientProjectApplicationCard key={index} project={project} getProjectData={getProjectData} />
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    }
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

export default index
