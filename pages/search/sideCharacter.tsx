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
import { useEffect } from 'react';
import { ApiMemberGet } from '../../service/api';
import { SEARCH_SIDE_CHARACTER } from '../../constants/api';
import axios from 'axios';
import { useCallback } from 'react';
import { useRef } from 'react';
import useSearchSideCharecter from '../../hooks/useSearchSideCharecter';
import { MEMBER } from '../../constants/keywords';
import router from 'next/router';
import { getUrl } from '../../utils/helper';
import { LOGIN } from '../../constants/routes';
import _ from 'lodash';

function SideCharacter() {
    const { Option } = Select;
    const { t } = useTranslation();
    const [buttonVisible, setButtonVisible] = useState(false)
    const observer = useRef<any>()
    const [searchFilter, setSearchFilter] = useState({
        page: 1,
        profession: ["all"]
    })

    const {
        searchSideCharecter,
        hasMore,
        loading,
        error
    } = useSearchSideCharecter(searchFilter)

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
        setSearchFilter({ page: 1, profession: [value] })
    }

    const Capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleRedirect = () => {
        router.push(getUrl(router.locale, LOGIN))
    }

    const professionOptions: any = [];
    professionOptions[t('featureSearch.All')] = 'all';
    professionOptions[t('common.Development')] = 'development';
    professionOptions[t('common.Design')] = 'design';
    professionOptions[t('common.Marketing')] = 'marketing';
    professionOptions[t('common.Other')] = 'other';

    function getProfession(profession: any) {
        let _professionOptions: any = _.invert(professionOptions);
        return profession.map((key: string, value: number) => _professionOptions[key]);
    }

    return (
        <AppLayout title={t('search.findChar')} whiteHeader={true} page="ft-bl-pages">

            {searchSideCharecter &&
                <div className="fe-page-outer ft-sc-search-page ft-mobile-box-view">
                    <div className="ft-footer-static">
                        <div className="ft-page-container w-800 ft-mbox">
                            <div className="ft-top-box">
                                <div className="ft-stitle-main">
                                    <h1 className='ft-title-left'>
                                        {t('search.findChar')}
                                    </h1>
                                    <div className="right">
                                        <div className="ft-desk-element">
                                            <Button className="ft-deafult-btn1" onClick={handleRedirect}>{t('search.sideCharacterBeforeLogin.postSideCharac')}</Button>
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
                                <div className="ft-subtitle-main ft-fw-btn">
                                    <h1 className='ft-sub-title'>
                                        {getProfession(searchFilter.profession)}
                                    </h1>
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
                                        <div className="ft-mb-element">
                                            <Button className="ft-deafult-btn1" onClick={handleRedirect}>{t('search.sideCharacterBeforeLogin.postSideCharac')}</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ft-search-card-wrapper" >
                                {searchSideCharecter.map((profile: any, index: number) => {
                                    if (searchSideCharecter.length === index + 1) {
                                        return (
                                            <ProfileCardBeforeLogin key={index} profile={profile} lastCardElementRef={lastCardElementRef} member={MEMBER.SIDE_CHARACTER} />
                                        )
                                    } else {
                                        return (
                                            <ProfileCardBeforeLogin key={index} profile={profile} member={MEMBER.SIDE_CHARACTER} />
                                        )
                                    }
                                })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </AppLayout>

    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});


export default SideCharacter