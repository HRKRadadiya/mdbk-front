import { SideCharStep } from '../interfaces/actiontype';
import * as types from '../types'
import rootState, { SideCharReducerStateType } from '../initialState';

export const sideCharReducer = (state: SideCharReducerStateType = rootState.sideChar, { type, payload }: SideCharStep) => {
    switch (type) {

        // update while submit step 1 to 3  
        case types.CHANGE_SIDE_CHARACTER_STATES:
            return {
                tab: state.tab,
                profilePercentage: payload.profilePercentage,
                step: {
                    ...state.step,
                    ...payload.step
                },
            };


        case types.UPDATE_SIDE_CHARACTER_PROFILE_EDIT_TAB:
            return {
                ...state,
                tab: payload
            };

        case types.ISPHONEVERIFY:
            return {
                ...state,
                step: { ...state.step, is_phone_verified: payload }
            };

        // delete experience
        case types.DELETE_SIDE_CHARACTER_EXPERIENCE_BY_ID:
            let tempStep = {
                ...state.step,
                experiences: state.step.experiences.filter((ex: any, index: number) => ex.id !== payload)
            }

            return {
                tab: state.tab,
                profilePercentage: state.profilePercentage,
                step: tempStep
            };


        // delete portfolio
        case types.DELETE_SIDE_CHARACTER_PORTFOLIO_BY_ID:
            let tempRelatedImagesStates = {
                ...state.step,
                portfolios: state.step.portfolios.filter((ex: any, index: number) => ex.id !== payload)
            }

            return {
                tab: state.tab,
                profilePercentage: state.profilePercentage,
                step: tempRelatedImagesStates
            };


        default:
            return state
    }
}