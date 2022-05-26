import { ClientStep, SideCharStep } from '../interfaces/actiontype';
import * as types from '../types'

import rootState, { sideCharecterStateType } from '../initialState';

export const SideCharecterProfileDataReducer = (state: sideCharecterStateType = rootState.sideCharData, { type, payload }: ClientStep) => {
    switch (type) {
        case types.UPDATE_SIDE_CHARACTER_PROFILE:
            return {
                ...state,
                profile: payload
            };
        default:
            return state
    }
}