export interface EmailAuth {
    email: string,
    code?: number
}

export interface PhoneCode {
    phone: string
}

export interface ColumnAttributes {
    label: string;
    field: string;
}

export interface SearchField {
    value: string;
    label: string;
}

export interface RegisterAuth {
    name?: string,
    email?: string,
    password?: string,
    confirmPassword?: string,
    name1?: string,
    email1?: string,
    confirmPassword1?: string,
    password1?: string,
    confirm_password?: string,
    registration_type?: number
}