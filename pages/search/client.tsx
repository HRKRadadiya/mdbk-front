/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import Head from 'next/head'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppLayout, ProfileCardBeforeLogin } from '../../components'
import { Menu, Dropdown, Button, Divider, Select } from 'antd';
import styles from '../../styles/Search.module.css'
import profiles from '../../public/data'
import { GetServerSideProps } from 'next';
import useSearchClient from '../../hooks/useSearchClient';
import { useRef } from 'react';
import { useCallback } from 'react';
import { CLIENTINDIVIDUAL, CLIENTCOMPANY, MEMBER } from '../../constants/keywords';
import router from 'next/router';
import { LOGIN } from '../../constants/routes';
import { getUrl } from '../../utils/helper';
import _ from 'lodash';

function Client() {
    const { t } = useTranslation();
    const { Option } = Select;
    const [buttonVisible, setButtonVisible] = useState(false)
    const observer = useRef<any>()
    const [clientCompany, setClientCompany] = useState(CLIENTINDIVIDUAL)

    const [searchFilter, setSearchFilter] = useState({
        page: 1,
        profession: ["all"],
        is_company: "no"
    })

    const {
        searchClient,
        hasMore,
        loading,
        error
    } = useSearchClient(searchFilter)

    const lastCardElementRef = useCallback((node) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setSearchFilter({ ...searchFilter, page: searchFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    function handleChangeField(value: any) {
        setSearchFilter({ ...searchFilter, page: 1, profession: [value] })
    }

    const handleRedirect = () => {
        router.push(getUrl(router.locale, LOGIN))
    }



    return (
        <AppLayout title={t('search.clientbeforeLogin.findClient')} whiteHeader={true} page="ft-bl-pages">
            <div className="fe-page-outer ft-client-search-page ft-mobile-box-view">
                <div className="ft-footer-static">
                    <div className="ft-page-container w-800 ft-mbox">
                        <div className="ft-top-box">
                            <div className="row d-flex justify-content-center">
                                <div className="ft-stitle-main">
                                    <h1 className='ft-title-left'>
                                        {t('search.clientbeforeLogin.findClient')}
                                    </h1>
                                    <div className="right">
                                        <div className="ft-desk-element">
                                            <Button className="ft-deafult-btn1" onClick={handleRedirect}>{t('search.clientbeforeLogin.postClient')}</Button>
                                        </div>
                                        <div className="ft-mb-element">
                                            <Select defaultValue={searchFilter.profession[0]} className="ft-custom-ant-select" onChange={handleChangeField}>
                                                <Option value="all">{t('search.dropdown.val1')}</Option>
                                                <Option value="development">{t('search.dropdown.val2')}</Option>
                                                <Option value="design">{t('search.dropdown.val3')}</Option>
                                                <Option value="marketing">{t('search.dropdown.val4')}</Option>
                                                <Option value="other">{t('search.dropdown.val5')}</Option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="ft-subtitle-main ft-fw-btn">
                                <div className="ft-tabs-outer at-cursor-tab">
                                    <div className={searchFilter.is_company == "no" ? "ft-tab active" : "ft-tab"} onClick={() => { setSearchFilter({ ...searchFilter, page: 1, is_company: CLIENTINDIVIDUAL }) }}>
                                        {t('search.clientbeforeLogin.individual')}
                                    </div>
                                    <div className={searchFilter.is_company == "yes" ? "ft-tab active" : "ft-tab"} onClick={() => { setSearchFilter({ ...searchFilter, page: 1, is_company: CLIENTCOMPANY }) }}>
                                        {t('search.clientbeforeLogin.company')}
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="ft-desk-element">
                                        <Select defaultValue={searchFilter.profession[0]} className="ft-custom-ant-select" onChange={handleChangeField}>
                                            <Option value="all">{t('search.dropdown.val1')}</Option>
                                            <Option value="development">{t('search.dropdown.val2')}</Option>
                                            <Option value="design">{t('search.dropdown.val3')}</Option>
                                            <Option value="marketing">{t('search.dropdown.val4')}</Option>
                                            <Option value="other">{t('search.dropdown.val5')}</Option>
                                        </Select>
                                    </div>
                                    <div className="ft-mb-element ft-ts-20">
                                        <Button className="ft-deafult-btn1" onClick={handleRedirect}>{t('search.clientbeforeLogin.postClient')}</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ft-search-card-wrapper" >
                            {searchClient.map((profile: any, index: number) => {
                                if (searchClient.length === index + 1) {
                                    return (
                                        <ProfileCardBeforeLogin key={index} profile={profile} lastCardElementRef={lastCardElementRef} member={MEMBER.CLIENT} />
                                    )
                                } else {
                                    return (
                                        <ProfileCardBeforeLogin key={index} profile={profile} member={MEMBER.CLIENT} />
                                    )
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div >

        </AppLayout >
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});


export default Client