import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppLayout } from '../../components';
import { Button, Select, Input } from 'antd'
import { useTranslation } from 'react-i18next';
import ReadMore from '../../components/ReadMore';
import MakeProfile from '../../components/popup/makeProfile';
import postQuestion from '../../components/popup/postQuestion';
import PostQuestion from '../../components/popup/postQuestion';
import { ApiMemberDelete, ApiMemberGet, ApiMemberPost } from '../../service/api';
import { FORUM, FORUM_DRAFT_QUESTION, FORUM_QUESTION_LIST, FORUM_VOTE } from '../../constants/api';
import useForumResoponseData from '../../hooks/useGetForumResponce';
import { humanizeDate, isEmpty, __qs_delete } from '../../utils/helper';
import ForumResponse from '../../components/card/forumResponse';
import { useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import useForumQuestionData from '../../hooks/useGetForumQuestion';
import ForumQuestion from '../../components/card/forumQuestion';
import router from 'next/router';

const Question = () => {
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
    const clientData = useSelector((state: State) => state?.clientData)
    let { rId } = router.query
    const [responseId, setResponseId] = useState<any>(rId)
    const [activeTab, setActiveTab] = useState("search.dropdown.val1");
    const [activeTabQuestion, setActiveTabQuestion] = useState("search.dropdown.val1");
    const [isApplyError, setIsApplyError] = useState(false);
    const [isQuestionResponse, setIsQuestionResponse] = useState(false)
    const [isQuestionResponseID, setIsQuestionResponseID] = useState(0)
    const [isApplyPostQuestion, setisApplyPostQuestion] = useState(false);
    const [draftData, setDraftData] = useState<any>()
    const userData = useSelector((state: State) => state.auth.userData)
    const observer = useRef<any>()
    const [hashtag, setHashtag] = useState("")
    const [searchFilter, setSearchFilter] = useState<any>({
        page: 0,
        category: "",
        is_refresh: true
    })

    const [searchQuestionFilter, setSearchQuestionFilter] = useState<any>({
        page: 0,
        category: "",
        is_refresh: true
    })
    if (responseId != undefined || responseId != null)
        __qs_delete('rId')

    const { loading,
        error,
        getResponse,
        setGetResponse,
        getQuestion,
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

    useEffect(() => {
        handleDraftData()
    }, [])

    useEffect(() => {
        if (isQuestionResponse) {
            setSearchFilter({ ...searchFilter, page: 1, is_refresh: !searchFilter.is_refresh, question_ids: [isQuestionResponseID], response_ids: [], hashtag: "" })
        }
    }, [isQuestionResponse, isQuestionResponseID])

    useEffect(() => {
        if (response) {
            setActiveTab("search.dropdown.val1");
            if (!isQuestionResponse) {
                setSearchFilter({ page: 1, is_refresh: !searchFilter.is_refresh, question_ids: [], response_ids: [], hashtag: "" })
            }
            if (responseId != undefined || responseId != null) {
                setSearchFilter({ page: 1, is_refresh: !searchFilter.is_refresh, response_ids: [responseId], question_ids: [], hashtag: "" })
                setResponseId(undefined)
            }
        } else {
            setIsQuestionResponse(false)
            setHashtag("")
            setActiveTabQuestion("search.dropdown.val1");
            setSearchQuestionFilter({ page: 1, is_refresh: !searchQuestionFilter.is_refresh, is_waiting_response: true })
        }
    }, [isQuestionResponse, response])

    const handleDraftData = async () => {
        await ApiMemberGet(FORUM_DRAFT_QUESTION)
            .then((response: any) => {
                if (response.data && response.success) {
                    setDraftData(response?.data)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("error", error)
            })
    }

    const showResponseSection = () => {
        setResponse(true)
        setQuestion(false)
    }

    const showQuestionSection = () => {
        setQuestion(true)
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
            setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, category: "", })
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
            <div className="forum-page hm-forum-page">
                <div className="forum-container">
                    <div className="forum-title">
                        <h3>{t('mdbkforum.Forum')}</h3>
                    </div>
                    <div className="forum-main-tab fe-forum-main-flex-tab  forum-dropdown-select">
                        <div className="fe-forum-main-start-tab">
                            <button onClick={showResponseSection} className={`${response ? 'main-tab-activeBtn pv-tab-activebtn hm-main-tab-activeBtn at-tab-activeBtn' : 'main-tab-Btn hm-main-tab-Btn'} ${router.locale == "en" ? "pv-main-tab-eng" : ""}`}>{t('mdbkforum.Response')}</button>
                            <button onClick={showQuestionSection} className={`${question ? 'main-tab-activeBtn pv-tab-activebtn hm-main-tab-activeBtn at-tab-activeBtn' : 'main-tab-Btn hm-main-tab-Btn'} ${router.locale == "en" ? "pv-main-tab-eng" : ""}`}>{t('mdbkforum.Question')}</button>
                        </div>
                    </div>
                    {response &&
                        <div className="response-page-content hm-response-page-content">
                            <div className="btn-1">
                                {tabsList.map((tab, i) => {
                                    return (
                                        <button
                                            key={"response_filter_type_" + tab}
                                            className={`${activeTab === tab ? "tab-card-activeBtn hm-line-height-28 pv-line-height-16" : "tab-cardBtn hm-line-height-28  pv-line-height-16"} ${router.locale == "en" ? "pv-activebtn-eng" : ""}`}
                                            onClick={() => filterData(tab)}
                                        >
                                            {t(tab)}
                                        </button>
                                    );
                                })}
                            </div>
                            {isQuestionResponse &&
                                <div className="pv-response-ctn">
                                    <p className="hm-response-hashtag-ctn">
                                        <span className="hm-response-question">{!isEmpty(getQuestion?.question) && `${getQuestion?.question?.text}?`}</span>
                                        <span className="hm-list-answer">{t('mdbkforum.Listanswers')}</span>
                                    </p>
                                </div>
                            }
                            {!(hashtag == "") &&
                                <div className="pv-response-ctn">
                                    <p className="hm-response-hashtag-ctn at-res-has">
                                        <span className="hm-response-hashtag">#{hashtag}</span>
                                        <span className="hm-list-answer"> {t('mdbkforum.Listanswers')} </span>
                                    </p>
                                </div>
                            }

                            {/* <div className="post-question-card">
                                <div className="profile-row">
                                    <img src="/grayuser.svg" alt="" />
                                    <p>{userData?.member?.nickname}</p>

                                </div>
                                <div className="post-question">
                                    <input type="text" placeholder={t('mdbkforum.Whatask')} />
                                    <div className="post-quebtn-footer">
                                        <button className="post-quebtn" onClick={showMakeProfile}>
                                            질문작성
                                        </button>
                                        <button className="post-quebtn" onClick={showPostQuestion}>
                                            {t('mdbkforum.PostQuestion')}
                                        </button>

                                    </div>
                                </div>
                            </div> */}
                            {getResponse && getResponse.map((items: any, index: number) => {
                                if (getResponse.length === index + 1) {
                                    return (
                                        <ForumResponse key={"Forum_Response" + index} setIsQuestionResponse={setIsQuestionResponse} setHashtag={setHashtag} setSearchFilter={setSearchFilter} searchFilter={searchFilter} getResponse={getResponse} setResponse={setResponse} setQuestion={setQuestion} setGetResponse={setGetResponse} index={index} items={items} lastCardElementRef={lastCardElementRef} />
                                    )
                                } else {
                                    return (
                                        <ForumResponse key={"Forum_Response" + index} setIsQuestionResponse={setIsQuestionResponse} setHashtag={setHashtag} setSearchFilter={setSearchFilter} searchFilter={searchFilter} setResponse={setResponse} setQuestion={setQuestion} getResponse={getResponse} setGetResponse={setGetResponse} index={index} items={items} />
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
                                                key={"question_filter_type_" + tab}
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
                                        className="ft-custom-ant-select  select-1"
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
                                        className="ft-custom-ant-select  select-1"
                                    >
                                        <Option value="true">{t('mdbkforum.waitinganswered')}</Option>
                                        <Option value="false">{t('mdbkforum.answered')}</Option>
                                        {/* <p className="dropdown-placeholder">{t('forumPopup.questionInput.placeholder.selectCategory')}</p> */}
                                    </Select>)
                                }
                            </div>
                            <div className="post-question-card" onClick={showPostQuestion}>
                                <div className="profile-row hm-profile-row">
                                    <img src={isEmpty(clientData?.profile?.profile_picture) ? "/grayuser.svg" : clientData?.profile?.profile_picture} alt="" />
                                    <p>{isEmpty(clientData?.profile?.nick_name) ? userData?.member?.name : clientData?.profile?.nick_name}</p>

                                </div>
                                <div className="post-question">
                                    <input type="text" placeholder={t('mdbkforum.Whatask')} />
                                    <div className="post-quebtn-footer">
                                        {/* <button className="post-quebtn" onClick={showMakeProfile}>
                                            질문작성
                                        </button> */}
                                        <button className="post-quebtn hm-line-height-28" onClick={showPostQuestion}>
                                            {t('mdbkforum.PostQuestion')}
                                        </button>

                                    </div>
                                </div>
                            </div>
                            {getQuesion && getQuesion.map((items: any, index: number) => {
                                if (getQuesion.length === index + 1) {
                                    return (
                                        <ForumQuestion key={"Forum_Question" + index} searchQuestionFilter={searchQuestionFilter} setSearchQuestionFilter={setSearchQuestionFilter} index={index} setResponse={setResponse} setQuestion={setQuestion} items={items} setGetQuesion={setGetQuesion} getQuesion={getQuesion} setIsQuestionResponseID={setIsQuestionResponseID} setIsQuestionResponse={setIsQuestionResponse} lastCardElementRef={lastCardElementRefQuestion} />
                                    )
                                } else {
                                    return (
                                        <ForumQuestion searchQuestionFilter={searchQuestionFilter} setSearchQuestionFilter={setSearchQuestionFilter} key={"Forum_Question" + index} index={index} setIsQuestionResponseID={setIsQuestionResponseID} setResponse={setResponse} setIsQuestionResponse={setIsQuestionResponse} setQuestion={setQuestion} setGetQuesion={setGetQuesion} getQuesion={getQuesion} items={items} />
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



            {draftData && <PostQuestion
                draftData={draftData}
                searchQuestionFilter={searchQuestionFilter}
                setSearchQuestionFilter={setSearchQuestionFilter}
                showPostQuestion={isApplyPostQuestion}
                closePostQuestion={closePostQuestion} />
            }

        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default Question
