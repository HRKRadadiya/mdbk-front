import * as types from '../types'
import Router, { useRouter } from 'next/router'
import { ClientStep } from './../interfaces/actiontype'
import { Dispatch } from 'redux'
import { ApiMemberDelete, ApiMemberPost } from '../../service/api'
import { API_ROUTES } from '../../constants'


export const updateClientProfile = (data: any) => (dispatch: Dispatch<ClientStep>) => {
    dispatch({
        type: types.UPDATE_CLIENT_PROFILE,
        payload: data
    })
}


export const updateClientProfileEditStep = (tab: any) => (dispatch: Dispatch<ClientStep>) => {
    dispatch({
        type: types.UPDATE_CLIENT_PROFILE_EDIT_TAB,
        payload: tab
    })
}

export const changeClientStates = (client: any) => (dispatch: Dispatch<ClientStep>) => {
    dispatch({
        type: types.CHANGE_CLIENT_STATES,
        payload: client
    })
    // dispatch({
    //     type: types.CLIENT_CHANGE_PROGRESS,
    //     payload: client.profilePercentage
    // })
}

export const deleteClientPortfolioById = (id: number, type: number) => async (dispatch: Dispatch<ClientStep>) => {
    await ApiMemberDelete(API_ROUTES.PROFILE_RELATED_IMAGE + `/${id}?registration_type=${type}`).then(async (response: any) => {
        if (response.data && response.success) {
            dispatch({
                type: types.DELETE_CLIENT_PORTFOLIO_BY_ID,
                payload: id
            })
        } else {
            console.log("No Data found")
        }
    }).catch((error: any) => {
        console.log("Error", error)
    })
}