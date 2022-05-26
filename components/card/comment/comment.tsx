import { useState } from 'react'
import React from 'react'
import { humanizeDate, isEmpty } from '../../../utils/helper'
import ReadMore from '../../ReadMore'
import { useTranslation } from 'react-i18next'
import { ApiMemberDelete, ApiMemberPost, ApiMemberPut } from '../../../service/api'
import { FORUM_COMMENT, FORUM_COMMENT_CREATE, FORUM_REPORT_UNREPORT } from '../../../constants/api'
import { Modal as BootstrapModel } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { State } from '../../../redux/reducers/rootReducer'
import ChildComment from './childComment'
import { Button } from 'antd'
import { useEffect } from 'react'

const Comment = ({ item, member_id, qmember_id, allComment, setAllComment }: any) => {
    const [reportCounterComment, setReportCounterComment] = useState(item?.total_reports)
    const { t } = useTranslation();
    const [commentData, setCommentData] = useState<string>("")
    const userData = useSelector((state: State) => state.auth.userData)
    const [deleteComment, setDeleteComment] = useState(false)
    const sideCharData = useSelector((state: State) => state?.sideCharData)
    const [editComments, setEditComments] = useState(false)
    const [isCommentDone, setIsCommentDone] = useState(false)
    const [editComment, setEditComment] = useState(item?.text)
    const [allChildComment, setAllChildComment] = useState<any>()
    const [comment, setComment] = useState<any>(item)
    const [isMyComment, setIsMyComment] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const handleReport = async (type: string, id: number, key: any) => {
        await ApiMemberPost(FORUM_REPORT_UNREPORT, {
            report_type: type,
            source_id: id,
            registration_type: userData.registration_type
        }).then(async (response: any) => {
            setReportCounterComment(response.data.report_flag ? reportCounterComment + 1 : reportCounterComment - 1)
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    useEffect(() => {
        setAllChildComment(item?.child_comment)
    }, [item])

    const handleCommentCreate = async (forum_id: number) => {
        await ApiMemberPost(FORUM_COMMENT_CREATE, {
            text: commentData,
            forum_id,
            registration_type: userData.registration_type,
            parent_id: forum_id
        }).then(async (response: any) => {
            setIsCommentDone(true)
            setAllChildComment(allChildComment == undefined ? [response.data.response] : [...allChildComment, response.data.response])
            setCommentData("")
            setIsMyComment(true)
        }).catch((error: any) => {
            setIsCommentDone(false)
            console.log("Error", error)
        })
    }

    const handleDeleteCommment = async (id: number) => {
        await ApiMemberDelete(FORUM_COMMENT + `/${id}`).then(async (response: any) => {
            if (response.data && response.success) {
                setDeleteComment(false)
                setAllComment(allComment.filter((data: any) => data.id != id))
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            setDeleteComment(false)
            console.log("Error", error)
        })
    }

    const handleEditCommment = async (id: number) => {
        await ApiMemberPut(FORUM_COMMENT + `/${id}`, {
            text: editComment
        }).then(async (response: any) => {
            if (response.data && response.success) {
                setIsEdit(false)
                setEditComments(true)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            setIsEdit(false)
            setEditComments(false)
            console.log("Error", error)
        })
    }

    return (
        <>
            <div className="CommentsList">
                <div className="CommentList-profile pv-main-CommentList-profile">
                    <img src={isEmpty(comment?.profile_picture) ? "/grayuser.svg" : comment?.profile_picture} alt="" />
                    <p>{comment?.name} <span>∙  {humanizeDate(new Date(comment?.created_at), t)}</span></p>
                    <div className="postEdit">
                        {(comment?.is_my_post) ?
                            <>
                                <button className="edit-icon" onClick={() => {
                                    isEdit && handleEditCommment(comment?.id)
                                    setIsEdit(!isEdit)
                                }}> <img src={isEdit ? "/editdone.svg" : "/editPost.svg"} /></button>
                                <button onClick={() => setDeleteComment(true)}><img src="/trashPost.svg" /></button>
                            </>
                            :
                            <>
                                <span>{reportCounterComment}</span>
                                <button onClick={() => handleReport("comment", comment?.id, 1)}><img src="/notification-bell.svg" /></button>
                            </>
                        }
                    </div>
                </div>
                <div className="CommentList-Readmore hm-CommentList-Readmore">
                    {isEdit ?
                        <textarea className="fe-textarea-design" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                        :
                        <ReadMore >
                            <h5 className="fe-word-break">{editComment}</h5>
                        </ReadMore>
                    }
                    {!isEdit && <button className="PostCommentBtn hm-PostCommentBtn">{t('mdbkforum.PostComment')}</button>}
                </div>

                <div className="CommentsPost-row Comment-reply-row">
                    <img src={isEmpty(sideCharData?.profile?.profile_picture) ? "/grayuser.svg" : sideCharData?.profile?.profile_picture} />
                    <input type="text" value={commentData} onChange={(e) => setCommentData(e.target.value)} placeholder={t('mdbkforum.EnterComment')} />
                    <button disabled={(commentData == "" || (member_id == userData?.member?.id) || (qmember_id == userData?.member?.id)) ? true : false} className={`${((commentData == "" || (member_id == userData?.member?.id) || (qmember_id == userData?.member?.id))) ? "post-deactiveBtn hm-line-height-28" : "post-activeBtn hm-line-height-28"}`} onClick={() => handleCommentCreate(comment?.id)}>{t('mdbkforum.Post')}</button>
                </div>

            </div>
            {!isEmpty(allChildComment) && allChildComment.map((comment: any) => (
                <ChildComment allChildComment={allChildComment} setAllChildComment={setAllChildComment} comment={comment} member_id={member_id} qmember_id={qmember_id} />
            ))
            }

            <BootstrapModel
                show={deleteComment}
                onHide={() => setDeleteComment(false)}
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
                    <div className="desc ques-del-desc">{t('mdbkforum.Doyoureallywanttodeletethecomment')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <div className="ft-footer-btns ft-two-btn">
                        <Button className="ft-pop-theme-btn" onClick={() => handleDeleteCommment(comment?.id)}>
                            {t('proposalDeletion.yes')}
                        </Button>
                        <Button className="ft-pop-theme-btn" onClick={() => setDeleteComment(false)}>
                            {t('proposalDeletion.no')}
                        </Button>
                    </div>
                </BootstrapModel.Footer>
            </BootstrapModel>

            <BootstrapModel
                show={editComments}
                onHide={() => setEditComments(false)}
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
                        {t('mdbkforum.Commentedited')}
                    </div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={() => setEditComments(false)}>
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
        </>
    )
}

export default Comment
