import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import { STORAGE_KEY } from "../constants";

class Storage {
    static set(key: string, data: any) {
        localStorage.setItem(key, data);
    }

    static setJson(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static get(key: string) {
        return localStorage.getItem(key);
    }

    static getJson(key: string) {
        const data: any = localStorage.getItem(key);
        return JSON.parse(data);
    }

    static delete(key: string) {
        localStorage.removeItem(key);
    }

    // Others
    static getToken() {
        return localStorage.getItem(STORAGE_KEY.TOKEN);
    }


    static isUserAuthenticated() {
        return (localStorage.getItem(STORAGE_KEY.TOKEN) !== null);
    }

    static deauthenticateUser() {
        localStorage.removeItem(STORAGE_KEY.TOKEN);
    }

}

export default Storage;

const createNoopStorage = () => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any) {
            return Promise.resolve();
        },
    };
}

export const myStorage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();