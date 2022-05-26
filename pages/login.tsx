import styles from '../styles/Register.module.css'
import loginstyles from '../styles/login.module.css'
import verifystyles from '../styles/emailVerify.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, Form, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login-typed';
import { Apple, Facebook, Google, Kakaotalk, Naver } from '../public/icon'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import mobieLightLogo from '../public/mobile-hero-light-logo.png'
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next'
import { LoginFooter, LoginHeader, LoginHeaderMobile } from '../components';
import GoogleLogin from 'react-google-login';
import { facebookappId, googleclientId } from '../constants/authids';
import { isEmailRegistered } from '../redux/actions';
import axios from 'axios';
import { BASE_URL, CHECK_EMAIL } from '../constants/api';
import { isSocialRegistered, memberLogout } from '../redux/actions/memberAction';
import { EmailAuth } from '../types';
import { toast, ToastContainer } from 'react-toastify';

const Login: React.FC = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const router = useRouter();
	const [fource, forceUpdate] = useState({});
	const [loadingclick, setloadingclick] = useState(false)
	const [email, setEmail] = useState('');
	const dispatch = useDispatch()
	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = async (values: EmailAuth) => {
		dispatch(isEmailRegistered(values, setloadingclick))
	};

	const responseGoogle = (response: any) => {
		const data = {
			email: response.profileObj.email,
			name: response.profileObj.name,
			login_type: "google",
			social_id: response.profileObj.googleId
		}
		dispatch(isSocialRegistered(data))
	}

	const responseFacebook = (response: any) => {
		const data = {
			email: response.email,
			name: response.name,
			login_type: "facebook",
			social_id: response.id
		}
		dispatch(isSocialRegistered(data))
	}

	const failResponseGoogle = () => {
		toast.error(t('common.popupclose'))
	}

	const failResponseFacebook = () => {
		toast.error(t('common.popupclose'))
	}

	return (
		<div className={`${styles.container} minhight ft-login-page`}>
			<LoginHeader headingtext={t('login.heading')} />
			<ToastContainer />
			<LoginHeaderMobile headingtext={t('login.heading')} />

			<div className="main-content-outer">
				<div className={`${styles.heading} col4-cmn-cntr-640 register-outer`}>
					<div className="mobile-hero">
						{/* <div className="mobile-hero-logo">
							<Link href='/'>
								<a href="#" className="">
									<Image src={mobieLightLogo} alt="Mobile Hero Logo" />
								</a>
							</Link>
						</div> */}
						<div className="mobile-hero-heading">{t('login.heading')}</div>
						<div className="mobile-hero-overlay"></div>
					</div>
				</div>
				<Card className={`${styles.registerCard} col4-cmn-cntr-640 ft-register-card mb-100 custom-login-btn`}>
					<Form form={form} name="login" layout="vertical" autoComplete="off" onFinish={onFinish} className="custom-lonin">
						<label className="login-form-label mb-20 custom-lonin-title pm-line-height-m2" htmlFor="email">{t('login.emailLabel')}</label>
						<Form.Item
							name="email"
							className="login-email"
							rules={[{ required: true, type: 'email', message: t('login.emailErrorMessage') }]}
						>
							<Input className="form-input pm-custom-login-text" placeholder={t('login.emailPlaceholder')} />
						</Form.Item>
						<Form.Item shouldUpdate>
							{() => (
								<Button
									type="primary"
									loading={loadingclick}
									htmlType="submit"
									disabled={
										!form.isFieldsTouched(true) ||
										!!form.getFieldsError().filter(({ errors }) => errors.length).length
									}
									className={!form.isFieldsTouched(true) ||
										!!form.getFieldsError().filter(({ errors }) => errors.length).length ?
										`${loginstyles.savebutton} ${loginstyles.disabledbutton} primary-button Login-btn reg-Login-btn  pm-disabled-btn-opa ` :
										`${loginstyles.savebutton} primary-button ph-custom-diseble  `}
								>
									{t('login.saveButton')}
								</Button>
							)}
						</Form.Item>
					</Form>
					{/* <Form form={form} name="login" layout="vertical" autoComplete="off" onFinish={onFinish}>
						<label className="login-form-label mb-20" htmlFor="email">{t('login.emailLabel')}</label>
						<Form.Item
							name="email"
							className="login-email"
							rules={[
								{
									type: 'email',
									message: t('index.formItem1.checkEmail'),
								}
							]}
						>
							<Input className="form-input" placeholder={t('login.emailPlaceholder')} />
						</Form.Item>
						<Form.Item shouldUpdate>
							{() => (
								<Button loading={loadingclick}
									type="primary"
									htmlType="submit"
									disabled={
										!form.isFieldsTouched(true) ||
										!!form.getFieldsError().filter(({ errors }) => errors.length).length
									}
									className={!form.isFieldsTouched(true) ||
										!!form.getFieldsError().filter(({ errors }) => errors.length).length ?
										`${loginstyles.savebutton} ${loginstyles.disabledbutton} primary-button` :
										`${loginstyles.savebutton} primary-button`}
								>
									{t('login.saveButton')}
								</Button>
							)}
						</Form.Item>
					</Form> */}
					<div style={{ marginTop: "50px" }} className="social-outer Social-outer-box">
						<GoogleLogin
							clientId={googleclientId}
							render={renderProps => (
								<Button className={`${loginstyles.button} Social-media-btn`} onClick={renderProps.onClick} disabled={renderProps.disabled}>
									<div className="soc-login-inner">
										<div className="soc-wrap">
											<span className={`${loginstyles.buttonIcon} `}>
												<Image src={Google} alt="Google Icon" className="Custom-img" /></span>
											<span className="ft-socail-title social-text">{t('login.googleText')}</span>
										</div>
									</div>
								</Button>
							)}
							onSuccess={responseGoogle}
							onFailure={failResponseGoogle}
							cookiePolicy={'single_host_origin'}
						/>
						{/* <FacebookLogin
							appId={facebookappId}
							callback={responseFacebook}
							onFailure={failResponseFacebook}
							fields="email,name,picture"
							render={renderProps => (
								<Button className={`${loginstyles.button} Social-media-btn`} onClick={renderProps.onClick}>
									<div className="soc-login-inner">
										<div className="soc-wrap">
											<span className={loginstyles.buttonIcon}><Image src={Facebook} alt="Facebook Icon" className="Custom-img pm-facebook-icon" /></span>
											<span className="ft-socail-title social-text">{t('login.facebookText')}</span>
										</div>
									</div>
								</Button>
							)}
						/> */}

						{/* <Button className={`${loginstyles.button} Social-media-btn`}>
							<div className="soc-login-inner">
								<div className="soc-wrap">
									<span className={loginstyles.buttonIcon}><Image src={Naver} alt="Naver Icon" className="Custom-img" /></span>
									<span className="ft-socail-title social-text">{t('login.navertext')}</span>
								</div>
							</div>
						</Button> */}
						{/* <Button className={`${loginstyles.button} Social-media-btn`}>
							<div className="soc-login-inner">
								<div className="soc-wrap">
									<span className={loginstyles.buttonIcon}><Image src={Kakaotalk} alt="Kakaotalk Icon" className="Custom-img pm-kakaotalk-icon" /></span>
									<span className="ft-socail-title social-text">{t('login.talkText')}</span>
								</div>
							</div>
						</Button>
						<Button className={`${loginstyles.button} Social-media-btn `}>
							<div className="soc-login-inner">
								<div className="soc-wrap ">
									<span className={`${loginstyles.buttonIcon} ph-custom-img`}><Image src={Apple} alt="Apple Icon" className="Custom-img ph-custom-apple-img " /></span>
									<span className="ft-socail-title social-text">{t('login.appleText')}</span>
								</div>
							</div>
						</Button> */}
					</div>
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

export default Login