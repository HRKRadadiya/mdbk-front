// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import freshState from '../initialState'
import { authReducer } from './authReducer';
import { validationReducer } from './validationReducer';
import { clientReducer } from './clientReducer';
import { sideCharReducer } from './sideCharReducer';
import { ClientProfileReducer } from './clientProfileReducer';
import { MemberSearchReducer } from './memberSearchReducer';
import Storage from '../../service/storage';
import { STORAGE_KEY } from '../../constants';
import { ProjectCreateReucer } from './projectCreateReucer';
import { ClientProfileDataReducer } from './clientProfileDataReducer';
import { SideCharecterProfileDataReducer } from './sideCharecterProfileDataReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    validation: validationReducer,
    client: clientReducer,
    clientProfile: ClientProfileReducer,
    sideChar: sideCharReducer,
    memberSearch: MemberSearchReducer,
    projectCreate: ProjectCreateReucer,
    clientData: ClientProfileDataReducer,
    sideCharData: SideCharecterProfileDataReducer
})

const appReducer = (state: any, action: any) => {
    if (action?.type === "MEMBER_LOG_OUT") {
        Storage.delete(STORAGE_KEY.TOKEN)
        return rootReducer(freshState, action);
    }
    return rootReducer(state, action);
}

export default appReducer

export type State = ReturnType<typeof appReducer>
