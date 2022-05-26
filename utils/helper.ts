import excel from 'exceljs';
import { saveAs } from 'file-saver'
import { isArray, xor } from 'lodash';
import moment from 'moment';
import grayprofile from '../public/grayprofile.png'
import { useTranslation } from 'react-i18next';
import { API_ROUTES } from '../constants';

export const getUrl = (locale: any, restUrl: string) => {
    return window.location.origin + '/' + (locale + '/' + restUrl).replace("//", '/');
}

export const getDaynamicUrl = (locale: any, restUrl: string, id: number) => {
    return window.location.origin + '/' + locale + '/' + restUrl + '/' + id;
}

export const profilePictureUrl = (image: any) => {
    if (typeof image === 'object') {
        return image?.file_path
    }
    if (isEmpty(image)) {
        return API_ROUTES.BASE_URL + API_ROUTES.DEFAULT_GRAY_USER
    } else {
        return image
    }
}

export const exportExcel = async (header: any, body: any, sheetName = "List") => {
    let workbook = new excel.Workbook();
    await workbook.addWorksheet(sheetName);
    let currentSheet = await workbook.getWorksheet(sheetName);
    currentSheet.columns = header;
    await currentSheet.addRows(body);

    const buf = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buf]), `${sheetName}_${moment().format('YYYY_MM_DD_h_m')}.xlsx`)
}

export const humanizeExperienceBetweenTwoDateToDays = (start_date: any, end_date: any) => {
    var start = moment([moment(end_date).format('YYYY'), moment(end_date).format('MM')]);
    var end = moment([moment(start_date).format('YYYY'), moment(start_date).format('MM')]);
    return start.diff(end, 'days')
}

export const humanizeDate = (date: any, t: any) => {
    var seconds = Math.floor((new Date().valueOf() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + t('memberTime.yearago');
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + t('memberTime.monthago');
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + t('memberTime.dayago');
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + t('memberTime.hoursago');
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + t('memberTime.minutesago');
    }
    return t('memberTime.secondsago');
}

export function numberWithCommas(x: any) {
    return (x == undefined || x == null) ? 0 : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export function replaceValue(x: any) {
    return x.replace("-", "_")
}

export function projectAmount(x: any, router: any) {
    return x
}

export function isValidUrl(url: any) {
    return (url.includes("http://") || url.includes("https://"))
}

export function isUrl(url: any) {
    // var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var expression = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    var regex = new RegExp(expression);
    if (url.match(regex)) {
        return true
    } else {
        return false
    }
}

export const isEmpty = (value: any) => {
    if (value == null) {
        return true;
    }
    if (typeof value == "object") {
        return Object.keys(value).length == 0;
    }
    return (
        (isArray(value) && value.length == 0)
        || ((value == undefined || value == null || value == ''))
    )
}

export const getProvincesByid = (listProvinces: any[], id: number) => {
    return listProvinces.find((provinces: any) => (
        provinces.id == id
    ))
}

export const getDistrictsByid = (listDistricts: any[], id: number) => {
    return listDistricts.filter((districts: any) =>
        districts.id == id
    )
}
export function phoneNumberMasking(phone: any, masking: string) {
    if (phone.toString().length == 11) {
        var x: any = phone.replace(/\D/g, '').match(/(\d{0,3})(\d{0,4})(\d{0,4})/);
        return !x[2] ? x[1] : '' + x[1] + masking + x[2] + (x[3] ? masking + x[3] : '');
    } else {
        return phone
    }
}
export const getImageUrl = (image: any) => {
    isEmpty(image) ? grayprofile.src : image
}

//Get querystring value
export function __qs_get(name: string) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Function used to remove querystring
export function __qs_delete(key: string) {
    var urlValue = document.location.href;
    //Get query string value
    var searchUrl: any = location.search;
    if (key != "") {
        let oldValue: any, removeVal: any
        oldValue = __qs_get(key);
        removeVal = key + "=" + oldValue;
        if (searchUrl.indexOf('?' + removeVal + '&') != "-1") {
            urlValue = urlValue.replace('?' + removeVal + '&', '?');
        }
        else if (searchUrl.indexOf('&' + removeVal + '&') != "-1") {
            urlValue = urlValue.replace('&' + removeVal + '&', '&');
        }
        else if (searchUrl.indexOf('?' + removeVal) != "-1") {
            urlValue = urlValue.replace('?' + removeVal, '');
        }
        else if (searchUrl.indexOf('&' + removeVal) != "-1") {
            urlValue = urlValue.replace('&' + removeVal, '');
        }
    }
    else {
        var searchUrl: any = location.search;
        urlValue = urlValue.replace(searchUrl, '');
    }
    history.pushState({ state: 1, rand: Math.random() }, '', urlValue);
}