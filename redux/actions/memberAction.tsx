/* eslint-disable eqeqeq */
import axios from 'axios'
import * as types from '../types'
import Router, { useRouter } from 'next/router'
import { Dispatch } from 'redux'
import { AuthAction, MemberA, memberSearch, ProjectData } from './../interfaces/actiontype'
import { ApiPostNoAuth } from '../../service/api'
import { CHECK_EMAIL, CONFIRM_RESET_PASSWORD, SOCIAL_AUTH } from '../../constants/api'
import router from 'next/router'
import { EmailAuth } from '../../types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUrl, isEmpty } from '../../utils/helper'
import { EMAILVERIFY, PASSWORD, REGISTER } from '../../constants/routes'
import { updateClientProfile } from './clientProfileAction'

export const projectCreatePercentage = (data: number) => (dispatch: Dispatch<ProjectData>) => {
	dispatch({
		type: types.PROJECT_PERCENTEGE,
		payload: data
	})
}

export const memberLogout = () => (dispatch: Dispatch<MemberA>) => {
	dispatch({
		type: types.MEMBER_LOG_OUT,
	})
}

export const register_Type_Change = (type: number) => (dispatch: Dispatch<MemberA>) => {
	dispatch({
		type: types.REGISTER_TYPE,
		payload: type
	})
}

export const notify_change = (type: number) => (dispatch: Dispatch<MemberA>) => {
	dispatch({
		type: types.NOTIFY_CHANGE,
		payload: type
	})
}

export const nike_name_Change = (type: string) => (dispatch: Dispatch<MemberA>) => {
	dispatch({
		type: types.NIKE_NAME,
		payload: type
	})
}

export const Profile_Picture_Change = (type: string) => (dispatch: Dispatch<MemberA>) => {
	dispatch({
		type: types.PROFILE_PICTURE,
		payload: type
	})
}
export const progress_Change_Client = (progress: any, key: number = 0) => (dispatch: Dispatch<AuthAction>) => {
	dispatch({
		type: types.PROFILE_PROGRESS_CLIENT,
		payload: progress
	})
}
export const progress_Change_SideChar = (progress: any, key: number = 0) => (dispatch: Dispatch<AuthAction>) => {
	dispatch({
		type: types.PROFILE_PROGRESS_SIDECHAR,
		payload: progress
	})
}

export const searchFilterForm = (searchFilter: any) => (dispatch: Dispatch<memberSearch>) => {
	dispatch({
		type: types.CLIENT_SIDECHARECTER_SEARCH_PROFILE,
		payload: isEmpty(searchFilter.client__side_character) ? {} : searchFilter.client__side_character
	})

	dispatch({
		type: types.SIDECHARECTER_CLIENT_SEARCH_PROFILE,
		payload: isEmpty(searchFilter.side_character__client) ? {} : searchFilter.side_character__client
	})
}


export const loginUser = (data: any) => (dispatch: Dispatch<MemberA>) => {
	dispatch({
		type: types.USER_DATA,
		payload: data
	})

}

export const isSocialRegistered = (member: any) => async (dispatch: Dispatch<MemberA | memberSearch>) => {
	await ApiPostNoAuth(SOCIAL_AUTH, member)
		.then((response: any) => {
			if (response.data && response.success) {
				dispatch({
					type: types.MEMBER_REGISTER,
					payload: { email: member.email }
				})
				if (response.data.new_member == true) {
					router.push(getUrl(router.locale, REGISTER))
				} else if (response.data?.status == "verified") {
					router.push(getUrl(router.locale, REGISTER))
				}
				else if (response.data?.status == "login") {
					dispatch({
						type: types.CLIENT_SIDECHARECTER_SEARCH_PROFILE,
						payload: response.data.member.search_option.client__side_character
					})

					dispatch({
						type: types.SIDECHARECTER_CLIENT_SEARCH_PROFILE,
						payload: response.data.member.search_option.side_character__client
					})

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
					dispatch({
						type: types.UPDATE_CLIENT_PROFILE,
						payload: response.data?.profile_info?.client_profile
					})

					dispatch({
						type: types.UPDATE_SIDE_CHARACTER_PROFILE,
						payload: response.data?.profile_info?.side_character_profile
					})
					dispatch({
						type: types.USER_DATA,
						payload: data
					})
					// if (response.data?.status == "login")
					dispatch({
						type: types.PROFILE_PICTURE,
						payload: response.data?.profile?.profile_picture
					})
					dispatch({
						type: types.NIKE_NAME,
						payload: response.data?.profile?.nick_name
					})
					dispatch({
						type: types.PROFILE_PROGRESS_CLIENT,
						payload: response.data?.member?.client_profile_progress
					})
					dispatch({
						type: types.PROFILE_PROGRESS_SIDECHAR,
						payload: response.data?.member?.side_character_profile_progress
					})
					router.push(getUrl(router.locale, "/"))
				}

			} else {
				console.log("No Data found")
			}
		})
		.catch(error => {
			error.error && error.error.message && toast.error(error.error.message)
		})
}

