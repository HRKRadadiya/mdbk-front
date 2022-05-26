
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Registration.module.css'
import { Button, Progress, Radio, Form } from 'antd';
import stylessec from '../../styles/searchdetail.module.css';
import { useTranslation } from 'next-i18next';
import ClientProfilePercentage from '../clientProfilePercentage';
import { State } from '../../redux/reducers/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Modal } from 'react-bootstrap'
import { isEmpty } from '../../utils/helper';

interface IProps {
    stepComplete: boolean;
    onFinish: Function;
    onPreviousBtn: Function;
    formError: any;
}

function SideCharStep3({ onFinish, onPreviousBtn, stepComplete, formError }: IProps) {

    const [form] = Form.useForm();
    const { t } = useTranslation();
    const router = useRouter()
    const dispatch = useDispatch()
    const sideCharState = useSelector((state: State) => state.sideChar)
    const sideCharMember = sideCharState.step;
    const _preparedStep3Info = () => {
        return {
            desired_date: sideCharMember.desired_date,
            desired_time: sideCharMember.desired_time,
            desired_project_type: sideCharMember.desired_project_type,
            insurance_status: sideCharMember.insurance_status,
            desired_work_type: sideCharMember.desired_work_type,
        }
    }

    const [formInitialValues, setFormInitialValues] = useState(_preparedStep3Info())
    const [step3Disable, setStep3Disable] = useState<boolean>(true)
    const [step3Form, setStep3Form] = useState<any>({
        desired_date: sideCharMember.desired_date,
        desired_time: sideCharMember.desired_time,
        desired_project_type: sideCharMember.desired_project_type,
        insurance_status: sideCharMember.insurance_status,
        desired_work_type: sideCharMember.desired_work_type,
    })
    useEffect(() => {
        if (!isEmpty(step3Form.desired_date) && !isEmpty(step3Form.desired_time) && !isEmpty(step3Form.desired_project_type) && !isEmpty(step3Form.insurance_status) && !isEmpty(step3Form.desired_work_type)) {
            setStep3Disable(false)
        } else {
            setStep3Disable(true)
        }
    }, [step3Form, step3Disable])

    const handleChangeForm = (e: any, key: number) => {
        if (key == 1) {
            setStep3Form({ ...step3Form, desired_date: e.target.value });
        } else if (key == 2) {
            setStep3Form({ ...step3Form, desired_time: e.target.value });
        } else if (key == 3) {
            setStep3Form({ ...step3Form, desired_project_type: e.target.value });
        } else if (key == 4) {
            setStep3Form({ ...step3Form, insurance_status: e.target.value });
        } else if (key == 5) {
            setStep3Form({ ...step3Form, desired_work_type: e.target.value });
        }
    }

    useEffect(() => {
        form.setFieldsValue(_preparedStep3Info());
    }, [sideCharState.step])
    const profilePercentage = useSelector((state: State) => state.sideChar.profilePercentage)

    return (
        <>
            <Form
                form={form}
                initialValues={formInitialValues}
                name="step3"
                className="ft-step ft-step3"
                onFinish={(values) => {
                    onFinish(values)
                }}>
                <div className="mb-40">
                    <ClientProfilePercentage profilePercentage={profilePercentage} />
                </div>

                {/* Desired Date* */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep3.dateLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    </div>
                </div>
                <div className="ft-h134 at-h60">
                    <div className="mt-20">
                        <Form.Item name="desired_date" >
                            <Radio.Group onChange={(e) => handleChangeForm(e, 1)} name="desired_date" className="w-100 ft-db-select">
                                <Radio.Button value='weekdays' name="desired_date" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('clientProfile.clientProfileStep3.weekdaysLabel')}</Radio.Button>
                                <Radio.Button value='weekend' name="desired_date" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('clientProfile.clientProfileStep3.weekendLabel')}</Radio.Button>
                                <Radio.Button value='weekdays-weekend' name="desired_date" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('clientProfile.clientProfileStep3.weekday/end')}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {formError != null && formError.desired_date ? <div className="ant-form-item-explain ant-form-item-explain-error"><div role="alert"> {formError.desired_date}</div></div> : null}
                </div>

                {/* Desired Time* */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep3.timeLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    </div>
                </div>
                <div className="ft-h134 at-h60">
                    <div className="mt-20">
                        <Form.Item name="desired_time">
                            <Radio.Group onChange={(e) => handleChangeForm(e, 2)} name="desired_time" className="w-100 ft-db-select">
                                <Radio.Button value='morning' name="desired_time" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('clientProfile.clientProfileStep3.morningLabel')}</Radio.Button>
                                <Radio.Button value='afternoon' name="desired_time" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('clientProfile.clientProfileStep3.noonLabel')}</Radio.Button>
                                <Radio.Button value='evening' name="desired_time" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('clientProfile.clientProfileStep3.eveLabel')}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {formError != null && formError.desired_time ? <div className="ant-form-item-explain ant-form-item-explain-error"><div role="alert"> {formError.desired_time}</div></div> : null}
                </div>

                {/* What is your desired project type?* */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep3.projectLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    </div>
                </div>
                <div className="ft-h170">
                    <div className="mt-20">
                        <Form.Item name="desired_project_type">
                            <Radio.Group onChange={(e) => handleChangeForm(e, 3)} name="desired_project_type" className="w-100 ft-db-select ft-project-type">
                                <Radio.Button value={'short-term'} name="desired_project_type" className={`${stylessec.bigbtn} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
                                    <div className="ft-txt-wrap at-wrap-fixed">
                                        <p>
                                            <div className={`${stylessec.firsttext} ft-first`}>{t('clientProfile.clientProfileStep3.shortTermProject')}</div>
                                            <div className={`${stylessec.sectext} ft-sec`}>{t('clientProfile.clientProfileStep3.less3Mon')}</div>
                                        </p>
                                    </div>
                                </Radio.Button>
                                <Radio.Button value={'long-term'} name="desired_project_type" className={`${stylessec.bigbtn} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px", fontWeight: "bold" }}>
                                    <div className="ft-txt-wrap at-wrap-fixed">
                                        <p>
                                            <div className={`${stylessec.firsttext} ft-first`} >{t('clientProfile.clientProfileStep3.longTermLabel')}</div>
                                            <div className={`${stylessec.sectext} ft-sec`}>{t('clientProfile.clientProfileStep3.more3month')}</div>
                                        </p>
                                    </div>
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {formError != null && formError.desired_project_type ? <div className="ant-form-item-explain ant-form-item-explain-error"><div role="alert"> {formError.desired_project_type}</div></div> : null}
                </div>

                {/* Can you provide insurance?* */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep3.insuranceLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    </div>
                </div>
                <div className="ft-h134 at-h60">
                    <div className="mt-20">
                        <Form.Item name="insurance_status" >
                            <Radio.Group onChange={(e) => handleChangeForm(e, 4)} name="insurance_status" className="w-100 ft-db-select">
                                <Radio.Button value='available' name="insurance_status" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", width: "50%" }}>{t('clientProfile.clientProfileStep3.avilbleLabel')}</Radio.Button>
                                <Radio.Button value='unavailable' name="insurance_status" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px", width: "50%" }}>{t('clientProfile.clientProfileStep3.unavailable')}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {formError != null && formError.insurance_status ? <div className="ant-form-item-explain ant-form-item-explain-error"><div role="alert"> {formError.insurance_status}</div></div> : null}
                </div>

                {/* What is your desired work type?* */}
                <div className="ft-lbl-wrap">
                    <div className="left">
                        <span className="ft-lbl">
                            {t('clientProfile.clientProfileStep3.workTypeLabel')}
                            <span className="ft-required-dot ml-10" style={{ verticalAlign: "text-top" }}></span>
                        </span>
                    </div>
                </div>
                <div className="mt-20">
                    <Form.Item name="desired_work_type" >
                        <Radio.Group onChange={(e) => handleChangeForm(e, 5)} name="desired_work_type" className="w-100 ft-db-select">
                            <Radio.Button value='workfrom-office' name="desired_work_type" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", width: "50%" }}>{t('clientProfile.clientProfileStep3.fromOfc')}</Radio.Button>
                            <Radio.Button value='workfrom-home' name="desired_work_type" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px", width: "50%" }}>{t('clientProfile.clientProfileStep3.workHome')}</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </div>
                {formError != null && formError.desired_work_type ? <div className="ant-form-item-explain ant-form-item-explain-error"><div role="alert"> {formError.desired_work_type}</div></div> : null}

                {/* Save Button */}
                <div className="row ft-step23-btn mt-60">
                    <Button onClick={() => { onPreviousBtn('2') }} className="ft-step-prev-btn" >
                        {t('clientProfile.clientProfileStep2.prevBtn')}
                    </Button>

                    <Button
                        loading={stepComplete}
                        type="primary"
                        htmlType="submit"
                        disabled={step3Disable}
                        className={step3Disable ? "ft-step-next-btn disable" : "ft-step-next-btn"}
                        style={{ background: '#00D6E3', borderColor: "#00D6E3" }}
                    >
                        {t('clientProfile.clientProfileStep3.cmpltBtn')}
                    </Button>
                </div>
            </Form>

        </>

    )


}

export default SideCharStep3