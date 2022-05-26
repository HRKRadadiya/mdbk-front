export interface AuthReducerStateType {
    userData: {
        token: string,
        registration_type: number,
        member: {
            email: string,
            id: number,
            name: string,
            profile_picture: string,
            notify: number
        }
    };
    passwordErr: object;
    validateMember: object;
    permissions: [];
    clientProgress: number,
    sideCharProgress: number
}

export interface ProjectStateType {
    create: {
        project_images: [],
        member_id: number,
        profession: [],
        field: string,
        current_planning_stage: [],
        suggested_amount: string,
        schedule: [],
        schedule_direct_start_date: any,
        schedule_direct_end_date: any,
        city: number,
        district: number,
        work_related_details: string,
        direct_input: string
    },
    createPrecentage: number
}

export interface clientDataStateType {
    profile: {}
}

export interface sideCharecterStateType {
    profile: {}
}


export interface ValidationReducerStateType {
    emailError: string;
    emailAlreadyExist: string;
    validationCode: string;
    splash: boolean
}

export interface ClientReducerStateType {
    provinces: [];
    districts: [];
    codeSendMsg: string;
    phoneErrCodeMsg: string;
    client: [];
    clientByProfession: [];
}

export interface ClientProfileReducerStateType {
    tab: number;
    step: {
        company: any
        created_at: any
        desired_date: any
        desired_project_type: any
        desired_time: any
        desired_work_type: any
        facebook_link: any
        fields: any
        homepage_link: any
        id: any
        instagram_link: any
        insurance_status: any
        introduction: any
        introductories: any
        is_company: any
        is_phone_verified: any
        locations: any
        member_id: any
        nick_name: any
        other_link: any
        phone: any
        phone_verification_code: any
        profession: any
        profile_picture: any
        updated_at: any
    };
    profilePercentage: number;
}

export interface SideCharReducerStateType {
    tab: number;
    step: {
        id: any,
        member_id: any,
        nick_name: any,
        introduction: any,
        phone: any,
        phone_verification_code: any,
        is_phone_verified: any,
        profession: any,
        homepage_link: any,
        facebook_link: any,
        instagram_link: any,
        other_link: any,
        is_experienced: any,
        desired_date: any,
        desired_time: any,
        desired_project_type: any,
        insurance_status: any,
        desired_work_type: any,
        created_at: any,
        updated_at: any,
        fields: any,
        locations: any,
        experiences: any,
        portfolios: any,
        profile_picture: any,
    };
    profilePercentage: number;
}

export interface MemberSearchReducerStateType {
    clientSearchSideChar: any;
    sideCharSearchClient: any;
}

const validationReducerState: ValidationReducerStateType = {
    emailError: '',
    emailAlreadyExist: '',
    validationCode: '',
    splash: false,
};

const authReducerState: AuthReducerStateType = {
    userData: {
        token: "",
        registration_type: 0,
        member: {
            email: "",
            id: 0,
            name: "",
            profile_picture: "",
            notify: 0
        }
    },
    passwordErr: {},
    validateMember: {},
    permissions: [],
    clientProgress: 0,
    sideCharProgress: 0
};

const projectReducerState: ProjectStateType = {
    create: {
        project_images: [],
        member_id: 0,
        profession: [],
        field: "",
        current_planning_stage: [],
        suggested_amount: "",
        schedule: [],
        schedule_direct_start_date: "",
        schedule_direct_end_date: "",
        city: 0,
        district: 0,
        work_related_details: "",
        direct_input: ""
    },
    createPrecentage: 0
};

const clientDataReducerState: clientDataStateType = {
    profile: {}
};

const sideCharecterDataReducerState: sideCharecterStateType = {
    profile: {}
};

const clientReducerState: ClientReducerStateType = {
    provinces: [],
    districts: [],
    codeSendMsg: '',
    phoneErrCodeMsg: '',
    client: [],
    clientByProfession: []
};

const ClientProfileReducerState: ClientProfileReducerStateType = {
    tab: 1,
    profilePercentage: 0,
    step: {
        company: "",
        created_at: "",
        desired_date: "",
        desired_project_type: "",
        desired_time: "",
        desired_work_type: "",
        facebook_link: "",
        fields: [],
        homepage_link: "",
        id: 0,
        instagram_link: "",
        insurance_status: "",
        introduction: "",
        introductories: [],
        is_company: "no",
        is_phone_verified: false,
        locations: [],
        member_id: 0,
        nick_name: "",
        other_link: "",
        phone: "",
        phone_verification_code: "",
        profession: "",
        profile_picture: "",
        updated_at: ""
    },
};

const sideCharReducerState: SideCharReducerStateType = {
    tab: 1,
    profilePercentage: 0,
    step: {
        id: 0,
        member_id: "",
        nick_name: "",
        introduction: "",
        phone: "",
        phone_verification_code: "",
        is_phone_verified: false,
        profession: "",
        homepage_link: "",
        facebook_link: "",
        instagram_link: "",
        other_link: "",
        is_experienced: "",
        desired_date: "",
        desired_time: "",
        desired_project_type: "",
        insurance_status: "",
        desired_work_type: "",
        created_at: "",
        updated_at: "",
        fields: [],
        locations: [],
        experiences: [],
        portfolios: [],
        profile_picture: "",
    },
};

const memberSearchReducerState: MemberSearchReducerStateType = {
    clientSearchSideChar: {},
    sideCharSearchClient: {}
};

export default {
    auth: authReducerState,
    validation: validationReducerState,
    client: clientReducerState,
    clientProfile: ClientProfileReducerState,
    sideChar: sideCharReducerState,
    memberSearch: memberSearchReducerState,
    projectCreate: projectReducerState,
    clientData: clientDataReducerState,
    sideCharData: sideCharecterDataReducerState
}