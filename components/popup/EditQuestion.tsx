import React, { useState, useEffect } from 'react';

import { Modal as BootstrapModel } from 'react-bootstrap'
import router from 'next/router';
import { KEYWORDS, ROUTES } from '../../constants';
import { useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import { useTranslation } from 'react-i18next';
import verifystyles from '../../styles/emailVerify.module.css'
import { Button, Select, Form, Input } from 'antd'
import { FORUM, FORUM_CREATE, FORUM_DRAFT_QUESTION } from '../../constants/api';
import { ApiMemberGet, ApiMemberPost, ApiMemberPut } from '../../service/api';
import { isEmpty } from '../../utils/helper';

interface IProps {
    showPostQuestion: boolean;
    closePostQuestion: any;
    id: any;
    editData: any;
    searchQuestionFilter: any;
    setSearchQuestionFilter: any
}

function EditQuestion({ showPostQuestion, closePostQuestion, editData, id, searchQuestionFilter, setSearchQuestionFilter }: IProps) {
    const { Option } = Select;
    const [editQuestion, setEditQuestion] = useState(false)
    const [loading, setLoading] = useState(false)
    const { TextArea } = Input;
    const clientData = useSelector((state: State) => state?.clientData)
    const [disable, setDisable] = useState(true)
    const [linkError, setLinkError] = useState(false)
    const [createData, setCreateData] = useState<any>(editData)
    const { t } = useTranslation();
    const userData = useSelector((state: State) => state.auth.userData)

    useEffect(() => {
        if (createData.category != "" && createData.text != "") {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [createData])

    const handleEdit = async () => {
        await ApiMemberPut(`${FORUM}/${id}`, createData
        ).then(async (response: any) => {
            setEditQuestion(true)
            closePostQuestion()
            setLoading(false)

        }).catch((error: any) => {
            if (error?.code == 422 && error?.error?.link == "Invalid link") {
                setLinkError(true)
            }
            // closePostQuestion()
            // setEditQuestion(true)
            setLoading(false)
            console.log("Error", error)
        })
    }


    return (
        <>
            <BootstrapModel
                show={showPostQuestion}
                backdrop="static"
                onHide={closePostQuestion}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal forum-popup-ques-ask"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>
                        <div className="popup-title-ctn at-clr-title">
                        <img src={isEmpty(clientData?.profile?.profile_picture) ? "/grayuser.svg" : clientData?.profile?.profile_picture} alt="user_profile_img" />
                            <span>
                                {isEmpty(clientData?.profile?.nick_name) ? userData?.member?.name : clientData?.profile?.nick_name}
                            </span>
                        </div>
                    </BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <Select
                        defaultValue={createData.category}
                        placeholder={t('forumPopup.questionInput.placeholder.selectCategory')}
                        onChange={(e: any) => setCreateData({ ...createData, category: e })}
                        className="ft-custom-ant-select"
                    >
                        <Option value="development">{t('common.Development')}</Option>
                        <Option value="design">{t('common.Design')}</Option>
                        <Option value="marketing">{t('common.Marketing')}</Option>
                        <Option value="other">{t('common.Other')}</Option>
                        {/* <p className="dropdown-placeholder">{t('forumPopup.questionInput.placeholder.selectCategory')}</p> */}
                    </Select>
                    <input
                        type="text"
                        value={createData.text}
                        placeholder={`${t("forumPopup.questionInput.placeholder.enterQuestion")}`}
                        className="input-ques"
                        onChange={(e) => setCreateData({ ...createData, text: e.target.value })}
                    />
                    <input
                        type="url"
                        value={createData.link}
                        placeholder={`${t("forumPopup.questionInput.placeholder.enterLink")}`}
                        className="input-link"
                        onChange={(e) => {
                            setLinkError(false)
                            setCreateData({ ...createData, link: e.target.value })
                        }}
                    />
                    {linkError ? <p className={`${verifystyles.redMsg} ft-red-msg`}>{t('common.InvalidUrl')}</p> : null}
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer popup-btn-ctn fe-disable-btn">
                    <Button className="ft-pop-theme-btn" onClick={() => {
                         closePostQuestion()
                    }}>
                        {t('forumPopup.questionInput.cancelBtn')}
                    </Button>
                    <Button loading={loading} disabled={disable} className={`ft-pop-theme-btn ${disable ? "disable" : ""} `} onClick={() => {
                        setLoading(true)
                        handleEdit()
                    }}>
                        {t('forumPopup.questionInput.askBtn')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>


            <BootstrapModel
                show={editQuestion}
                onHide={() => setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, is_refresh: !searchQuestionFilter.is_refresh, question_ids: [] })}
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
                        {t('forumPopup.questionEdit.description')}
                    </div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={() => setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, is_refresh: !searchQuestionFilter.is_refresh, question_ids: [] })}>
                        {t('common.Confirm')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>
        </>
    )
}
export default EditQuestion