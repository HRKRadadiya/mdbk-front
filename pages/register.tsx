/* eslint-disable @next/next/no-img-element */

import styles from '../styles/Register.module.css';
import loginstyles from '../styles/login.module.css';
import verifystyles from '../styles/emailVerify.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, Form, Input, Button, Tabs, Modal, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import { registerMember } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import mobieLightLogo from '../public/mobile-hero-light-logo.png'
import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { State } from '../redux/reducers/rootReducer';
import blueLogo from '../public/header.svg'
import { LoginFooter, LoginHeader, LoginHeaderMobile } from '../components';
import { RegisterAuth } from '../types';
import { ApiPostNoAuth } from '../service/api';
import { CLIENT_PROFILE, REGISTER } from '../constants/api';
import router, { useRouter } from 'next/router';
import Router from 'next/router';
import popUpstyles from '../styles/components/pop.module.css'
import GiftBox from '../public/PopupImage.svg'
import { getUrl, isEmpty } from '../utils/helper';
import { CLIENTPROFILEPROFILE, EDIT_CLIENT_PROFILE, EDIT_SIDE_CHARACTER_PROFILE, SIDECHARACTERPROFILE } from '../constants/routes';
import { ROUTES } from '../constants';
import response from './forum/response';



const Register: React.FC = () => {
	const { t } = useTranslation();
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
	const [key, setKey] = useState<any>("1");
	const [form] = Form.useForm();
	const [form1] = Form.useForm();
	const [memberId, setMemberId] = useState(0)
	const [, forceUpdate] = useState({});
	useEffect(() => {
		forceUpdate({});
	}, []);

	const [password, setPassword] = useState<any>(t('index.formItem1.labelPassword1'));
	const { TabPane } = Tabs;
	const dispatch = useDispatch()
	const store = useSelector((state: State) => state.validation.emailAlreadyExist)
	const emaildata = useSelector((state: State) => state.auth.validateMember.email)
	const [loadingclick, setloadingclick] = useState(false)
	const [passwordIsRequired, setPasswordIsRequired] = useState<any>(null)
	const [passwordPatten, setPasswordPatten] = useState<any>(false)
	const [passwordPattenSideChar, setPasswordPattenSideChar] = useState<any>(false)
	const [passwordMessageClient, setPasswordMessageClient] = useState(true)
	const [passwordMessageSideChar, setPasswordMessageSideChar] = useState(true)
	const [isEnable, setIsEnable] = useState(false);
	const [sideIsEnable, setSideIsEnable] = useState(false);

	const [clientForm, setClientForm] = useState<any>({
		name: "",
		password: "",
		confirmpassword: "",
		policy: false
	})
	const [sideForm, setSideForm] = useState<any>({
		name: "",
		password: "",
		confirmpassword: "",
		policy: false
	})
	const [registerDisable, setregisterDisable] = useState<boolean>(true)
	const [registerDisable1, setregisterDisable1] = useState<boolean>(true)

	const router = useRouter();
	const [visible, setVisible] = useState(false)

	const handleCancel = () => {
		if (key == 1) {
			router.push(getUrl(router.locale, EDIT_CLIENT_PROFILE))
		} else {
			router.push(getUrl(router.locale, EDIT_SIDE_CHARACTER_PROFILE))
		}
		setVisible(false)
	}

	// const onChange = () => {
	// 	setPasswordIsRequired(null)
	// 	setPasswordMessageClient(false)
	// }

	// const onChangeSideCharPass = () => {
	// 	setPasswordMessageSideChar(false)
	// }

	function handleClientPolicy(e: any) {
		setClientForm({ ...clientForm, policy: e.target.checked })
	}

	function handleSideCharPolicy(e: any) {
		setSideForm({ ...sideForm, policy: e.target.checked })
	}

	const onFinish = async (values: RegisterAuth) => {
		setloadingclick(true)
		let data;
		if (key == 1) {
			data = {
				name: values.name,
				email: values.email,
				password: values.password,
				confirm_password: values.confirmPassword,
				registration_type: key
			}
		} else {
			data = {
				name: values.name1,
				email: values.email1,
				password: values.password1,
				confirm_password: values.confirmPassword1,
				registration_type: key
			}
		}
		// dispatch(registerMember(data, setloadingclick))
		await ApiPostNoAuth(REGISTER, data)
			.then((response: any) => {
				setMemberId(response.data.member.id)
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
					setPasswordIsRequired(error.error)
				}
				if ((error?.error?.password?.length || 0) > 0) {
					setPasswordPatten(false)
				}
			})
		setloadingclick(false)
	};

	useEffect(() => {
		if (new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i).test(clientForm.password) || clientForm.password.length < 3) {
			setPasswordPatten(true)
		} else {
			setPasswordPatten(false)
		}
	}, [clientForm.password])

	useEffect(() => {
		if (new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i).test(sideForm.password) || sideForm.password.length < 3) {
			setPasswordPattenSideChar(true)
		} else {
			setPasswordPattenSideChar(false)
		}
	}, [passwordPattenSideChar, sideForm.password])

	useEffect(() => {
		if (clientForm.name != "" && clientForm.password != "" && clientForm.confirmpassword != "" && clientForm.policy) {
			setregisterDisable(false)
		} else {
			setregisterDisable(true)
		}
	}, [clientForm, registerDisable])

	useEffect(() => {
		if (sideForm.name != "" && sideForm.password != "" && sideForm.confirmpassword != "" && sideForm.policy) {
			setregisterDisable1(false)
		} else {
			setregisterDisable1(true)
		}
	}, [sideForm, registerDisable1])

	const handleChangeForm = (e: any, key: number) => {

		setPasswordIsRequired(null)

		if (key == 1) {
			setClientForm({ ...clientForm, name: e.target.value });
		} else if (key == 2) {
			setIsEnable(true);
			setClientForm({ ...clientForm, password: e.target.value });
			setPasswordMessageClient(false)

		} else if (key == 3) {
			setClientForm({ ...clientForm, confirmpassword: e.target.value });
		}
	}
	const handleChangeForm1 = (e: any, key: number) => {

		setPasswordIsRequired(null)
		if (key == 1) {
			setSideForm({ ...sideForm, name: e.target.value });
		} else if (key == 2) {
			setSideForm({ ...sideForm, password: e.target.value });
			setPasswordMessageSideChar(false)
			setSideIsEnable(true);

		} else if (key == 3) {
			setSideForm({ ...sideForm, confirmpassword: e.target.value });
		}
	}

	return (
		<div className={`${styles.container} minhight ft-register-page`}>
			<div className="bg-pc-overlay"></div>
			<LoginHeader headingtext={t('changePwd.login')} />
			<LoginHeaderMobile headingtext={t('index.heading')} />


			<div className={`${styles.heading} col4-cmn-cntr-640 register-outer`}>
				<div className="mobile-hero">
					{/* <div className="mobile-hero-logo">
						<Link href='/'>
							<a href="#" className="">
								<Image src={mobieLightLogo} alt="Mobile Hero Logo" />
							</a>
						</Link>
					</div> */}
					<div className="mobile-hero-heading ">{t('index.heading')}</div>
					<div className="mobile-hero-overlay"></div>
				</div>

			</div>
			<Card
				className={`${styles.registerCard} col4-cmn-cntr-640 registerTabModalCard`}
				activeTabKey={key}
			>
				<Tabs defaultActiveKey="1" className="registerSteps registerTabModal ft-reg-modal" centered onChange={key => setKey(Number(key))}>
					<TabPane className="row-3" key={1} tab={
						<div>
							<div className={styles.tab}>
								{key == "1" ? <img src="/client1.svg" alt="Header" /> : <img src="/clientDark.svg" alt="Header" />}
								<p>{t('index.tab1.subTitle')}</p>
							</div>
						</div>
					} >
						<Form form={form} name="register" layout="vertical" className={styles.registerForm} onFinish={onFinish}>
							<Form.Item

								name="name"
								label={
									<span className={styles.formLabel}>{t('index.formItem1.labelName')}</span>
								}
								rules={[
									{
										required: true,
										message:
											t('index.formItem1.nameRequired')
									},
									{
										pattern: new RegExp(
											/[A-Za-z]|[\u3131-\uD79D]/ugi
										),
										message: t('index.formItem1.usePropercharacters')
									},
								]}
							>
								<Input type="text" autoComplete="off"
									placeholder={t('index.formItem1.placeholderName')} className="form-input input-eighteen " onChange={(e) => handleChangeForm(e, 1)} />
							</Form.Item>
							<Form.Item
								name="email"
								validateStatus={isEmpty(passwordIsRequired) ? "" : "error"}
								initialValue={emaildata}
								label={
									<span className={styles.formLabel}>{t('index.formItem1.labelEmail')}</span>
								}
								rules={[
									{
										required: false,
										// type: 'email',
										message: t('index.formItem1.checkEmail'),
									},
								]}>
								<Input autoComplete="nope" type="text" readOnly required={false} defaultValue={emaildata} value={emaildata} placeholder={t('index.formItem1.placeholderEmail')} className="form-input input-eighteen" />
								{!isEmpty(passwordIsRequired) ? <p className={`${verifystyles.redMsg}`}>{t('index.formItem1.emailAlreadyExist')}</p> : null}
							</Form.Item>
							<div className={`ft-enter-pass`}>
								<Form.Item
									validateStatus={passwordPatten ? "" : "error"}
									name="password"
									label={
										<span className={styles.formLabel}>{t('index.formItem1.labelPassword')}</span>
									}
									rules={[
										{
											required: true,
											message: t('index.formItem1.nameRequired')
										},
									]}
									hasFeedback
								>
									<Input type="password" name="password" autoComplete="nope" onChange={(e) => handleChangeForm(e, 2)} placeholder={t('index.formItem1.placeholderPassword')} className="form-input input-twenty" />
								</Form.Item>
								{passwordMessageClient ? <div className={`password-hint ${router.locale == "en" ? "en" : ""}`}>{t('index.formItem1.labelPassword1')}</div> : null}
								{/* {isEnable && clientForm.password.length == 0 ? <div className={`fe-input-error`}>{t('index.formItem1.nameRequired')}</div> : null} */}
								{passwordPatten ? null : <div className={`fe-input-error`}>{t('index.formItem1.labelPassword1')}</div>}

							</div>

							<Form.Item
								name="confirmPassword"
								label={
									<span className={styles.formLabel}>{t('index.formItem1.labelConfirmPassword')}</span>
								}
								// style={{ paddingTop: "20px" }}
								className="confirmPassworError"
								dependencies={['password']}
								hasFeedback
								rules={[
									{
										required: true,
										message: t('index.formItem1.nameRequired'),
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve();
											}
											return Promise.reject(new Error(t('index.formItem1.passwordNotMatch')));
										},
									}),
								]}
							>
								<Input type="password" autoComplete="nope" placeholder={t('index.formItem1.placeholderConfirmPassword')} className="form-input input-twenty" onChange={(e) => handleChangeForm(e, 3)} />
							</Form.Item>
							<div className="regitser-footerContent">
								<p className={styles.termsLabel}>
									{t('index.formEndContent1')}
								</p>
								<div className="at-check">
									<Checkbox onChange={handleClientPolicy} className="ft-custom-checkbox"></Checkbox>
									<p className="mb-0 ft-reg-term">
										<span>{t('index.formEndContent2.sp1')} </span>
										<a href={ROUTES.PRIVACY_POLICY} target="_blank" className="ft-term-bold"> {t('index.formEndContent2.sp2')}</a>
										<span> {t('index.formEndContent2.sp4')}</span>
										<a target="_blank" href={ROUTES.TERMS_CONDITION} className="ft-term-bold"> {t('index.formEndContent2.sp3')}</a>
										<span> {t('index.formEndContent2.sp5')}</span>
									</p>
								</div>
							</div>
							<Form.Item className="regiterBtnRow" shouldUpdate>
								{() => (
									<Button
										htmlType="submit"
										loading={loadingclick}
										type="primary"
										disabled={registerDisable ? true : false}
										className={
											registerDisable ?
												`${loginstyles.savebutton} ${loginstyles.disabledbutton} primary-button email-verify at-reg-btn` :
												`${loginstyles.savebutton} primary-button`}
									>
										{t('index.heading')}
									</Button>
								)}
							</Form.Item>
						</Form>
					</TabPane>

					<TabPane className="row-3" key={2} tab={
						<div>
							<div className={styles.tab}>
								{key == 2 ? <img src="/sideCharc.svg" alt="Header" /> : <img src="/sideCharcDark.svg" alt="Header" />}
								<p>{t('index.tab2.subTitle')}</p>
							</div>
						</div>} >
						<Form form={form1} name="register1" layout="vertical" className={styles.registerForm} onFinish={onFinish}>
							<Form.Item
								name="name1"
								label={
									<span className={styles.formLabel}>{t('index.formItem1.labelName')}</span>
								}
								rules={[
									{
										required: true,
										message:
											t('index.formItem1.nameRequired')
									},
									{
										pattern: new RegExp(
											/[A-Za-z]|[\u3131-\uD79D]/ugi
										),
										message: t('index.formItem1.usePropercharacters')
									},
								]}
							>
								<Input type="text" autoComplete="off"
									placeholder={t('index.formItem1.placeholderName')} className="form-input input-eighteen" onChange={(e) => handleChangeForm1(e, 1)} />
							</Form.Item>
							<Form.Item
								name="email1"
								validateStatus={isEmpty(passwordIsRequired) ? "" : "error"}
								initialValue={emaildata}
								label={
									<span className={styles.formLabel}>{t('index.formItem1.labelEmail')}</span>
								}
								rules={[
									{
										required: false,
										// type: 'email',
										message: t('index.formItem1.checkEmail'),
									},
								]}>
								<Input autoComplete="nope" type="text" readOnly required={false} defaultValue={emaildata} value={emaildata} placeholder={t('index.formItem1.placeholderEmail')} className="form-input input-eighteen" />
								{!isEmpty(passwordIsRequired) ? <p className={`${verifystyles.redMsg}`}>{t('index.formItem1.emailAlreadyExist')}</p> : null}
							</Form.Item>
							<div className="ft-enter-pass">
								<Form.Item
									validateStatus={passwordPattenSideChar ? "" : "error"}
									name="password1"
									label={
										<span className={styles.formLabel}>{t('index.formItem1.labelPassword')}</span>
									}
									rules={[
										{
											required: true,
											message: t('index.formItem1.nameRequired')
										},
									]}
									hasFeedback
								>
									<Input type="password" autoComplete="nope" onChange={(e) => handleChangeForm1(e, 2)} placeholder={t('index.formItem1.placeholderPassword')} className="form-input input-twenty" />
								</Form.Item>
								{passwordMessageSideChar ? <div className={`password-hint ${router.locale == "en" ? "en" : ""}`}>{t('index.formItem1.labelPassword1')}</div> : null}
								{/* {sideIsEnable && sideForm.password.length == 0 ? <div className={`fe-input-error`}>{t('index.formItem1.nameRequired')}</div> : null} */}
								{!passwordPattenSideChar ? <div className={`fe-input-error`}>{t('index.formItem1.labelPassword1')}</div> : null}

								{/* <p className={`${verifystyles.redMsg}`}>{passwordIsRequired != null && passwordIsRequired.password != null && passwordIsRequired.password[0] && t('index.formItem1.labelPassword1')}</p> */}
							</div>
							<Form.Item
								name="confirmPassword1"
								label={
									<span className={styles.formLabel}>{t('index.formItem1.labelConfirmPassword')}</span>
								}
								className="confirmPassworError"
								dependencies={['password1']}
								hasFeedback
								rules={[
									{
										required: true,
										message: t('index.formItem1.nameRequired'),
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password1') === value) {
												return Promise.resolve();
											}
											return Promise.reject(new Error(t('index.formItem1.passwordNotMatch')));
										},
									}),
								]}
							>
								<Input type="password" autoComplete="nope" placeholder={t('index.formItem1.placeholderConfirmPassword')} className="form-input input-twenty" onChange={(e) => handleChangeForm1(e, 3)} />
							</Form.Item>
							<div className="regitser-footerContent">
								<p className={styles.termsLabel}>
									{t('index.formEndContent1')}
								</p>
								<div className="at-check">
									<Checkbox onChange={handleSideCharPolicy} className="ft-custom-checkbox"></Checkbox>
									<p className="mb-0 ft-reg-term">
										<span>{t('index.formEndContent2.sp1')} </span>
										<a href={ROUTES.PRIVACY_POLICY} target="_blank" className="ft-term-bold"> {t('index.formEndContent2.sp2')}</a>
										<span> {t('index.formEndContent2.sp4')}</span>
										<a target="_blank" href={ROUTES.TERMS_CONDITION} className="ft-term-bold"> {t('index.formEndContent2.sp3')}</a>
										<span> {t('index.formEndContent2.sp5')}</span>
									</p>
								</div>
							</div>
							<Form.Item className="regiterBtnRow" shouldUpdate>
								{() => (
									<Button
										loading={loadingclick}
										type="primary"
										htmlType="submit"
										disabled={registerDisable1 ? true : false}
										// disabled={!form1.isFieldsTouched(true) ||
										// 	!!form1.getFieldsError().filter(({ errors }) => errors.length).length}
										className={
											// !form1.isFieldsTouched(true) ||
											registerDisable1 ?
												`${loginstyles.savebutton} ${loginstyles.disabledbutton} primary-button email-verify` :
												`${loginstyles.savebutton} primary-button`}
									>
										{t('index.heading')}
									</Button>
								)}
							</Form.Item>
						</Form>
					</TabPane>
				</Tabs>
			</Card>

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
		</div >
	)
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common']))
	}
});

export default Register