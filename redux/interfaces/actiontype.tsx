export interface Login {
    type: "LOGIN_USER",
    payload: any
}

export interface Mreg {
    type: "MEMBER_REGISTER",
    payload: any
}

export interface Forgotpass {
    type: "FORGOT_PASSWORD",
    payload: any
}

export interface VerifyCode {
    type: "VERIFICATION_CODE_MSG",
    payload: any
}

export interface PhoneCodeError {
    type: "PHONE_CODE_ERROR_MSG",
    payload: any
}

export interface GetProvinces {
    type: "GET_PROVINCES",
    payload: any
}

export interface GetDistricts {
    type: "GET_DISTRICTS",
    payload: any
}

export interface GetClient {
    type: "GET_CLIENT",
    payload: any
}

export interface GetClientByProffesion {
    type: 'GET_CLIENT_BY_PROFESSION',
    payload: any
}

export interface EmailError {
    type: "EMAIL_ERROR",
    payload: any
}

export interface EmailExist {
    type: "EMAIL_ALREADY_EXIST",
    payload: any
}

export interface VerifyCode1 {
    type: "VERIFICATION_CODE",
    payload: any
}

export interface UserData {
    type: "USER_DATA",
    payload: any
}

export interface Splash {
    type: "SPLASH_USE",
    payload: any
}
export interface adminuser {
    type: "ADMIN_USER_DATA",
    payload: any
}

export interface adminLogout {
    type: "ADMIN_LOG_OUT",
    payload?: any
}


// for side character
export interface UpdateSideCharacterProfileEditTabType {
    type: "UPDATE_SIDE_CHARACTER_PROFILE_EDIT_TAB",
    payload: any
}

export interface ChangeSideCharacterStatesActionType {
    type: "CHANGE_SIDE_CHARACTER_STATES",
    payload: any
}

export interface DeleteSideCharacterExperienceByIdType {
    type: "DELETE_SIDE_CHARACTER_EXPERIENCE_BY_ID",
    payload: any
}
export interface DeleteSideCharacterPortfolioByIdType {
    type: "DELETE_SIDE_CHARACTER_PORTFOLIO_BY_ID",
    payload: any

}
export interface UpdateClientProfileEditTabType {
    type: "UPDATE_CLIENT_PROFILE_EDIT_TAB",
    payload: any
}
export interface ChangeClientStatesActionType {
    type: "CHANGE_CLIENT_STATES",
    payload: any
}
export interface DeleteClientPortfolioByIdType {
    type: "DELETE_CLIENT_PORTFOLIO_BY_ID",
    payload: any
}


export interface Register_Type_Change {
    type: "REGISTER_TYPE",
    payload: number
}
export interface MemberLogOut {
    type: "MEMBER_LOG_OUT",
    payload?: any
}

export interface NikeName {
    type: "NIKE_NAME",
    payload: string
}

export interface Client_Change_Progress {
    type: "CLIENT_CHANGE_PROGRESS",
    payload: number
}

export interface Sidecharecter_Change_Progress {
    type: "SIDECHARECTER_CHANGE_PROGRESS",
    payload: number
}

export interface Client_Search {
    type: "CLIENT_CLIENT_SEARCH_PROFILE",
    payload: any
}
export interface Client_Search_sideChar {
    type: "CLIENT_SIDECHARECTER_SEARCH_PROFILE",
    payload: any
}

export interface SideCharecter_Search {
    type: "SIDECHARECTER_SIDECHARECTER_SEARCH_PROFILE",
    payload: any
}

export interface SideCharecter_Client_Search {
    type: "SIDECHARECTER_CLIENT_SEARCH_PROFILE",
    payload: any
}

export interface Project_Data {
    type: "PROJECTDATA",
    payload: any
}

export interface Project_Data_Precentage {
    type: "PROJECT_PERCENTEGE",
    payload: any
}

export interface Profile_Percentage_Client {
    type: "PROFILE_PROGRESS_CLIENT",
    payload: any
}
export interface Profile_Percentage_SideChar {
    type: "PROFILE_PROGRESS_SIDECHAR",
    payload: any
}
export interface Profile_Image {
    type: "PROFILE_PICTURE",
    payload: any
}
export interface isPhoneVerify {
    type: "ISPHONEVERIFY",
    payload: any
}
export interface isPhoneVerifyClient {
    type: "ISPHONEVERIFYCLIENT",
    payload: any
}

export interface notify_Change {
    type: "NOTIFY_CHANGE",
    payload: any
}

export interface profile_Change {
    type: "UPDATE_CLIENT_PROFILE",
    payload: any
}
export interface profile_Change_sc {
    type: "UPDATE_SIDE_CHARACTER_PROFILE",
    payload: any
}



export type AdminAction = adminuser | adminLogout
export type AdminA = adminuser
export type AuthAction = Login | Mreg | notify_Change | Profile_Image | Forgotpass | UserData | Register_Type_Change | MemberLogOut | NikeName | Client_Change_Progress | Sidecharecter_Change_Progress | Profile_Percentage_Client | Profile_Percentage_SideChar
export type clientAction = VerifyCode | PhoneCodeError | GetProvinces | GetDistricts | GetClient | GetClientByProffesion
export type ValidatedAction = EmailError | EmailExist | VerifyCode1 | Splash
export type ClentA = GetProvinces | EmailExist | GetDistricts | GetClient | GetClientByProffesion | VerifyCode | VerifyCode1 | PhoneCodeError | Splash
export type MemberA = Login | EmailExist | Profile_Image | EmailError | notify_Change | VerifyCode1 | Mreg | UserData | Register_Type_Change | MemberLogOut | NikeName
export type SideA = EmailExist | isPhoneVerify | isPhoneVerifyClient
export type ProjectData = Project_Data | Project_Data_Precentage

export type SideCharStep = isPhoneVerify | UpdateSideCharacterProfileEditTabType | ChangeSideCharacterStatesActionType | DeleteSideCharacterExperienceByIdType | DeleteSideCharacterPortfolioByIdType | Sidecharecter_Change_Progress
export type ClientStep = isPhoneVerifyClient | UpdateClientProfileEditTabType | ChangeClientStatesActionType | DeleteClientPortfolioByIdType | Client_Change_Progress | profile_Change | profile_Change_sc

export type memberSearch = SideCharecter_Client_Search | SideCharecter_Search | Client_Search | Client_Search_sideChar | Profile_Percentage_Client | Profile_Percentage_SideChar | profile_Change | profile_Change_sc