export const isEmailRegistered = (member: EmailAuth, IsLogin: any) => async (dispatch: Dispatch<MemberA>) => {
	IsLogin(true)
	await ApiPostNoAuth(CHECK_EMAIL, member)
		.then((response: any) => {
			if (response.data && response.success) {
				dispatch({
					type: types.MEMBER_REGISTER,
					payload: member
				})
				if (response.data.is_email_registered == true) {
					if (response.data?.status == "un_verify")
						router.push(getUrl(router.locale, EMAILVERIFY))
					else if (response.data?.status == "verified")
						router.push(getUrl(router.locale, REGISTER))
					else
						router.push(getUrl(router.locale, PASSWORD))
				} else
					router.push(getUrl(router.locale, EMAILVERIFY))
			} else {
				console.log("No Data found")
			}
		})
		.catch(error => {
			console.log("Error", error)
		})
	IsLogin(false)
}

export const passwordreset = (member: any) => (dispatch: Dispatch<MemberA>) => {
	ApiPostNoAuth(CONFIRM_RESET_PASSWORD, member)
		.then((response: any) => {
			if (response.data && response.success) {
				{ Router.push(`${router.locale && router.locale == 'en' ? '/en/login' : '/login'}`) }
				// callback(true)
			} else {
				console.log("No Data found")
			}
			//  callback(true)
		})
		.catch(error => {
			dispatch({
				type: types.EMAIL_ERROR,
				payload: 'Email already exists'
			})
			console.log("Error", error)
			//  callback(true)
		})
}

export const generateVerificationCode = (email: any) => (dispatch: Dispatch<MemberA>) => {
	const router = useRouter();
	axios
		.post("http://localhost:4000/v1/member/generateVerificationCode", email)
		.then(response => {
			if (response.data && response.data.status == 'success') {
				dispatch({
					type: types.VERIFICATION_CODE,
					payload: response
				})
				{ Router.push(`${router.locale && router.locale == 'en' ? '/en/emailConfirmation' : '/emailConfirmation'}`) }
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


export const verifyEmail = () => async (dispatch: Dispatch<MemberA>) => {
	dispatch({
		type: types.EMAIL_ERROR,
		payload: 'Email already exists'
	})
}


export const registerMember = (member: any) => async (dispatch: Dispatch<MemberA>) => {
	// setloadingclick(true)
	// await ApiPostNoAuth(REGISTER, member)
	// 	.then((response: any) => {
	// 		const data = {
	// 			token: response.data.token,
	// 			registration_type: response.data.registration_type,
	// 			member: {
	// 				email: response.data.member.email,
	// 				id: response.data.member.id,
	// 				name: response.data.member.name,

	// 			}
	// 		}
	// 		if (response.data && response.success) {
	dispatch({
		type: types.USER_DATA,
		payload: member
	})
	// 		} else {
	// 			console.log("No Data found")
	// 		}
	// 	})
	// 	.catch(error => {
	// 		dispatch({
	// 			type: types.EMAIL_ALREADY_EXIST,
	// 			payload: 'Email already exists'
	// 		})
	// 	})
	// setloadingclick(false)
}

// export const validateUser = () => dispatch => {
//   const { authorization } = parseCookies()

//   const allowPages = ['/auth/forgotPwd', '/register', '/404', '/register/success']

//   if (!allowPages.includes(Router.pathname)) {
//     if (authorization) {
//       axios
//         .post("/v1/auth/validateAccess")
//         .then(response => {
//           if (response.data.result === true) {

//             dispatch({
//               type: types.VALIDATE_USER,
//               payload: response.data
//             })
//           }
//         }
//         )
//         .catch(() => {
//           toast.error('Wrong Credentails. Please try again.', {
//             position: toast.POSITION.BOTTOM_RIGHT,
//             autoClose: 3000,
//             draggable: false
//           })
//         })
//     } else {
//       Router.push('/auth/login')
//     }
//   }
// }

// export const forgotPassword = (email) => dispatch => {
//   axios
//     .post("/v1/auth/forgotPassword", { email })
//     .then(response => {
//       if (response.status == 200) {
//         dispatch({
//           type: types.LOGIN_USER,
//           payload: response.data
//         })
//         toast.success('New password sent to given mail id', {
//           position: toast.POSITION.BOTTOM_RIGHT,
//           autoClose: 3000,
//           draggable: false
//         })
//         Router.push('/auth/login')
//       }
//     }
//     )
//     .catch((error) => {
//       let errorMsg = 'Something Went Wrong. Please try again.'
//       if (error.response.data.error) {
//         errorMsg = error.response.data.error.message
//       }
//       toast.error(errorMsg, {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 3000,
//         draggable: false
//       })
//     })
// }


// export const resetPassword = (token, password, callback) => dispatch => {
//   axios
//     .post("/v1/auth/resetPassword/:token", { token, password })
//     .then(response => {
//       if (response.data && response.data.status == 'success') {
//         toast.success('Password updated successfully', {
//           position: toast.POSITION.BOTTOM_RIGHT,
//           autoClose: 3000,
//           draggable: false
//         })
//         Router.push('/auth/login')
//       } else {
//         toast.error('Something Went Wrong. Please try again.', {
//           position: toast.POSITION.BOTTOM_RIGHT,
//           autoClose: 3000,
//           draggable: false
//         })
//       }
//     })
//     .catch(error => {
//       toast.error(error.response.data.error.message, {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 3000,
//         draggable: false
//       })
//     })
// }


// export const getUser = () => dispatch => {
//   axios
//     .get("/v1/auth/getUser")
//     .then(response => {
//       if (response.status == 200) {
//         dispatch({
//           type: types.LOGIN_USER,
//           payload: response.data[0]
//         })
//       }
//     }
//     )
//     .catch((error) => {
//       console.log(error)
//     })
// }
