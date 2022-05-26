import { ClientStep, memberSearch, SideCharStep } from '../interfaces/actiontype';
import * as types from '../types'
import rootState, { MemberSearchReducerStateType } from '../initialState';

export const MemberSearchReducer = (state: MemberSearchReducerStateType = rootState.memberSearch, { type, payload }: memberSearch) => {
    switch (type) {
        case types.CLIENT_SIDECHARECTER_SEARCH_PROFILE:
            return {
                ...state,
                clientSearchSideChar: payload
            };

        case types.SIDECHARECTER_CLIENT_SEARCH_PROFILE:
            return {
                ...state,
                sideCharSearchClient: payload
            };
        default:
            return state
    }
}