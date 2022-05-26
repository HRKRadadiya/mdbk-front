import React, { useState } from 'react'
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components';
import { Button, Select } from 'antd'
import DefaultProfile from '../../public/profile-default.svg'
import { useRef } from 'react';
import { useCallback } from 'react';
import ClientProjectCard from '../../components/card/clientProjectCard';
import useProjectClientData from '../../hooks/useAllClientProject';
import useAllSideCharProposal from '../../hooks/useAllSideCharProposal';
import { isEmpty } from '../../utils/helper';
import NotFound from '../../components/notFound';
import router from 'next/router';
import { useEffect } from 'react';

function sideCharacter() {

    const { t } = useTranslation();
    const { Option } = Select;
    const observer = useRef<any>()
    const [projectFilter, setProjectFilter] = useState({
        page: 0,
        profession: "all",
        sideCharecterAcion: true,
        is_refresh: true
    })
    const [projectStatus, setProjectStatus] = useState("")

    const [sideCharFilter, setSideCharFilter] = useState({
        page: 0,
        profession: "all",
        sideCharecterAcion: true
    })

    function handleChangeField(value: any) {
        setProjectFilter({ ...projectFilter, page: 1, profession: value })
    }

    useEffect(() => {
        const { tab } = router.query
        if (!(tab == undefined || tab == null) && tab == "send") {
            setProjectFilter({ ...projectFilter, page: 0, sideCharecterAcion: false })
            setSideCharFilter({ ...sideCharFilter, page: 1, sideCharecterAcion: false })
        } else {
            setSideCharFilter({ ...sideCharFilter, page: 0, sideCharecterAcion: true })
            setProjectFilter({ ...projectFilter, page: 1, sideCharecterAcion: true })
        }
    }, [])

    const {
        getAllClientProject,
        hasMoreClientProject,
        loadingClientProject,
        errorClientProject
    } = useProjectClientData(projectFilter)

    const lastCardElementRefAllClientProject = useCallback((node) => {
        if (loadingClientProject) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreClientProject) {
                setProjectFilter({ ...projectFilter, page: projectFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingClientProject, hasMoreClientProject])

    const {
        getAllSideCharPropasal,
        hasMoreSideCharPropasal,
        loadingSideCharPropasal,
        errorSideCharPropasal
    } = useAllSideCharProposal(sideCharFilter)

    const lastCardElementRefAllSideCharPropasal = useCallback((node) => {
        if (loadingSideCharPropasal) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreSideCharPropasal) {
                setSideCharFilter({ ...sideCharFilter, page: sideCharFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingSideCharPropasal, hasMoreSideCharPropasal])

    return (
        <AppLayout title="Project" whiteHeader={true}>
            <div className="fe-page-outer ft-sc-project-list-page hm-project-sc-card">
                <div className="ft-footer-static">
                    <div className="ft-search-section">
                        <div className="ft-page-container">
                            <div className="ft-ptitle-main">
                                <h1 className='ft-ptitle'>
                                    {t('header.SearchProjects')}
                                </h1>
                                <div className="right">
                                    <Select defaultValue={projectFilter.profession} onChange={handleChangeField} className="ft-custom-ant-select second">
                                        <Option value="all">{t('search.dropdown.val1')}</Option>
                                        <Option value="development">{t('search.dropdown.val2')}</Option>
                                        <Option value="design">{t('search.dropdown.val3')}</Option>
                                        <Option value="marketing">{t('search.dropdown.val4')}</Option>
                                        <Option value="other">{t('search.dropdown.val5')}</Option>
                                    </Select>
                                </div>
                            </div>
                            <div className="ft-tabs-outer ptab at-pointer">
                                <div className={projectFilter.sideCharecterAcion ? "ft-tab active" : "ft-tab"} onClick={() => {
                                    setSideCharFilter({ ...sideCharFilter, page: 0, sideCharecterAcion: true })
                                    setProjectFilter({ ...projectFilter, page: 1, sideCharecterAcion: true })
                                }}>
                                    {t('header.SearchProjects')}
                                </div>
                                <div className={sideCharFilter.sideCharecterAcion ? "ft-tab" : "ft-tab active"} onClick={() => {
                                    setProjectFilter({ ...projectFilter, page: 0, sideCharecterAcion: false })
                                    setSideCharFilter({ ...sideCharFilter, page: 1, sideCharecterAcion: false })
                                }}>
                                    {t('project.SentProposals')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ft-fabg">
                        <div className="ft-project-detail-card">
                            <div className="ft-page-container">
                                {projectFilter.sideCharecterAcion ?
                                    (
                                        !isEmpty(getAllClientProject) ? getAllClientProject.map((project: any, index: number) => {
                                            if (getAllClientProject.length === index + 1) {
                                                return (
                                                    <ClientProjectCard key={index} project={project} lastCardElementRef={lastCardElementRefAllClientProject} setProjectFilter={setProjectFilter} projectFilter={projectFilter} clientList="Client" />
                                                )
                                            } else {
                                                return (
                                                    <ClientProjectCard key={index} project={project} setProjectFilter={setProjectFilter} projectFilter={projectFilter} clientList="Client" />
                                                )
                                            }
                                        })
                                            :
                                            <div className="ft-not-found-outer">
                                                <div className="ft-not-found-wrap">
                                                    <img src="../not-found.svg"></img>
                                                    <div className="msg">
                                                        {t('common.project.Noprojects')}
                                                        {t('common.project.Pleaseproposal')}
                                                    </div>
                                                </div>
                                            </div>
                                    ) :
                                    (
                                        !isEmpty(getAllSideCharPropasal) ? getAllSideCharPropasal.map((project: any, index: number) => {
                                            if (getAllSideCharPropasal.length === index + 1) {
                                                return (
                                                    <ClientProjectCard key={index} project={project} lastCardElementRef={lastCardElementRefAllSideCharPropasal} clientList="sentPropasal" />
                                                )
                                            } else {
                                                return (
                                                    <ClientProjectCard key={index} project={project} clientList="sentPropasal" />
                                                )
                                            }
                                        })
                                            :
                                            <div className="ft-not-found-outer">
                                                <div className="ft-not-found-wrap">
                                                    <img src="../not-found.svg"></img>
                                                    <div className="msg">
                                                        {t('common.project.Noprojects')}
                                                        {t('common.project.Pleaseproposal')}
                                                    </div>
                                                </div>
                                            </div>
                                    )
                                }
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

export default sideCharacter
