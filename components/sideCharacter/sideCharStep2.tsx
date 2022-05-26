/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Radio, DatePicker, Space, Checkbox } from 'antd';
import stylessec from '../../styles/searchdetail.module.css';
import { useTranslation } from 'next-i18next';
import { CheckOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'
import { CaretDownOutlined } from '@ant-design/icons';
import checkCircleFill from '../../public/check-circle-fill.svg'
import ClientProfilePercentage from '../clientProfilePercentage';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import moment from 'moment';
import { deleteSideCharacterExperienceById } from '../../redux/actions';
import checkCircle from '../../public/check-circle.svg'
import { isEmpty } from '../../utils/helper';

interface IProps {
    stepComplete: boolean,
    onFinish: any,
    onPreviousBtn: any
}

function SideCharacterStep2({ onFinish, onPreviousBtn, stepComplete }: IProps) {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const router = useRouter()
    const dispatch = useDispatch()
    const sideCharState = useSelector((state: State) => state.sideChar)
    const sideCharMember = sideCharState.step;
    const [employeeStatus, setEmployeeStatus] = useState<any>(isEmpty(sideCharMember?.experiences[0]?.is_employed_currently) ? false : sideCharMember?.experiences[0]?.is_employed_currently)
    const [step2Disable, setStep2Disable] = useState<boolean>(true)
    const data = sideCharMember.experiences[0]
    const [dateError, setDateError] = useState(false)
    const [step2Form, setStep2Form] = useState<any>({
        company_name: (data?.company_name == undefined || data?.company_name == null) ? "" : data?.company_name,
        start_date: (data?.employment_start_date == undefined || data?.employment_start_date == null) ? null : moment(data?.employment_start_date),
        end_date: (data?.employment_end_date == undefined || data?.employment_end_date == null) ? null : moment(data?.employment_end_date),
        position: (data?.position == undefined || data?.position == null) ? "" : data?.position,
        profession: (data?.profession == undefined || data?.profession == null) ? "" : data?.profession,
        employeeStatus: (data?.is_employed_currently == undefined || data?.is_employed_currently == null) ? false : data?.is_employed_currently
    })

    const [expData, setExpData] = useState<any>(form.getFieldsValue(["experience"]))
    const [disableExp, setDisableExp] = useState(true)
    useEffect(() => {
        let formValue = form.getFieldsValue(["experience"]);
        let userCanGoNextStep = true;

        // let x = formValue?.experience?.map((ex: any, i: any) => {
        //     let isCompanyName = ex?.company_name != undefined && ex?.company_name != "";
        //     let isPosition = ex?.position != undefined && ex?.position != "";
        //     return (isCompanyName && isPosition);
        // })
        // console.log(formValue?.experience, x);


        if (isExperienced) {
            let total = formValue?.experience?.length || 1;
            for (let i = 0; i < total; i++) {
                if (!(formValue?.experience && formValue?.experience[i] != undefined)) {
                    userCanGoNextStep = false;
                    break;
                }
                let isCompanyName = formValue?.experience[i]?.company_name != undefined && formValue?.experience[i]?.company_name != "";
                let isPosition = formValue?.experience[i]?.position != undefined && formValue?.experience[i]?.position != "";
                let isProfession = formValue?.experience[i]?.profession != undefined && formValue?.experience[i]?.profession != "";
                let isStartDate = formValue?.experience[i]?.employment_start_date != undefined && formValue?.experience[i]?.employment_start_date != null && formValue?.experience[i]?.employment_start_date != "";
                let isEndDate = formValue?.experience[i]?.employment_end_date != undefined && formValue?.experience[i]?.employment_end_date != null && formValue?.experience[i]?.employment_start_date != "";
                if (employeeStatus && i == 0) {
                    isEndDate = true;
                }

                if (!(isCompanyName && isPosition && isProfession && isStartDate && isEndDate)) {
                    userCanGoNextStep = false;
                    break;
                }
            }
        }

        setDisableExp(!userCanGoNextStep);
        // !isEmpty(expData?.experience) && expData?.experience?.map((ex: any) => {
        //     if (ex?.company_name != "" && ex?.profession != "" && ex?.position != "" && ex?.employment_start_date != null && ex?.employment_end_date != null) {
        //         setDisableExp(false)
        //     } else {
        //         setDisableExp(true)
        //     }
        // return(

        // )
        // })
    }, [form.getFieldsValue(["experience"]), disableExp])

    // console.log("--------------", disableExp)


    const _preparedWorkExperiance = () => {
        return sideCharMember.experiences.map((ex: any, index: number) => {
            const { id, company_name, position, profession } = ex;
            return {
                id,
                company_name,
                position,
                profession,
                employment_start_date: moment(ex.employment_start_date),
                employment_end_date: ex.employment_end_date == null ? null : moment(ex.employment_end_date),
            }
        });
    }

    // Other States
    const [workExperiance, setWorkExperiance] = useState<any>(_preparedWorkExperiance());
    const [isExperienced, setIsExperienced] = useState<boolean>(() => sideCharMember?.is_experienced == "no" ? false : true);
    const [disabled, setDisabled] = useState<any>(isExperienced ? false : true);

    useEffect(() => {
        if (isExperienced) {
            setStep2Disable(true)
            if (step2Form.profession != "" && step2Form.company_name != "" && step2Form.position != "" && step2Form.start_date != null && step2Form.end_date != null) {
                setStep2Disable(false)
            } else if (step2Form.employeeStatus && (step2Form.profession != "" && step2Form.company_name != "" && step2Form.position != "" && step2Form.start_date != null)) {
                setStep2Disable(false)
            } else {
                setStep2Disable(true)
            }
            // if (!isEmpty(workExperiance)) {
            //     setStep2Disable(false)
            // }
        } else {
            setStep2Disable(false)
        }
        if (employeeStatus) {
            setDateError(false)
        }
        if (!isExperienced) {
            setDateError(false)
        }
    }, [step2Form, step2Disable, isExperienced, employeeStatus])

    const totalInDate = (date: any) => {
        if (date < 12) {
            return `${Math.floor(date)} ${t('workExperienceDate.newMonths')}`
        } else {
            let expInYears = Math.floor(date / 12);
            let expMonths = expInYears * 12;
            let remainingMonths = date - expMonths;

            let yearsStr = `${t('workExperienceDate.newYear')}`;
            let monthStr = `${t('workExperienceDate.newMonths')}`;
            if (expInYears > 1) {
                yearsStr = `${t('workExperienceDate.newYear')}`
            }
            if (remainingMonths > 1) {
                monthStr = `${t('workExperienceDate.newMonths')}`
            }
            if (remainingMonths > 0) {
                return `${Math.floor(expInYears)} ${yearsStr} ${Math.floor(remainingMonths)} ${monthStr}`
            } else {
                return `${Math.floor(expInYears)} ${yearsStr}`
            }
        }
    }
    function monthDiff(dateFrom: any, dateTo: any) {
        return dateTo.getMonth() - dateFrom.getMonth() +
            (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    }
    let total: any = 0
    const displayTotalExp = (key: any) => {
        if (form.getFieldsValue().experience && form.getFieldsValue().experience[key] && form.getFieldsValue().experience[key].employment_start_date && form.getFieldsValue().experience[key].employment_end_date) {
            let empStartDate = form.getFieldsValue().experience[key].employment_start_date;
            let empEndDate = form.getFieldsValue().experience[key].employment_end_date;
            return totalInDate(total = monthDiff(new Date(moment(empStartDate).format("YYYY,MM")), new Date(moment(empEndDate).format("YYYY,MM"))));
        } else {
            return '';
        }
    }

    const displayTotalExp1 = (key: any) => {
        if (form.getFieldsValue().experience && form.getFieldsValue().experience[key] && form.getFieldsValue().experience[key].employment_start_date) {
            let empStartDate = form.getFieldsValue().experience[key].employment_start_date;
            let empEndDate = (form.getFieldsValue().experience[key].employment_end_date == undefined || form.getFieldsValue().experience[key].employment_end_date == null) ? new Date() : form.getFieldsValue().experience[key].employment_end_date;
            return totalInDate(total = monthDiff(new Date(moment(empStartDate).format("YYYY,MM")), new Date(moment(empEndDate).format("YYYY,MM"))));
        } else {
            return '';
        }
    }

    const handleChangeForm = (e: any, key: number) => {
        setExpData(form.getFieldsValue(["experience"]))
        if (key == 1) {
            setStep2Form({ ...step2Form, company_name: e.target.value });
        } else if (key == 2) {
            setStep2Form({ ...step2Form, position: e.target.value });
        } else if (key == 3) {
            setStep2Form({ ...step2Form, profession: e.target.value });
        } else if (key == 4) {
            setStep2Form({ ...step2Form, start_date: e });
        } else if (key == 5) {
            if (e == null) {
                setDateError(true)
            } else {
                setDateError(false)
            }
            setStep2Form({ ...step2Form, end_date: e });
        } else if (key == 6) {

        }
    }
    // need to update form value usign form.setFieldsValue & from -> initialValue
    useEffect(() => {
        form.setFieldsValue({
            isExperienced: isExperienced,
            experience: _preparedWorkExperiance()
        });
    }, [sideCharState.step])

    useEffect(() => {
        if (!isExperienced) {
            form.resetFields();
        }
    }, [isExperienced])

    // Page Level Actions
    const deleteExperience = async (remove: any, name: number) => {
        let exId = form.getFieldsValue().experience[name].id;
        if (exId != undefined) {
            await dispatch(deleteSideCharacterExperienceById(exId));
        }
        remove(name);
    }

    const [required, setRequired] = useState(false)
    const profilePercentage = useSelector((state: State) => state.sideChar.profilePercentage)
    return (
        <Form
            form={form}
            name="dynamic_form_nest_item"
            initialValues={{
                experience: workExperiance
            }}
            layout="vertical"
            className="ft-step ft-step2"
            onFinish={(values) => {
                if (values.experience.length <= 0) {
                    if (isExperienced)
                        setRequired(true)
                    else {
                        onFinish({ employeeStatus, ...values })
                        setRequired(false)
                    }
                } else {
                    onFinish({ employeeStatus, ...values })
                    setRequired(false)
                }
            }}>
            <div className="mb-40">
                <ClientProfilePercentage profilePercentage={profilePercentage} />
            </div>
            <div className="ft-lbl-wrap">
                <div className="left">
                    <span className="ft-lbl">
                        {t('sideCharacterProfile.workExp.Title1')}
                        <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                    </span>
                </div>
            </div>
            <div className="mt-20">
                <Form.Item
                    className=""
                    name="isExperienced"
                    rules={[
                        {
                            required: disabled ? false : true,
                            message: t('index.formItem1.nameRequired'),
                        },
                    ]}
                    initialValue={isExperienced}
                >
                    <Radio.Group
                        defaultValue={isExperienced}
                        className="w-100 ft-radio-ex"
                        value={isExperienced}
                        onChange={(e) => { setIsExperienced(e.target.value) }}
                        name='isExperienced'
                    >
                        <Radio.Button value={false} name='isExperienced' onClick={() => { setDisabled(true) }} className={`${stylessec.bigbtn}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('sideCharacterProfile.workExp.unExp')}</Radio.Button>
                        <Radio.Button value={true} name='isExperienced' onClick={() => { setDisabled(false) }} className={stylessec.bigbtn} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('sideCharacterProfile.workExp.Exp')}</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </div>
            {required ? <div className="ant-form-item-explain ant-form-item-explain-error"><div role="alert"> {t('sideCharacterProfile.workExp.addExp')}</div></div>
                : null}
            {/* Form */}
            <div className="ft-exp-card-wrap">
                <Form.List name="experience" >
                    {(fields, { add, remove }) => {
                        isEmpty(fields) && add()
                        return (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => {
                                    return (
                                        <>
                                            <div className={`ft-exp-card ${disabled ? "ft-disable-exp" : ""}`}>
                                                {/* Company Name */}
                                                <div className="mt-40">
                                                    <div className="ft-lbl-wrap">
                                                        <div className="left">
                                                            <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                                                                {t('index.companyName')}
                                                            </span>
                                                        </div>
                                                        <div className="right">
                                                            <div className={`ft-black-txt ${disabled ? "ft-disable-exp" : ""}`}>
                                                                {t('sideCharacterProfile.workExp.totalExp')}
                                                            </div>
                                                            {name == 0 ?
                                                                <div className={`ft-theme-txt ${disabled ? "ft-disable-exp" : ""}`}>{displayTotalExp1(name) == "" ? t('sideCharacterProfile.workExp.unExp') : displayTotalExp1(name)}</div>
                                                                :
                                                                <div className={`ft-theme-txt ${disabled ? "ft-disable-exp" : ""}`}>{displayTotalExp(name) == "" ? t('sideCharacterProfile.workExp.unExp') : displayTotalExp(name)}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <Form.Item hidden={true} name={[name, 'id']} fieldKey={[fieldKey, 'id']}>
                                                            <Input type="text" disabled={disabled} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'company_name']}
                                                            fieldKey={[fieldKey, 'company_name']}
                                                            className="ft-control-wrap"
                                                            rules={[
                                                                {
                                                                    required: disabled ? false : true,
                                                                    message: t('index.formItem1.nameRequired')
                                                                },
                                                            ]}>
                                                            <Input
                                                                type="text"
                                                                autoComplete="off"
                                                                disabled={disabled} onChange={(e) => handleChangeForm(e, 1)}
                                                                placeholder={t('clientProfile.clientProfileStep2.companyPlaceholder')}
                                                                className="ft-input-control mt-20" />
                                                        </Form.Item>
                                                    </div>
                                                </div>

                                                {/* Employment Period */}
                                                <div className="row">
                                                    <div className="ft-lbl-wrap">
                                                        <div className="left">
                                                            <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                                                                {t('sideCharacterProfile.workExp.employmentPeriod')}
                                                            </span>
                                                        </div>
                                                        <div className="right">
                                                            {/* <Form.Item
                                                                valuePropName="checked"
                                                                name={[name, 'is_employed_currently']}
                                                                fieldKey={[fieldKey, 'is_employed_currently']}
                                                                className="ft-control-wrap">
                                                                <Checkbox name='is_employed_currently' onChange={(e) => console.log(e.target.checked)}>{t('sideCharacterProfile.workExp.employmentCurrent')}</Checkbox>
                                                            </Form.Item> */}
                                                            {name == 0 ? <div className={`ft-budget-nb ft-ne ${employeeStatus ? "ft-check" : ""}`}>
                                                                <input type="checkbox" disabled={disabled} checked={employeeStatus} className="ft-budget-check" onChange={(e) => {
                                                                    setEmployeeStatus(e.target.checked)
                                                                    setStep2Form({ ...step2Form, employeeStatus: e.target.checked });
                                                                }}
                                                                    id="ft-budget-check" />
                                                                <label htmlFor="ft-budget-check">
                                                                    <img src={checkCircle.src} className="grey" />
                                                                    <img src={checkCircleFill.src} className="theme" />
                                                                    <span className="txt">{t('sideCharacterProfile.workExp.employmentCurrent')}</span>
                                                                </label>
                                                            </div> : null}
                                                        </div>
                                                    </div>
                                                    <div className="ft-period-selector mt-20" >
                                                        <div className="col-6" >
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'employment_start_date']}
                                                                fieldKey={[fieldKey, 'employment_start_date']}
                                                                rules={[
                                                                    {
                                                                        required: disabled ? false : true,
                                                                        message: t('index.formItem1.nameRequired')
                                                                    },
                                                                ]}
                                                                className="">
                                                                <DatePicker
                                                                    {...restField}
                                                                    name='employment_start_date'
                                                                    placeholder={`YYYY          |           MM`}
                                                                    suffixIcon={<CaretDownOutlined />}
                                                                    onChange={(e) => handleChangeForm(e, 4)}
                                                                    picker="month"
                                                                    disabled={disabled}
                                                                    disabledDate={(current) => {
                                                                        return current && current > moment().endOf('day');
                                                                    }}
                                                                    style={{ width: "100%", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, height: 48 }} />
                                                            </Form.Item>
                                                        </div>
                                                        <div className="col-6" >
                                                            {name == 0 ?
                                                                <>
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'employment_end_date']}
                                                                        fieldKey={[fieldKey, 'employment_end_date']}
                                                                        className="">
                                                                        <DatePicker
                                                                            {...restField}
                                                                            name='employment_end_date'
                                                                            onChange={(e) => handleChangeForm(e, 5)}
                                                                            placeholder={`YYYY          |           MM`}
                                                                            suffixIcon={<CaretDownOutlined />}
                                                                            picker="month"
                                                                            disabled={disabled || employeeStatus}
                                                                            disabledDate={(current) => {
                                                                                return current && current > moment().endOf('day');
                                                                            }}
                                                                            style={{ width: "100%", borderBottomRightRadius: 10, borderTopRightRadius: 10, height: 48 }} />
                                                                    </Form.Item>
                                                                    {(dateError && step2Form.end_date == null) ? <p className={`fe-input-error`}>{t('index.formItem1.nameRequired')}</p> : null}
                                                                </>
                                                                :
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'employment_end_date']}
                                                                    fieldKey={[fieldKey, 'employment_end_date']}
                                                                    rules={[
                                                                        {
                                                                            required: disabled ? false : true,
                                                                            message: t('index.formItem1.nameRequired')
                                                                        },
                                                                    ]}
                                                                    className="">
                                                                    <DatePicker
                                                                        {...restField}
                                                                        name='employment_end_date'
                                                                        placeholder={`YYYY          |           MM`}
                                                                        onChange={(e) => handleChangeForm(e, 5)}
                                                                        suffixIcon={<CaretDownOutlined />}
                                                                        picker="month"
                                                                        disabledDate={(current) => {
                                                                            return current && current > moment().endOf('day');
                                                                        }}
                                                                        disabled={disabled}
                                                                        style={{ width: "100%", borderBottomRightRadius: 10, borderTopRightRadius: 10, height: 48 }} />
                                                                </Form.Item>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Position */}
                                                <div className="row mt-40">
                                                    <div className="col-12">
                                                        <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                                                            {t('sideCharacterProfile.workExp.position')}
                                                        </span>
                                                    </div>
                                                    <div className="col-12">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'position']}
                                                            fieldKey={[fieldKey, 'position']}
                                                            className="ft-control-wrap"
                                                            rules={[
                                                                {
                                                                    required: disabled ? false : true,
                                                                    message: t('index.formItem1.nameRequired'),
                                                                },
                                                            ]}>
                                                            <Input
                                                                type="text"
                                                                disabled={disabled}
                                                                onChange={(e) => handleChangeForm(e, 2)}
                                                                autoComplete="off"
                                                                placeholder={t('sideCharacterProfile.workExp.profPlaceHolder')}
                                                                className="ft-input-control mt-20" />
                                                        </Form.Item>
                                                    </div>
                                                </div>

                                                {/* Profession */}
                                                <div className="row">
                                                    <div className="col-12">
                                                        <span className={`ft-lbl ${disabled ? "ft-disable-exp" : ""}`}>
                                                            {t('sideCharacterProfile.workExp.profession')}
                                                        </span>
                                                    </div>
                                                    <div className="col-12">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'profession']}
                                                            fieldKey={[fieldKey, 'profession']}
                                                            className="ft-control-wrap ft-h104"
                                                            rules={[
                                                                {
                                                                    required: disabled ? false : true,
                                                                    message: t('index.formItem1.nameRequired'),
                                                                },
                                                            ]}>
                                                            <Input
                                                                type="text"
                                                                disabled={disabled}
                                                                onChange={(e) => handleChangeForm(e, 3)}
                                                                placeholder={t('sideCharacterProfile.workExp.enterPosition')}
                                                                autoComplete="off"
                                                                className="ft-input-control mt-20" />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div className="btn-wrap">
                                                    <div className="ft-del-expbtn">
                                                        <Button
                                                            disabled={disabled}
                                                            onClick={() => { deleteExperience(remove, name) }}
                                                            className={`ft-delete-expbtn ${disabled ? "ft-disable-exp" : ""}`}
                                                        >{t('sideCharacterProfile.workExp.deleteExp')}</Button>
                                                    </div>
                                                    {fields.length == (name + 1) && (
                                                        <div className="ft-add-exbtn">
                                                            <Button onClick={() => {
                                                                add()
                                                            }} disabled={disabled} className={`ft-default-grey-btn ${disabled ? "ft-disable-exp" : ""}`} >{t('sideCharacterProfile.workExp.addExp')}</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>)
                                })}
                                {fields.length == 0 && (
                                    <div className="ft-add-exbtn">
                                        <Button onClick={() => add()} disabled={disabled} className={`ft-default-grey-btn ${disabled ? "ft-disable-exp" : ""}`} >{t('sideCharacterProfile.workExp.addExp')}
                                        </Button>
                                    </div>
                                )}

                            </>
                        )
                    }}
                </Form.List>
            </div>

            {/* Next & Go Back Button */}
            <div className="row ft-step23-btn mt-60">
                <Button
                    className="ft-step-prev-btn"
                    onClick={() => { onPreviousBtn('1') }} >
                    {t('clientProfile.clientProfileStep2.prevBtn')}
                </Button>
                <Form.Item shouldUpdate style={{ width: "auto", padding: 0 }}>
                    <Button
                        loading={stepComplete}
                        type="primary"
                        htmlType="submit"
                        disabled={disableExp}
                        className="ft-step-next-btn"
                        style={
                            // form.isFieldsTouched(true) ||
                            disableExp ?
                                { background: '#EAEAEA', borderColor: "#EAEAEA" } :
                                { background: '#00D6E3', borderColor: "#00D6E3" }} >
                        {t('clientProfile.clientProfileStep2.nextBtn')}
                    </Button>
                </Form.Item>
            </div>
        </Form>
    )
}

export default SideCharacterStep2