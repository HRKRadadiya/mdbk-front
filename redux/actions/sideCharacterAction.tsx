import * as types from '../types'
import Router, { useRouter } from 'next/router'
import { ClientStep, SideA, SideCharStep } from './../interfaces/actiontype'
import { Dispatch } from 'redux'
import { ApiMemberDelete, ApiMemberPost } from '../../service/api'
import { API_ROUTES } from '../../constants'


export const updateSideCharecterProfile = (data: any) => (dispatch: Dispatch<ClientStep>) => {
	dispatch({
		type: types.UPDATE_SIDE_CHARACTER_PROFILE,
		payload: data
	})
}

// used while updating step 1 to 3
export const changeSideCharacterStates = (sideCharacter: any) => (dispatch: Dispatch<SideCharStep>) => {
	dispatch({
		type: types.CHANGE_SIDE_CHARACTER_STATES,
		payload: sideCharacter
	})
	// dispatch({
	// 	type: types.SIDECHARECTER_CHANGE_PROGRESS,
	// 	payload: sideCharacter.profilePercentage
	// })
}

// update edit tab number
export const updateSideCharacterProfileEditStep = (tab: number) => (dispatch: Dispatch<SideCharStep>) => {
	dispatch({
		type: types.UPDATE_SIDE_CHARACTER_PROFILE_EDIT_TAB,
		payload: tab
	})
}

export const phoneVerify = (type: boolean) => (dispatch: Dispatch<SideA>) => {
	dispatch({
		type: types.ISPHONEVERIFY,
		payload: type
	})
}


export const phoneVerifyClient = (type: boolean) => (dispatch: Dispatch<SideA>) => {
	dispatch({
		type: types.ISPHONEVERIFYCLIENT,
		payload: type
	})
}

// delete experience
export const deleteSideCharacterExperienceById = (id: number) => async (dispatch: Dispatch<SideCharStep>) => {
	await ApiMemberDelete(API_ROUTES.SIDE_CHARACTER_DELETE_EXPERIENCE.replace("%id%", id + "")).then(async (response: any) => {
		if (response.data && response.success) {
			dispatch({
				type: types.DELETE_SIDE_CHARACTER_EXPERIENCE_BY_ID,
				payload: id
			})
		} else {
			console.log("No Data found")
		}
	}).catch((error: any) => {
		console.log("Error", error)
	})
}

// delete portfolio
export const deleteSideCharacterPortfolioById = (id: number) => async (dispatch: Dispatch<SideCharStep>) => {
	await ApiMemberDelete(API_ROUTES.PROFILE_RELATED_IMAGE + `/${id}?registration_type=2`).then(async (response: any) => {
		if (response.data && response.success) {
			dispatch({
				type: types.DELETE_SIDE_CHARACTER_PORTFOLIO_BY_ID,
				payload: id
			})
		} else {
			console.log("No Data found")
		}
	}).catch((error: any) => {
		console.log("Error", error)
	})
}