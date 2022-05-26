import styles from '../styles/Register.module.css'
import loginstyles from '../styles/login.module.css'
import verifystyles from '../styles/emailVerify.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, Form, Input, Button, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { verifyEmail } from '../redux/actions'
import { GetServerSideProps } from 'next'
import styles1 from '../styles/components/pop.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import blueLogo from '../public/header.svg'
import mobieLightLogo from '../public/mobile-hero-light-logo.png'
import { LoginFooter, LoginHeader, LoginHeaderMobile } from '../components';
import router from 'next/router';
import { EmailAuth } from '../types';
import Router from 'next/router';
import { MEMBER_VERIFY_EMAIL } from '../constants/api';
import { ApiPostNoAuth } from '../service/api';
import { getUrl } from '../utils/helper';
import { REGISTER } from '../constants/routes';

const EmailConfirmation: React.FC = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [loadingclick, setloadingclick] = useState(false)
	const [, forceUpdate] = useState({});
	const [msg, setMsg] = useState(t('emailConfirm.blueMsg'));
	useEffect(() => {
		forceUpdate({});
	}, []);
	const dispatch = useDispatch()
	const store = useSelector((state: State) => state.validation.emailError)
	const useremail = useSelector((state: State) => state.auth.validateMember.email)
	const [visible, setVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState<any>(false)

	const [verficationcode, setVerficationcode] = useState<any>("")
	const [btnDisable, setBtnDisable] = useState<boolean>(true)

	useEffect(() => {
		if (verficationcode != "") {
			setBtnDisable(false)
		} else {
			setBtnDisable(true)
		}
	}, [verficationcode, btnDisable])

	const handleOk = () => {
		router.push(getUrl(router.locale, REGISTER))
	};

	const handleCancel = () => {
		router.push(getUrl(router.locale, REGISTER))
	};

	const onFinish = async (values: EmailAuth) => {
		const data = { email: values.email, verification_code: values.code?.toString().trim() }
		setloadingclick(true)
		await ApiPostNoAuth(MEMBER_VERIFY_EMAIL, data)
			.then((response: any) => {
				if (response.data && response.success) {
					setVisible(true)
				} else {
					console.log("No Data found")
				}
			})
			.catch(error => {
				setErrorMessage(true)
				// dispatch(verifyEmail())
				console.log("Error", error)
			})
		setloadingclick(false)
	};


	return (
		<div className={`${styles.container} minhight ft-emailConfirmation-page`}>

			<LoginHeader headingtext={t('changePwd.login')} />
			<LoginHeaderMobile headingtext={t('emailvarify.verifyEmail')} />

			<div className={`${styles.heading} col4-cmn-cntr-640 register-outer`}>
				<div className="mobile-hero">
					<div className="mobile-hero-heading">{t('emailvarify.verifyEmail')}</div>
					<div className="mobile-hero-overlay"></div>
				</div>
			</div>
			<Card className={`${styles.registerCard} col4-cmn-cntr-640 ft-register-card mb-100 pm-emailconfirmation-card`}>
				<p className={`${verifystyles.subheading} mb-5 emailConfirmation pm-emailConfirmation `}>{t('emailvarify.verifyEmailMsg')}</p>
				<Form form={form} name="login" layout="vertical" onFinish={onFinish}>
					<label className="login-form-label mb-3 custom-emailConfirm-content pm-line-height-m2 pm-emailConfirm-content" htmlFor="email">{t('emailConfirm.verificationCode')}</label>
					<Form.Item
						name="code"
						validateStatus={errorMessage ? "error" : ""}
						className="email-verify ft-db"
						rules={[
							{
								// required: true,
								// min: 4,
								//  message: t('login.emailErrorMessage'),
							}
						]}
					>
						<Input type="text" autoComplete="off" className="form-input" placeholder={t('emailConfirm.verificationCodePlaceholder')} onChange={(e) => {
							setErrorMessage(false)
							setVerficationcode(e.target.value)
						}} />

					</Form.Item>
					<p className={!errorMessage ? `${verifystyles.blueMsg} mb-5  pm-emailConfirmation  ` : `${verifystyles.redMsg} mb-5 pm-emailConfirmation `}>
						{errorMessage ? t('emailConfirm.codeIncorrect') : msg}</p>
					<label className="login-form-label mb-3 custom-emailConfirm-content pm-line-height-m2 pm-emailConfirm-content" htmlFor="email">{t('emailvarify.emailAddress')}</label>
					<Form.Item
						name="email"
						initialValue={useremail}
						className="ph-custom-confirmation"
					>
						<Input type="email" readOnly value={useremail} defaultValue={useremail} className="form-input" />
					</Form.Item>
					<Form.Item shouldUpdate>
						{() => (
							<Button
								type="primary"
								loading={loadingclick}
								htmlType="submit"
								disabled={btnDisable ? true : false}
								// 	!!form.getFieldsError().filter(({ errors }) => errors.length).length}
								className={
									// !form.isFieldsTouched(true) ||
									btnDisable ?
										`${loginstyles.savebutton} ${loginstyles.disabledbutton} primary-button email-verify mt-4 reg-btn ph-custom-dis pm-custom-dis-btn pm-emailConfirmation-submit-btn pm-disabled-btn-opa` :
										`${loginstyles.savebutton} primary-button mt-4 ph-custom-enable pm-emailConfirmation-submit-btn`}
							>

								{t('emailConfirm.saveButton')}
							</Button>
						)}
					</Form.Item>
				</Form>
			</Card>

			<LoginFooter />

			<Modal
				visible={visible}
				title={<div>
					<p style={{ fontWeight: "bold", fontSize: "40px", fontFamily: "SpoqaHanSans", lineHeight: "44px", marginBottom: "0px" }} className="pm-emailconfirmation-title ">{t('emailConfirm.popUpTitle')}</p>
				</div>}
				centered
				onOk={handleOk}
				onCancel={handleCancel}
				className="pop-title-email-verify ft-db pm-emailConfirmation-modal"
				bodyStyle={{ fontFamily: "SpoqaHanSans", fontStyle: "normal", fontWeight: "normal", fontSize: "20px", lineHeight: "28px", color: " #16181C" }}
				footer={[
					<Button key="back" className={`${styles1.footerbtn} d-flex justify-content-center align-items-center  ph-custom-enable ph-custom-enable1  pm-emailconfirmation-disable-btn `} onClick={handleCancel}>
						{t('emailConfirm.popUpButton')}
					</Button>
				]}
			>
				<p className="title pm-emailconfirmation-content-title pm-custom-emailconfirmation-title"> {t('emailConfirm.popUpContent')}
				</p>
			</Modal>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common']))
	}
});
export default EmailConfirmation