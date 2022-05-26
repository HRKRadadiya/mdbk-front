import { ClientStep, SideCharStep } from '../interfaces/actiontype';
import * as types from '../types'

import rootState, { clientDataStateType } from '../initialState';

export const ClientProfileDataReducer = (state: clientDataStateType = rootState.clientData, { type, payload }: ClientStep) => {
    switch (type) {
        case types.UPDATE_CLIENT_PROFILE:
            return {
                ...state,
                profile: payload
            };
        default:
            return state
    }
}