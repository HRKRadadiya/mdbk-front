import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Upload, Select, Checkbox, message } from 'antd';
import stylessec from '../../styles/searchdetail.module.css';
import verifystyles from '../../styles/emailVerify.module.css'
import camera from '../../public/camera.svg'
import Image from 'next/image'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { getProvinces, getDistricts, generateVerificationCode, verifyPhone } from '../../redux/actions'
import { State } from '../../redux/reducers/rootReducer';
import ClientProfilePercentage from '../../components/clientProfilePercentage';
import { generatePhoneVerifyCode } from '../../redux/actions/clientAction';
import { ApiMemberPost } from '../../service/api';
import { CONFORM_PHONE_VERIFICATION_CODE } from '../../constants/api';
import { deleteSideCharacterPortfolioById } from '../../redux/actions';
import { phoneVerify } from '../../redux/actions/sideCharacterAction'
import { PhoneVerifyPopup } from '..';
import _ from 'lodash';
import { isEmpty, isUrl } from '../../utils/helper';
import { ISPHONEVERIFY } from '../../redux/types';


interface IProps {
    stepComplete: boolean,
    onFinish: Function,
    formError: any,
    setFormError: any
}

function SideCharStep1({ onFinish, stepComplete, setFormError, formError }: IProps) {

    const { Option } = Select;
    const router = useRouter()
    const { t } = useTranslation();

    const professionOptions: any = [];
    professionOptions[t('common.Development')] = 'development';
    professionOptions[t('common.Design')] = 'design';
    professionOptions[t('common.Marketing')] = 'marketing';
    professionOptions[t('common.Other')] = 'other';
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const userData = useSelector((state: State) => state.auth.userData)
    const sideCharState = useSelector((state: State) => state.sideChar)
    const provinceData = useSelector((state: State) => state.client.provinces)
    const cityData = useSelector((state: State) => state.client.districts)
    const invalidCodeMsg = useSelector((state: State) => state.client.phoneErrCodeMsg)
    const prevCodeAndPhone = useSelector((state: State) => state.validation.validationCode)
    const profilePercentage = useSelector((state: State) => state.sideChar.profilePercentage)
    const [codeSentMsg, setCodeSentMsg] = useState(false)
    const sideCharMember = sideCharState.step;
    const [isVeify, setIsVeify] = useState(false)
    const [formLink, setFormLink] = useState({
        home: true,
        facebook: true,
        insta: true,
        other: true,
        homeLink: sideCharMember.homepage_link,
        fbLink: sideCharMember.facebook_link,
        instaLink: sideCharMember.instagram_link,
        otherLink: sideCharMember.other_link,
    })


    // others
    const [arr, setArr] = useState<any>([])
    const [value, setValue] = useState<any>("");
    const [filedValue, setFiledValue] = useState<any>(false);
    const [codeValue, setCodeValue] = useState<boolean>(true);
    const [code, setCode] = useState<string>("");
    const [isPhoneVerify, setIsPhoneVerify] = useState(false);
    const [phoneVerifyCode, setPhoneVerifyCode] = useState(false);
    const [step1Form, setStep1Form] = useState<any>({
        nike_name: sideCharMember.nick_name,
        introduction: sideCharMember.introduction,
        phone: sideCharMember.phone,
        profession: sideCharMember.profession
    })
    const [step1Disable, setStep1Disable] = useState<boolean>(true)
    const handlePhoneVerifyClose = () => {
        setPhoneVerifyCode(false)
        setIsPhoneVerify(false)
        form.setFieldsValue({
            codeValues: ''
        });
    }
    const _preparedReletedImage = () => {
        return sideCharMember.portfolios.map((ex: any) => {
            const { file_path, id, file_name } = ex;
            return {
                uid: id,
                name: file_name,
                status: 'done',
                url: file_path
            }
        });
    }

    const _preparedLocation = (locationIndex: any) => {
        if (sideCharMember && sideCharMember.locations.length > 0) {
            if (sideCharMember.locations[locationIndex] != undefined) {
                let _location = sideCharMember.locations[locationIndex];
                return {
                    id: _location.id,
                    province_id: _location.city,
                    district_id: _location.district,
                }
            }
        }
        return {
            id: 0,
            province_id: 0,
            district_id: 0,
        };
    }

    const [fileList, setFileList] = useState<any>(_preparedReletedImage())
    // Handle Locations
    const [fieldsAreRequired, setFieldsAreRequired] = useState(false)
    // const isVeify = useSelector((state: State) => state?.sideChar?.step?.is_phone_verified)
    const [myLocationOne, setMyLocationOne] = useState<any>(_preparedLocation(0));
    const [myLocationTwo, setMyLocationTwo] = useState<any>(_preparedLocation(1));

    useEffect(() => {
        if (step1Form.nike_name != "" && step1Form.introduction != "" && step1Form.phone != "" && step1Form.profession.length != 0 && arr.length > 0
            && myLocationOne.district_id != 0 && myLocationOne.province_id != 0 && isVeify) {
            setStep1Disable(false)
        } else {
            setStep1Disable(true)
        }
    }, [step1Form, step1Disable, arr, myLocationOne, isVeify])

    const handleChangeForm = (e: any, key: number) => {
        // console.log("Error", e.target.value);
        if (key == 1) {
            setFormError(null)
            setStep1Form({ ...step1Form, nike_name: e.target.value });
        } else if (key == 2) {
            setStep1Form({ ...step1Form, introduction: e.target.value });
        } else if (key == 3) {
            setStep1Form({ ...step1Form, phone: e.target.value });
        } else if (key == 4) {
            setStep1Form({ ...step1Form, profession: e });
        }
    }

    // user clicked save & update state first & then form
    useEffect(() => {
        form.setFieldsValue({
            nickName: sideCharMember.nick_name,
            introduction: sideCharMember.introduction,
            phoneNumber: sideCharMember.phone,
            profession: getProfession(sideCharMember.profession),
            homepageLink: sideCharMember.homepage_link,
            facebookLink: sideCharMember.facebook_link,
            instagramLink: sideCharMember.instagram_link,
            otherLink: sideCharMember.other_link,
            introductryImg: fileList
        })

        setArr(sideCharMember.fields);
        setMyLocationOne(_preparedLocation(0));
        setMyLocationTwo(_preparedLocation(1));
        setFileList(_preparedReletedImage());
        setIsVeify(sideCharMember.is_phone_verified)

    }, [sideCharState.step])

    function getProfession(profession: any) {
        let _professionOptions: any = _.invert(professionOptions);
        if (isEmpty(profession)) {
            return [];
        }
        return profession.map((key: string, value: number) => _professionOptions[key]);
    }

    useEffect(() => {
        dispatch(getProvinces())
        dispatch(getDistricts())
    }, []);

    const getcode = () => {
        setIsVeify(false)
        setCodeSentMsg(true)
        setCodeValue(false)
        dispatch(generatePhoneVerifyCode({
            phone: value,
            registration_type: userData.registration_type
        }));
    }

    const handleDeleteImage = async (e: any) => {
        dispatch(deleteSideCharacterPortfolioById(e.uid));
    }

    function beforeUpload(file: any) {
        // let message: any;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Image must smaller than 10MB!');
            return Upload.LIST_IGNORE;
        }
        return isJpgOrPng && isLt2M;
    }


    function handleVerify() {

        const data = { phone: value, phone_verification_code: code, registration_type: userData.registration_type }
        ApiMemberPost(CONFORM_PHONE_VERIFICATION_CODE, data)
            .then((response: any) => {
                if (response.data && response.success) {
                    if (response.data.is_verify) {
                        setIsVeify(true)
                        setIsPhoneVerify(true)
                    } else {
                        setPhoneVerifyCode(true)
                    }
                } else {
                    console.log("No Data found")
                }
                //  callback(true)
            })
            .catch(error => {
                console.log("Error", error)
                //  callback(true)
            })
        // dispatch(verifyPhone(data))
    }

    return (
        <>

            <Form form={form} name="step1" layout="vertical" className="ft-step ft-step1 at-step1-rel" onFinish={(values) => {
                if (!isVeify) {
                    setPhoneVerifyCode(true)
                    window.scrollTo(0, 800);
                    return
                }
                const links = {
                    homepageLink: formLink.homeLink,
                    facebookLink: formLink.fbLink,
                    instagramLink: formLink.instaLink,
                    otherLink: formLink.otherLink,
                }
                const newVal = { values, arr, fileList, myLocationOne, myLocationTwo, links }
                values.profession = values.profession.map((key: string, value: number) => professionOptions[key]);
                if (arr.length < 1) {
                    setFieldsAreRequired(true)
                } else if (formLink.home && formLink.other && formLink.insta && formLink.facebook) {
                    setFieldsAreRequired(false)
                    setCode("")
                    onFinish(newVal)
                }
            }}>
                <div className="mb-40">
                    <ClientProfilePercentage profilePercentage={profilePercentage} />
                </div>
                {/* Nickname */}
                <Form.Item
                    name="nickName"
                    className={`ft-control-wrap `}
                    initialValue={sideCharMember.nick_name}
                    rules={[
                        { required: true, message: t('index.formItem1.nameRequired') }
                    ]}
                    label={
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.nickNameLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    }>
                    <Input
                        type="text"
                        autoComplete="off"
                        onChange={(e) => handleChangeForm(e, 1)}
                        defaultValue={sideCharMember.nick_name}
                        placeholder={t('profilePlaceholder.Enternickname')}
                        className="ft-input-control mt-20" />
                </Form.Item>
                {(formError != null && formError.nick_name) ? <div className="ant-form-item-explain ant-form-item-explain-error at-profile-wrap-nick"><div role="alert"> {formError.nick_name}</div></div> : null}

                {/* introduction */}
                <Form.Item
                    name="introduction"
                    className="ft-control-wrap intro"
                    initialValue={sideCharMember.introduction}
                    rules={[
                        { required: true, message: t('index.formItem1.nameRequired') },
                    ]}
                    label={
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.introductionLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    }>
                    <Input.TextArea
                        rows={4}
                        defaultValue={sideCharMember.introduction}
                        onChange={(e) => handleChangeForm(e, 2)}
                        maxLength={160}
                        placeholder={t('profilePlaceholder.Enterintroduction')}
                        className="ft-textarea-control mt-20" />
                </Form.Item>

                {/* contact */}
                <div className="ft-control-wrap ft-contact-sec">
                    <span className="ft-lbl">
                        {t('profilePlaceholder.Entercontactinformation')}
                        <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                    </span>
                    <div className="row mt-20">
                        <div className="col-sm-12 col-md-8">
                            <div className="ft-contact-main">
                                <Form.Item
                                    name="phoneNumber"
                                    initialValue={sideCharMember.phone}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('index.formItem1.nameRequired')
                                        },
                                    ]}>
                                    <Input type="text" value={value} onKeyDown={(evt) => {
                                        if (evt.key === '1' || evt.key === '2' || evt.key === '3' || evt.key === '4' || evt.key === '5' || evt.key === '6' || evt.key === '7' || evt.key === '8' || evt.key === '9' || evt.key === '0' || evt.key === '' || evt.key === 'Backspace') {

                                        } else {
                                            evt.preventDefault()
                                        }
                                    }} defaultValue={sideCharMember.phone} maxLength={11} onChange={(event) => {
                                        {
                                            setCodeSentMsg(false)
                                            handleChangeForm(event, 3)
                                            setValue(event.target.value)
                                        }
                                    }} placeholder={t('profilePlaceholder.Entercontactinformation1')} className="ft-input-control " />
                                </Form.Item>
                                {codeSentMsg ? <p className={`${verifystyles.blueMsg}`}>{codeSentMsg ? t('clientProfile.clientProfileStep1.codeMsg') : ''}</p> : ''}
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <Button className="ft-border-btn" disabled={value.length != 11 ? true : false} style={{
                                color: `${value.length != 11 ? "#EAEAEA" : "#00D6E3"}`, borderColor: `
                        ${value.length != 11 ? "#EAEAEA" : "#00D6E3"}`
                            }} onClick={getcode}>{t('profilePlaceholder.Sendverificationcode')}</Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-8">
                            <div className="ft-contact-bottom">
                                <Form.Item
                                    name="codeValues"
                                // rules={[
                                //     {
                                //         required: true,
                                //         message:
                                //             t('index.formItem1.nameRequired'),
                                //     },
                                // ]}
                                >
                                    <Input type="text" onKeyDown={(evt) => {
                                        if (evt.key === '1' || evt.key === '2' || evt.key === '3' || evt.key === '4' || evt.key === '5' || evt.key === '6' || evt.key === '7' || evt.key === '8' || evt.key === '9' || evt.key === '0' || evt.key === '' || evt.key === 'Backspace') {

                                        } else {
                                            evt.preventDefault()
                                        }
                                    }} defaultValue="" onChange={(event) => {
                                        setPhoneVerifyCode(false)
                                        setCode(event.target.value)
                                    }} placeholder={t('profilePlaceholder.Enterverificationcode')} className="ft-input-control" />
                                    {phoneVerifyCode ? <p className={`${verifystyles.redMsg} ft-red-msg fe-verify-error`}>{phoneVerifyCode ? t('clientProfile.clientProfileStep1.invalidCodeMsg') : ''}</p> : ''}
                                </Form.Item>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4 pb-3">
                            <Button className="ft-default-btn at-bold-btn" disabled={codeValue}
                                style={{
                                    backgroundColor: `${codeValue ? "#EAEAEA" : "#00D6E3"}`,
                                    borderColor: `${codeValue ? "#EAEAEA" : "#00D6E3"}`
                                }}
                                onClick={handleVerify}>{t('profilePlaceholder.Verify')}</Button>
                        </div>
                    </div>
                </div>
                {/* professions */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.professionLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    </div>
                    <div className="right">
                        <span>{t('clientProfile.clientProfileStep1.multipleSelection')}</span>
                    </div>
                </div>
                <div className="row h-134">
                    <div className="col-12 mt-20">
                        <span className="w-100" style={{ height: "50px", border: "2px", borderRadius: "20px" }}>
                            <Form.Item name="profession" initialValue={getProfession(sideCharMember.profession)}
                                rules={[
                                    {
                                        required: true,
                                        message: t('index.formItem1.nameRequired'),
                                    },
                                ]}
                            >
                                <Checkbox.Group onChange={(e) => handleChangeForm(e, 4)} className="w-100 new-multi-checkbox ft-multi-checkbox mt-0 mb-0" options={Object.keys(professionOptions)} />
                            </Form.Item>
                        </span>
                    </div>
                </div >

                {/* fields */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.fieldLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    </div>
                    <div className="right">
                        <span>{t('clientProfile.clientProfileStep2.companyFieldLimit')}</span>
                    </div>
                </div>
                <div className="minh-134">
                    <div className="ft-field-wrap" >
                        <div className="ft-fdinput mt-20">
                            <Form.Item name="fieldName"
                                initialValue=""
                                rules={(arr && arr.length < 1) ? [
                                    {
                                        required: true,
                                        message: t('index.formItem1.nameRequired'),
                                    },
                                ] : []}>
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setFieldsAreRequired(false)
                                        setFiledValue(e.target.value)
                                    }}
                                    placeholder={t('clientProfile.clientProfileStep1.fieldPlaceholder')}
                                    className="ft-input-control" />
                            </Form.Item>
                            {fieldsAreRequired ? <div className="ant-form-item-explain ant-form-item-explain-error"><div role="alert">{t('index.formItem1.nameRequired')}</div></div> : null}
                        </div>
                        <div className="ft-fdmore mt-20">
                            <Button
                                style={{ border: "none" }}
                                className="ft-profile-plus"
                                onClick={(val) => {
                                    if (arr && filedValue && (filedValue + "").trim().length > 0 && arr.length < 3) {
                                        setArr([...arr, filedValue])
                                        setFieldsAreRequired(false)
                                        setFiledValue(false);
                                    }
                                    form.setFieldsValue({
                                        fieldName: ''
                                    })
                                    if (arr.length == 2) {
                                        setFieldsAreRequired(false)
                                    }
                                }}>
                                <img src="/plus.svg" alt="Plus Icon" />
                            </Button>
                        </div>
                    </div>
                    {arr.length > 0 && (
                        <div className="mt-20 mb-50">
                            <div className="ft-filed-detail">
                                {arr.map((field: any, index: any) => <Button className={`${stylessec.btn} searchdetail_btn1 ft-field at-company-field`}>
                                    {field} <img src="/cross.svg" onClick={() => {
                                        arr.splice(index, 1);
                                        setArr([...arr]);
                                    }} /></Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {/* locations Fields */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.locationLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    </div>
                </div>
                <div className="row mb-30 ft-loc-main">
                    {/* location one */}
                    <div className="col-6 minh-84 mt-20">
                        <Form.Item name="location1"
                            initialValue={(myLocationOne.id != 0) ? myLocationOne.province_id : null}
                            rules={[
                                { required: true, message: t('index.formItem1.nameRequired') },
                            ]}>
                            {/* <div className="dropdown" style={{ color: "white" }}> */}
                            <Select
                                placeholder={t('clientProfile.clientProfileStep1.CityLabel')}
                                className="new-select-box ft-select-control"
                                defaultValue={(myLocationOne.id != 0) ? myLocationOne.province_id : null}
                                onChange={(value) => {
                                    setMyLocationOne({
                                        ...myLocationOne,
                                        province_id: value,
                                        district_id: 0
                                    });
                                }}>
                                {provinceData.map((province: any) => (
                                    <>
                                        <Option
                                            key={province.id}
                                            value={province.id}
                                        >{province.name}</Option>
                                    </>
                                ))}
                            </Select>
                        </Form.Item>
                        {/* <Dropdown style={{ borderRadius: 10, height: 48 }} overlay={() => (<Menu>
                                {provinces? provinces.map(province => {       
                                    <Menu.Item className={stylessec.dropdownitem} key={province.id}>{province.name}</Menu.Item>
                                }) : ''}
                            </Menu>)
                            }>
                                <Button className={stylessec.dropdownBtn} style={{ width: "100%", borderRadius: "20px" }}> {t('clientProfile.clientProfileStep1.CityLabel')} <img src="/arrowdown.svg" style={{ float: "right", paddingTop: "10px" }} /></Button>
                            </Dropdown> */}
                        {/* </div> */}
                    </div>
                    <div className="col-6 minh-84 mt-20">
                        <div className="dropdown" style={{ color: "white" }}>
                            <Form.Item name="city1"
                                initialValue={(myLocationOne.id != 0) ? myLocationOne.district_id : null}
                                rules={[
                                    { required: true, message: t('index.formItem1.nameRequired') },
                                ]}>
                                <Select
                                    placeholder={t('clientProfile.clientProfileStep1.countyLabel')}
                                    className="new-select-box ft-select-control"
                                    defaultValue={(myLocationOne.id != 0) ? myLocationOne.district_id : null}
                                    onChange={(value) => {
                                        setMyLocationOne({
                                            ...myLocationOne,
                                            district_id: value
                                        });
                                    }}>
                                    {cityData.filter((c: any) => c.province_id == myLocationOne.province_id).map((city: any) => (
                                        <>
                                            <Option key={city.id} value={city.id}>{city.name}</Option>
                                        </>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    {/* location two */}
                    <div className="col-6 minh-84">
                        <div className="dropdown" style={{ color: "white" }}>
                            <Form.Item
                                initialValue={(myLocationTwo.id != 0) ? myLocationTwo.province_id : null}
                                name="location2">
                                <Select
                                    className="new-select-box ft-select-control"
                                    placeholder={t('clientProfile.clientProfileStep1.CityLabel')}
                                    defaultValue={(myLocationTwo.id != 0) ? myLocationTwo.province_id : null}
                                    onChange={(value) => {
                                        setMyLocationTwo({
                                            ...myLocationTwo,
                                            province_id: value,
                                            district_id: 0
                                        });
                                    }}>
                                    {provinceData.map((province: any) => (
                                        <Option key={province.id} value={province.id}>{province.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="col-6 minh-84">
                        <div className="dropdown" style={{ color: "white" }}>
                            <Form.Item
                                initialValue={(myLocationTwo.id != 0) ? myLocationTwo.district_id : null}
                                name="city2">
                                <Select
                                    className="new-select-box ft-select-control"
                                    placeholder={t('clientProfile.clientProfileStep1.countyLabel')}
                                    defaultValue={(myLocationTwo.id != 0) ? myLocationTwo.district_id : null}
                                    onChange={(value) => {
                                        setMyLocationTwo({
                                            ...myLocationTwo,
                                            district_id: value
                                        });
                                    }}
                                >
                                    {cityData.filter((c: any) => c.province_id == myLocationTwo.province_id).map((city: any) => (
                                        <>
                                            <Option key={city.id} value={city.id}>{city.name}</Option>
                                        </>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                </div>

                {/* homelink */}
                <div className="row">
                    <div className="col-12">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.homepageLabel')}
                        </span>
                    </div>
                    <div className="col-12">
                        <Form.Item
                            name="homepageLink"
                            className="ft-control-wrap"
                            initialValue={sideCharMember.homepage_link}

                        >
                            <Input
                                placeholder={t('clientProfile.clientProfileStep1.homepageURL')}
                                autoComplete="off"
                                onChange={(e) => {
                                    setFormLink({ ...formLink, home: e.target.value == "" ? true : isUrl(e.target.value), homeLink: e.target.value })
                                }}
                                defaultValue={sideCharMember.homepage_link}
                                className="ft-input-control mt-20"
                            />
                            {!formLink.home ? <p className={`${verifystyles.redMsg} ft-red-msg`}>{!formLink.home ? t('common.InvalidUrl') : ''}</p> : ''}
                        </Form.Item>
                    </div>
                </div>

                {/* facebook link */}
                <div className="row">
                    <div className="col-12">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.fbLabel')}
                        </span>
                    </div>
                    <div className="col-12">
                        <Form.Item name="facebookLink"
                            className="ft-control-wrap"
                            initialValue={sideCharMember.facebook_link}
                        >
                            <Input
                                placeholder={t('clientProfile.clientProfileStep1.fbURL')}
                                autoComplete="off"
                                onChange={(e) => {
                                    setFormLink({ ...formLink, facebook: e.target.value == "" ? true : isUrl(e.target.value), fbLink: e.target.value })
                                }}
                                defaultValue={sideCharMember.facebook_link}
                                className="ft-input-control mt-20"
                            />
                            <p className={`${verifystyles.redMsg} ft-red-msg`}>{!formLink.facebook ? t('common.InvalidUrl') : ''}</p>
                        </Form.Item>
                    </div>
                </div>

                {/* instagram link */}
                <div className="row">
                    <div className="col-12">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.instaLabel')}
                        </span>
                    </div>
                    <div className="col-12">
                        <Form.Item name="instagramLink"
                            className="ft-control-wrap"
                            initialValue={sideCharMember.instagram_link}
                        >
                            <Input
                                placeholder={t('clientProfile.clientProfileStep1.instaURL')}
                                autoComplete="off"
                                onChange={(e) => {
                                    setFormLink({ ...formLink, insta: e.target.value == "" ? true : isUrl(e.target.value), instaLink: e.target.value })
                                }}
                                defaultValue={sideCharMember.instagram_link}
                                className="ft-input-control mt-20"
                            />
                            <p className={`${verifystyles.redMsg} ft-red-msg`}>{!formLink.insta ? t('common.InvalidUrl') : ''}</p>
                        </Form.Item>
                    </div>
                </div>

                {/* website other link */}
                <div className="row">
                    <div className="col-12">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.otherLabel')}
                        </span>
                    </div>
                    <div className="col-12">
                        <Form.Item name="otherLink"
                            className="ft-control-wrap"
                            initialValue={sideCharMember.other_link}
                        >
                            <Input
                                placeholder={t('clientProfile.clientProfileStep1.otherURL')}
                                autoComplete="off"
                                onChange={(e) => {
                                    console.log(e.target.value == "")
                                    setFormLink({ ...formLink, other: e.target.value == "" ? true : isUrl(e.target.value), otherLink: e.target.value })
                                }}
                                defaultValue={sideCharMember.other_link}
                                className="ft-input-control mt-20"
                            />
                            <p className={`${verifystyles.redMsg} ft-red-msg`}>{!formLink.other ? t('common.InvalidUrl') : ''}</p>
                        </Form.Item>
                    </div>
                </div>

                {/* Images */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep1.imageLabel')}
                        </span>
                    </div>
                    <div className="right">
                        <span>({t('clientProfile.clientProfileStep1.less10')} - {t('clientProfile.clientProfileStep1.fileFormat')}JPG,PNG,PDF)</span>
                    </div>
                </div>
                <div className="row mt-20">
                    <div className="col-12">
                        <Upload
                            name="introductryImg"
                            listType="picture-card"
                            className="introductoryUpload ft-introductory-image"
                            defaultFileList={fileList}
                            fileList={fileList}
                            multiple
                            maxCount={20}
                            onRemove={(e) => handleDeleteImage(e)}
                            beforeUpload={beforeUpload}
                            onChange={({ fileList: newFileList }) => {
                                setFileList(newFileList);
                            }}
                        >
                            {fileList.length >= 20 ? null : (<div>
                                <Image src={camera} alt="Profile Image" width={38} height={30} />
                            </div>)}
                        </Upload>
                    </div>
                </div>

                {/* Save Button */}
                <div className="row mt-90">
                    <Button
                        loading={stepComplete}
                        htmlType="submit"
                        // disabled={step1Disable ? true : false}
                        className={(step1Disable || !isVeify) ? "ft-step1-btn disable" : "ft-step1-btn"}
                    >
                        {t('clientProfile.clientProfileStep2.nextBtn')}
                    </Button>
                </div>


                {/* Popup */}
                <PhoneVerifyPopup isPhoneVerify={isPhoneVerify} handlePhoneVerifyClose={handlePhoneVerifyClose} />
            </Form>
        </>


    )
}

export default SideCharStep1