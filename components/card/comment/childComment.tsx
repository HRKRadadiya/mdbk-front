import { useState } from 'react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FORUM_COMMENT, FORUM_REPORT_UNREPORT } from '../../../constants/api';
import { State } from '../../../redux/reducers/rootReducer';
import { ApiMemberDelete, ApiMemberPost, ApiMemberPut } from '../../../service/api';
import { humanizeDate, isEmpty } from '../../../utils/helper';
import { Modal as BootstrapModel } from 'react-bootstrap'
import ReadMore from '../../ReadMore';
import { Button } from 'antd';

const ChildComment = ({ comment, member_id, qmember_id, allChildComment, setAllChildComment }: any) => {
    const [reportCounterComment, setReportCounterComment] = useState(comment?.total_reports)
    const { t } = useTranslation();
    const [deleteComment, setDeleteComment] = useState(false)
    const [editComments, setEditComments] = useState(false)
    const userData = useSelector((state: State) => state.auth.userData)
    const [editComment, setEditComment] = useState(comment?.text)
    const [isEdit, setIsEdit] = useState(false)

    const handleReport = async (type: string, id: number) => {
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

    const handleEditCommment = async (id: number) => {
        await ApiMemberPut(FORUM_COMMENT + `/${id}`, {
            text: editComment
        }).then(async (response: any) => {
            setIsEdit(false)
            setEditComments(true)
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    const handleDeleteCommment = async (id: number) => {
        await ApiMemberDelete(FORUM_COMMENT + `/${id}`).then(async (response: any) => {
            if (response.data && response.success) {
                setAllChildComment(allChildComment.filter((data: any) => data.id != id))
                setDeleteComment(false)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            setDeleteComment(false)
            console.log("Error", error)
        })
    }
    return (
        <div className="commentReply-MainBox">
            <div className="commentReply-Box">
                <div className="CommentList-profile pv-CommentList-profile">
                    <img src={isEmpty(comment?.profile_picture) ? "/grayuser.svg" : comment?.profile_picture} alt="" />
                    <p>{comment?.name}</p>
                    <div className="postEdit">
                        {comment?.is_my_post ?
                            <>
                                <button className="edit-icon" onClick={() => {
                                    isEdit && handleEditCommment(comment?.id)
                                    setIsEdit(!isEdit)
                                }
                                }><img src={isEdit ? "/editdone.svg" : "/editPost.svg"} /></button>
                                <button onClick={() => setDeleteComment(true)}><img src="/trashPost.svg" /></button>
                            </>
                            :
                            <>
                                <span>{reportCounterComment}</span>
                                <button onClick={() => handleReport("comment", comment?.id)}><img src="/notification-bell.svg" /></button>
                            </>
                        }
                    </div>
                </div>
                <div className="CommentList-Readmore CommentReply-reply hm-child-CommentList-Readmore pv-CommentList-Readmore pv-CommentReply-reply">
                    {isEdit ?
                        <textarea className="fe-textarea-design" value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                        :
                        <ReadMore >
                            <h5 className="fe-word-break">{editComment}</h5>
                        </ReadMore>
                    }
                </div>

            </div>

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

        </div>
    )
}

export default ChildComment
