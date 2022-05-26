/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import styles from '../styles/Search.module.css'
import React from 'react';
import { GetServerSideProps } from 'next'
import { Footer, Header, Giftbox, HeaderTab, SearchCard, AppLayout } from "../components"
import { Menu, Dropdown, Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import useSearchSideCharecter from '../hooks/useSearchSideCharecter';
import { LIKE_TYPE_CLIENT, LIKE_TYPE_SIDE_CHARACTER, MEMBER } from '../constants/keywords';
import { useRef } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { ApiMemberGet } from '../service/api';
import { SEARCH_MY_LIKE } from '../constants/api';
import useLikeData from '../hooks/useLikeData';
import { isEmpty } from '../utils/helper';
import useSearchClient from '../hooks/useSearchClient';
import { useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import useClientRecieveRequest from '../hooks/useClientRecieveRequest';
import useClientSentRequest from '../hooks/useClientSendRequest';
import SearchSecieveAndSendCard from '../components/card/searchRecieveAndSendCard';
import useDidMountEffect from '../hooks/useDidMountEffect';

function ClientSearch() {
    const { t } = useTranslation();
    const observer = useRef<any>()
    const [filterShow, setFilterShow] = useState(false)
    const registration_type = useSelector((state: State) => state.auth.userData?.registration_type)
    const clientSearch = useSelector((state: State) => state.memberSearch)
    const sideCharProgress = useSelector((state: State) => state.auth.sideCharProgress)


    const [searchFilter, setSearchFilter] = useState<any>({
        page: 0,
        profession: [],
        is_company: undefined,
        fields: [],
        locations: [],
        desired_date: undefined,
        desired_time: undefined,
        desired_project_type: undefined,
        insurance_status: undefined,
        desired_work_type: undefined,
        registration_type,
        is_reset: false,
        is_refresh: true
    })


    const [likeFilter, setLikeFilter] = useState({
        page: 0,
        profile: LIKE_TYPE_CLIENT,
        registration_type: registration_type,
        is_refresh: true
    })
    const [recieveFilter, setRecieveFilter] = useState({
        page: 0,
        registration_type: 2,
        request_type: "receive",
        is_refresh: true
    })
    const [sentFilter, setSentFilter] = useState({
        page: 0,
        registration_type: 2,
        request_type: "sent",
        is_refresh: true
    })
    const [menuTabKey, setMenuTabKey] = useState(1)
    const filterShowChange = () => {
        setFilterShow(!filterShow)
    }

    const {
        searchClient,
        hasMore,
        loading,
        error,
    } = useSearchClient(searchFilter)

    const {
        memberLikeData,
        hasMoreLike,
        loadingLike,
        errorLike
    } = useLikeData(likeFilter)

    const { loadingRecieve, errorRecieve, clientRecieveRequest, hasMoreRecieve } = useClientRecieveRequest(recieveFilter)
    const { loadingSent, errorSent, clientSentRequest, hasMoreSent } = useClientSentRequest(sentFilter)


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

    const lastCardElementRefLike = useCallback((node) => {
        if (loadingLike) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreLike) {
                setLikeFilter({ ...likeFilter, page: likeFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingLike, hasMoreLike])

    const lastCardElementRefsent = useCallback((node) => {
        if (loadingSent) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreSent) {
                setSentFilter({ ...sentFilter, page: sentFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingSent, hasMoreSent])

    const lastCardElementRefrecive = useCallback((node) => {
        if (loadingRecieve) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreRecieve) {
                setRecieveFilter({ ...recieveFilter, page: recieveFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingRecieve, hasMoreRecieve])

    useDidMountEffect(() => {
        if (menuTabKey == 1) {
            setSearchFilter({
                ...searchFilter,
                is_refresh: !searchFilter.is_refresh,
                page: 1
            })
        }
        if (menuTabKey == 2) {
            setRecieveFilter({
                ...recieveFilter,
                is_refresh: !recieveFilter.is_refresh,
                page: 1
            })
        }
        if (menuTabKey == 3) {
            setSentFilter({
                ...sentFilter,
                is_refresh: !sentFilter.is_refresh,
                page: 1
            })
        }
        if (menuTabKey == 4) {
            setLikeFilter({
                ...likeFilter,
                is_refresh: !likeFilter.is_refresh,
                page: 1,
            })
        }
    }, [menuTabKey])

    const onFinishSearch = ({ values, arr }: any) => {
        let locations: any = [];
        if ((values.province_id1 != undefined || values.district_id1 != undefined)) {
            locations.push({
                province_id: values.province_id1,
                district_id: values.district_id1
            });
        }
        if ((values.province_id2 != undefined || values.district_id2 != undefined)) {
            locations.push({
                province_id: values.province_id2,
                district_id: values.district_id2
            });
        }
        let finalFilter = { ...searchFilter, page: 1, is_reset: false };

        if (!isEmpty(values.is_company)) {
            finalFilter = { ...finalFilter, is_company: values.is_company }
        }
        if (!isEmpty(locations)) {
            finalFilter = { ...finalFilter, locations }
        }
        if (!isEmpty(values.desired_date)) {
            finalFilter = { ...finalFilter, desired_date: values.desired_date }
        }
        if (!isEmpty(values.desired_time)) {
            finalFilter = { ...finalFilter, desired_time: values.desired_time }
        }
        if (!isEmpty(values.desired_project_type)) {
            finalFilter = { ...finalFilter, desired_project_type: values.desired_project_type }
        }
        if (!isEmpty(values.insurance_status)) {
            finalFilter = { ...finalFilter, insurance_status: values.insurance_status }
        }
        if (!isEmpty(values.desired_work_type)) {
            finalFilter = { ...finalFilter, desired_work_type: values.desired_work_type }
        }
        if (!isEmpty(values.profession)) {
            finalFilter = { ...finalFilter, profession: values.profession }
        }
        if (!isEmpty(arr)) {
            finalFilter = { ...finalFilter, fields: arr }
        }
        setSearchFilter(finalFilter)
    }

    const resetForm = () => {
        setSearchFilter({ page: 1, registration_type, is_reset: true })
    }

    return (
        <>
            <AppLayout title={t('featureSearch.Findclients')} whiteHeader={true}>
                <div className="fe-page-outer ft-sc-search-page-al">
                    <div className="ft-footer-static">
                        <div className="ft-search-section">
                            <div className="ft-page-container">
                                <div className="ft-desk-element">
                                    <div className="mb-40">
                                        {sideCharProgress >= 80 ? null : <Giftbox />}
                                    </div>
                                </div>
                                {/* <div className="ft-subtitle-main">
                                    <h1 className='ft-sub-title'>
                                        {t('featureSearch.Findclients')}
                                    </h1>
                                    <div className="right">
                                        {filterShow ? <Button className="" onClick={handleClearForm}>{t('featureSearch.Refresh')}</Button> : null}
                                    </div>
                                </div> */}
                                <div className="ft-custom-search-tab">
                                    <HeaderTab val={menuTabKey} setMenuTabKey={setMenuTabKey} onFinishSearch={onFinishSearch} member={MEMBER.CLIENT} filterShow={filterShow} setFilterShow={setFilterShow} filterShowChange={filterShowChange} resetForm={resetForm} Search={clientSearch} type={LIKE_TYPE_CLIENT} />
                                </div>
                            </div>
                        </div>
                        <div className="ft-fabg">
                            <div className="ft-mb-element">
                                {sideCharProgress >= 80 ? null : <Giftbox />}
                            </div>
                            <div className="ft-search-detail-card">
                                <div className="ft-page-container">
                                    {menuTabKey == 1 && searchClient.map((profile: any, index: number) => {
                                        if (searchClient.length === index + 1) {
                                            return (
                                                <SearchCard key={index} profile={profile} lastCardElementRef={lastCardElementRef} member={MEMBER.CLIENT} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} sentFilter={sentFilter} setSentFilter={setSentFilter} setRecieveFilter={setRecieveFilter} recieveFilter={recieveFilter} />
                                            )
                                        } else {
                                            return (
                                                <SearchCard key={index} profile={profile} member={MEMBER.CLIENT} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} sentFilter={sentFilter} setSentFilter={setSentFilter} setRecieveFilter={setRecieveFilter} recieveFilter={recieveFilter} />
                                            )
                                        }
                                    })
                                    }

                                    {(menuTabKey == 1  && (searchClient.length==0))  &&  <p className='at-no-notification-card'>{t('common.none')}</p> }

                                    {menuTabKey == 2 && clientRecieveRequest.map((profile: any, index: number) => {
                                        if (clientRecieveRequest.length === index + 1) {
                                            return (
                                                <SearchSecieveAndSendCard key={index} profile={profile} lastCardElementRef={lastCardElementRefrecive} member={MEMBER.CLIENT} setLikeFilter={setLikeFilter} sentFilter={sentFilter} setSentFilter={setSentFilter} setRecieveFilter={setRecieveFilter} recieveFilter={recieveFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} keyvalue="receive" />
                                            )
                                        } else {
                                            return (
                                                <SearchSecieveAndSendCard key={index} setLikeFilter={setLikeFilter} profile={profile} member={MEMBER.CLIENT} setSentFilter={setSentFilter} setRecieveFilter={setRecieveFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} sentFilter={sentFilter} recieveFilter={recieveFilter} searchFilter={searchFilter} keyvalue="receive" />
                                            )
                                        }
                                    })
                                    }
                                    {(menuTabKey == 2  && (clientRecieveRequest.length==0))  &&  <p className='at-no-notification-card'>{t('common.none')}</p> }

                                    {menuTabKey == 3 && clientSentRequest.map((profile: any, index: number) => {
                                        if (clientSentRequest.length === index + 1) {
                                            return (
                                                <SearchSecieveAndSendCard key={index} profile={profile} setLikeFilter={setLikeFilter} lastCardElementRef={lastCardElementRefsent} setRecieveFilter={setRecieveFilter} member={MEMBER.CLIENT} setSentFilter={setSentFilter} sentFilter={sentFilter} recieveFilter={recieveFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} keyvalue="sent" />
                                            )
                                        } else {
                                            return (
                                                <SearchSecieveAndSendCard key={index} profile={profile} setSentFilter={setSentFilter} member={MEMBER.CLIENT} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setRecieveFilter={setRecieveFilter} setSearchFilter={setSearchFilter} sentFilter={sentFilter} recieveFilter={recieveFilter} searchFilter={searchFilter} keyvalue="sent" />
                                            )
                                        }
                                    })
                                    }
                                    {(menuTabKey == 3  && (clientSentRequest.length==0))  &&  <p className='at-no-notification-card'>{t('common.none')}</p> }

                                    {menuTabKey == 4 && memberLikeData.map((profile: any, index: number) => {
                                        // if (memberLikeData.length === index + 1) {
                                        return (
                                            <SearchCard key={index} profile={profile} lastCardElementRef={lastCardElementRefLike} member={MEMBER.CLIENT} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} sentFilter={sentFilter} setSentFilter={setSentFilter} setRecieveFilter={setRecieveFilter} recieveFilter={recieveFilter} />
                                        )
                                        // } else {
                                        //     return (
                                        //         <SearchCard key={index} profile={profile} member={MEMBER.SIDE_CHARACTER} />
                                        //     )
                                        // }
                                    })
                                    }
                                    {(menuTabKey == 4  && (memberLikeData.length==0))  &&  <p className='at-no-notification-card'>{t('common.none')}</p> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default ClientSearch