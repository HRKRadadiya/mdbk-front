import React, { useCallback, useRef, useState } from 'react'
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppLayout } from '../../components';
import { Button, Select, Input } from 'antd'
import { useTranslation } from 'react-i18next';
import ReadMore from '../../components/ReadMore';
import MakeProfile from '../../components/popup/makeProfile';
import postQuestion from '../../components/popup/postQuestion';
import PostQuestion from '../../components/popup/postQuestion';
import { ApiMemberGet, ApiMemberPost } from '../../service/api';
import { FORUM_QUESTION_LIST, FORUM_VOTE } from '../../constants/api';
import useForumResoponseData from '../../hooks/useGetForumResponce';
import { getUrl, humanizeDate } from '../../utils/helper';
import ForumResponse from '../../components/card/forumResponse';
import { useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import useForumQuestionData from '../../hooks/useGetForumQuestion';
import ForumQuestion from '../../components/card/forumQuestion';
import ForumResponseBeforeLogin from '../../components/card/forumResponseBeforeLogin';
import ForumQuestionBeforeLogin from '../../components/card/forumQuestionBeforeLogin';
import router from 'next/router';
import { LOGIN } from '../../constants/routes';
import { useEffect } from 'react';


const ForumBeforeLogin = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);
    const { t } = useTranslation();
    const { Option } = Select;
    const [buttonClicked, setButtonClicked] = useState();
    const [response, setResponse] = useState(true);
    const [question, setQuestion] = useState(false);
    const [activeTab, setActiveTab] = useState("search.dropdown.val1");
    const [activeTabQuestion, setActiveTabQuestion] = useState("search.dropdown.val1");
    const [isApplyError, setIsApplyError] = useState(false);
    const [isApplyPostQuestion, setisApplyPostQuestion] = useState(false);
    const userData = useSelector((state: State) => state.auth.userData)
    const observer = useRef<any>()
    const [searchFilter, setSearchFilter] = useState<any>({
        page: 0,
        category: ""
    })

    const [searchQuestionFilter, setSearchQuestionFilter] = useState<any>({
        page: 0,
        category: ""
    })

    useEffect(() => {
        if (response) {
            setActiveTab("search.dropdown.val1");
            setSearchFilter({ page: 1, is_refresh: !searchFilter.is_refresh, question_ids: [] })
        } else {
            setActiveTabQuestion("search.dropdown.val1");
            setSearchQuestionFilter({ page: 1, is_refresh: !searchQuestionFilter.is_refresh })
        }
    }, [response])

    const { loading,
        error,
        getResponse,
        setGetResponse,
        hasMore } = useForumResoponseData(searchFilter)

    const { loadingQuesion,
        errorQuesion,
        getQuesion,
        hasMoreQuesion,
        setGetQuesion
    } = useForumQuestionData(searchQuestionFilter)

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

    const gotoLogin = () => {
        router.push(getUrl(router.locale, LOGIN))
    }


    const lastCardElementRefQuestion = useCallback((node) => {
        if (loadingQuesion) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreQuesion) {
                setSearchQuestionFilter({ ...searchQuestionFilter, page: searchQuestionFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingQuesion, hasMoreQuesion])

    const showResponseSection = () => {
        setResponse(!response)
        setQuestion(false)
    }

    const showQuestionSection = () => {
        setQuestion(!question)
        setResponse(false)
    }
    const tabsList = [
        `search.dropdown.val1`,
        `search.dropdown.val2`,
        `search.dropdown.val3`,
        `search.dropdown.val4`,
        `search.dropdown.val5`,
    ];

    const tabsListTwo = [
        `search.dropdown.val1`,
        `search.dropdown.val2`,
        `search.dropdown.val3`,
        `search.dropdown.val4`,
        `search.dropdown.val5`,
    ];

    const filterData = (state: any) => {
        if (state == "search.dropdown.val1") {
            setSearchFilter({ ...searchFilter, page: 1, category: "" })
        } else if (state == "search.dropdown.val2") {
            setSearchFilter({ ...searchFilter, page: 1, category: "development" })
        } else if (state == "search.dropdown.val3") {
            setSearchFilter({ ...searchFilter, page: 1, category: "design" })
        } else if (state == "search.dropdown.val4") {
            setSearchFilter({ ...searchFilter, page: 1, category: "marketing" })
        } else if (state == "search.dropdown.val5") {
            setSearchFilter({ ...searchFilter, page: 1, category: "other" })
        }
        setActiveTab(state);
    };

    const filterDataTwo = (state: any) => {
        if (state == "search.dropdown.val1") {
            setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, category: "" })
        } else if (state == "search.dropdown.val2") {
            setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, category: "development" })
        } else if (state == "search.dropdown.val3") {
            setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, category: "design" })
        } else if (state == "search.dropdown.val4") {
            setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, category: "marketing" })
        } else if (state == "search.dropdown.val5") {
            setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, category: "other" })
        }
        setActiveTabQuestion(state);
    };


    const showMakeProfile = () => {
        setIsApplyError(true)
    }

    const closeMakeProfile = () => {
        setIsApplyError(false)
    }

    const showPostQuestion = () => {
        setisApplyPostQuestion(true)
    }

    const closePostQuestion = () => {
        setisApplyPostQuestion(false)
    }
    return (
        <AppLayout title="Forum" whiteHeader={true}>
            <div className="forum-page">
                <div className="forum-container">
                    <div className="forum-title">
                        <h3>{t('mdbkforum.Forum')}</h3>
                    </div>
                    <div className="forum-main-tab fe-forum-main-flex-tab">
                        <div className="fe-forum-main-start-tab">
                            <button onClick={showResponseSection} className={`${response ? 'main-tab-activeBtn pv-tab-activebtn hm-main-tab-activeBtn at-tab-activeBtn' : 'main-tab-Btn hm-main-tab-Btn'} ${router.locale == "en" ? "pv-main-tab-eng" : ""}`}>{t('mdbkforum.Response')}</button>
                            <button onClick={showQuestionSection} className={`${question ? 'main-tab-activeBtn pv-tab-activebtn hm-main-tab-activeBtn at-tab-activeBtn' : 'main-tab-Btn hm-main-tab-Btn'} ${router.locale == "en" ? "pv-main-tab-eng" : ""}`}>{t('mdbkforum.Question')}</button>
                        </div>
                        {/* {question && <Select
                            defaultValue="false"
                            onChange={(e: any) => setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, is_waiting_response: e == "true" ? true : false })}
                            placeholder={t('forumPopup.questionInput.placeholder.selectCategory')}
                            className="ft-custom-ant-select select-1"
                        >
                            <Option value="true">{t('mdbkforum.waitinganswered')}</Option>
                            <Option value="false">{t('mdbkforum.answered')}</Option>
                            {/* <p className="dropdown-placeholder">{t('forumPopup.questionInput.placeholder.selectCategory')}</p> */}
                        {/* </Select> */}
                        {/* } */}
                    </div>
                    {response &&
                        <div className="response-page-content hm-response-page-content">
                            <div className="btn-1">
                                {tabsList.map((tab, i) => {
                                    return (
                                        <button
                                            className={`${activeTab === tab ? "tab-card-activeBtn hm-line-height-28 pv-line-height-16" : "tab-cardBtn hm-line-height-28  pv-line-height-16"} ${router.locale == "en" ? "pv-activebtn-eng" : ""}`}
                                            onClick={() => filterData(tab)}
                                        >
                                            {t(tab)}
                                        </button>
                                    );
                                })}
                            </div>

                            {getResponse && getResponse.map((items: any, index: number) => {
                                if (getResponse.length === index + 1) {
                                    return (
                                        <ForumResponseBeforeLogin key={index} getResponse={getResponse} setGetResponse={setGetResponse} index={index} items={items} lastCardElementRef={lastCardElementRef} />
                                    )
                                } else {
                                    return (
                                        <ForumResponseBeforeLogin key={index} getResponse={getResponse} setGetResponse={setGetResponse} index={index} items={items} />
                                    )
                                }
                            })
                            }
                        </div>
                    }
                    {question &&
                        <div className={`response-page-content  pv-select-drodown pv-moblie-forum-selector ${router.locale == "en" ? "pv-select-eng" : ""}`}>
                            <div className="btn-1 question-tab-row">
                                <div>
                                    {tabsListTwo.map((tab, i) => {
                                        return (
                                            <button
                                                className={`${activeTabQuestion === tab ? "tab-card-activeBtn hm-line-height-28 pv-line-height-16" : "tab-cardBtn hm-line-height-28 pv-line-height-16"} ${router.locale == "en" ? "pv-activebtn-eng" : ""}`}
                                                onClick={() => filterDataTwo(tab)}
                                            >
                                                {t(tab)}
                                            </button>
                                        );
                                    })}
                                </div>
                                {(width > 720) ?
                                    (question && <Select
                                        defaultValue="true"
                                        onChange={(e: any) => setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, is_waiting_response: e == "true" ? true : false })}
                                        placeholder={t('forumPopup.questionInput.placeholder.selectCategory')}
                                        className="ft-custom-ant-select select-1"
                                    >
                                        <Option value="true">{t('mdbkforum.waitinganswered')}</Option>
                                        <Option value="false">{t('mdbkforum.answered')}</Option>
                                        {/* <p className="dropdown-placeholder">{t('forumPopup.questionInput.placeholder.selectCategory')}</p> */}
                                    </Select>)
                                    :
                                    (question && <Select
                                        defaultValue="true"
                                        onChange={(e: any) => setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, is_waiting_response: e == "true" ? true : false })}
                                        placeholder={t('forumPopup.questionInput.placeholder.selectCategory')}
                                        className="ft-custom-ant-select select-1"
                                    >
                                        <Option value="true">{t('mdbkforum.waitinganswered')}</Option>
                                        <Option value="false">{t('mdbkforum.answered')}</Option>
                                        {/* <p className="dropdown-placeholder">{t('forumPopup.questionInput.placeholder.selectCategory')}</p> */}
                                    </Select>)
                                }
                            </div>

                            <div className="post-question-card" onClick={gotoLogin}>
                                {/* <div className="profile-row">
                                    <img src="/grayuser.svg" alt="" />
                                    <p>{userData?.member?.nickname}</p>

                                </div> */}
                                <div className="post-question" >
                                    <input type="text" placeholder={t('mdbkforum.Whatask')} />
                                    <div className="post-quebtn-footer">
                                        <button className="post-quebtn" onClick={gotoLogin}>
                                            {t('mdbkforum.PostQuestion')}
                                        </button>

                                    </div>
                                </div>
                            </div>
                            {getQuesion && getQuesion.map((items: any, index: number) => {
                                if (getQuesion.length === index + 1) {
                                    return (
                                        <ForumQuestionBeforeLogin key={index} index={index} items={items} setGetQuesion={setGetQuesion} getQuesion={getQuesion} lastCardElementRef={lastCardElementRefQuestion} />
                                    )
                                } else {
                                    return (
                                        <ForumQuestionBeforeLogin key={index} index={index} setGetQuesion={setGetQuesion} getQuesion={getQuesion} items={items} />
                                    )
                                }
                            })
                            }
                        </div>
                    }
                </div>
            </div>
            <MakeProfile
                showMakeProfile={isApplyError}
                closeMakeProfile={closeMakeProfile} />
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default ForumBeforeLogin
