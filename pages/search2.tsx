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
import { LIKE_TYPE_SIDE_CHARACTER, MEMBER } from '../constants/keywords';
import { useRef } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { ApiMemberGet } from '../service/api';
import { SEARCH_MY_LIKE } from '../constants/api';
import useLikeData from '../hooks/useLikeData';
import { isEmpty } from '../utils/helper';
import { useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import useSideCharRecieveRequest from '../hooks/useSideCharRecieveRequest';
import useSideCharSendRequest from '../hooks/useSideCharSendRequest';
import SearchSecieveAndSendCard from '../components/card/searchRecieveAndSendCard';
import useDidMountEffect from '../hooks/useDidMountEffect';

function Search2() {
    const { Option } = Select;
    const { t } = useTranslation();
    const [filterShow, setFilterShow] = useState(false)
    const observer = useRef<any>()
    const registration_type = useSelector((state: State) => state.auth.userData?.registration_type)
    const sideCharacterSearch = useSelector((state: State) => state.memberSearch)
    const clientProgress = useSelector((state: State) => state.auth.clientProgress)
    const [searchFilter, setSearchFilter] = useState<any>({
        page: 0,
        profession: [],
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
        registration_type: registration_type,
        profile: LIKE_TYPE_SIDE_CHARACTER,
        is_refresh: true
    })

    const [recieveFilter, setRecieveFilter] = useState({
        page: 0,
        registration_type: 1,
        request_type: "receive",
        is_refresh: true
    })
    const [sentFilter, setSentFilter] = useState({
        page: 0,
        registration_type: 1,
        request_type: "sent",
        is_refresh: true
    })

    const [menuTabKey, setMenuTabKey] = useState(1)

    const {
        searchSideCharecter,
        hasMore,
        loading,
        error,
    } = useSearchSideCharecter(searchFilter)

    const {
        memberLikeData,
        hasMoreLike,
        loadingLike,
        errorLike
    } = useLikeData(likeFilter)


    const { loadingSideCharRecieve, errorSideCharRecieve, sideCharRecieveRequest, hasMoreSideCharRecieve } = useSideCharRecieveRequest(recieveFilter)
    const { loadingSideCharSent, errorSideCharSent, sideCharSentRequest, hasMoreSideCharSent } = useSideCharSendRequest(sentFilter)

    const lastCardElementRefsent = useCallback((node) => {
        if (loadingSideCharSent) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreSideCharSent) {
                setSentFilter({ ...sentFilter, page: sentFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingSideCharSent, hasMoreSideCharSent])

    const lastCardElementRefrecive = useCallback((node) => {
        if (loadingSideCharRecieve) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreSideCharRecieve) {
                setRecieveFilter({ ...recieveFilter, page: recieveFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingSideCharRecieve, hasMoreSideCharRecieve])

    const filterShowChange = () => {
        setFilterShow(!filterShow)
        window.scrollTo(0, 0);
    }


    const resetForm = () => {
        setSearchFilter({ page: 1, registration_type, is_reset: true })
    }

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

    return (
        <>
            <AppLayout title={t('featureSearch.Findsidecharacters')} whiteHeader={true}>
                <div className="fe-page-outer ft-sc-search-page-al">
                    <div className="ft-footer-static">
                        <div className="ft-search-section">
                            <div className="ft-page-container">
                                <div className="ft-desk-element">
                                    <div className="mb-40">
                                        {clientProgress >= 80 ? null : <Giftbox />}
                                    </div>
                                </div>
                                {/* <div className="ft-subtitle-main">
                                    <h1 className='ft-sub-title'>
                                        {t('featureSearch.Findsidecharacters')}
                                    </h1>
                                    <div className="right">
                                        <Button className="" >{t('featureSearch.Refresh')}</Button>
                                    </div>
                                </div> */}
                                <div className="ft-custom-search-tab">
                                    <HeaderTab val={menuTabKey} setMenuTabKey={setMenuTabKey} onFinishSearch={onFinishSearch} member={MEMBER.SIDE_CHARACTER} filterShow={filterShow} setFilterShow={setFilterShow} filterShowChange={filterShowChange} resetForm={resetForm} Search={sideCharacterSearch} type={LIKE_TYPE_SIDE_CHARACTER} />
                                </div>
                            </div>
                        </div>
                        <div className="ft-fabg">
                            <div className="ft-mb-element">
                                {clientProgress >= 80 ? null : <Giftbox />}
                            </div>
                            <div className="ft-search-detail-card">
                                <div className="ft-page-container">
                                    {menuTabKey == 1 && 
                                    searchSideCharecter.map((profile: any, index: number) => {
                                        if (searchSideCharecter.length === index + 1) {
                                            return (
                                                <SearchCard key={index} profile={profile} lastCardElementRef={lastCardElementRef} member={MEMBER.SIDE_CHARACTER} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} />
                                            )
                                        } else {
                                            return (
                                                <SearchCard key={index} profile={profile} member={MEMBER.SIDE_CHARACTER} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} />
                                            )
                                        }
                                    })
                                   
                                    }

                                    {
                                     (menuTabKey == 1 && (searchSideCharecter.length==0))  &&  <p className='at-no-notification-card'>{t('common.none')}</p>  
                                    }

                                    {menuTabKey == 2 && sideCharRecieveRequest.map((profile: any, index: number) => {
                                        if (sideCharRecieveRequest.length === index + 1) {
                                            return (
                                                <SearchSecieveAndSendCard key={index} profile={profile} lastCardElementRef={lastCardElementRefrecive} member={MEMBER.SIDE_CHARACTER} setLikeFilter={setLikeFilter} keyvalue="receive" likeFilter={likeFilter} setSearchFilter={setSearchFilter} setSentFilter={setSentFilter} sentFilter={sentFilter} searchFilter={searchFilter} recieveFilter={recieveFilter} setRecieveFilter={setRecieveFilter} />
                                            )
                                        } else {
                                            return (
                                                <SearchSecieveAndSendCard key={index} setSentFilter={setSentFilter} profile={profile} member={MEMBER.SIDE_CHARACTER} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} keyvalue="receive" searchFilter={searchFilter} setRecieveFilter={setRecieveFilter} sentFilter={sentFilter} recieveFilter={recieveFilter} />
                                            )
                                        }
                                    })
                                    }
                                    {
                                     (menuTabKey == 2  && (sideCharRecieveRequest.length==0))  &&  <p className='at-no-notification-card'>{t('common.none')}</p>  
                                    }
                                    {menuTabKey == 3 && sideCharSentRequest.map((profile: any, index: number) => {
                                        if (sideCharSentRequest.length === index + 1) {
                                            return (
                                                <SearchSecieveAndSendCard key={index} profile={profile} setSentFilter={setSentFilter} lastCardElementRef={lastCardElementRefsent} member={MEMBER.SIDE_CHARACTER} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} sentFilter={sentFilter} setRecieveFilter={setRecieveFilter} recieveFilter={recieveFilter} keyvalue="sent" />
                                            )
                                        } else {
                                            return (
                                                <SearchSecieveAndSendCard key={index} profile={profile} setSentFilter={setSentFilter} member={MEMBER.SIDE_CHARACTER} setLikeFilter={setLikeFilter} setRecieveFilter={setRecieveFilter} likeFilter={likeFilter} recieveFilter={recieveFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} sentFilter={sentFilter} keyvalue="sent" />
                                            )
                                        }
                                    })
                                    }
                                    {
                                     (menuTabKey == 3  && (sideCharSentRequest.length==0))  &&  <p className='at-no-notification-card'>{t('common.none')}</p>  
                                    }

                                    {menuTabKey == 4 && memberLikeData.map((profile: any, index: number) => {
                                        // if (memberLikeData.length === index + 1) {
                                        return (
                                            <SearchCard key={index} profile={profile} lastCardElementRef={lastCardElementRefLike} member={MEMBER.SIDE_CHARACTER} setLikeFilter={setLikeFilter} likeFilter={likeFilter} setSearchFilter={setSearchFilter} searchFilter={searchFilter} />
                                        )
                                        // } else {
                                        //     return (
                                        //         <SearchCard key={index} profile={profile} member={MEMBER.SIDE_CHARACTER} />
                                        //     )
                                        // }
                                    })
                                    }
                                    {
                                     (menuTabKey == 4  && (memberLikeData.length==0))  &&  <p className='at-no-notification-card'>{t('common.none')}</p>  
                                    }
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

export default Search2