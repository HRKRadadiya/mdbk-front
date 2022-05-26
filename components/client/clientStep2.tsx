/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Button, Progress, Form, Input, Radio, Select, Checkbox, DatePicker } from 'antd';
import stylessec from '../../styles/searchdetail.module.css';
import Image from 'next/image'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { registerClient, getProvinces, getDistricts } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import ClientProfilePercentage from '../../components/clientProfilePercentage';
import _, { isArray } from 'lodash';
import { isEmpty } from '../../utils/helper';
import moment from 'moment';
interface IProps {
    stepComplete: boolean,
    onFinish: Function,
    onPreviousBtn: Function
}

function ClientStep2({ onFinish, onPreviousBtn, stepComplete }: IProps) {
    const { t } = useTranslation();
    const { Option } = Select;
    const [radioCompanyProfession, setRadioCompanyProfession] = useState('other');
    const [hashTagArr, setHashTagArr] = useState<any>([])
    const [hashTag, setHashTag] = useState<any>("");
    const [companyField, setCompanyField] = useState<any>('');
    const [companyFieldArr, setCompanyFieldArr] = useState<any>([])
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getProvinces())
        dispatch(getDistricts())
    }, []);
    const provinceData = useSelector((state: State) => state.client.provinces)
    const cityData = useSelector((state: State) => state.client.districts)
    const companyData = useSelector((state: State) => state.clientProfile.step.is_company)
    const [radioIsCompany, setRadioIsCompany] = useState(companyData);
    const clientState = useSelector((state: State) => state.clientProfile)
    const clientMember = clientState.step.company;
    const disableValue = companyData == 'yes' ? true : false
    const [disabled, setDisabled] = useState(disableValue)
    const [hashTagDisable, setHashTagDisable] = useState(false)
    const [step2Disable, setStep2Disable] = useState<boolean>(true)
    const [step2Form, setStep2Form] = useState<any>({
        name: clientMember == null ? "" : clientMember.name,
        introduction: clientMember == null ? "" : clientMember.introduction,
        contact_information: clientMember == null ? "" : clientMember.contact_information,
        profession: isEmpty(clientMember?.profession) ? [] : clientMember?.profession,
        registation_number: clientMember == null ? "" : clientMember.registation_number,
        foundation_year: clientMember == null ? null : moment(`${clientMember.foundation_year}/1/1`),
        representative_name: clientMember == null ? "" : clientMember.representative_name,
        total_employees: clientMember == null ? 0 : clientMember.total_employees,    
    })
    const _preparedLocation = (locationIndex: any) => {
        if (clientMember && clientMember.locations.length > 0) {
            if (clientMember.locations[locationIndex] != undefined) {
                let _location = clientMember.locations[locationIndex];
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


    const [myLocationOne, setMyLocationOne] = useState<any>(_preparedLocation(0));
    const [myLocationTwo, setMyLocationTwo] = useState<any>(_preparedLocation(1));
    // const saveHashTag = () => {
    //     form.setFieldsValue({
    //         hashtags: ''
    //     })
    //     setHashTag("")
    //     hashTag == "" ? setHashTagArr([...hashTagArr]) : setHashTagArr([...hashTagArr, hashTag])
    // }

    const professionOptions: any = [];
    professionOptions[t('common.Development')] = 'development';
    professionOptions[t('common.Design')] = 'design';
    professionOptions[t('common.Marketing')] = 'marketing';
    professionOptions[t('common.Other')] = 'other';


    useEffect(() => {
        if (radioIsCompany == 'yes') {
            if (step2Form.name != "" && step2Form.introduction != "" && step2Form.contact_information != "" && step2Form.contact_information.length >= 11 && companyFieldArr.length > 0 && myLocationOne.district_id != 0 && myLocationOne.province_id != 0 && step2Form.registation_number != "" && (/^[0-9\b]+$/).test(step2Form.registation_number) && step2Form.registation_number.length >= 10 && step2Form.representative_name != "" && step2Form.foundation_year != null && ((/^[0-9\b]+$/).test(step2Form.total_employees) || step2Form.total_employees=="")) {
                setStep2Disable(false)
            } else {
                setStep2Disable(true)
            }
        } else {
            setStep2Disable(false)
        }

    }, [step2Form, step2Disable, radioIsCompany, companyFieldArr, myLocationOne])

    const handleChangeForm = (e: any, key: number) => {
        // console.log("Error", e.target.value);
        if (key == 1) {
            setStep2Form({ ...step2Form, name: e.target.value });
        } else if (key == 2) {
            setStep2Form({ ...step2Form, introduction: e.target.value });
        } else if (key == 3) {
            setStep2Form({ ...step2Form, contact_information: e.target.value });
        }
        // else if (key == 4) {
        //     setStep2Form({ ...step2Form, profession: e });
        // } 
        else if (key == 5) {
            setStep2Form({ ...step2Form, registation_number: e.target.value });
        } else if (key == 6) {
            setStep2Form({ ...step2Form, foundation_year: e });
        } else if (key == 7) {
            setStep2Form({ ...step2Form, representative_name: e.target.value });
        }
        else if (key == 8) {
            setStep2Form({ ...step2Form, total_employees: e.target.value });
        }
    }

    useEffect(() => {
        companyData == 'no' ? setDisabled(true) : setDisabled(false)
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            name: clientMember == null ? "" : clientMember.name,
            introduction: clientMember == null ? "" : clientMember.introduction,
            contact_information: clientMember == null ? "" : clientMember.contact_information,
            profession: getProfession(clientMember?.profession),
            registation_number: clientMember == null ? "" : clientMember.registation_number,
            foundation_year: clientMember == null ? null : moment(`${clientMember.foundation_year}/1/1`),
            representative_name: clientMember == null ? "" : clientMember.representative_name,
            total_employees: clientMember == null ? "" : clientMember.total_employees,
            locations: clientMember == null ? [] : clientMember.locations
        })
        setCompanyFieldArr(clientMember == null ? [] : clientMember.fields);
        setHashTagArr(clientMember == null ? [] : clientMember.hashtags)
        setMyLocationOne(_preparedLocation(0));
        setMyLocationTwo(_preparedLocation(1));

    }, [clientState.step])

    function getProfession(profession: any) {
        if (isEmpty(profession)) {
            return [];
        }
        let _professionOptions: any = _.invert(professionOptions);
        let selected: any = "" + profession.split(",").map((key: string, value: number) => _professionOptions[key]);
        return selected.split(",");
    }

    const [required, setRequired] = useState(false)

    const profilePercentage = useSelector((state: State) => state.clientProfile.profilePercentage)

    useEffect(() => {
        console.log("hashTagArr", hashTagArr)
        if (hashTagArr.length >= 10) {
            setHashTagDisable(true)
        } else {
            setHashTagDisable(false)
        }
    }, [hashTagArr])

    return (
        <Form name="step2" form={form} className="ft-step ft-step2" onFinish={(values) => {
            const newVal = { values, hashTagArr, companyFieldArr, myLocationOne, myLocationTwo }
            if (radioIsCompany == 'yes') {
                if (!isArray(values.profession)) {
                    values.profession = values.profession.split(",");
                }
                values.profession = values.profession.map((key: string, value: number) => professionOptions[key]);
                if (companyFieldArr.length < 1) {
                    setRequired(true)
                } else {
                    setRequired(false)
                    onFinish(newVal)
                }
            } else {
                setRequired(false)
                onFinish(newVal)
            }
        }}>
            <div className="mb-40">
                <ClientProfilePercentage profilePercentage={profilePercentage} />
            </div>
            <div className="ft-lbl-wrap">
                <div className="left">
                    <span className="ft-lbl">
                        {t('clientProfile.clientProfileStep2.areYouCompany')}
                        <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                    </span>
                </div>
            </div>
            <div className="h-134">
                <Form.Item name="is_company" initialValue={radioIsCompany}>
                    <Radio.Group value={radioIsCompany} className="w-100 ft-radio-ex mt-20" defaultValue={radioIsCompany} onChange={(e) => { setRadioIsCompany(e.target.value) }} name="is_company">
                        <Radio.Button value="no" name="is_company" onClick={() => { setDisabled(true) }} className={`${stylessec.bigbtn}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('clientProfile.clientProfileStep2.noCompany')}</Radio.Button>
                        <Radio.Button value="yes" name="is_company" onClick={() => { setDisabled(false) }} className={stylessec.bigbtn} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('clientProfile.clientProfileStep2.yesCompany')}</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </div>

            <div className="ft-lbl-wrap">
                <div className="left">
                    <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                        {t('clientProfile.clientProfileStep2.companyNameLabel')}
                        <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                    </span>
                </div>
                <div className="right">
                    <span>{t('clientProfile.clientProfileStep2.companyInfoLabel')}</span>
                </div>
            </div>
            <div className="h-134">
                <div className="col-12">
                    <Form.Item
                        name="name"
                        className="ft-control-wrap"
                        rules={[
                            {
                                required: disabled ? false : true,
                                message:
                                    t('index.formItem1.nameRequired'),
                            },
                        ]}>
                        <Input type="text" disabled={disabled} onChange={(e) => handleChangeForm(e, 1)}
                            placeholder={t('clientProfile.clientProfileStep2.companyPlaceholder')} className="ft-input-control mt-20" autoComplete="off" />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                    {t('clientProfile.clientProfileStep2.companyIntroLabel')}
                    <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                </span>
                <Form.Item
                    name="introduction"
                    className="ft-control-wrap intro"
                    rules={[
                        {
                            required: disabled ? false : true,
                            message:
                                t('index.formItem1.nameRequired'),
                        },
                    ]}>
                    <Input.TextArea rows={4} disabled={disabled} onChange={(e) => handleChangeForm(e, 2)}
                        placeholder={t('clientProfile.clientProfileStep2.EnterCompanyIntroduction')} className="ft-textarea-control mt-20" />
                </Form.Item>
            </div>

            <div className="row">
                <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                    {t('clientProfile.clientProfileStep2.Entercontactinformation')}
                    <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                </span>
                <Form.Item
                    name="contact_information"
                    className="ft-control-wrap"
                    rules={[
                        {
                            required: disabled ? false : true,
                            message:
                                t('index.formItem1.nameRequired'),
                        }
                    ]}>
                    <Input type="text" onChange={(e) => handleChangeForm(e, 3)} maxLength={11} disabled={disabled} onKeyDown={(evt) => {
                        if (evt.key === '1' || evt.key === '2' || evt.key === '3' || evt.key === '4' || evt.key === '5' || evt.key === '6' || evt.key === '7' || evt.key === '8' || evt.key === '9' || evt.key === '0' || evt.key === '' || evt.key === 'Backspace') {

                        } else {
                            evt.preventDefault()
                        }
                    }} placeholder={t('adminregister.entercontect')} className="ft-input-control mt-20" />
                </Form.Item>
            </div>
            <div className="row mb-40">
                <div className="col-12">
                    <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                        {t('clientProfile.clientProfileStep2.hashtagLabel')}
                    </span>
                </div>
                <div className="ft-hashtag-main">
                    <div className="ft-hash-input">
                        <Form.Item name="hashtags" className="ft-control-wrap"

                        >
                            <Input type="text" disabled={disabled} placeholder={t('clientProfile.clientProfileStep2.EnterRelatedHashtags')} className="ft-input-control mt-20" onChange={(e) => setHashTag(e.target.value)} />
                        </Form.Item>
                        {hashTagArr.length > 0 && (
                            <div className="mt-20 ft-tag-outer-div">

                                {disabled ? "" : hashTagArr.map((field: any, index: number) => <Button key={'button_' + index} className={`${stylessec.hashBtn} searchdetail_btn1 ft-tag-list at-btn-fixed `} 
                                // style={index > 0 ? { marginLeft: "10px", marginBottom: "10px" } : { marginLeft: "0px" }}
                                >
                                    {field}<img src="/cross.svg" onClick={() => {
                                        hashTagArr.splice(index, 1);
                                        setHashTagArr([...hashTagArr]);
                                    }} />
                                </Button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="ft-hash-btn at-has-step2-btn">
                        {(disabled || hashTagDisable) ? <Button disabled style={{ background: '#EAEAEA' }}>
                            {t('clientProfile.clientProfileStep2.enterLabel')}
                        </Button> : <Button style={{ background: '#00D6E3' }}
                            onClick={(val) => {
                                if (hashTag && hashTag && (hashTag + "").trim().length > 0 && hashTagArr.length < 10) {
                                    hashTag == "" ? setHashTagArr([...hashTagArr]) : setHashTagArr([...hashTagArr, hashTag])
                                }
                                setHashTag("")
                                form.setFieldsValue({
                                    hashtags: ''
                                })

                            }}
                        >
                            {t('clientProfile.clientProfileStep2.enterLabel')}
                        </Button>}
                    </div>
                </div>
            </div>

            <div className="ft-lbl-wrap">
                <div className="left">
                    <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                        {t('clientProfile.clientProfileStep2.companyProfLabel')}
                    </span>
                </div>
                <div className="right">
                    <span>{t('clientProfile.clientProfileStep1.multipleSelection')}</span>
                </div>
            </div>
            <div className="row h-134">
                <div className="col-12 mt-20">
                    <span className="w-100" style={{ height: "50px", border: "2px", borderRadius: "20px" }}></span>
                    <Form.Item name="profession" initialValue={getProfession(clientMember?.profession)}>
                        <Checkbox.Group
                            disabled={disabled} onChange={(e) => handleChangeForm(e, 4)}
                            className={`w-100 new-multi-checkbox ft-multi-checkbox mt-0 mb-0 ${disabled ? "disable-btn" : ""}`}
                            options={Object.keys(professionOptions)} />
                    </Form.Item>
                </div>
            </div>

            <div className="ft-lbl-wrap">
                <div className="left">
                    <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                        {t('clientProfile.clientProfileStep2.companyFieldLabel')}
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
                        <Form.Item name="fields"
                            rules={(companyFieldArr && companyFieldArr.length < 1) ? [
                                {
                                    required: disabled ? false : true,
                                    message: t('index.formItem1.nameRequired'),
                                },
                            ] : []}>
                            <Input type="text" disabled={disabled}
                                placeholder={t('clientProfile.clientProfileStep1.fieldPlaceholder')} className="ft-input-control" onChange={(event) => {
                                    setCompanyField(event.target.value);
                                }} />
                        </Form.Item>
                        {required ? <div className="ant-form-item-explain ant-form-item-explain-error"><div role="alert"> {t('index.formItem1.nameRequired')}</div></div>
                            : null}
                    </div>
                    <div className="ft-fdmore mt-20">
                        {disabled ? <Button className="ft-profile-plus" style={{ border: "none" }}><img src="/grayplus.svg" alt="Plus Icon" /> </Button> : <Button className="ft-profile-plus" style={{ border: "none" }}
                            // onClick={(val) => {
                            //     companyFieldArr && companyFieldArr.length < 3 ? setCompanyFieldArr([...companyFieldArr, companyField]) : <p>You can only give 3 field values</p>
                            // }}
                            onClick={(val) => {
                                if (companyFieldArr && companyField && (companyField + "").trim().length > 0 && companyFieldArr.length < 3) {
                                    setCompanyFieldArr([...companyFieldArr, companyField])
                                }
                                setCompanyField("")
                                form.setFieldsValue({
                                    fields: ''
                                })
                                setRequired(false);
                            }}>

                            <img src="/plus.svg" alt="Plus Icon" />
                        </Button>}
                    </div>
                </div>
                {disabled ? '' :
                    companyFieldArr.length > 0 && (
                        <div className="mt-20 mb-40">
                            <div className="ft-filed-detail">
                                {companyFieldArr.map((field: any, index: number) => <Button className={`${stylessec.btn} searchdetail_btn1 ft-field at-company-field`}>
                                    {field} <img src="/cross.svg" onClick={() => {
                                        companyFieldArr.splice(index, 1);
                                        setCompanyFieldArr([...companyFieldArr]);
                                    }} /></Button>
                                )}
                            </div>
                        </div>
                    )
                }
            </div>


            <div className="ft-lbl-wrap">
                <div className="left">
                    <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                        {t('clientProfile.clientProfileStep1.locationLabel')}
                        <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                    </span>
                </div>
            </div>
            <div className="row mb-20 ft-s2-loc">
                <div className="col-6 minh-84 mt-20">
                    <div className="dropdown" style={{ color: "white" }}>
                        <Form.Item name="location1" initialValue={(myLocationOne.id != 0) ? myLocationOne.province_id : null}
                            rules={[
                                { required: disabled ? false : true, message: t('index.formItem1.nameRequired') },
                            ]}>
                            <Select disabled={disabled} placeholder={t('clientProfile.clientProfileStep1.CityLabel')} defaultValue={(myLocationOne.id != 0) ? myLocationOne.province_id : null} className="new-select-box ft-select-control"
                                onChange={(value) => {
                                    setMyLocationOne({
                                        ...myLocationOne,
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
                <div className="col-6 minh-84 mt-20">
                    <div className="dropdown" style={{ color: "white" }}>
                        <Form.Item name="city1" initialValue={(myLocationOne.id != 0) ? myLocationOne.district_id : null}
                            rules={[
                                { required: disabled ? false : true, message: t('index.formItem1.nameRequired') },
                            ]}>
                            <Select disabled={disabled} placeholder={t('clientProfile.clientProfileStep1.countyLabel')} defaultValue={(myLocationOne.id != 0) ? myLocationOne.district_id : null} className="new-select-box ft-select-control"
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
                <div className="col-6 minh-84">
                    <div className="dropdown" style={{ color: "white" }}>
                        <Form.Item name="location2" initialValue={(myLocationTwo.id != 0) ? myLocationTwo.province_id : null}>
                            <Select disabled={disabled} placeholder={t('clientProfile.clientProfileStep1.CityLabel')} defaultValue={(myLocationTwo.id != 0) ? myLocationTwo.province_id : null} className="new-select-box ft-select-control"
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
                        <Form.Item name="city2" initialValue={(myLocationTwo.id != 0) ? myLocationTwo.district_id : null}>
                            <Select disabled={disabled} placeholder={t('clientProfile.clientProfileStep1.countyLabel')} defaultValue={(myLocationTwo.id != 0) ? myLocationTwo.district_id : null} className="new-select-box ft-select-control"
                                onChange={(value) => {
                                    setMyLocationTwo({
                                        ...myLocationTwo,
                                        district_id: value
                                    });
                                }}>
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

            <div className="row">
                <div className="col-12">
                    <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                        {t('clientProfile.clientProfileStep2.companyRegisPlaceholder')}
                        <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                    </span>
                </div>

                <div className="col-12">
                    <Form.Item name="registation_number"
                        className="ft-control-wrap"
                        rules={[
                            {
                                required: disabled ? false : true,
                                message:
                                    t('index.formItem1.nameRequired'),
                            },
                            {
                                pattern: new RegExp(/^[0-9\b]+$/),
                                message: t('clientProfile.clientProfileStep2.numberError'),
                            }
                        ]}>
                        <Input type="text" maxLength={10}
                            onKeyDown={(evt) => {
                                if (evt.key === '1' || evt.key === '2' || evt.key === '3' || evt.key === '4' || evt.key === '5' || evt.key === '6' || evt.key === '7' || evt.key === '8' || evt.key === '9' || evt.key === '0' || evt.key === '' || evt.key === 'Backspace') {

                                } else {
                                    evt.preventDefault()
                                }
                            }}
                            onChange={(e) => handleChangeForm(e, 5)}
                            disabled={disabled} placeholder={t('clientProfile.clientProfileStep2.Entercompany’sregistrationnumber')} className="ft-input-control mt-20" />
                            
                    </Form.Item>
                </div>
            </div>
            <div className="row">
                <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                    {t('clientProfile.clientProfileStep2.companyFoundLabel')}
                    <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                </span>
                <div className="col-12">
                    <Form.Item name="foundation_year"
                        className="ft-control-wrap"
                        rules={[
                            {
                                required: disabled ? false : true,
                                message:
                                    t('index.formItem1.nameRequired')
                            },
                        ]}>
                        <DatePicker disabled={disabled} onChange={(e) => handleChangeForm(e, 6)}
                          disabledDate={(current) => {
                            return current && current > moment().endOf('day');
                        }}
                             placeholder={t('clientProfile.clientProfileStep2.companyFoundDate')} className="ft-input-control mt-20 fe-datepiker-fix" name="foundation_year" picker="year" />
                    </Form.Item>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                        {t('clientProfile.clientProfileStep2.companyRepLabel')}
                        <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                    </span>
                </div>
                <div className="col-12">
                    <Form.Item name="representative_name"
                        className="ft-control-wrap"
                        rules={[
                            {
                                required: disabled ? false : true,
                                message:
                                    t('index.formItem1.nameRequired')
                            },
                        ]}>
                        <Input type="text"
                            disabled={disabled} onChange={(e) => handleChangeForm(e, 7)} placeholder={t('clientProfile.clientProfileStep2.companyRepPlaceholder')} className="ft-input-control mt-20" autoComplete="off" />
                    </Form.Item>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                        {t('clientProfile.clientProfileStep2.companyEmpLabel')}
                    </span>
                </div>
                <div className="col-12 ft-h0">
                    <Form.Item name="total_employees"
                        className="ft-control-wrap at-control-wrap"
                        rules={[
                            {
                                pattern: new RegExp(/^[0-9\b]+$/),
                                message: t('clientProfile.clientProfileStep2.numberError'),
                            },
                        ]}
                       >
                        <Input type="text"
                            disabled={disabled} onChange={(e) => handleChangeForm(e, 8)} onKeyDown={(evt) => {
                                if (evt.key === '1' || evt.key === '2' || evt.key === '3' || evt.key === '4' || evt.key === '5' || evt.key === '6' || evt.key === '7' || evt.key === '8' || evt.key === '9' || evt.key === '0' || evt.key === '' || evt.key === 'Backspace') {

                                } else {
                                    evt.preventDefault()
                                }
                            }} placeholder={t('clientProfile.clientProfileStep2.companyEmpPlaceholder')} className="ft-input-control mt-20" autoComplete="off" />
                          
                    </Form.Item>
                </div>
            </div>
            <div className="row ft-step23-btn mt-60">
                <Button onClick={() => { onPreviousBtn('1') }} className="ft-step-prev-btn" >
                    {t('clientProfile.clientProfileStep2.prevBtn')}
                </Button>

                <Form.Item shouldUpdate style={{ width: "auto", padding: 0 }}>
                    <Button
                        loading={stepComplete}
                        type="primary"
                        htmlType="submit"
                        disabled={step2Disable ? true : false}
                        className="ft-step-next-btn"
                        style={step2Disable ?
                            { background: '#EAEAEA', border: "none" } :
                            { background: '#00D6E3', borderColor: "#00D6E3" }} >
                        {t('clientProfile.clientProfileStep2.nextBtn')}
                    </Button>
                </Form.Item>
            </div>
        </Form >
    )
}

export default ClientStep2