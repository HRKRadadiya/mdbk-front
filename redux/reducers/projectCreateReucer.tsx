import { ProjectData } from '../interfaces/actiontype';
import * as types from '../types'
import rootState, { ProjectStateType } from '../initialState';

export const ProjectCreateReucer = (state: ProjectStateType = rootState.projectCreate, { type, payload = null }: ProjectData) => {
    switch (type) {
        case types.PROJECTDATA:
            return {
                ...state,
                create: { ...state.create, ...payload }
            };

        case types.PROJECT_PERCENTEGE:
            if (payload == 0) {
                return {
                    ...state,
                    createPrecentage: 0
                };
            } else {
                return {
                    ...state,
                    createPrecentage: state.createPrecentage < payload ? payload : state.createPrecentage
                };
            }
        default:
            return state
    }
}