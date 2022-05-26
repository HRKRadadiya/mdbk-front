import comment from 'antd/lib/comment';
import { useEffect } from 'react';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FORUM, FORUM_COMMENT, FORUM_COMMENT_CREATE, FORUM_CREATE, FORUM_REPORT_UNREPORT, FORUM_VOTE } from '../../constants/api';
import { State } from '../../redux/reducers/rootReducer';
import { ApiMemberDelete, ApiMemberPost, ApiMemberPut } from '../../service/api';
import Storage from '../../service/storage';
import { Modal as BootstrapModel } from 'react-bootstrap'
import { getUrl, humanizeDate, isEmpty, isValidUrl } from '../../utils/helper'
import ReadMore from '../ReadMore';
import ChildComment from './comment/childComment';
import Comment from './comment/comment';
import { nike_name_Change, Profile_Picture_Change, register_Type_Change } from '../../redux/actions/memberAction';
import router from 'next/router';
import { EDIT_CLIENT_PROFILE, EDIT_SIDE_CHARACTER_PROFILE } from '../../constants/routes';
import { Button } from 'antd';
import $ from 'jquery'

const ForumResponse = ({ items, lastCardElementRef, index, setGetResponse, getResponse, setResponse, setQuestion, setSearchFilter, searchFilter, setHashtag, setIsQuestionResponse }: any) => {
    const { t } = useTranslation();
    const [showCommentsRow, setShowCommentsRow] = useState<number>();
    const token = Storage.get('token');
    const [isSwitch, setIsSwitch] = useState(false)
    const dispatch = useDispatch();
    const [deleteResponse, setDeleteResponse] = useState(false)
    const [isApplyError, setIsApplyError] = useState(false)
    const [isCommentDone, setIsCommentDone] = useState(false)
    const [postResoponce, setPostResoponce] = useState(true)
    const [switchData, setSwitchData] = useState<any>("")
    const [likeCounter, setLikeCounter] = useState({
        flag: (items?.like_flag && items?.vote_type == 1) ? true : false,
        count: items?.total_upvote
    })
    const [disLikeCounter, setDiLikeCounter] = useState({
        flag: (items?.like_flag && items?.vote_type == 0) ? true : false,
        count: items?.total_downvote
    })
    const [reportCounter, setReportCounter] = useState(items?.total_reports)
    const userData = useSelector((state: State) => state.auth.userData)

    const [tags, setTags] = useState<any>(items?.forum_hashtags)
    let tagInput: any
    const [openImageUploadInput, setOpenImageUploadInput] = useState(false);
    const [openLinkUploadInput, setOpenLinkUploadInput] = useState(false);
    const [openTagUploadInput, setOpenTagUploadInput] = useState(false);
    const [giveResponse, setGiveResponse] = useState(false)
    const [imageName, setImageName] = useState(items?.forum_images[0]);
    const [isMyComment, setIsMyComment] = useState(false)
    const [imageUpload, setImageUpload] = useState(false)
    const [isLike, setIsLike] = useState(true)
    const sideCharData = useSelector((state: State) => state?.sideCharData)
    const [editResponce, setEditResponce] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [allComment, setAllComment] = useState<any>([])
    const [isComment, setIsComment] = useState(false)
    const [commentData, setCommentData] = useState<string>("")
    const [linkUpload, setLinkUpload] = useState(false)
    const [responseData, setResponseData] = useState<any>({
        parent_id: 0,
        links: items?.forum_links[0],
        hashtags: [],
        text: items?.text
    })

    const removeTag = (i: number) => {
        const newTags = [...tags];
        newTags.splice(i, 1);
        setTags(newTags);
    }

    useEffect(() => {
        setAllComment(items?.forum_comments)
    }, [items])

    useEffect(() => {
        if (responseData.text != "") {
            setPostResoponce(false)
        } else {
            setPostResoponce(true)
        }
    }, [responseData])

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


    const AddComments = (index: number) => {
        setShowCommentsRow(index)
    }

    const attechImage = () => {
        $("#attechImage").trigger("click");
    };


    useEffect(() => {
    }, [allComment])

    const handleDelete = async (id: number) => {
        await ApiMemberDelete(FORUM + `/${id}`).then(async (response: any) => {
            if (response.data && response.success) {
                setGetResponse(getResponse.filter((data: any) => data.id != id))
                setDeleteResponse(false)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            setDeleteResponse(false)
            console.log("Error", error)
        })
    }

    const handleReport = async (type: string, id: number, key: any) => {
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

    const handleCommentCreate = async (forum_id: number) => {
        await ApiMemberPost(FORUM_COMMENT_CREATE, {
            text: commentData,
            forum_id,
            registration_type: userData.registration_type
        }).then(async (response: any) => {
            setIsCommentDone(true)
            setAllComment([...allComment, response.data.response])
            setCommentData("")
        }).catch((error: any) => {
            setCommentData("")
            setIsCommentDone(false)
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

    const handleResponseEdit = async (id: any, tag: any, parent_id: any) => {
        const formData = new FormData();
        { !(responseData.forum_image == undefined || responseData.forum_image == null) && formData.append('forum_image', responseData.forum_image) }
        formData.append('links', responseData.links)
        formData.append('parent_id', parent_id)
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
        await ApiMemberPut(`${FORUM}/${id}`, formData, config).then(async (response: any) => {
            if (response.data && response.success) {
                setGiveResponse(false)
                setIsEdit(false)
                setEditResponce(true)
            } else {
                setGiveResponse(false)
                setIsEdit(false)
                setEditResponce(false)
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    const handlehashtags = (tag: string) => {
        setHashtag(tag)
        setIsQuestionResponse(false)
        setSearchFilter({ page: 1, is_refresh: !searchFilter.is_refresh, question_ids: [], response_ids: [], hashtag: tag })
    }

    return (
        <div className="postResult-card" ref={isEmpty(lastCardElementRef) ? null : lastCardElementRef}>
            <div className="profile-row">
                <img src={isEmpty(items?.side_character_profile?.profile_picture) ? "/grayuser.svg" : items?.side_character_profile?.profile_picture} />
                <p> {items?.side_character_profile?.nick_name}  <span className="at-ago-dot">∙</span><span>{humanizeDate(new Date(items?.created_at), t)}</span></p>
                {items?.is_my_post ?
                    <div className="postEdit">
                        <button className="edit-icon" onClick={() => {
                            !isEdit ? setGiveResponse(true) : handleResponseEdit(items?.id, tags, items?.parent_id)
                            setIsEdit(!isEdit)
                            { console.log("responseData.links", responseData.links, "tags", tags, "imageName", imageName) }
                            !isEmpty(responseData.links) && openLinkUpload()
                            !isEmpty(tags) && openTagUpload()
                            !isEmpty(imageName) && openImageUpload()
                        }}><img src={isEdit ? "/editdone.svg" : "/editPost.svg"} /></button>
                        <button onClick={() => setDeleteResponse(true)}><img src="/trashPost.svg" /></button>
                    </div>
                    :
                    <div className="postEdit">
                        <span>{reportCounter}</span>
                        <button onClick={() => handleReport("response", items?.id, 0)}><img src="/profile-report-icon.svg" /></button>
                    </div>
                }
            </div>
            <div className="profileContent-main">
                <div className="postResult-Usercontent pv-postResult-Usercontent  hm-postResult-Usercontent ">
                    <h3>{items?.question?.name} ∙ {humanizeDate(new Date(items?.question?.created_at), t)}</h3>
                    <h4>{items?.question?.text}</h4>
                </div>

                {!isEdit && <div className={`postResult-Readmore  hm-break-word-ctn ${(isEmpty(items?.forum_images) && isEmpty(items?.forum_links)) ? "" : "hm-postResult-Readmore"}`}>
                    <ReadMore>
                        <h5>{items?.text}</h5>
                    </ReadMore>
                </div>
                }
            </div>
            {!isEdit &&
                !isEmpty(items?.forum_images) &&
                <div className="Postcontent-image hm-Postcontent-image">
                    <a href={isEmpty(items?.forum_images) ? "" : items?.forum_images[0]} target="_blank"> <img src={items?.forum_images[0]} />
                    </a>
                </div>
            }
            {!isEdit &&
                !isEmpty(items?.forum_links) && <div className="fe-Postcontent-link">
                    <a href={isEmpty(items?.forum_links) ? "" : (isValidUrl(items?.forum_links[0]) ? items?.forum_links[0] : "http://" + items?.forum_links[0])} target="_blank">  <p>{items?.forum_links[0]}</p></a>
                </div>
            }

            <div className="profileContent-main fe-padiing-top-main-response">
                {!isEdit && <div className="postResult-tags hm-postResult-tags at-pr-tag">
                    {items?.forum_hashtags.map((tag: any) => (
                        <p key={tag} onClick={() => handlehashtags(tag)}>#{tag}</p>
                    ))}
                </div>
                }
                {(giveResponse && isEdit) &&
                    <div className="">
                        <div className="forum-editor">
                            <div className="forum-top-row fe-response-edit hm-forum-response-edit pv-forum-response-edit">
                                <div className="forum-profile-editor">
                                    {!isEdit &&
                                        <>
                                            <img src={isEmpty(userData?.member?.profile_picture) ? "/grayuser.svg" : userData?.member?.profile_picture} alt="" />
                                            <h4>{userData?.member?.nickname}</h4>
                                        </>
                                    }
                                </div>
                                <div>
                                    <button><img src={`${!imageUpload ? "/color-upload.png" : "/disableimageicon.png"}`} alt="" onClick={openImageUpload} className="uploadBtn" /></button>
                                    <button><img src={`${!linkUpload ? "/color-links.png" : "/disablelink.png"}`} alt="" onClick={openLinkUpload} className="LinkBtn" /></button>
                                    <button><img src="/hashtag.png" alt="" onClick={openTagUpload} className="HashTagBtn" /></button>
                                </div>
                            </div>
                        </div>

                        <div className="answer-textarea1">
                            <div className="">
                                <textarea className="fe-textarea-line" value={responseData.text} placeholder={t("mdbkforum.Enterresponse")} onChange={(e: any) => setResponseData({ ...responseData, text: e.target.value })}>
                                </textarea>
                                <div className="topupload-section topupload-section1 hm-topupload-section">
                                    {openImageUploadInput &&
                                        <div className="fileupload-inputs fileupload-inputs1 hm-fileupload-inputs ">
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
                                        <div className="fileUplod-links fileUplod-links1 hm-fileUplod-links">
                                            <input type="url" value={responseData.links} onChange={(e: any) => setResponseData({ ...responseData, forum_image: null, links: e.target.value })} placeholder={t('forumPopup.questionInput.placeholder.enterLink')} />
                                        </div>
                                    }
                                    {openTagUploadInput &&
                                        <div className="fileupload-tages fileupload-tages hm-fileupload-tages">
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
                        </div>
                    </div>
                }


                <div className="postComment fe-padding-top-response">
                    <div className="ToalComments"
                        onClick={() => {
                            setIsComment(!isComment)
                            AddComments(index)
                        }
                        }
                    >
                        <p> {t('mdbkforum.Comments')} <span> {allComment.length} </span></p>
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
            </div>
            {isComment && <div className="CommentsPost">
                <div className="CommentsPost-row">
                    <img src={isEmpty(sideCharData?.profile?.profile_picture) ? "/grayuser.svg" : sideCharData?.profile?.profile_picture} />
                    <input type="text" value={commentData} onChange={(e) => setCommentData(e.target.value)} placeholder={t('mdbkforum.EnterComment')} />
                    <button disabled={(commentData == "" || (items?.member_id == userData?.member?.id) || (items?.question?.member_id == userData?.member?.id)) ? true : false} className={`${(commentData == "" || (items?.member_id == userData?.member?.id) || (items?.question?.member_id == userData?.member?.id)) ? "post-deactiveBtn hm-line-height-28" : "post-activeBtn hm-line-height-28"}`} onClick={() => handleCommentCreate(items?.id)}>{t('mdbkforum.Post')}</button>
                </div>
            </div>
            }
            {(isComment) &&
                !isEmpty(allComment) && allComment.map((item: any, index: number) => {
                    return (
                        <Comment key={index} item={item} allComment={allComment} setAllComment={setAllComment} member_id={items?.member_id} qmember_id={items?.question?.member_id} />
                    )
                }
                )}

            <BootstrapModel
                show={isApplyError}
                onHide={() => setIsApplyError(false)}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>{t('popUps.profile_uncomplete.title')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc">{t('mdbkforum.Pleasepostcomment')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={() => setIsSwitch(true)}>
                        {t('resetPwd.saveButton')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>

            <BootstrapModel
                show={deleteResponse}
                onHide={() => setDeleteResponse(false)}
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
                    <div className="desc ques-del-desc">{t('mdbkforum.Doyoureallywanttodeletetheresponse')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <div className="ft-footer-btns ft-two-btn">
                        <Button className="ft-pop-theme-btn" onClick={() => handleDelete(items?.id)}>
                            {t('proposalDeletion.yes')}
                        </Button>
                        <Button className="ft-pop-theme-btn" onClick={() => setDeleteResponse(false)}>
                            {t('proposalDeletion.no')}
                        </Button>
                    </div>
                </BootstrapModel.Footer>
            </BootstrapModel>

            <BootstrapModel
                show={editResponce}
                backdrop="static"
                onHide={() => setSearchFilter({ ...searchFilter, page: 1, is_refresh: !searchFilter.is_refresh, question_ids: [] })}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal forum-popup"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>{t('forumPopup.questionEdit.title')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc">
                        {t('mdbkforum.Responseedited')}
                    </div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={() => setSearchFilter({ ...searchFilter, page: 1, is_refresh: !searchFilter.is_refresh, question_ids: [] })}>
                        {t('common.Confirm')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>

            <BootstrapModel
                show={isCommentDone}
                onHide={() => setIsCommentDone(false)}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>{t('mdbkforum.ForumcommentCompleted')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc">{t('mdbkforum.Yourcommentforum')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={() => setIsCommentDone(false)}>
                        {t('common.Confirm')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>
        </div>
    )
}

export default ForumResponse
