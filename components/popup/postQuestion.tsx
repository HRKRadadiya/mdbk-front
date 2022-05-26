import React, { useState, useEffect } from 'react';

import { Modal as BootstrapModel } from 'react-bootstrap'
import router from 'next/router';
import { getUrl, isEmpty, isUrl } from '../../utils/helper';
import { KEYWORDS, ROUTES } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import verifystyles from '../../styles/emailVerify.module.css'
import { useTranslation } from 'react-i18next';
import { Button, Select, Form, Input } from 'antd'
import { FORUM_CREATE, FORUM_DRAFT_QUESTION } from '../../constants/api';
import { ApiMemberGet, ApiMemberPost } from '../../service/api';
import { nike_name_Change, Profile_Picture_Change, register_Type_Change } from '../../redux/actions/memberAction';
import { EDIT_CLIENT_PROFILE, EDIT_SIDE_CHARACTER_PROFILE } from '../../constants/routes';

interface IProps {
    showPostQuestion: boolean;
    closePostQuestion: any;
    draftData: any;
    setSearchQuestionFilter: any;
    searchQuestionFilter: any
}

function PostQuestion({ showPostQuestion, closePostQuestion, draftData, searchQuestionFilter, setSearchQuestionFilter }: IProps) {
    const { Option } = Select;
    const { TextArea } = Input;
    const clientData = useSelector((state: State) => state?.clientData)
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

    const [isSwitch, setIsSwitch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingDraft, setLoadingDraft] = useState(false)
    const dispatch = useDispatch();
    const [linkError, setLinkError] = useState(false)
    const [isApplyError, setIsApplyError] = useState(false)
    const [isQuestionDone, setIsQuestionDone] = useState(false)
    const [cancle, setCancle] = useState(false)
    const [disable, setDisable] = useState(true)
    const [switchData, setSwitchData] = useState<any>("")
    const data = {
        category: "development",
        text: "",
        link: "",
        is_draft: false,
    }
    const dataDraft = {
        category: draftData?.question?.category,
        text: draftData?.question?.text,
        link: draftData?.question?.link,
        is_draft: false,
    }
    const dat = (draftData?.is_draft) ? dataDraft : data
    const [createData, setCreateData] = useState<any>(dat)

    useEffect(() => {
        setDisable(false)
        setCancle(false)
    }, [dat])

    const { t } = useTranslation();
    const userData = useSelector((state: State) => state.auth.userData)

    useEffect(() => {
        if (createData.category != "" && createData.text != "") {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }, [createData])

    const handleCreate = async (draft: boolean) => {
        if (createData.link != "") {
            if (isUrl(createData.link)) {
            } else {
                setLoadingDraft(false)
                setLoading(false)
                setCancle(false)
                setLinkError(true)
                return
            }
        }
        await ApiMemberPost(FORUM_CREATE, {
            ...createData,
            is_draft: draft
        }).then(async (response: any) => {
            setLoading(false)
            if (response.data.forum?.status == "draft") {
                closePostQuestion()
            } else {
                setSearchQuestionFilter({ ...searchQuestionFilter, page: 1, is_refresh: !searchQuestionFilter.is_refresh })
                closePostQuestion()
                setIsQuestionDone(true)
                setCreateData(data)
            }
            setLoadingDraft(false)
            setLoading(false)
            setCancle(false)
        }).catch((error: any) => {
            setLoadingDraft(false)
            setLoading(false)
            setCancle(false)
            if (error?.code == 422 && error?.error?.link == "Invalid link") {
                setLinkError(true)
            }
            if (error?.code == 422 && error?.error?.text == "text must be required") {
                closePostQuestion()
            }
            if (error?.code == 400 && error?.error?.is_profile_completed == false) {
                closePostQuestion()
                setSwitchData(error?.error)
                setIsApplyError(true);
            }
            console.log("Error", error)
        })

    }

    useEffect(() => {
        if (isSwitch) {
            if (userData?.registration_type == 2) {
                dispatch(register_Type_Change(switchData?.switch_response?.registration_type))
                dispatch(nike_name_Change(switchData?.switch_response?.profile.nick_name))
                dispatch(Profile_Picture_Change(switchData?.switch_response?.profile_picture))
                router.push(getUrl(router.locale, EDIT_CLIENT_PROFILE))
            } else {
                userData.registration_type == 1 ? router.push(getUrl(router.locale, EDIT_CLIENT_PROFILE))
                    : router.push(getUrl(router.locale, EDIT_SIDE_CHARACTER_PROFILE))
            }
        }
    }, [switchData, isSwitch])

    return (
        <>
            <BootstrapModel
                show={showPostQuestion}
                onHide={closePostQuestion}
                backdrop="static"
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
                <BootstrapModel.Body className={`ft-pop-body ${(width < 640) ? 'at-border' : ''}`}>
                    <Select
                        defaultValue={createData.category}
                        placeholder={t('forumPopup.questionInput.placeholder.selectCategory')}
                        onChange={(e: any) => setCreateData({ ...createData, category: e })}
                        className="ft-custom-ant-select at-select-size"
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
                    <Button loading={loadingDraft} disabled={cancle} className={`ft-pop-theme-btn ${cancle ? "disabledraft" : ""} `} onClick={() => {
                        setLoadingDraft(true)
                        setDisable(true)
                        handleCreate(true)
                    }}>
                        {t('forumPopup.questionInput.cancelBtn')}
                    </Button>
                    <Button loading={loading} disabled={disable} className={`ft-pop-theme-btn ${disable ? "disable" : ""} `} onClick={() => {
                        setLoading(true)
                        setCancle(true)
                        handleCreate(false)
                    }}>
                        {t('forumPopup.questionInput.askBtn')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>


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
                    <Button className="ft-pop-theme-btn " onClick={() => {
                        setIsSwitch(true)
                    }}>
                        {t('resetPwd.saveButton')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>

            <BootstrapModel
                show={isQuestionDone}
                onHide={() => setIsQuestionDone(false)}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>{t('forumPopup.questionComplete.title')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc">{t('forumPopup.questionComplete.description')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={() => setIsQuestionDone(false)}>
                        {t('common.Confirm')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel>
        </>
    )
}
export default PostQuestion