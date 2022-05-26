import axios from 'axios'
import * as types from '../types'
import Router, { useRouter } from 'next/router'
import { ClentA } from '../interfaces/actiontype'
import { Dispatch } from 'redux'
import router from 'next/router'
import { ApiMemberGet, ApiMemberPost, ApiPostNoAuth } from '../../service/api'
import { CONFORM_PHONE_VERIFICATION_CODE, DISTRICT, PROVINCE, RESET_PASSWORD_LINK, SEND_PHONE_VERIFICATION_CODE, SEND_VERIFICATION_CODE } from '../../constants/api'
import { EmailAuth, PhoneCode } from '../../types'

export const splashScreen = (value: any) => (dispatch: Dispatch<ClentA>) => {
	dispatch({
		type: types.SPLASH_USE,
		payload: value
	})
}
// reset_password_email

export const resetLinkSend = (member: any) => (dispatch: Dispatch<ClentA>) => {
	ApiPostNoAuth(RESET_PASSWORD_LINK, member)
		.then((response: any) => {
			if (response.data && response.success) {
				// dispatch({
				// 	type: types.VERIFICATION_CODE,
				// 	payload: response
				// })
				// dispatch({
				// 	type: types.VERIFICATION_CODE_MSG,
				// 	payload: 'A verification code has been sent'
				// })
				// { Router.push(`${router.locale && router.locale == 'en' ? '/en/emailConfirmation?islogin=2' : '/emailConfirmation?islogin=2'}`) }
				console.log("response", response)
				console.log("value", member)
				//  { Router.push(`${Router.router.locale && Router.router.locale == 'en' ? '/en/emailConfirmation?islogin=2' : '/emailConfirmation?islogin=2'}`) }
				// callback(true)
			} else {
				console.log("No Data found")
			}
			//  callback(true)
		})
		.catch(error => {
			console.log("Error", error)
			//  callback(true)
		})
}

export const registerClient = (client: any, introductryImg: any) => (dispatch: Dispatch<ClentA>) => {
	const router = useRouter();
	const formData = new FormData()
	formData.append("introductryImg", introductryImg[0])

	axios
		.post("http://localhost:4000/v1/clientProfile/create", client)
		.then(response => {
			if (response.data && response.data.status == 'success') {
				{ Router.push(`${router.locale && router.locale == 'en' ? '/en/popup/updateProfilePop' : '/popup/updateProfilePop'}`) }
			} else {
				console.log("No Data found")
			}
		})
		.catch(error => {
			dispatch({
				type: types.EMAIL_ALREADY_EXIST,
				payload: 'Email already exists'
			})
		})
}

export const getProvinces = () => (dispatch: Dispatch<ClentA>) => {
	ApiMemberGet(PROVINCE)
		.then((response: any) => {
			if (response.data && response.success) {
				dispatch({
					type: types.GET_PROVINCES,
					payload: response.data
				})
			} else {
				console.log("No Data found")
			}
		})
		.catch(error => {
			console.log("Error", error)
		})
}

export const getDistricts = () => (dispatch: Dispatch<ClentA>) => {
	ApiMemberGet(DISTRICT)
		.then((response: any) => {
			if (response.data && response.success) {
				dispatch({
					type: types.GET_DISTRICTS,
					payload: response.data
				})
			} else {
				console.log("No Data found")
			}
		})
		.catch(error => {
			console.log("Error", error)
		})
}

export const getClientByMemberId = () => (dispatch: Dispatch<ClentA>) => {
	axios
		.get("http://localhost:4000/v1/clientProfile/byMemberId")
		.then(response => {
			if (response.status == 200) {
				dispatch({
					type: types.GET_CLIENT,
					payload: response.data.data
				})
			}
		}
		)
		.catch((error) => {
			console.log(error)
		})
}

export const getClientByProfession = (profession: any) => (dispatch: Dispatch<ClentA>) => {
	axios
		.get(`http://localhost:4000/v1/clientProfile/${profession}`)
		.then(response => {
			if (response.data && response.data.status == 'success') {
				dispatch({
					type: types.GET_CLIENT_BY_PROFESSION,
					payload: response.data.data
				})
			} else {
				//  dispatch(errorHandlerActions.handleHTTPError(response))
			}

		})
		.catch(error => {
			//  dispatch(errorHandlerActions.handleHTTPError(error))
			console.log(error)
		})
}

export const generateVerificationCode = (email: EmailAuth) => (dispatch: Dispatch<ClentA>) => {
	ApiPostNoAuth(SEND_VERIFICATION_CODE, email)
		.then((response: any) => {
			if (response.data && response.success) {
				dispatch({
					type: types.VERIFICATION_CODE,
					payload: response
				})
				dispatch({
					type: types.VERIFICATION_CODE_MSG,
					payload: 'A verification code has been sent'
				})
				{ Router.push(`${router.locale && router.locale == 'en' ? '/en/emailConfirmation' : '/emailConfirmation'}`) }
				// console.log("response", response.config.data.email)
				//  { Router.push(`${Router.router.locale && Router.router.locale == 'en' ? '/en/emailConfirmation?islogin=2' : '/emailConfirmation?islogin=2'}`) }
				// callback(true)
			} else {
				console.log("No Data found")
			}
			//  callback(true)
		})
		.catch(error => {
			console.log("Error", error)
			//  callback(true)
		})
}

export const generatePhoneVerifyCode = (fromData: any) => (dispatch: Dispatch<ClentA>) => {
	ApiMemberPost(SEND_PHONE_VERIFICATION_CODE, fromData)
		.then((response: any) => {
			if (response.data && response.success) {
				// dispatch({
				// 	type: types.VERIFICATION_CODE,
				// 	payload: response.data
				// })
				dispatch({
					type: types.VERIFICATION_CODE_MSG,
					payload: 'A verification code has been sent'
				})
				// { Router.push(`${router.locale && router.locale == 'en' ? '/en/emailConfirmation?islogin=2' : '/emailConfirmation?islogin=2'}`) }
				// console.log("response", response.config.data.email)
				//  { Router.push(`${Router.router.locale && Router.router.locale == 'en' ? '/en/emailConfirmation?islogin=2' : '/emailConfirmation?islogin=2'}`) }
				// callback(true)
			} else {
				console.log("No Data found")
			}
			//  callback(true)
		})
		.catch(error => {
			console.log("Error", error)
			//  callback(true)
		})
}

export const verifyPhone = (phoneNumber: any) => (dispatch: Dispatch<ClentA>) => {
	ApiMemberPost(CONFORM_PHONE_VERIFICATION_CODE, phoneNumber)
		.then((response: any) => {
			if (response.data && response.success) {
				// dispatch({
				// 	type: types.VERIFICATION_CODE,
				// 	payload: response.data
				// })
				// dispatch({
				// 	type: types.VERIFICATION_CODE_MSG,
				// 	payload: 'A verification code has been sent'
				// })
				// { Router.push(`${router.locale && router.locale == 'en' ? '/en/emailConfirmation?islogin=2' : '/emailConfirmation?islogin=2'}`) }
				console.log("response", response)
				//  { Router.push(`${Router.router.locale && Router.router.locale == 'en' ? '/en/emailConfirmation?islogin=2' : '/emailConfirmation?islogin=2'}`) }
				// callback(true)
			} else {
				console.log("No Data found")
			}
			//  callback(true)
		})
		.catch(error => {
			console.log("Error", error)
			//  callback(true)
		})
}