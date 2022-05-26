import styles from '../styles/Register.module.css'
import loginstyles from '../styles/login.module.css'
import verifystyles from '../styles/emailVerify.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, Form, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Router, { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { State } from '../redux/reducers/rootReducer';
import mobieLightLogo from '../public/mobile-hero-light-logo.png'
import Image from 'next/image'
import * as types from '../types'
import Link from 'next/link'
import { LoginFooter, LoginHeader, LoginHeaderMobile } from '../components';
import { loginUser } from '../redux/actions';
import { ApiPostNoAuth } from '../service/api';
import { LOGIN } from '../constants/api';
import { memberLogout, nike_name_Change, Profile_Picture_Change, progress_Change_Client, progress_Change_SideChar, searchFilterForm } from '../redux/actions/memberAction';
import { updateClientProfile } from '../redux/actions/clientProfileAction';
import { updateSideCharecterProfile } from '../redux/actions/sideCharacterAction';

const ChangePassword: React.FC = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const router = useRouter();
	const [force, forceUpdate] = useState({});
	const [msg, setMsg] = useState<boolean>();
	useEffect(() => {
		forceUpdate({});
	}, []);
	const dispatch = useDispatch()
	const email = useSelector((state: State) => state.auth.validateMember.email)
	const passwordError = useSelector((state: State) => state.auth.passwordErr.message)

	interface password { password: string }

	const onFinish = async (values: any) => {
		const password = values.password;
		await ApiPostNoAuth(LOGIN, { email, password })
			.then((response: any) => {
				const data = {
					token: response.data.token,
					registration_type: response.data.registration_type,
					member: {
						email: response.data.member.email,
						id: response.data.member.id,
						name: response.data.member.name,
						notify: response.data.total_un_read_notifications,
					}
				}
				const searchFilter = {
					client__side_character: response.data.member.search_option.client__side_character,
					side_character__client: response.data.member.search_option.side_character__client
				}
				const progress = {
					client: response.data?.member?.client_profile_progress,
					sideChar: response.data?.member?.side_character_profile_progress
				}
				if (response.data && response.success) {
					dispatch(memberLogout())
					setMsg(false)
					dispatch(progress_Change_Client(progress.client))
					dispatch(progress_Change_SideChar(progress.sideChar))
					dispatch(loginUser(data))
					dispatch(updateClientProfile(response.data?.profile_info?.client_profile))
					dispatch(updateSideCharecterProfile(response.data?.profile_info?.side_character_profile))
					dispatch(nike_name_Change(response.data?.profile?.nick_name))
					dispatch(Profile_Picture_Change(response.data?.profile?.profile_picture))
					dispatch(searchFilterForm(searchFilter))
					router.push(`${router.locale && router.locale == 'en' ? '/en/' : '/'}`)
				} else {
					console.log("No Data found")
				}
			})
			.catch((error: any) => {
				setMsg(true)
				console.log("Error", error)
			})
	}

	const onChange = (values: any) => {
		setMsg(false)
	};


	return (
		<div className={`${styles.container} minhight ft-changePassword-page`}>

			<LoginHeader headingtext={t('changePwd.login')} />
			<LoginHeaderMobile headingtext={t('changePwd.login')} />

			<div className="main-content-outer">
				<div className={`${styles.heading} col4-cmn-cntr-640 register-outer`}>
					<div className="mobile-hero">
						<div className="mobile-hero-heading">{t('changePwd.login')}</div>
						<div className="mobile-hero-overlay"></div>
					</div>
				</div>
				<Card className={`${styles.registerCard} col4-cmn-cntr-640 ft-register-card mb-100 pm-password-input-ctn`}>
					<Form form={form} name="login" layout="vertical" onFinish={onFinish}>
						<label className="login-form-label mb-3 custom-pass-title pm-enter-password-content pm-line-height-m2" htmlFor="email">{t('changePwd.password')}</label>
						<div style={{ minHeight: "92px" }} className="custom-textbtn ph-custom-textbtn">
							<Form.Item
								name="password"
								className={`email-verify ft-db ${msg ? "ft-input-err" : ""} pm-password-error-ctn`}
								rules={[
									{
										required: true,
										min: 0,
										message: t('index.formItem1.checkPassword'),
									}
								]}
							>
								<Input type="password" className="form-input pm-custom-password-input-text" onChange={onChange} placeholder={t('changePwd.passwordPlaceholder')} />
							</Form.Item>
							{msg ? <p className={`${verifystyles.redMsg}`}>{t('index.formItem1.checkPassword')}</p> : null}
						</div>
						<Button className={`${verifystyles.resetPwd} ft-resetpwd-btn mb-50 pcustom--btn ph-custom-password`} onClick={() => {
							router.locale == 'en' ?
								Router.push('/en/reset-password') : Router.push('/reset-password')
						}}>{t('changePwd.resetPassword')}</Button>
						<Form.Item shouldUpdate className="ft-login-btn custom-reset-pass">
							{() => (
								<Button
									type="primary"
									htmlType="submit"
									disabled={
										!form.isFieldsTouched(true) ||
										!!form.getFieldsError().filter(({ errors }) => errors.length).length}
									className={!form.isFieldsTouched(true) ||
										!!form.getFieldsError().filter(({ errors }) => errors.length).length ?
										`${loginstyles.savebutton} ${loginstyles.disabledbutton} primary-button email-verify ph-custom-password1 pm-disabled-btn pm-disabled-btn-opa` :
										`${loginstyles.savebutton} primary-button ph-custom-password1`}
								>
									{t('changePwd.login')}
								</Button>
							)}
						</Form.Item>


					</Form>
				</Card>
			</div>
			<LoginFooter />
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common']))
	}
});

export default ChangePassword