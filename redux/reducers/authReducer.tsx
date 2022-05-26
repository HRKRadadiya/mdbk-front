import { STORAGE_KEY } from '../../constants';
import Storage from '../../service/storage';
import { AuthAction } from '../interfaces/actiontype';
import * as types from '../types'
import rootState, { AuthReducerStateType } from '../initialState';

export const authReducer = (state: AuthReducerStateType = rootState.auth, { type, payload = null }: AuthAction) => {
	switch (type) {
		case types.USER_DATA:
			Storage.set(STORAGE_KEY.TOKEN, "Bearer " + payload.token)
			return {
				...state,
				userData: payload
			};
		case types.REGISTER_TYPE:
			return {
				...state,
				userData: { ...state.userData, registration_type: payload }
			};
		case types.NIKE_NAME:
			return {
				...state,
				userData: { ...state.userData, member: { ...state.userData.member, nickname: payload } }
			};

		case types.NOTIFY_CHANGE:
			return {
				...state,
				userData: { ...state.userData, member: { ...state.userData.member, notify: payload } }
			};
		case types.PROFILE_PICTURE:
			return {
				...state,
				userData: { ...state.userData, member: { ...state.userData.member, profile_picture: payload } }
			};
		case types.PROFILE_PROGRESS_CLIENT:
			return {
				...state,
				clientProgress: payload
			};
		case types.PROFILE_PROGRESS_SIDECHAR:
			return {
				...state,
				sideCharProgress: payload
			};
		case types.LOGIN_USER:
			return {
				...state,
				passwordErr: payload
			};
		case types.MEMBER_REGISTER:
			return {
				...state,
				validateMember: payload
			};
		case types.FORGOT_PASSWORD: {
			return state;
		}

		case types.CLIENT_CHANGE_PROGRESS: {
			return {
				...state,
				userData: { ...state.userData, member: { ...state.userData.member, clientProgress: payload } }
			};
		}

		case types.SIDECHARECTER_CHANGE_PROGRESS: {
			return {
				...state,
				userData: { ...state.userData, member: { ...state.userData.member, sideCharProgress: payload } }
			};
		}

		// case types.MEMBER_LOG_OUT:
		// 	Storage.delete(STORAGE_KEY.TOKEN)
		// 	Storage.delete('persist:root')
		// 	Storage.delete('persist:otherKey')
		// 	return {
		// 		...state,
		// 	};
		default:
			return state
	}
}