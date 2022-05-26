import axios from 'axios'
import url from 'url'
import Storage from './storage';
import { API_ROUTES } from '../constants'
import router from 'next/router';

const { BASE_URL, API_VERSION } = API_ROUTES;
const API_BASE_URL = url.format(BASE_URL + API_VERSION);

interface apiResponse {
    data: {
        data: any,
        error: any,
        status: number,
        success: boolean
    },
    status: number
}

export const ApiMemberGet = (url: string, params: any = {}, options: any = {}) => {
    params = params == null || params == undefined ? {} : params;
    return new Promise((resolve, reject) => {
        axios.get(`${API_BASE_URL}/${url}`, { params, ...getHttpMemberOptions(options, true) })
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    Storage.deauthenticateUser();
                    router.push("/")
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.error
                    });
                }
            });
    });
}


export const ApiMemberPost = (url: string, fromData: any = {}, options: any = {}) => {
    fromData = fromData == null || fromData == undefined ? {} : fromData;
    return new Promise((resolve, reject) => {
        axios.post(`${API_BASE_URL}/${url}`, fromData, getHttpMemberOptions(options, true))
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    Storage.deauthenticateUser();
                    router.push("/")
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.error
                    });
                }
            });
    });
}


export const ApiMemberPut = (url: string, fromData: any = {}, options: any = {}) => {
    fromData = fromData == null || fromData == undefined ? {} : fromData;
    return new Promise((resolve, reject) => {
        axios.put(`${API_BASE_URL}/${url}`, fromData, getHttpMemberOptions(options, true))
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    Storage.deauthenticateUser();
                    router.push("/")
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error.response.data.error
                    });
                }
            });
    });
}

export const ApiMemberDelete = (url: string, data: any = {}, options: any = {}) => {
    data = data == null || data == undefined ? {} : data;
    return new Promise((resolve, reject) => {
        axios.delete(`${API_BASE_URL}/${url}`, { data, ...getHttpMemberOptions(options, true) })
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    Storage.deauthenticateUser();
                    router.push("/")
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.error
                    });
                }
            });
    });
}


export const ApiPostNoAuth = (url: string, fromData: any, options: any = {}) => {
    fromData = fromData == null || fromData == undefined ? {} : fromData;
    return new Promise((resolve, reject) => {
        axios.post(`${API_BASE_URL}/${url}`, fromData, getHttpMemberOptions(options))
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    Storage.deauthenticateUser();
                    router.push("/")
                    // todo : redirect to login page
                } else {
                    reject({
                        code: error?.response?.status,
                        error: error?.response?.data?.error
                    });
                }
            });
    });
}

const getHttpMemberOptions = (options: any, isAuth: boolean = false) => {
    let headers = {
        Authorization: "",
        'Content-Type': "application/json",
    };
    if (isAuth) {
        headers['Authorization'] = Storage.getToken() ?? "";
    }
    if (options.hasOwnProperty('Content-Type')) {
        headers['Content-Type'] = options['Content-Type'] ?? "";
    }
    return { headers }
}