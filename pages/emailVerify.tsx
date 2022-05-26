import styles from '../styles/Register.module.css'
import loginstyles from '../styles/login.module.css'
import verifystyles from '../styles/emailVerify.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { generateVerificationCode } from '../redux/actions'
import React, { useState } from 'react';
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import mobieLightLogo from '../public/mobile-hero-light-logo.png'
import Image from 'next/image'
import blueLogo from '../public/header.svg'
import { LoginFooter, LoginHeader, LoginHeaderMobile } from '../components';
import router, { useRouter } from 'next/router';
import { State } from '../redux/reducers/rootReducer';
import { EmailAuth } from '../types';
import { ApiPostNoAuth } from '../service/api';
import { SEND_VERIFICATION_CODE } from '../constants/api';


const EmailVerification: React.FC = () => {
	const { t } = useTranslation();
	const [loadingclick, setloadingclick] = useState(false)
	const dispatch = useDispatch()
	const useremail = useSelector((state: State) => state.auth.validateMember.email)
	const onFinish = async (values: EmailAuth) => {
		setloadingclick(true)
		await ApiPostNoAuth(SEND_VERIFICATION_CODE, values)
			.then((response: any) => {
				if (response.data && response.success) {
					{ router.push(`${router.locale && router.locale == 'en' ? '/en/emailConfirmation' : '/emailConfirmation'}`) }
				} else {
					console.log("No Data found")
				}
			})
			.catch(error => {
				console.log("Error", error)
			})
		setloadingclick(false)
	};

	return (
		<div className={`${styles.container} minhight ft-emailverify-page`}>

			<LoginHeader headingtext={t('changePwd.login')} />
			<LoginHeaderMobile headingtext={t('emailvarify.verifyEmail')} />

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
						<div className="mobile-hero-heading">{t('emailvarify.verifyEmail')}</div>
						<div className="mobile-hero-overlay"></div>
					</div>
				</div>
				<Card className={`${styles.registerCard} col4-cmn-cntr-640 ft-register-card mb-100`}>
					<p className={`${verifystyles.subheading} mb-50 emailConfirmation `}>{t('emailvarify.verifyEmailMsg')}</p>
					<Form name="login" layout="vertical" onFinish={onFinish}>
						<label className="login-form-label mb-4 custom-emailVerify-content pm-line-height-m2 pm-emailVerify-content" htmlFor="email">{t('emailvarify.emailAddress')}</label>
						<Form.Item
							name="email"
							initialValue={useremail}
							className="ph-custom-item"
						>
							<Input type="email" readOnly value={useremail} defaultValue={useremail} className="form-input" />
						</Form.Item>
						<Button
							loading={loadingclick}
							type="primary"
							htmlType="submit"
							className={`${loginstyles.savebutton} primary-button mt-4 ph-custom-submit-btn pm-emailVerify-submit-btn`}
						>
							{t('emailvarify.saveButton')}
						</Button>
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

export default EmailVerification