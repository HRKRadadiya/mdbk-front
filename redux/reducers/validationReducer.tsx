import { ValidatedAction } from '../interfaces/actiontype';
import * as types from '../types'
import rootState, { ValidationReducerStateType } from '../initialState';

export const validationReducer = (state: ValidationReducerStateType = rootState.validation, { type, payload }: ValidatedAction) => {
	switch (type) {
		case types.EMAIL_ERROR:
			return {
				...state,
				emailError: payload
			};
		case types.EMAIL_ALREADY_EXIST:
			return {
				...state,
				emailAlreadyExist: payload
			};
		case types.SPLASH_USE:
			return {
				...state,
				splash: payload
			};
		case types.VERIFICATION_CODE:
			return {
				...state,
				validationCode: payload
			};
		default:
			return state
	}
}