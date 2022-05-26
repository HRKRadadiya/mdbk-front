import { clientAction } from '../interfaces/actiontype';
import * as types from '../types'
import rootState, { ClientReducerStateType } from '../initialState';

export const clientReducer = (state: ClientReducerStateType = rootState.client, { type, payload }: clientAction) => {
	switch (type) {
		case types.VERIFICATION_CODE_MSG:
			return {
				...state,
				codeSendMsg: payload
			};
		case types.PHONE_CODE_ERROR_MSG:
			return {
				...state,
				phoneErrCodeMsg: payload
			};
		case types.GET_PROVINCES:
			return {
				...state,
				provinces: payload
			};
		case types.GET_DISTRICTS:
			return {
				...state,
				districts: payload
			};
		case types.GET_CLIENT:
			return {
				...state,
				client: payload
			};
		case types.GET_CLIENT_BY_PROFESSION:
			return {
				...state,
				clientByProfession: payload
			};
		default:
			return state
	}
}