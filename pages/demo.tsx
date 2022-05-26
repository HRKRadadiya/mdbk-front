import React from 'react';
import { Button } from 'antd';
import { Modal as BootstrapModel } from 'react-bootstrap'
import router from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Select } from 'antd';
import { GetServerSideProps } from 'next';


function Demo() {
    const { t } = useTranslation();

    const [makeProfilePopup, setMakeProfilePopup] = useState(true) //state :  popup 1 


    const { Option } = Select; //state :  popup 2
    const [forumQuestionAskPopup, setForumQuestionAskPopup] = useState(true) //state :  popup 2


    const [forumQuestionCompletePopup, setForumQuestionCompletePopup] = useState(true) //state :  popup 3
    const [forumQuestionDeletePopup, setForumQuestionDeletePopup] = useState(true) //state :  popup 4
    const [forumQuestionEditPopup, setForumQuestionEditPopup] = useState(true) //state :  popup 5

    return (
        <>
            {/* Popup 1 : - Make Profile Popup */}
            {/* <BootstrapModel
                show={makeProfilePopup}
                onHide={() => setMakeProfilePopup(false)}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>{t('popUps.profile_uncomplete.title')}</BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <div className="desc">{t('popUps.profile_uncomplete.description')}</div>
                </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn">
                        {t('resetPwd.saveButton')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel> */}


            {/* Popup 2 : - Forum Question Ask popup */}
            {/* <BootstrapModel
                show={forumQuestionAskPopup}
                onHide={() => setForumQuestionAskPopup(false)}
                aria-labelledby="contained-BootstrapModel-title-vcenter"
                className="ft-custom-modal forum-popup-ques-ask"
                dialogClassName="ft-make-profile"
                centered
            >
                <BootstrapModel.Header closeButton className="ft-pop-header">
                    <BootstrapModel.Title>
                        <div className="popup-title-ctn">

                            <img src="./grayuser.svg" alt="user_profile_img" />
                            <span>
                                {t('header.nickName')}
                            </span>
                        </div>
                    </BootstrapModel.Title>
                </BootstrapModel.Header>
                <BootstrapModel.Body className="ft-pop-body">
                    <Select
                        defaultValue=""
                        placeholder={t('forumPopup.questionInput.placeholder.selectCategory')}
                        onChange={(e: any) => { }}
                        className="ft-custom-ant-select"
                    >
                        <Option value="development">{t('common.Development')}</Option>
                        <Option value="design">{t('common.Design')}</Option>
                        <Option value="marketing">{t('common.Marketing')}</Option>
                        <Option value="other">{t('common.Other')}</Option>
                        {/* <p className="dropdown-placeholder">{t('forumPopup.questionInput.placeholder.selectCategory')}</p> */}
            {/* </Select>
                    <input
                        type="text"
                        placeholder={`${t("forumPopup.questionInput.placeholder.enterQuestion")}`}
                        className="input-ques"
                    />
                    <input
                        type="url"
                        placeholder={`${t("forumPopup.questionInput.placeholder.enterLink")}`}
                        className="input-link"
                    /> */}
            {/* </BootstrapModel.Body>
                <BootstrapModel.Footer className="ft-pop-footer popup-btn-ctn">
                    <Button className="ft-pop-theme-btn">
                        {t('forumPopup.questionInput.cancelBtn')}
                    </Button>
                    <Button className="ft-pop-theme-btn">
                        {t('forumPopup.questionInput.askBtn')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel> */}

            {/* Popup 3 : - Forum Question  Complete popup */}
            {/* <BootstrapModel
                show={forumQuestionCompletePopup}
                backdrop="static"
                onHide={() => setForumQuestionCompletePopup(false)}
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
                    <Button className="ft-pop-theme-btn">
                        {t('common.Confirm')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel> */}


            {/* Popup 4 : - Forum Question delete popup */}
            {/* <BootstrapModel
                show={forumQuestionDeletePopup}
                backdrop="static"
                onHide={() => setForumQuestionDeletePopup(false)}
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
                        <Button className="ft-pop-theme-btn">
                            {t('proposalDeletion.yes')}
                        </Button>
                        <Button className="ft-pop-theme-btn">
                            {t('proposalDeletion.no')}
                        </Button>
                    </div>
                </BootstrapModel.Footer>
            </BootstrapModel> */}

            {/* Popup 5 : - Forum Question edit popup */}
            {/* <BootstrapModel
                show={forumQuestionEditPopup}
                onHide={() => setForumQuestionEditPopup(false)}
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
                    <Button className="ft-pop-theme-btn">
                        {t('common.Confirm')}
                    </Button>
                </BootstrapModel.Footer>
            </BootstrapModel> */}

        </>

    )
}
export default Demo

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});