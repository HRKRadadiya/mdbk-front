import registerstyles from '../styles/Register.module.css'
import loginstyles from '../styles/login.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, Form, Input, Button, Modal, Upload } from 'antd';
import React from 'react';
import user from '../public/usergray.png'
import Image from 'next/image'
import Head from 'next/head'
import styles from '../styles/Search.module.css'
import { GetServerSideProps } from 'next'
import { AppLayout } from '../components';
import { ApiMemberDelete, ApiMemberGet, ApiMemberPost, ApiMemberPut } from '../service/api';
import { MEMBER, MEMBER_CHANGE_NOTIFICATION_SETTING, MEMBER_EDITINFORMATION_SETTING, MEMBER_MY_PROFILE, PROFILE_UPLOAD_PORTFOLIO } from '../constants/api';
import { useEffect, useState } from 'react';
import router from 'next/router';
import { getUrl } from '../utils/helper';
import { ROUTES } from '../constants';
import styles1 from "../styles/components/pop.module.css";
import Storage from '../service/storage';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import { Modal as BootstrapModal } from 'react-bootstrap'
import { memberLogout, Profile_Picture_Change } from '../redux/actions/memberAction';


function InfoSetting() {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [memberProfileData, setMemberProfileData] = useState<any>()
    const [deleteId, setDeleteId] = useState(0)
    const [visible, setVisible] = useState(false);
    const [passwordChangePopUp, setPasswordChangePopUp] = useState(false);
    const token = Storage.get('token');
    const [loading, setLoading] = useState(false)
    const [ProfleImage, setProfleImage] = useState()
    const registration_type = useSelector((state: State) => state.auth.userData.registration_type)
    const dispatch = useDispatch();
    const [isDisable, setIsDisable] = useState(true)
    const handleOk = async () => {
        await ApiMemberDelete(`${MEMBER}/${deleteId}`)
            .then((response: any) => {
                if (response.data && response.success) {
                    dispatch(memberLogout())
                    router.push(getUrl(router.locale, '/'));
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    };

    const handleCancel = () => {
        router.back()
        setVisible(false);
        setPasswordChangePopUp(false)
    };

    const handleOkChange = () => {
        router.push(getUrl(router.locale, ROUTES.MYPAGE))
    };

    const getData = async () => {
        await ApiMemberGet(MEMBER_MY_PROFILE, { registration_type })
            .then((response: any) => {
                if (response.data && response.success) {
                    setMemberProfileData(response.data.member)
                    setProfleImage(response.data.member.profile_picture)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }


    useEffect(() => {
        getData()
    }, [])

    const handleDeleteAccount = (id: number) => {
        setDeleteId(id)
        setVisible(true)
    }


    const onFinish = async (values: any) => {
        console.log("onFinish", values)
        const data = {
            name: memberProfileData.name,
            email: memberProfileData.email,
            password: values.password
        }
        await ApiMemberPut(MEMBER_EDITINFORMATION_SETTING, data)
            .then((response: any) => {
                if (response.data && response.success) {
                    setPasswordChangePopUp(true)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    function beforeUpload(file: any) {
        let message: any;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const dummyRequest = ({ onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    function getBase64(img: any, callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, async (imgUrl: any) => {
                setLoading(false)
                setProfleImage(imgUrl)
                const formData = new FormData();
                formData.append('profile_image', info.file.originFileObj)
                formData.append('registration_type', registration_type)
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'content-type': 'multipart/form-data'
                    }
                }
                await ApiMemberPost(PROFILE_UPLOAD_PORTFOLIO, formData, config).then(async (response: any) => {
                    if (response.data && response.success) {
                        dispatch(Profile_Picture_Change(response.data?.profile_image))
                    } else {
                        console.log("No Data found")
                    }
                }).catch((error: any) => console.log("Error", error))
            });
        }
    };

    return (
        <AppLayout title={t('myPages.infosetting')} whiteHeader={true}>
            {memberProfileData && <div className="jumbotron fe-page-outer ft-information-page">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <h1 className='ft-heading'>
                            {t('myPages.infosetting')}
                        </h1>
                        <div className="ft-info-wrap">
                            <div className="ft-profile">
                                <Upload
                                    name="img"
                                    listType="picture-card"
                                    className="ft-avatarUpload"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    customRequest={dummyRequest}
                                    onChange={handleChange}
                                >
                                    <img className="ft-profileImage" src={ProfleImage != null ? ProfleImage : "/grayuser.svg"} alt="User Image" />
                                    <button className="ft-profilebtn"><img src="/profilechange.png" alt="Change Profile" /></button>
                                </Upload>
                            </div>
                            <div className="ft-profile-main">
                                <div className="ft-control-wrapper">
                                    <label className={`ft-plabel`}>{t('myPages.labelName')}</label>
                                    <div className={`ft-val`} >
                                        {memberProfileData.name}
                                    </div>
                                </div>
                                <div className="ft-control-wrapper">
                                    <label className={`ft-plabel`}>{t('common.email')}</label>
                                    <div className={`ft-val`} >
                                        {memberProfileData.email}
                                    </div>
                                </div>
                                <Form form={form} name="register" layout="vertical" onFinish={onFinish}>
                                    <div className="ft-control-wrapper fe-alert-line at-control-ht">
                                        <Form.Item
                                            name="password"
                                            className=""
                                            label={
                                                <span className="ft-plabel">{t('index.formItem1.labelPassword')}</span>
                                            }
                                            rules={[
                                                {
                                                    // min: 6,
                                                    pattern: new RegExp(
                                                        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i
                                                    ),
                                                    message: t('index.formItem1.labelPassword1')
                                                },
                                                {
                                                    required: true,
                                                    message: t('index.formItem1.nameRequired')
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <Input type="password" autoComplete="off" placeholder={t('index.formItem1.placeholderPassword')} />
                                        </Form.Item>
                                    </div>
                                    <div className="ft-control-wrapper at-control-ht">
                                        <Form.Item
                                            name="confirmPassword"
                                            label={
                                                <span className="ft-plabel">{t('index.formItem1.labelConfirmPassword')}</span>
                                            }
                                            dependencies={['password']}
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t('index.formItem1.passwordNotMatch'),
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            setIsDisable(false)
                                                            return Promise.resolve();
                                                        }
                                                        setIsDisable(true)
                                                        return Promise.reject(new Error(t('index.formItem1.passwordNotMatch')));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input type="password" autoComplete="off" placeholder={t('index.formItem1.placeholderConfirmPassword')} />
                                        </Form.Item>
                                    </div>

                                    <Button
                                        type="primary"
                                        disabled={isDisable}
                                        htmlType="submit"
                                        className={`ft-save-btn ${isDisable ? "disable" : ""}`}
                                    >
                                        {t('myPages.save')}
                                    </Button>
                                    <div className={`ft-del-btn`}>
                                        <p onClick={() => handleDeleteAccount(memberProfileData.id)} >
                                            {t('myPages.deleteAcc')}
                                        </p>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            }

            <BootstrapModal
                show={passwordChangePopUp}
                onHide={() => handleOkChange()}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-info-change-Complete "
                centered
            >
                <BootstrapModal.Header closeButton className="ft-pop-header at-model-delac">
                    <BootstrapModal.Title>{t("myInfoPageComplete.title")}</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body className="ft-pop-body">
                    <div className="desc">{t("myInfoPageComplete.subTitle1")}</div>
                </BootstrapModal.Body>
                <BootstrapModal.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={handleOkChange}>
                        {t("resetPwd.confirm")}
                    </Button>
                </BootstrapModal.Footer>
            </BootstrapModal>

            <BootstrapModal
                show={visible}
                onHide={() => setVisible(false)}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-ac-delete-popup"
                centered
            >
                <BootstrapModal.Header closeButton className="ft-pop-header at-model-delac">
                    <BootstrapModal.Title>{t("myPages.deleteAcc")}</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body className="ft-pop-body">
                    <div className="desc">{t("accountDeletion.subTitle")}</div>
                    <div className="desc">{t("accountDeletion.subTitle1")}</div>
                </BootstrapModal.Body>
                <BootstrapModal.Footer className="ft-pop-footer">
                    <div className="ft-footer-btns ft-two-btn">
                        <Button className="ft-pop-border-btn" onClick={handleOk}>
                            {t("proposalDeletion.yes")}
                        </Button>
                        <Button className="ft-pop-theme-btn" onClick={() => setVisible(false)}>
                            {t("accountDeletion.no")}
                        </Button>
                    </div>
                </BootstrapModal.Footer>
            </BootstrapModal>
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default InfoSetting