import React, { useState, useEffect } from 'react';
import { Button, Tabs, Form, Checkbox, Input, Select, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';
import stylessec from '../styles/searchdetail.module.css';
import _, { values } from 'lodash';
import { getDistricts, getProvinces } from '../redux/actions';
import { getDistrictsByid, getProvincesByid, isEmpty } from '../utils/helper';

import { isMobile } from 'react-device-detect';


function HeaderTab(props: any) {
    const { t } = useTranslation();
    const { Option } = Select;
    const { TabPane } = Tabs;
    const values = Object.values(props.val)
    function callback(key: any) {
        props.setMenuTabKey(key);
    }
    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);

    function getProfession(profession: any) {
        let _professionOptions: any = _.invert(professionOptions);
        return profession.map((key: string, value: number) => _professionOptions[key]);
    }

    const dispatch = useDispatch()
    const provinceData = useSelector((state: State) => state.client.provinces)
    const cityData = useSelector((state: State) => state.client.districts)
    const professionOptions: any = []
    professionOptions[t('common.Development')] = 'development'
    professionOptions[t('common.Design')] = 'design'
    professionOptions[t('common.Marketing')] = 'marketing'
    professionOptions[t('common.Other')] = 'other'
    const [form] = Form.useForm();
    const [isLine, setIsLine] = useState(false)
    const registration_type = useSelector((state: State) => state.auth.userData.registration_type)
    // others
    const [arr, setArr] = useState<any>([])
    const [value, setValue] = useState<any>(false)
    const searchFilterShow = (registration_type == 1 ? props.Search.clientSearchSideChar : props.Search.sideCharSearchClient)
    // const [isDisable, setIsDisable] = useState<any>(false);
    const [city1, setCity1] = useState("");
    const [city2, setCity2] = useState("");

    useEffect(() => {
        if (isEmpty(searchFilterShow)) {
            form.setFieldsValue({
                profession: [],
                fields: [],
                fieldName: "",
                province_id1: undefined,
                district_id1: undefined,
                province_id2: undefined,
                district_id2: undefined,
                is_company: undefined,
                desired_date: undefined,
                desired_time: undefined,
                desired_project_type: undefined,
                insurance_status: undefined,
                desired_work_type: undefined,
            })
            setArr([])
            const data = {
                arr: [],
                values: {
                    profession: [],
                    province_id1: undefined,
                    district_id1: undefined,
                    province_id2: undefined,
                    district_id2: undefined,
                    is_company: undefined,
                    desired_date: undefined,
                    desired_time: undefined,
                    desired_project_type: undefined,
                    insurance_status: undefined,
                    desired_work_type: undefined,
                }
            }
            setIsLine(false)
            fetchDetail(data)
            props.onFinishSearch(data)
        } else {
            form.setFieldsValue({
                profession: getProfession(searchFilterShow.profession),
                province_id1: isEmpty(searchFilterShow?.locations[0]?.city) ? undefined : searchFilterShow.locations[0].city,
                district_id1: isEmpty(searchFilterShow?.locations[0]?.district) ? undefined : searchFilterShow.locations[0].district,
                province_id2: isEmpty(searchFilterShow?.locations[1]?.city) ? undefined : searchFilterShow.locations[1].city,
                district_id2: isEmpty(searchFilterShow?.locations[1]?.district) ? undefined : searchFilterShow.locations[1].district,
                is_company: searchFilterShow.is_company == undefined ? undefined : searchFilterShow.is_company,
                desired_date: searchFilterShow.desired_date,
                desired_time: searchFilterShow.desired_time,
                desired_project_type: searchFilterShow.desired_project_type,
                insurance_status: searchFilterShow.insurance_status,
                desired_work_type: searchFilterShow.desired_work_type,
            })
            const data = {
                arr: searchFilterShow.fields,
                values: {
                    profession: searchFilterShow.profession,
                    province_id1: isEmpty(searchFilterShow?.locations[0]?.city) ? undefined : searchFilterShow.locations[0].city,
                    district_id1: isEmpty(searchFilterShow?.locations[0]?.district) ? undefined : searchFilterShow.locations[0].district,
                    province_id2: isEmpty(searchFilterShow?.locations[1]?.city) ? undefined : searchFilterShow.locations[1].city,
                    district_id2: isEmpty(searchFilterShow?.locations[1]?.district) ? undefined : searchFilterShow.locations[1].district,
                    is_company: searchFilterShow.is_company == undefined ? undefined : searchFilterShow.is_company,
                    desired_date: searchFilterShow.desired_date,
                    desired_time: searchFilterShow.desired_time,
                    desired_project_type: searchFilterShow.desired_project_type,
                    insurance_status: searchFilterShow.insurance_status,
                    desired_work_type: searchFilterShow.desired_work_type,
                }
            }
            setCity1(isEmpty(searchFilterShow?.locations[0]?.city) ? undefined : searchFilterShow.locations[0].city)
            setCity2(isEmpty(searchFilterShow?.locations[1]?.city) ? undefined : searchFilterShow.locations[1].city,)
            setArr(searchFilterShow.fields)
            fetchDetail(data)
            props.onFinishSearch(data)

            if (isEmpty(data.values.desired_date) &&
                isEmpty(data.values.desired_project_type) &&
                isEmpty(data.values.desired_time) &&
                isEmpty(data.values.desired_work_type) &&
                isEmpty(data.values.district_id1) &&
                isEmpty(data.values.district_id2) &&
                isEmpty(data.arr) &&
                isEmpty(data.values.insurance_status) &&
                isEmpty(data.values.profession) &&
                isEmpty(data.values.province_id1) &&
                isEmpty(data.values.is_company) &&
                isEmpty(data.values.province_id2)) {
                setIsLine(false)
            } else {
                setIsLine(true)

            }
        }
        dispatch(getProvinces())
        dispatch(getDistricts())
    }, []);



    const [filterSearch, setFilterSearch] = useState<any>([])

    const fetchDetail = async ({ values, arr }: any) => {
        const province1 = getProvincesByid(provinceData, values.province_id1)
        const districts1 = getDistrictsByid(cityData, values.district_id1)
        const province2 = getProvincesByid(provinceData, values.province_id2)
        const districts2 = getDistrictsByid(cityData, values.district_id2)


        const location = [];
        const details = [];
        if (!isEmpty(province1)) location.push(province1.name);
        if (!isEmpty(districts1)) location.push(districts1[0].name)
        if (!isEmpty(province2)) location.push(province2.name)
        if (!isEmpty(districts2)) location.push(districts2[0].name)

        if ((!isEmpty(province1) || !isEmpty(districts1) || !isEmpty(province2) || !isEmpty(districts2))) {
            details.push({
                label: t("featureSearch.Location"),
                value: location.join(", "),
            })
        }
        if (!isEmpty(values.is_company)) {
            details.push({
                label: t("featureSearch.Company"),
                value: values.is_company == "no" ? t("featureSearch.Individual") : t("featureSearch.Company")
            })
        }
        if (!isEmpty(values.profession)) {
            details.push({
                label: t("featureSearch.Profession"),
                value: (getProfession(values.profession)).join(", ")
            })
        }
        if (!isEmpty(arr)) {
            details.push({
                label: t("featureSearch.Field"),
                value: arr.join("/")
            })
        }

        if (!isEmpty(values.desired_date)) {
            details.push({
                label: t("featureSearch.DesiredDate"),
                value: t("dynamic.desired_date." + values.desired_date)
            })
        }
        if (!isEmpty(values.desired_time)) {
            details.push({
                label: t("featureSearch.DesiredTime"),
                value: t("dynamic.desired_time." + values.desired_time)
            })
        }
        if (!isEmpty(values.desired_project_type)) {
            details.push({
                label: t("featureSearch.DesiredType"),
                value: t("dynamic.desired_project_type." + values.desired_project_type)
            })
        }
        if (!isEmpty(values.insurance_status)) {
            details.push({
                label: t("featureSearch.Insurance"),
                value: t("dynamic.insurance_status." + values.insurance_status)
            })
        }
        if (!isEmpty(values.desired_work_type)) {
            details.push({
                label: t("featureSearch.WorkType"),
                value: t("dynamic.desired_work_type." + values.desired_work_type)
            })
        }
        setFilterSearch(details)
    }


    const onSearchFilter = (value: any) => {
        value.values.profession = isEmpty(value.values.profession) ? null : value.values.profession.map((key: string, value: number) => professionOptions[key]);
        props.onFinishSearch(value)
        fetchDetail(value)
        props.setFilterShow(!props.filterShow)
    }

    const handleClearForm = () => {
        form.setFieldsValue({
            profession: [],
            fields: [],
            fieldName: "",
            province_id1: undefined,
            district_id1: undefined,
            province_id2: undefined,
            district_id2: undefined,
            is_company: undefined,
            desired_date: undefined,
            desired_time: undefined,
            desired_project_type: undefined,
            insurance_status: undefined,
            desired_work_type: undefined,
        })
        setArr([])
        const data = {
            arr: [],
            values: {
                profession: [],
                province_id1: undefined,
                district_id1: undefined,
                province_id2: undefined,
                district_id2: undefined,
                is_company: undefined,
                desired_date: undefined,
                desired_time: undefined,
                desired_project_type: undefined,
                insurance_status: undefined,
                desired_work_type: undefined,
            }
        }
        fetchDetail(data)
        props.resetForm()
        setCity1("")
        setCity2("")
        props.setFilterShow(!props.filterShow)
        setIsLine(false)
    }
    return (
        <>
            <div className="ft-subtitle-main ft-head at-title">
                <h1 className='ft-sub-title'>
                    {props.member == 2 ? t('featureSearch.Findsidecharacters') : t('featureSearch.Findclients')}
                </h1>
                <div className="right">
                    {(props.filterShow && props.val == "1") ? <Button className="ft-refresh-btn" onClick={handleClearForm}>{t('featureSearch.Refresh')}</Button> : null}
                </div>
            </div>
            <div className="container">
                <div className={`row`}>
                    <Tabs defaultActiveKey={`${values}`} onChange={callback}>
                        <TabPane tab={
                            <span className="normaltab">
                                {isMobile}
                                {props.member == 2 ? t("common.searchSideChar") : t("common.searchClient")}
                            </span>
                        } key="1">
                            <div className="ft-search-tag-wrap">
                                {filterSearch && filterSearch?.length > 0 &&
                                    <div className="ft-desk-element">
                                        <div className="ft-search-tagss">
                                            {filterSearch && filterSearch.map((details: any, index: number) => (
                                                <Button key={index} className="ft-search-tag">
                                                    <span className="ft-lbl">{details.label}</span>
                                                    <span className="ft-val">{details.value}</span>
                                                </Button>))
                                            }
                                        </div>
                                    </div>
                                }
                                <div className={`row`}>
                                    {props.filterShow ? null : <Button className="ft-search-setting-btn" onClick={props.filterShowChange}>{t("featureSearch.SearchOptionSettings")}</Button>}
                                </div>
                                {filterSearch && filterSearch?.length > 0 &&
                                    <div className="ft-mb-element">
                                        <div className="ft-search-tagss">
                                            {filterSearch && filterSearch.map((details: any, index: number) => (
                                                <Button key={index} className="ft-search-tag">
                                                    <span className="ft-lbl">{details.label}</span>
                                                    <span className="ft-val">{details.value}</span>
                                                </Button>))
                                            }
                                        </div>
                                    </div>
                                }
                                {props.filterShow ?
                                    <Form form={form} name="step1" layout="vertical" className="ft-step" onFinish={(values) => {
                                        if (isEmpty(values.desired_date) &&
                                            isEmpty(values.desired_project_type) &&
                                            isEmpty(values.desired_time) &&
                                            isEmpty(values.desired_work_type) &&
                                            isEmpty(values.district_id1) &&
                                            isEmpty(values.district_id2) &&
                                            isEmpty(values.fieldName) &&
                                            isEmpty(values.insurance_status) &&
                                            isEmpty(values.profession) &&
                                            isEmpty(values.province_id1) &&
                                            isEmpty(values.is_company) &&
                                            isEmpty(values.province_id2) && isEmpty(arr)) {
                                            setIsLine(false)
                                        } else {
                                            setIsLine(true)

                                        }
                                        const newVal = { values, arr, direct: false }
                                        onSearchFilter(newVal)
                                    }}>
                                        <div className={`ft-search-form-wrapper ${isLine ? "" : "fe-header-top-border-none"}`}>
                                            {/* Who is your desired client? */}
                                            {props.member == 2 ? null :
                                                <>
                                                    <div className="ft-lbl-wrap">
                                                        <div className="left">
                                                            <span className="ft-lbl">
                                                                {t('featureSearch.Whoisyourdesiredclient?')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <div className="mt-20 mb-50">
                                                            <Form.Item name="is_company" >
                                                                <Radio.Group name="is_company" className="w-100 ft-db-select">
                                                                    <Radio.Button value='no' name="is_company" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", width: "50%" }}> {t('featureSearch.Individual')}</Radio.Button>
                                                                    <Radio.Button value='yes' name="is_company" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px", width: "50%" }}> {t('featureSearch.Company')}</Radio.Button>
                                                                </Radio.Group>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {/* professions */}
                                            <div className="ft-lbl-wrap">
                                                <div className="left">
                                                    <span className="ft-lbl">
                                                        {t('featureSearch.Whatisyourdesiredprofession?')}
                                                    </span>
                                                </div>
                                                <div className="right">
                                                    <span>{t('clientProfile.clientProfileStep1.multipleSelection')}</span>
                                                </div>
                                            </div>
                                            <div className="row h-118">
                                                <div className="col-12 mt-20" >
                                                    <span className="w-100" style={{ height: "50px", border: "2px", borderRadius: "20px" }}>
                                                        <Form.Item name="profession"
                                                        >
                                                            <Checkbox.Group className="w-100 new-multi-checkbox ft-multi-checkbox mt-0 mb-0 " options={Object.keys(professionOptions)} />
                                                        </Form.Item>
                                                    </span>
                                                </div>
                                            </div >


                                            {/* fields */}
                                            <div className="ft-lbl-wrap">
                                                <div className="left">
                                                    <span className="ft-lbl">
                                                        {t('featureSearch.Whatisyourdesiredfield?')}
                                                    </span>
                                                </div>
                                                <div className="right">
                                                    <span>{t('clientProfile.clientProfileStep2.companyFieldLimit')}</span>
                                                </div>
                                            </div>
                                            <div className="minh-134 ft-desire">
                                                <div className="wrap" >
                                                    <div className="left mt-20">
                                                        <Form.Item name="fieldName"
                                                            initialValue=""
                                                        >
                                                            <Input
                                                                type="text"
                                                                autoComplete="off"
                                                                onChange={(e) => { setValue(e.target.value) }}
                                                                placeholder={t('clientProfile.clientProfileStep1.fieldPlaceholder')}
                                                                className="ft-input-control" />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="right mt-20">
                                                        <Button
                                                            style={{ border: "none" }}
                                                            className="ft-plus"
                                                            onClick={(val) => {
                                                                if (arr && value && (value + "").trim().length > 0 && arr.length < 3) {
                                                                    setArr([...arr, value])
                                                                    setValue(false);
                                                                }
                                                                form.setFieldsValue({
                                                                    fieldName: ''
                                                                })
                                                            }}>
                                                            <img src="/plus.svg" alt="Plus Icon" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {!isEmpty(arr) && (
                                                    <div className="mb-50 ft-field-deatil">
                                                        <div className="ft-filed-detail at-btn-fixed">
                                                            {arr.map((field: any, index: any) =>
                                                                <Button className={`${stylessec.btn} searchdetail_btn1 ft-field at-btn`} style={field && field.length > 1 ? { marginLeft: "10px" } : { marginLeft: "0px" }}>
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
                                                        {t('featureSearch.Whereisyourdesiredlocation?')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="row mb-50 ft-mb-location">
                                                {/* location one */}
                                                <div className="col-6 mt-20">
                                                    <Form.Item name="province_id1">
                                                        <Select
                                                            placeholder={t('featureSearch.SelectCity')}
                                                            className="new-select-box ft-select-control"
                                                            onChange={(value: any) => {
                                                                setCity1(value)
                                                                form.setFieldsValue({
                                                                    district_id1: null
                                                                })
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
                                                </div>
                                                <div className="col-6 mt-20">
                                                    <div className="dropdown" style={{ color: "white" }}>
                                                        <Form.Item name="district_id1">
                                                            <Select
                                                                placeholder={t('featureSearch.SelectDistrict')}
                                                                className="new-select-box ft-select-control"
                                                            >
                                                                {cityData.filter((c: any) => c.province_id == city1).map((city: any) => (
                                                                    <Option key={city.id} value={city.id}>{city.name}</Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                {/* location two */}
                                                <div className="col-6 mt-20">
                                                    <div className="dropdown" style={{ color: "white" }}>
                                                        <Form.Item
                                                            name="province_id2">
                                                            <Select
                                                                className="new-select-box ft-select-control"
                                                                placeholder={t('featureSearch.SelectCity')}
                                                                onChange={(value: any) => {
                                                                    setCity2(value)
                                                                    form.setFieldsValue({
                                                                        district_id2: null
                                                                    })
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
                                                    </div>
                                                </div>
                                                <div className="col-6 mt-20">
                                                    <div className="dropdown" style={{ color: "white" }}>
                                                        <Form.Item
                                                            name="district_id2">
                                                            <Select
                                                                className="new-select-box ft-select-control"
                                                                placeholder={t('featureSearch.SelectDistrict')}
                                                            >
                                                                {cityData.filter((c: any) => c.province_id == city2).map((city: any) => (
                                                                    <Option key={city.id} value={city.id}>{city.name}</Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Desired Date* */}
                                            <div className="ft-lbl-wrap">
                                                <div className="left">
                                                    <span className="ft-lbl">
                                                        {t('featureSearch.Whenisyourdesireddate?')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="mt-20 mb-50">
                                                    <Form.Item name="desired_date" >
                                                        <Radio.Group name="desired_date" className="w-100 ft-db-select">
                                                            <Radio.Button value='weekdays' name="desired_date" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('clientProfile.clientProfileStep3.weekdaysLabel')}</Radio.Button>
                                                            <Radio.Button value='weekend' name="desired_date" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('clientProfile.clientProfileStep3.weekendLabel')}</Radio.Button>
                                                            <Radio.Button value='weekdays-weekend' name="desired_date" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('clientProfile.clientProfileStep3.weekday/end')}</Radio.Button>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </div>
                                            </div>

                                            {/* Desired Time* */}
                                            <div className="ft-lbl-wrap">
                                                <div className="left">
                                                    <span className="ft-lbl">
                                                        {t('featureSearch.Whenisyourdesiredtime?')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="mt-20 mb-50">
                                                    <Form.Item name="desired_time">
                                                        <Radio.Group name="desired_time" className="w-100 ft-db-select">
                                                            <Radio.Button value='morning' name="desired_time" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('clientProfile.clientProfileStep3.morningLabel')}</Radio.Button>
                                                            <Radio.Button value='afternoon' name="desired_time" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('clientProfile.clientProfileStep3.noonLabel')}</Radio.Button>
                                                            <Radio.Button value='evening' name="desired_time" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('clientProfile.clientProfileStep3.eveLabel')}</Radio.Button>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </div>
                                            </div>

                                            {/* What is your desired project type?* */}
                                            <div className="ft-lbl-wrap">
                                                <div className="left">
                                                    <span className="ft-lbl">
                                                        {t('clientProfile.clientProfileStep3.projectLabel')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ft-desired-ptype">
                                                <div className="mt-20 mb-50">
                                                    <Form.Item name="desired_project_type">
                                                        <Radio.Group name="desired_project_type" className="w-100 ft-db-select ft-project-type">
                                                            <Radio.Button value={'short-term'} name="desired_project_type" className={`${stylessec.bigbtn} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
                                                                <div className="ft-txt-wrap at-wrap-fix">
                                                                    <p>
                                                                        <div className={`${stylessec.firsttext} ft-first`}>{t('clientProfile.clientProfileStep3.shortTermProject')}</div>
                                                                        <div className={`${stylessec.sectext} ft-sec`}>{t('clientProfile.clientProfileStep3.less3Mon')}</div>
                                                                    </p>
                                                                </div>
                                                            </Radio.Button>
                                                            <Radio.Button value={'long-term'} name="desired_project_type" className={`${stylessec.bigbtn} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px", fontWeight: "bold" }}>
                                                                <div className="ft-txt-wrap at-wrap-fix">
                                                                    <p>
                                                                        <div className={`${stylessec.firsttext} ft-first`} >{t('clientProfile.clientProfileStep3.longTermLabel')}</div>
                                                                        <div className={`${stylessec.sectext} ft-sec`}>{t('clientProfile.clientProfileStep3.Morethan3months')}</div>
                                                                    </p>
                                                                </div>
                                                            </Radio.Button>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </div>
                                            </div>

                                            {/* Can you provide insurance?* */}
                                            <div className="ft-lbl-wrap">
                                                <div className="left">
                                                    <span className="ft-lbl">
                                                        {t('clientProfile.clientProfileStep3.insuranceLabel')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="mt-20 mb-50">
                                                    <Form.Item name="insurance_status" >
                                                        <Radio.Group name="insurance_status" className="w-100 ft-db-select">
                                                            <Radio.Button value='available' name="insurance_status" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", width: "50%" }}>{t('clientProfile.clientProfileStep3.avilbleLabel')}</Radio.Button>
                                                            <Radio.Button value='unavailable' name="insurance_status" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px", width: "50%" }}>{t('clientProfile.clientProfileStep3.unavailable')}</Radio.Button>
                                                        </Radio.Group>
                                                    </Form.Item>
                                                </div>
                                            </div>

                                            {/* What is your desired work type?* */}
                                            <div className="ft-lbl-wrap">
                                                <div className="left">
                                                    <span className="ft-lbl">
                                                        {t('clientProfile.clientProfileStep3.workTypeLabel')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-20">
                                                <Form.Item name="desired_work_type" >
                                                    <Radio.Group name="desired_work_type" className="w-100 ft-db-select">
                                                        <Radio.Button value='workfrom-office' name="desired_work_type" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", width: "50%" }}>{t('clientProfile.clientProfileStep3.fromOfc')}</Radio.Button>
                                                        <Radio.Button value='workfrom-home' name="desired_work_type" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px", width: "50%" }}>{t('clientProfile.clientProfileStep3.workHome')}</Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </div>

                                            <div className="ft-search-btn-wrap">
                                                <Button className="ft-cancel-btn" onClick={props.filterShowChange}>
                                                    {t('featureSearch.Cancel')}
                                                </Button>
                                                <Button className="ft-save-option-btn" htmlType="submit">
                                                    {t('featureSearch.SaveSearchOptions')}
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>
                                    : null}
                            </div>
                        </TabPane>
                        <TabPane tab={
                            <span className="normaltab">
                                {width < 640 ? t("common.inbox") : t("featureSearch.ReceivedRequests")}
                            </span>
                        } key="2">
                        </TabPane>
                        <TabPane tab={
                            <span className="normaltab">
                                {width < 640 ? t("common.Sent") : t("featureSearch.SentRequests")}
                            </span>
                        } key="3">
                        </TabPane>
                        <TabPane tab={
                            <span className="normaltab">
                                {t("featureSearch.Likes")}
                            </span>
                        } key="4">
                        </TabPane>
                    </Tabs>

                </div>
            </div >
        </>
    )
}
export default HeaderTab