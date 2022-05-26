import { useEffect } from 'react';
import _ from 'lodash';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FORUM, FORUM_CREATE, FORUM_REPORT_UNREPORT, FORUM_VOTE } from '../../constants/api';
import { State } from '../../redux/reducers/rootReducer';
import { ApiMemberDelete, ApiMemberPost } from '../../service/api';
import { Modal as BootstrapModel } from 'react-bootstrap'
import Storage from '../../service/storage';
import { getUrl, humanizeDate, isEmpty, isValidUrl } from '../../utils/helper';
import EditQuestion from '../popup/EditQuestion';
import ReadMore from '../ReadMore';
import router from 'next/router';
import { MakeProfilePopup } from '..';
import $ from 'jquery'
import { Button } from 'antd';
import { nike_name_Change, Profile_Picture_Change, register_Type_Change } from '../../redux/actions/memberAction';
import { EDIT_CLIENT_PROFILE, EDIT_SIDE_CHARACTER_PROFILE } from '../../constants/routes';

const ForumQuestion = ({ searchQuestionFilter, setSearchQuestionFilter, items, lastCardElementRef, setIsQuestionResponseID, setGetQuesion, getQuesion, setResponse, setQuestion, setIsQuestionResponse }: any) => {
    const { t } = useTranslation();
    const [imageUpload, setImageUpload] = useState(false)
    const [linkUpload, setLinkUpload] = useState(false)
    const token = Storage.get('token');
    const [openImageUploadInput, setOpenImageUploadInput] = useState(false);
    const [isApplyPostQuestion, setisApplyPostQuestion] = useState(false);
    const [openLinkUploadInput, setOpenLinkUploadInput] = useState(false);
    const dispatch = useDispatch();
    const [isApplyError, setIsApplyError] = useState(false)
    const [deleteQuestion, setDeleteQuestion] = useState(false)
    const [isSwitch, setIsSwitch] = useState(false)
    const [switchData, setSwitchData] = useState<any>("")
    const [responseCounter, setResponseCounter] = useState<any>()
    const [isResponseDone, setIsResponseDone] = useState(false)
    const [isLike, setIsLike] = useState(true)
    const [openTagUploadInput, setOpenTagUploadInput] = useState(false);
    const sideCharData = useSelector((state: State) => state?.sideCharData)
    const userData = useSelector((state: State) => state.auth.userData)
    const [reportCounter, setReportCounter] = useState<any>()
    const [giveResponse, setGiveResponse] = useState(false)
    const [questionData, setQuestionData] = useState<any>()
    const [likeCounter, setLikeCounter] = useState({
        flag: (items?.like_flag && items?.vote_type == 1) ? true : false,
        count: items?.total_upvote
    })
    const [disLikeCounter, setDiLikeCounter] = useState({
        flag: (items?.like_flag && items?.vote_type == 0) ? true : false,
        count: items?.total_downvote
    })
    const [responseData, setResponseData] = useState<any>({
        forum_image: null,
        parent_id: 0,
        links: "",
        hashtags: [],
        text: ""
    })

    useEffect(() => {
        setResponseCounter(items?.total_response)
        setReportCounter(items?.total_reports)
    }, [items])

    const [imageName, setImageName] = useState();
    const [postResoponce, setPostResoponce] = useState(true)
    const [editData, setEditData] = useState({
        category: items?.category,
        text: items?.text,
        link: items?.link,
        is_draft: false,
    })

    useEffect(() => {
        if (responseData.text != "") {
            setPostResoponce(false)
        } else {
            setPostResoponce(true)
        }
    }, [responseData])

    const [tags, setTags] = useState<any>([])
    let tagInput: any

    const closePostQuestion = () => {
        setisApplyPostQuestion(false)
    }
    const handleResponse = (id: number) => {
        setIsQuestionResponseID(id)
        setIsQuestionResponse(true)
        setResponse(true)
        setQuestion(false)
    }

    const openImageUpload = () => {
        if (!openLinkUploadInput) {
            setImageUpload(false)
            setLinkUpload(true)
            setOpenImageUploadInput(!openImageUploadInput)
        }
        if (openImageUploadInput) {
            setLinkUpload(false)
        }
    }

    const openLinkUpload = () => {
        if (!openImageUploadInput) {
            setImageUpload(true)
            setLinkUpload(false)
            setOpenLinkUploadInput(!openLinkUploadInput)
        }
        if (openLinkUploadInput) {
            setImageUpload(false)
        }
    }

    const openTagUpload = () => {
        setOpenTagUploadInput(!openTagUploadInput)
    }

    const showPostQuestion = () => {
        setisApplyPostQuestion(true)
    }

    const removeTag = (i: number) => {
        const newTags = [...tags];
        newTags.splice(i, 1);
        setTags(newTags);
    }

    const inputKeyDown = (e: any) => {
        const val = e.target.value;
        if (e.key === 'Enter' && val) {
            if (tags.find((tag: any) => tag.toLowerCase() === val.toLowerCase())) {
                return;
            }
            setTags([...tags, val]);
            tagInput.value = null;
        } else if (e.key === 'Backspace' && !val) {
            removeTag(tags.length - 1);
        }
    }

    const handleReport = async (type: string, id: number) => {
        await ApiMemberPost(FORUM_REPORT_UNREPORT, {
            report_type: type,
            source_id: id,
            registration_type: userData.registration_type
        }).then(async (response: any) => {
            setReportCounter(response.data.report_flag ? reportCounter + 1 : reportCounter - 1)
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    const handleDelete = async (id: number) => {
        await ApiMemberDelete(FORUM + `/${id}`).then(async (response: any) => {
            if (response.data && response.success) {
                setGetQuesion(getQuesion.filter((data: any) => data.id != id))
                // setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, is_refresh: !searchQuestionFilter.is_refresh })
                setDeleteQuestion(false)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            setDeleteQuestion(false)
            console.log("Error", error)
        })
    }

    const attechImage = () => {
        $("#attechImage").trigger("click");
    };


    useEffect(() => {
    }, [likeCounter, disLikeCounter])

    const handlVote = async (id: number, vote: number) => {
        setIsLike(false)
        if (vote == 1) {
            if (disLikeCounter.flag) {
                setDiLikeCounter({
                    ...disLikeCounter,
                    count: disLikeCounter.count - 1
                })
            }
            if (likeCounter.flag) {
                setLikeCounter({
                    ...likeCounter,
                    count: likeCounter.count - 1
                })
            } else {
                setLikeCounter({
                    ...likeCounter,
                    count: likeCounter.count + 1
                })
            }

        } else {
            if (likeCounter.flag) {
                setLikeCounter({
                    ...likeCounter,
                    count: likeCounter.count - 1
                })
            }
            if (disLikeCounter.flag) {
                setDiLikeCounter({
                    ...disLikeCounter,
                    count: disLikeCounter.count - 1
                })
            } else {
                setDiLikeCounter({
                    ...disLikeCounter,
                    count: disLikeCounter.count + 1
                })
            }
            // setDiLikeCounter({
            //     ...disLikeCounter,
            //     count: disLikeCounter.count + 1
            // })
        }
        await ApiMemberPost(FORUM_VOTE, {
            forum_id: id,
            vote_type: vote
        }).then(async (response: any) => {
            if (response.data && response.success) {
                if (response.data.forums.like_flag == true && response.data.forums.vote_type == 0) {
                    setDiLikeCounter({
                        flag: response.data.forums.like_flag,
                        count: response.data.total_downvote
                    })
                    setLikeCounter({
                        flag: false,
                        count: response.data.total_upvote
                    })
                } else if (response.data.forums.like_flag == false && response.data.forums.vote_type == 0) {
                    setDiLikeCounter({
                        flag: response.data.forums.like_flag,
                        count: response.data.total_downvote
                    })
                    setLikeCounter({
                        flag: false,
                        count: response.data.total_upvote
                    })
                } else if (response.data.forums.like_flag == true && response.data.forums.vote_type == 1) {
                    setDiLikeCounter({
                        flag: false,
                        count: response.data.total_downvote
                    })
                    setLikeCounter({
                        flag: response.data.forums.like_flag,
                        count: response.data.total_upvote
                    })
                } else if (response.data.forums.like_flag == false && response.data.forums.vote_type == 1) {
                    setDiLikeCounter({
                        flag: false,
                        count: response.data.total_downvote
                    })
                    setLikeCounter({
                        flag: response.data.forums.like_flag,
                        count: response.data.total_upvote
                    })
                }
                setIsLike(true)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    const handleResponseCreate = async (id: any, tag: any) => {
        setGiveResponse(false)
        const formData = new FormData();
        formData.append('forum_image', responseData.forum_image)
        formData.append('links', responseData.links)
        formData.append('parent_id', id)
        for (var x = 0; x < tag.length; x++) {
            formData.append("hashtags", tag[x]);
        }
        formData.append('text', responseData.text)
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
                'content-type': 'multipart/form-data'
            }
        }
        await ApiMemberPost(FORUM_CREATE, formData, config).then(async (response: any) => {
            if (response.data && response.success) {
                setIsResponseDone(true)
                setResponseCounter(responseCounter + 1)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            setIsResponseDone(false)
            if (error?.code == 400 && error?.error?.is_profile_completed == false) {
                setSwitchData(error?.error)
                setIsApplyError(true);
            }
            console.log("Error", error)
        })
    }

    useEffect(() => {
        if (isSwitch) {
            if (userData?.registration_type == 1) {
                dispatch(register_Type_Change(switchData?.switch_response?.registration_type))
                dispatch(nike_name_Change(switchData?.switch_response?.profile.nick_name))
                dispatch(Profile_Picture_Change(switchData?.switch_response?.profile_picture))
                router.push(getUrl(router.locale, EDIT_SIDE_CHARACTER_PROFILE))
            } else {
                userData.registration_type == 1 ? router.push(getUrl(router.locale, EDIT_CLIENT_PROFILE))
                    : router.push(getUrl(router.locale, EDIT_SIDE_CHARACTER_PROFILE))
            }
        }
    }, [switchData, isSwitch])

    return (
        <div className="Forum-qusetionCard-conatiner  hm-Forum-qusetionCard-conatiner" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            <div className="Forum-qusetionCard hm-Forum-qusetionCard">
                <div className="profile-row">
                    <img src={isEmpty(items?.client_profile?.profile_picture) ? "/grayuser.svg" : items?.client_profile?.profile_picture} />
                    <p> {items?.client_profile?.nick_name}  <span className="at-ago-dot">∙</span><span> {humanizeDate(new Date(items?.created_at), t)}</span></p>
                    {items?.is_my_post ?
                        <div className="postEdit">
                            <button className="edit-icon" onClick={showPostQuestion}><img src="/editPost.svg" /></button>
                            <button onClick={() => setDeleteQuestion(true)}><img src="/trashPost.svg" /></button>
                        </div>
                        :
                        <div className="postEdit">
                            <span>{reportCounter}</span>
                            <button onClick={() => handleReport("question", items?.id)}><img src="/profile-report-icon.svg" /></button>
                        </div>
                    }
                </div>
                <div className="Forum-question-content hm-break-word-ctn">
                    <ReadMore>
                        <p>{items?.text}</p>
                    </ReadMore>
                </div>
                {((_.get(items?.link_info, "og:image", null) == null) || _.get(items?.link_info, "og:image", null) == "") ?
                    <div className="qusetionList-img">
                        {isEmpty(items?.link) ? null :
                            <div className="fe-Postcontent-link">
                                <p><a href={isValidUrl(items?.link) ? items?.link : "http://" + items?.link} target="_blank">{items?.link}</a></p>
                            </div>
                        }
                    </div>
                    :
                    <div className="qusetionList-img">
                        <a href={_.get(items?.link_info, "og:image", null) == null ? "" : _.get(items?.link_info, "og:image", null)} target="_blank"><img src={_.get(items?.link_info, "og:image", null) == null ? "" : _.get(items?.link_info, "og:image", null)} />
                        </a>
                        {isEmpty(items?.link) ? null :
                            <div className="fe-Postcontent-link">
                                <p><a href={isValidUrl(items?.link) ? items?.link : "http://" + items?.link} target="_blank">{items?.link}</a></p>
                            </div>
                        }
                    </div>
                }
                <div className="profileContent-main answerResponse-row">
                    <div className="postAnswerResponse">
                        <div className="ToalComments" onClick={() => handleResponse(items?.id)}>
                            <p>  {t('mdbkforum.Response')} <span> {responseCounter} </span></p>
                        </div>


                        <div className="postComment-like like-1" onClick={() => isLike && handlVote(items?.id, 1)}>
                            <img src="/like.png" />
                            <span>{likeCounter.count}</span>
                        </div>

                        <div className="postComment-unlike like-2" onClick={() => isLike && handlVote(items?.id, 0)}>
                            <img src="/unlike.png" />
                            <span>{disLikeCounter.count}</span>
                        </div>
                    </div>
                    <div className="answerBtnSection">
                        <button className={`answerBtn ${(giveResponse || items?.member_id == userData?.member?.id) ? "disable" : ""}`} disabled={(items?.member_id == userData?.member?.id)} onClick={() => setGiveResponse(true)}>{t('mdbkforum.Answer')}</button>
                    </div>
                </div>

                {giveResponse &&
                    <div className="answerBtn-Section">
                        <div className="forum-editor">
                            <div className="forum-top-row">
                                <div className="forum-profile-editor pv-forum-profile-editor">

                                    <img src={isEmpty(sideCharData?.profile?.profile_picture) ? "/grayuser.svg" : sideCharData?.profile?.profile_picture} alt="" />
                                    <h4>{isEmpty(sideCharData?.profile?.nick_name) ? userData?.member?.name : sideCharData?.profile?.nick_name}</h4>
                                </div>
                                <div>
                                    <button><img src={`${!imageUpload ? "/color-upload.png" : "/disableimageicon.png"}`} alt="" onClick={openImageUpload} className="uploadBtn" /></button>
                                    <button><img src={`${!linkUpload ? "/color-links.png" : "/disablelink.png"}`} alt="" onClick={openLinkUpload} className="LinkBtn" /></button>
                                    <button><img src="/hashtag.png" alt="" onClick={openTagUpload} className="HashTagBtn" /></button>
                                </div>
                            </div>
                        </div>

                        <div className="answer-textarea">
                            <div className="">
                                <textarea placeholder={t("mdbkforum.Enterresponse")} onChange={(e: any) => setResponseData({ ...responseData, text: e.target.value })}>
                                </textarea>
                                <div className="topupload-section">
                                    {openImageUploadInput &&
                                        <div className="fileupload-inputs ">
                                            <input
                                                id="attechImage"
                                                type="file"
                                                hidden
                                                onChange={(e: any) => {
                                                    setImageName(e.target.files[0].name)
                                                    setResponseData({ ...responseData, forum_image: e.target.files[0], links: null })
                                                }}
                                            />
                                            <div onClick={attechImage} className="hm-image-upload-ctn">
                                                <input
                                                    name="title"
                                                    type="text"
                                                    className="text-base w-full h-12 rounded-md border-gray-400 mt-3 pl-12"
                                                    placeholder={`${t(
                                                        "mdbkforum.Nofilechosen"
                                                    )}`}
                                                    value={imageName}
                                                    autoComplete="off"

                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    }
                                    {openLinkUploadInput &&
                                        <div className="fileUplod-links">
                                            <input type="url" onChange={(e: any) => setResponseData({ ...responseData, forum_image: null, links: e.target.value })} placeholder={t('forumPopup.questionInput.placeholder.enterLink')} />
                                        </div>
                                    }
                                    {openTagUploadInput &&
                                        <div className="fileupload-tages">
                                            <div className="input-tag">
                                                <ul className="input-tag__tags at-in-tag">
                                                    {tags.map((tag: any, i: number) => (
                                                        <li key={tag}>
                                                            {tag}
                                                        </li>
                                                    ))}
                                                    <li className="input-tag__tags__input"><input type="text" onKeyDown={inputKeyDown} ref={c => { tagInput = c; }} /></li>
                                                </ul>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="postBtn-Row">
                                <button className={`answerBtn ${postResoponce ? "PostBtnDisable" : ""} `} disabled={postResoponce} onClick={() => handleResponseCreate(items?.id, tags)}>{t('mdbkforum.PostResponse')}</button>
                            </div>
                        </div>
                    </div>
                }

            </div>

            <EditQuestion
                editData={editData}
                id={items?.id}
                searchQuestionFilter={searchQuestionFilter}
                setSearchQuestionFilter={setSearchQuestionFilter}
                showPostQuestion={isApplyPostQuestion}
                closePostQuestion={closePostQuestion} />

            <BootstrapModel
                show={isApplyError}
                onHide={() => setIsApplyError(false)}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-make-profile"
                centered>
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>{t('popUps.profile_uncomplete.title')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc">{t('mdbkforum.Pleasepostresponse')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={() => setIsSwitch(true)}>
                        {t('resetPwd.saveButton')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>


            <BootstrapModel
                show={deleteQuestion}
                onHide={() => setDeleteQuestion(false)}
                backdrop="static"
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal forum-popup"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>{t('forumPopup.questionDelete.title')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc ques-del-desc">{t('forumPopup.questionDelete.description')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <div className="ft-footer-btns ft-two-btn">
                        <Button className="ft-pop-theme-btn" onClick={() => handleDelete(items?.id)}>
                            {t('proposalDeletion.yes')}
                        </Button>
                        <Button className="ft-pop-theme-btn" onClick={() => setDeleteQuestion(false)}>
                            {t('proposalDeletion.no')}
                        </Button>
                    </div>
                </BootstrapModel.Footer>
            </BootstrapModel>


            <BootstrapModel
                show={isResponseDone}
                onHide={() => setIsResponseDone(false)}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>{t('mdbkforum.ForumResponseCompleted')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc">{t('mdbkforum.Yourresponseforum')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={() => setIsResponseDone(false)}>
                        {t('common.Confirm')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>
        </div>
    )
}

export default ForumQuestion
