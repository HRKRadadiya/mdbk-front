import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../../components';
import { Button, Checkbox, Form, Input, Upload, Select, Radio, message } from 'antd';
import ClientProfilePercentage from '../../../components/clientProfilePercentage';
import camera from '../../../public/camera.svg'
import checkCircle from '../../../public/check-circle.svg'
import checkCircleFill from '../../../public/check-circle-fill.svg'
import stylessec from '../../../styles/searchdetail.module.css';
import Image from 'next/image'
import router from 'next/router';
import { projectCreatePercentage } from '../../../redux/actions/memberAction';
import { useDispatch, useSelector } from 'react-redux';
import { getDistricts, getProvinces } from '../../../redux/actions';
import { State } from '../../../redux/reducers/rootReducer';
import { PROJECT } from '../../../constants/api';
import { ApiMemberDelete, ApiMemberGet, ApiMemberPost, ApiMemberPut } from '../../../service/api';
import { TOKEN } from '../../../constants/storagekey';
import Storage from '../../../service/storage';
import _ from 'lodash';
import { DateRange } from 'react-date-range'
import { format } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment';
import useDidMountEffect from '../../../hooks/useDidMountEffect';
import { getUrl } from '../../../utils/helper';
import { Modal } from 'react-bootstrap'
import NumberFormat from 'react-number-format';


