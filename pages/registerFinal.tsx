import { useEffect, useState } from 'react'
import React from 'react'
import { LoginFooter } from '../components'
import { useTranslation } from 'react-i18next'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ApiPostNoAuth } from '../service/api'
import { REGISTER } from '../constants/api'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import GiftBox from '../public/PopupImage.svg'
import { registerMember } from '../redux/actions'
import { useRouter } from 'next/router'
import popUpstyles from '../styles/components/pop.module.css'
import { getUrl, isEmpty } from '../utils/helper'
import { EDIT_CLIENT_PROFILE, EDIT_SIDE_CHARACTER_PROFILE } from '../constants/routes'
import { State } from '../redux/reducers/rootReducer'
import { ROUTES } from '../constants'
import { Button, Modal } from 'antd'


const Register = () => {
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
    const emaildata = useSelector((state: State) => state?.auth?.validateMember?.email)
    const [formData, setFormData] = useState<any>({
        registration_type: 1,
        name: "",
        email: emaildata,
        password: "",
        confirm_password: "",
        policy: false
    })
    const [nameError, setNameError] = useState(false)
    const { t } = useTranslation();
    const [registerDisable, setregisterDisable] = useState<boolean>(true)
    const [passwordMessageClient, setPasswordMessageClient] = useState(true)
    const [passwordPatten, setPasswordPatten] = useState<any>(false)
    const [samePassword, setSamePassword] = useState(false)
    const dispatch = useDispatch()
    const [emailIsRequired, setEmailIsRequired] = useState<any>(null)
    const router = useRouter();
    const [visible, setVisible] = useState(false)

    const handleCancel = () => {
        if (formData.registration_type == 1) {
            router.push(getUrl(router.locale, EDIT_CLIENT_PROFILE))
        } else {
            router.push(getUrl(router.locale, EDIT_SIDE_CHARACTER_PROFILE))
        }
        setVisible(false)
    }

    useEffect(() => {
        if (formData.name != "" && formData.password != "" && formData.confirm_password != "" && formData.policy && !samePassword && !passwordPatten) {
            setregisterDisable(false)
        } else {
            setregisterDisable(true)
        }
    }, [formData, registerDisable, samePassword, passwordPatten])

    function handlePolicy(e: any) {
        setEmailIsRequired(null)
        setFormData({ ...formData, policy: e.target.checked })
    }

    const handleChangeForm = (e: any, key: number) => {
        setEmailIsRequired(null)
        if (key == 1) {
            setFormData({ ...formData, name: e.target.value });
        } else if (key == 2) {
            setPasswordMessageClient(false)
            setFormData({ ...formData, password: e.target.value });
        } else if (key == 3) {
            setFormData({ ...formData, confirm_password: e.target.value });
        }
    }

    useEffect(() => {
        if (new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i).test(formData.password) || formData.password.length < 3) {
            setPasswordPatten(false)
        } else {
            setPasswordPatten(true)
        }
        if (formData.password.length == 0) {
            setPasswordMessageClient(true)
        }
    }, [formData.password])

    useEffect(() => {
        if (formData.confirm_password.length > 2) {
            if (formData.password == formData.confirm_password) {
                setSamePassword(false)
            } else {
                setSamePassword(true)
            }
        }
    }, [formData.password, formData.confirm_password])

    const handleRegister = async () => {
        await ApiPostNoAuth(REGISTER, formData)
            .then((response: any) => {
                const data = {
                    token: response.data.token,
                    registration_type: response.data.registration_type,
                    member: {
                        email: response.data.member.email,
                        id: response.data.member.id,
                        name: response.data.member.name,
                    }
                }
                if (response.data && response.success) {
                    setVisible(true)
                    dispatch(registerMember(data))
                } else {
                    console.log("No Data found")
                }
            })
            .catch((error: any) => {
                if ((error?.error?.email?.length || 0) > 0) {
                    setEmailIsRequired(error.error)
                }
                if ((error?.error?.password?.length || 0) > 0) {
                    setPasswordPatten(true)
                }
            })
    };

    return (
        <div className="register-header pv-footer">

            <div className="bg-shadow hm-bg-shadow"></div>
            <div className="reg-header-logo">
                <div className="header-logo1">
                    <div className="header-fix-container">
                        <img src="/header.svg" alt="" />
                    </div>
                </div>
            </div>
            <div className="reg-header">

                <div className="pv-main-header">
                    <img src="/Union.svg" alt="" />
                </div>
                <div className="main-header hm-main-header">
                    <p>{t('common.Register')}</p>
                </div>
                <div className="main-register-box">
                    <div className="register-cilent-box">

                        <div className={(formData.registration_type == 1) ? "register-cilent-1" : "register-cilent"} onClick={() => setFormData({ ...formData, registration_type: 1 })}>
                            <img src={(formData.registration_type == 1) ? "/client1.svg" : "/clientDark.svg"} alt="" />
                            <p>{t('index.tab1.subTitle')}</p>
                        </div>

                        <div className="line-box">
                            <img src="/Rectangle 2957.png" alt="" />
                        </div>
                        <div className="line-box-1">
                            <img src="/Rectangle 3855.png" alt="" />
                        </div>

                        <div className={(formData.registration_type == 2) ? "register-cilent-1" : "register-cilent"} onClick={() => setFormData({ ...formData, registration_type: 2 })}>
                            <img src={(formData.registration_type == 2) ? "/sideCharc.svg" : "/sideCharcDark.svg"} alt="" />
                            <p>{t('index.tab2.subTitle')}</p>
                        </div>


                    </div>

                    <div className="reg-box">
                        <div className="register-input-box" >
                            <div className="name-1 ">
                                <p>{t('index.formItem1.labelName')}</p>
                            </div>
                            <div className={`name-input`} >
                                <input type="text" autoComplete="off" placeholder={t('index.formItem1.placeholderName')} onChange={(e) => handleChangeForm(e, 1)} />
                            </div>

                            {/* {(formData.name == "") && <div className="error-messge">
                                <p>필수 정보입니다.</p>
                            </div>
                            } */}

                        </div>
                        <div className="register-input-box ">
                            <div className="name">
                                <p>{t('index.formItem1.labelEmail')}</p>
                            </div>
                            <div className={`name-input ${!isEmpty(emailIsRequired) && "error"}`}>
                                <input type="text" autoComplete="off" placeholder={t('index.formItem1.placeholderEmail')} value={formData.email} readOnly disabled />
                            </div>
                            {!isEmpty(emailIsRequired) ? <div className="error-messge"> <p>{t('index.formItem1.emailAlreadyExist')}</p></div> : null}

                        </div>
                        <div className="register-input-box  ">
                            <div className="name">
                                <p>{t('index.formItem1.labelPassword')}</p>
                            </div>
                            <div className={`name-input pv-password ${passwordPatten && "error"}`}>
                                <input type="password" autoComplete="off" placeholder={t('index.formItem1.placeholderPassword')} onChange={(e) => handleChangeForm(e, 2)} />
                            </div>

                            {passwordMessageClient && <div className="password-name"><p>{t('index.formItem1.labelPassword1')}</p></div>}

                            {passwordPatten && <div className="error-messge"><p>{t('index.formItem1.labelPassword1')}</p></div>}

                        </div>
                        <div className="register-input-box  pv-register-input">
                            <div className="name">
                                <p>{t('index.formItem1.labelConfirmPassword')}</p>
                            </div>
                            <div className={`name-input  pv-password  ${samePassword && "error"}`}>
                                <input type="password" autoComplete="off" placeholder={t('index.formItem1.placeholderConfirmPassword')} onChange={(e) => handleChangeForm(e, 3)} />
                            </div>

                            {samePassword && <div className="error-messge">
                                <p>{t('index.formItem1.passwordNotMatch')}</p>
                            </div>
                            }

                        </div>
                        <div className="social-media-text">
                            <p>{t('index.formEndContent1')}</p>
                        </div>
                        <div className="check-box ">
                            <label className="checkbox-container">
                                <input type="checkbox" onChange={(e) => handlePolicy(e)} />
                                <span className="checkmark"></span>

                            </label>
                            <p className="checkbox-text">
                                <span>{t('index.formEndContent2.sp1')} </span>
                                <a href={ROUTES.PRIVACY_POLICY} target="_blank" className="term-bold">{t('index.formEndContent2.sp2')}</a>
                                <span>{t('index.formEndContent2.sp4')}</span>
                                {" "}
                                <a href={ROUTES.TERMS_CONDITION} target="_blank" className="term-bold">{t('index.formEndContent2.sp3')}</a>
                                <span> {t('index.formEndContent2.sp5')}</span>
                            </p>
                        </div>
                        <div className={registerDisable ? "register-btndisable register-btn" : "register-btn  "}>
                            <button disabled={registerDisable} onClick={handleRegister}><p>{t('index.heading')}</p></button>
                        </div>
                    </div>
                </div>
            </div>
            <LoginFooter />
            <Modal
                maskClosable={false}
                visible={visible}
                title={
                    <div>
                        <div className="title1">
                            <p className="ph-custom-title">{t("resetPwd.welcome")}</p>
                        </div>
                        <div className="title2">
                            <p className="ph-custom-title2">{t("resetPwd.popUpTitle")}</p>
                        </div>
                    </div>
                }
                centered
                //  onOk={handleOk}
                onCancel={handleCancel}
                className="modal-title1 ft-profile-complete-popup fe-model-register-complete ph-custom-box pm-pop-custom-box pm-register-modal"
                footer={[
                    <Button
                        key="back"
                        className={`${popUpstyles.footerbtn} ft-complete-profile-btn ph-ft-submit-btn`}
                        onClick={handleCancel}
                    >
                        {t("resetPwd.saveButton")}
                    </Button>,
                ]}
            >
                {width < 639 ? (
                    <div className="ft-desc pm-responsive-register-modal-desc">
                        <p> {t("resetPwd.bonusMsg")}
                            <span className="ph-ft-pop-title">{t("resetPwd.completeProfileMsg")}</span>
                        </p>
                    </div>
                ) : (
                    <div className="ft-desc">
                        <p> {t("resetPwd.bonusMsg")}</p>
                        <p className="ph-ft-pop-title">{t("resetPwd.completeProfileMsg")}</p>
                    </div>

                )
                }
                <div className="ft-popup-img">
                    <Image
                        src={GiftBox}
                        alt="Blue Navbar Logo"
                        className="ph-ft-custom-gift-img"
                    />
                </div>
            </Modal >
        </div>

    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default Register