function ProjectEditPage() {
    const MAX_VAL = 999999999;
    const withValueCap = (inputObj: any) => {
        const { value } = inputObj;
        if (value <= MAX_VAL) return true;
        return false;
    };
    const { t } = useTranslation();
    const { Option } = Select
    const { id } = router.query
    const [step, setStep] = useState(1)
    const dispatch = useDispatch()
    const [form] = Form.useForm(); let a: any;
    const [fileList, setFileList] = useState<any>([])
    const provinceData = useSelector((state: State) => state.client.provinces)
    const cityData = useSelector((state: State) => state.client.districts)
    const userData = useSelector((state: State) => state.auth.userData)
    const [editComplete, setEditComplete] = useState(false)
    const token = Storage.get(TOKEN)
    const currentLanguage = router.locale ?? 'kr'
    const [currentDates, setCurrentDates] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [getData, setGetData] = useState<boolean>(false)
    const [projectInformation, setProjectInformation] = useState<any>({
        profession: "",
        field: "",
        current_planning_stage: "",
        direct_input: "",
        suggested_amount: "",
        is_negotiable: "no",
        schedule: "",
        city: 1,
        district: 100,
        work_related_details: "",
        member_id: userData.member.id,
        schedule_direct_start_date: "",
        schedule_direct_end_date: ""
    })

    const [startDate, setStartDate] = useState<any>()
    const [endDate, setEndDate] = useState<any>()
    const [amountDisable, setAmountDisable] = useState(false)

    const isStepDisabled = (step: number) => {
        if (step == 1) {
            return !(projectInformation.profession != "" && projectInformation.field != "")
        }
        if (step == 2) {
            if (projectInformation.current_planning_stage != "other") {
                return !(projectInformation.current_planning_stage != "" && fileList.length > 0)
            }
            else
                return !(projectInformation.direct_input != "" && fileList.length > 0)
        }
        if (step == 3) {
            return !((projectInformation.suggested_amount != "" && projectInformation.suggested_amount != "0") || projectInformation.is_negotiable != "no")
        }
        if (step == 4) {
            return !(projectInformation.schedule != "")
        }
        if (step == 5) {
            return !(projectInformation.city != "" && projectInformation.district != "")
        }
        if (step == 6) {
            return !(projectInformation.work_related_details != "")
        }
    }

    const handleEditDone = () => {
        router.push(getUrl(router.locale, PROJECT))
    }

    const _preparedReletedImage = (project_images: any) => {
        return project_images.map((ex: any) => {
            const { file_path, id, file_name } = ex;
            return {
                uid: id,
                name: file_name,
                status: 'done',
                url: file_path
            }
        });
    }

    const handleDeleteImage = async (e: any) => {
        await ApiMemberPut(`${PROJECT}/${id}`, {
            delete_project_image_id: e.uid
        }).then(async (response: any) => {
            if (response.data && response.success) {

            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }


    const _getProjectDetail = async () => {
        await ApiMemberGet(`${PROJECT}/${id}`)
            .then(async (response: any) => {
                if (response.data && response.success) {
                    setProjectInformation({
                        profession: response.data.project.profession,
                        field: response.data.project.field,
                        current_planning_stage: response.data.project.current_planning_stage,
                        direct_input: response.data.project.direct_input,
                        is_negotiable: response.data.project.is_negotiable,
                        suggested_amount: response.data.project.suggested_amount,
                        schedule: response.data.project.schedule,
                        schedule_direct_start_date: response.data.project.schedule_direct_start_date,
                        schedule_direct_end_date: response.data.project.schedule_direct_end_date,
                        city: parseInt(response.data.project.city),
                        district: parseInt(response.data.project.district),
                        work_related_details: response.data.project.work_related_details
                    })
                    setFileList(_preparedReletedImage(response.data.project.project_images))
                    setStartDate(new Date(response.data.project.schedule_direct_start_date))
                    setEndDate(new Date(response.data.project.schedule_direct_end_date))
                    setAmountDisable(response.data.project.is_negotiable == "yes" ? true : false)
                    // updateForm()
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    useEffect(() => {
        updateForm()
    }, [projectInformation])

    useEffect(() => {
        _getProjectDetail()
    }, [])

    function updateForm() {
        if (projectInformation.profession != "") {
            setGetData(true)
            form.setFieldsValue({
                profession: projectInformation.profession,
                field: projectInformation.field,
                current_planning_stage: projectInformation.current_planning_stage,
                direct_input: projectInformation.direct_input,
                suggested_amount: projectInformation.suggested_amount,
                schedule: projectInformation.schedule,
                rangeDate: `${projectInformation.schedule_direct_start_date} - ${projectInformation.schedule_direct_end_date}`,
                city: parseInt(projectInformation.city),
                district: parseInt(projectInformation.district),
                work_related_details: projectInformation.work_related_details
            })
        }
        // setProjectInformation({ ...projectInformation, is_negotiable: projectInformation.is_negotiable })
    }

    useEffect(() => {
        setProjectInformation({ ...projectInformation, schedule_direct_start_date: moment(startDate).format("YYYY.MM.DD"), schedule_direct_end_date: moment(endDate).format("YYYY.MM.DD") })
        setCurrentDates(`${moment(startDate).format("YYYY.MM.DD")} - ${moment(endDate).format("YYYY.MM.DD")}`)
        form.setFieldsValue({
            rangeDate: currentDates
        })
    }, [startDate, endDate, currentDates, setCurrentDates])

    useEffect(() => {
        dispatch(getProvinces())
        dispatch(getDistricts())
    }, []);

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

    const handleEdit = async () => {
        setLoading(true)
        let filterImage = fileList.filter((item: any, index: number) => Number.isInteger(item.uid) != true)
        const formData = new FormData();
        for (var x = 0; x < filterImage.length; x++) {
            formData.append("project_images", filterImage[x].originFileObj);
        }

        _.each(projectInformation, (value, key) => {
            formData.append(key, value);
        })


        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
                'content-type': 'multipart/form-data'
            }
        }

        await ApiMemberPut(`${PROJECT}/${id}`, formData, config).then((response: any) => {
            if (response.data && response.success) {
                setEditComplete(true)
                setLoading(false)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => console.log("Error", error))
    }

    const handleSet = (ranges: any) => {
        setStartDate(ranges.selection.startDate)
        setEndDate(ranges.selection.endDate)
    }

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
    }
    return (
        <AppLayout title={t('projectRegistrationClient.pageTitle')} whiteHeader={true}>
            {(projectInformation && getData) && <div className="fe-page-outer ft-project-create-page">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <h1 className='ft-heading'>
                            {step == 1 && t('projectCreation.ProjectProfession/Field?')}
                            {step == 2 && t('projectCreation.CurrentPlanningStage?')}
                            {step == 3 && t('projectCreation.Budget?')}
                            {step == 4 && t('projectCreation.Schedule?')}
                            {step == 5 && t('projectCreation.DesiredLocation?')}
                            {step == 6 && t('projectCreation.OtherDetails')}
                        </h1>
                        <div className="ft-post-project-card ft-search-form-wrapper">
                            <Form form={form} name="post-project" className="ft-post-project-form">
                                <ClientProfilePercentage profilePercentage={100} />
                                {step == 1 && (
                                    <div className="ft-pp-step ft-pp-step1">
                                        <div className="col-12 fd1" >
                                            <span className="w-100">
                                                <Form.Item name="profession" >
                                                    <Radio.Group name="profession" onChange={(e) => setProjectInformation({ ...projectInformation, profession: e.target.value })} className="w-100 ft-db-select four">
                                                        <Radio.Button value="development" name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('common.Development')}</Radio.Button>
                                                        <Radio.Button value='design' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('common.Design')}</Radio.Button>
                                                        <Radio.Button value='marketing' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('common.Marketing')}</Radio.Button>
                                                        <Radio.Button value='other' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('common.Other')}</Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </span>
                                        </div>

                                        <div className="row fd2">
                                            <div className="col-12">
                                                <span className="ft-lbl">
                                                    {t('featureSearch.Field')}
                                                </span>
                                            </div>
                                            <div className="col-12">
                                                <Form.Item
                                                    name="field"
                                                    className="ft-control-wrap"
                                                >
                                                    <Input
                                                        placeholder={t('featureSearch.Enterfield')}
                                                        className="ft-input-control mt-20"
                                                        value={projectInformation.field}
                                                        onChange={(e) => setProjectInformation({ ...projectInformation, field: e.target.value })}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        <div className="ft-pp-btn-wrap">
                                            <Button disabled={isStepDisabled(1)} className={`ft-pp-next-btn ${isStepDisabled(1) ? "disable" : ""}`} onClick={() => {
                                                setStep(2)
                                            }}>
                                                {t('projectCreation.Next')}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* step2 */}

                                {step == 2 && (
                                    <div className="ft-pp-step ft-pp-step2">
                                        <div className="col-12 fd1" >
                                            <span className="w-100">
                                                <Form.Item name="current_planning_stage" >
                                                    <Radio.Group name="profession" onChange={(e) => setProjectInformation({ ...projectInformation, current_planning_stage: e.target.value })} className="w-100 ft-db-select four">
                                                        <Radio.Button value='idea-ready' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('projectCreation.IdeaReady')}</Radio.Button>
                                                        <Radio.Button value='content-organization-complete' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('projectCreation.ContentOrganizationComplete')}</Radio.Button>
                                                        <Radio.Button value='detailed-plan-ready' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('projectCreation.DetailedPlanReady')}</Radio.Button>
                                                        <Radio.Button value='other' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('projectCreation.Other')}</Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </span>
                                        </div>

                                        {/* direct input */}
                                        <div className="row fd2">
                                            <div className="col-12">
                                                <Form.Item
                                                    name="direct_input"
                                                    className="ft-control-wrap"
                                                >
                                                    <Input
                                                        disabled={projectInformation.current_planning_stage != "other" ? true : false}
                                                        placeholder={t('projectCreation.Directinput')}
                                                        value={projectInformation.direct_input}
                                                        onChange={(e) => setProjectInformation({ ...projectInformation, direct_input: e.target.value })}
                                                        className="ft-input-control mt-20"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        {/* Images */}
                                        <div className="fd3">
                                            <div className="ft-lbl-wrap">
                                                <div className="left">
                                                    <span className="ft-lbl">
                                                        {t('projectCreation.Pleaseuploadimagesofplan')}
                                                    </span>
                                                </div>
                                                <div className="right">
                                                    <span>({t('projectCreation.10MBorless')} - {t('projectCreation.Fileformat')}JPG,PNG,PDF)</span>
                                                </div>
                                            </div>
                                            <div className="row mt-20">
                                                <div className="col-12">
                                                    <Upload
                                                        name="introductryImg"
                                                        listType="picture-card"
                                                        className="introductoryUpload ft-introductory-image"
                                                        fileList={fileList}
                                                        onRemove={handleDeleteImage}
                                                        multiple
                                                        maxCount={3}
                                                        beforeUpload={beforeUpload}
                                                        onChange={({ fileList: newFileList }) => {
                                                            setFileList(newFileList);
                                                        }}
                                                    >
                                                        {fileList.length >= 3 ? null : (<div>
                                                            <Image src={camera} alt="Profile Image" width={38} height={30} />
                                                        </div>)}
                                                    </Upload>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ft-pp-btn-wrap">
                                            <Button className="ft-pp-prev-btn" onClick={() => setStep(1)}>
                                                {t('projectCreation.Previous')}
                                            </Button>
                                            <Button disabled={isStepDisabled(2)} className={`ft-pp-next-btn ${isStepDisabled(2) ? "disable" : ""}`} onClick={() => {

                                                setStep(3)
                                            }}>
                                                {t('projectCreation.Next')}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* step3 */}
                                {step == 3 && (
                                    <div className="ft-pp-step ft-pp-step3">
                                        {/* budget */}
                                        <div className="row fd1">
                                            <div className="col-12">
                                                <span className="ft-lbl">
                                                    {t('projectCreation.SuggestedAmount')}
                                                </span>
                                            </div>
                                            <div className="col-12 mt-20">
                                                <div className="ft-bugget">
                                                    <Form.Item
                                                        name="suggested_amount"
                                                        className={`ft-control-wrap ${amountDisable ? "disable" : ""}`}
                                                    >
                                                        <NumberFormat thousandSeparator={true}
                                                            disabled={amountDisable}
                                                            isAllowed={withValueCap}
                                                            placeholder="0"
                                                            autoComplete="off"
                                                            value={projectInformation.suggested_amount}
                                                            className={`ft-input-control ${router.locale == "kr" ? "kr" : "en"}`}
                                                            onValueChange={(value: any) => {
                                                                setProjectInformation({ ...projectInformation, suggested_amount: value.value })
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    <div className="ft-sug-amt">
                                                        <span className={`txt ${amountDisable ? "disable" : ""}`}>{t('projectCreation.won')}</span>
                                                    </div>
                                                </div>
                                                <div className={`ft-budget-nb ft-ne ${amountDisable ? "ft-check" : ""}`}>
                                                    <input type="checkbox" className="ft-budget-check" id="ft-budget-check" checked={projectInformation.is_negotiable == "yes" ? true : false} onChange={(e) => {
                                                        e.target.checked ? setProjectInformation({ ...projectInformation, is_negotiable: 'yes', suggested_amount: 0 }) : setProjectInformation({ ...projectInformation, is_negotiable: 'no' })
                                                        setAmountDisable(e.target.checked)
                                                    }} />
                                                    <label htmlFor="ft-budget-check">
                                                        <img src={checkCircle.src} className="grey" />
                                                        <img src={checkCircleFill.src} className="theme" />
                                                        <span className="txt">{t('projectCreation.Negotiable')}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ft-pp-btn-wrap">
                                            <Button className="ft-pp-prev-btn" onClick={() => setStep(2)}>
                                                {t('projectCreation.Previous')}
                                            </Button>
                                            <Button disabled={isStepDisabled(3)} className={`ft-pp-next-btn ${isStepDisabled(3) ? "disable" : ""}`} onClick={() => {
                                                setStep(4)
                                            }}>
                                                {t('projectCreation.Next')}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* step4 */}
                                {step == 4 && (
                                    <div className="ft-pp-step ft-pp-step4">
                                        <div className="col-12 fd1" >
                                            <span className="w-100">
                                                <Form.Item name="schedule" >
                                                    <Radio.Group name="profession" onChange={(e) => setProjectInformation({ ...projectInformation, schedule: e.target.value })} className="w-100 ft-db-select four">
                                                        <Radio.Button value='negotiable' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>{t('projectCreation.Negotiable')}</Radio.Button>
                                                        <Radio.Button value='asap' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('projectCreation.ASAP')}</Radio.Button>
                                                        <Radio.Button value='not-hurry' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`}>{t('projectCreation.Notinahurry')}</Radio.Button>
                                                        <Radio.Button value='direct' name="profession" className={`${stylessec.radiobtntxt2} ft-db-option`} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>{t('projectCreation.DirectInput')}</Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </span>
                                        </div>
                                        <div className="col-12">
                                            <Form.Item
                                                name="rangeDate"
                                                initialValue={currentDates}
                                                className="ft-control-wrap"
                                            >
                                                <Input
                                                    placeholder={t('projectCreation.Directinput')}
                                                    defaultValue={currentDates}
                                                    disabled={projectInformation.schedule != "direct" ? true : false}
                                                    value={currentDates}
                                                    // onChange={handleDateChange}
                                                    className="ft-input-control mt-20"
                                                />
                                            </Form.Item>
                                        </div>
                                        {/* schedule date */}
                                        <div className="row ft-schedule-date-outer">
                                            <div className="col-12">
                                                {projectInformation.schedule != "direct" &&
                                                    <DateRange
                                                        locale={currentLanguage == "en" ? enUS : ko}
                                                        minDate={new Date()}
                                                        maxDate={new Date()}
                                                        onChange={() => console.log("==")}
                                                        moveRangeOnFirstSelection={false}
                                                        editableDateInputs={true}
                                                        className="ft-daterange-picker hk-date-color"
                                                    />
                                                }
                                                {projectInformation.schedule == "direct" && <DateRange
                                                    locale={currentLanguage == "en" ? enUS : ko}
                                                    ranges={[selectionRange]}
                                                    minDate={new Date()}
                                                    rangeColors={["#00D6E3"]}
                                                    onChange={handleSet}
                                                    moveRangeOnFirstSelection={false}
                                                    editableDateInputs={true}
                                                    className="ft-daterange-picker"
                                                    showSelectionPreview={false}
                                                />
                                                }
                                            </div>
                                        </div>
                                        <div className="ft-pp-btn-wrap">
                                            <Button className="ft-pp-prev-btn" onClick={() => setStep(3)}>
                                                {t('projectCreation.Previous')}
                                            </Button>
                                            <Button disabled={isStepDisabled(4)} className={`ft-pp-next-btn ${isStepDisabled(4) ? "disable" : ""}`} onClick={() => {

                                                setStep(5)
                                            }}>
                                                {t('projectCreation.Next')}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* step 5  */}
                                {step == 5 && (
                                    <div className="ft-pp-step ft-pp-step5">
                                        {/* city */}
                                        <div className="row" >
                                            <div className="col-6 fd1">
                                                <Form.Item name="city">
                                                    <Select

                                                        placeholder={t('projectCreation.SelectCity')}
                                                        className="new-select-box ft-select-control"
                                                        onChange={(value) => {
                                                            setProjectInformation({
                                                                ...projectInformation,
                                                                city: value,
                                                                district: 0
                                                            });
                                                        }}
                                                    >
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
                                            <div className="col-6 fd2">
                                                <div className="dropdown">
                                                    <Form.Item name="district">
                                                        <Select
                                                            placeholder={t('projectCreation.SelectDistrict')}
                                                            className="new-select-box ft-select-control"
                                                            onChange={(value) => {
                                                                setProjectInformation({
                                                                    ...projectInformation,
                                                                    district: value
                                                                });
                                                            }}
                                                        >
                                                            {cityData.filter((c: any) => c.province_id == projectInformation.city).map((city: any) => (
                                                                <Option key={city.id} value={city.id}>{city.name}</Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ft-pp-btn-wrap">
                                            <Button className="ft-pp-prev-btn" onClick={() => setStep(4)}>
                                                {t('projectCreation.Previous')}
                                            </Button>
                                            <Button disabled={isStepDisabled(5)} className={`ft-pp-next-btn ${isStepDisabled(5) ? "disable" : ""}`} onClick={() => {

                                                setStep(6)
                                            }}>
                                                {t('projectCreation.Next')}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* step 6 */}
                                {step == 6 && (
                                    <div className="ft-pp-step ft-pp-step6">
                                        {/* field */}
                                        <div className="row fd1">
                                            <div className="col-12">
                                                <Form.Item
                                                    name="work_related_details"
                                                    className="ft-control-wrap ft-work-detail"
                                                >
                                                    <Input.TextArea
                                                        rows={4}
                                                        value={projectInformation.work_related_details}
                                                        onChange={(e) => setProjectInformation({ ...projectInformation, work_related_details: e.target.value })}
                                                        placeholder={t('projectCreation.Enterworkrelateddetails')}
                                                        className="ft-textarea-control mt-20 fe-rezise-text" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className="ft-pp-btn-wrap">
                                            <Button className="ft-pp-prev-btn" onClick={() => setStep(5)}>
                                                {t('projectCreation.Previous')}
                                            </Button>
                                            <Button loading={loading} disabled={isStepDisabled(6)} className={`ft-pp-next-btn ${isStepDisabled(6) ? "disable" : ""}`} onClick={handleEdit}>
                                                {isStepDisabled(6) ? t('projectCreation.Next') : t('projectCreation.Finish')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            }
            <Modal
                show={editComplete}
                onHide={handleEditDone}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-profile-edit-complete"
                centered
            >
                <Modal.Header closeButton className="ft-pop-header">
                    <Modal.Title>{t('popUps.editProject.ProjectEditComplete')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ft-pop-body">
                    <div className="desc">
                        {t('popUps.editProject.Youfinishededitingproject')}
                    </div>
                </Modal.Body>
                <Modal.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={handleEditDone}>
                        {t('popUps.editProject.Confirm')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default ProjectEditPage;
