import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button, Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../../components';
import { MEMBER_LIKE_UNLIKE, MEMBER_REPORT_UNREPORT, PROJECT_PROJECT_APPLICATION_DETAILS, REQUEST, REQUEST_CREATE, REQUEST_ID_CHANGE_STATUS } from '../../../constants/api';
import { Modal as BootstrapModel } from 'react-bootstrap'
import router from 'next/router';
import { ApiMemberGet, ApiMemberPost } from '../../../service/api';
import { getUrl, isEmpty, numberWithCommas, phoneNumberMasking } from '../../../utils/helper';
import WorkExpSideCharecter from '../../../components/workExpSideCharecter';
import { LIKE_TYPE_CLIENT, LIKE_TYPE_REQUEST_CONTACT_INFORMATION, LIKE_TYPE_REQUEST_INTERVIEW, LIKE_TYPE_SIDE_CHARACTER, PROJECT_EVENT } from '../../../constants/keywords';
import { useSelector } from 'react-redux';
import { State } from '../../../redux/reducers/rootReducer';
import { KEYWORDS } from '../../../constants';
import { BCOINGUIDE, PROJECT_ID_PROPOSAL } from '../../../constants/routes';

function receive() {
    const userData = useSelector((state: State) => state.auth.userData)
    const { t } = useTranslation();
    const { Option } = Select
    const [renderingType, setrenderingType] = useState(userData?.registration_type == 1 ? true : false);
    const [isLike, setIsLike] = useState<boolean>()
    const { id } = router.query
    const memberid = useSelector((state: State) => state.auth.userData.member.id)
    const [companyField, setCompanyField] = useState<any>()
    const [reportCounter, setReportCounter] = useState<number>(0)
    const locationDataProvinces = useSelector((state: State) => state.client.provinces)
    const locationDataDistricts = useSelector((state: State) => state.client.districts)
    const [likeCounter, setLikeCounter] = useState<number>(0)
    const [companyProvices, setCompanyProvices] = useState<any>()
    const [companyDistricts, setCompanyDistricts] = useState<any>()
    const [provices, setProvices] = useState<any>()
    const [isCoin, setIsCoin] = useState(false)
    const [field, setField] = useState<any>()
    const [districts, setDistricts] = useState<any>()
    const [projectApplicationStatus, setProjectApplicationStatus] = useState("")
    const [requestDetails, setRequestDetails] = useState<any>()
    const [sideCharFilter, setSideCharFilter] = useState({
        request_type: "receive",
        registration_type: userData?.registration_type
    })

    const gotoPurchase = () => {
        router.push(getUrl(router.locale, BCOINGUIDE))
    };

    const getSideCharecterDetail = async () => {
        await ApiMemberGet(`${REQUEST}/${id}`, sideCharFilter)
            .then(async (response: any) => {
                if (response.data && response.success) {
                    setProjectApplicationStatus(response.data?.profile?.request?.status)
                    setRequestDetails(response.data)
                    setIsLike(response.data.profile.like_flag)
                    setLikeCounter(response.data.profile.total_likes)
                    setReportCounter(response.data.profile.report_count)

                    await setProvices(locationDataProvinces.find((provinces: any) => (
                        provinces.id == response.data.profile.locations[0].city
                    )))
                    await setDistricts(locationDataDistricts.filter((districts: any) => (
                        districts.id == response.data.profile.locations[0].district
                    )))

                    let companyfield = "";
                    if (response.data.profile.company != null) {
                        response.data.profile?.company?.fields.map((ex: any) => {
                            companyfield = companyfield + `${ex}/`
                        })
                        setCompanyField(companyfield.slice(0, -1))
                        await setCompanyProvices(locationDataProvinces.find((provinces: any) => (
                            provinces.id == response.data.profile?.company?.locations[0]?.city
                        )))
                        await setCompanyDistricts(locationDataDistricts.filter((districts: any) => (
                            districts.id == response.data.profile?.company?.locations[0]?.district
                        )))
                    }

                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    const handleRequest = async (e: React.MouseEvent<HTMLElement, MouseEvent>, key: string, id: number) => {
        await ApiMemberPost(REQUEST_ID_CHANGE_STATUS.replace('%id%', id + ""), {
            status: key,
            registration_type: userData?.registration_type
        })
            .then((response: any) => {
                if (response.data && response.success) {
                    key == PROJECT_EVENT.ACCEPTED ? setProjectApplicationStatus(PROJECT_EVENT.ACCEPTED) : setProjectApplicationStatus(PROJECT_EVENT.REJECTED)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                if (error?.code == 400 && error?.error?.is_enough_coin == false && error?.error?.is_free_request == false) {
                    console.log("Error", error)
                    setIsCoin(true);
                }
            })
    }

    const handleReport = async (id: number) => {
        let data;
        userData?.registration_type == 2 ?
            data = {
                report_type: LIKE_TYPE_REQUEST_CONTACT_INFORMATION,
                source_id: id
            }
            :
            data = {
                report_type: LIKE_TYPE_REQUEST_INTERVIEW,
                source_id: id
            }
        await ApiMemberPost(MEMBER_REPORT_UNREPORT, data)
            .then((response: any) => {
                if (response.data && response.success) {
                    setReportCounter(response.data.report_flag ? reportCounter + 1 : reportCounter - 1)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    const starPatten = () => {
        return [1, 2, 3, 4].map(() => (
            <img src="/contectnumber.png" />
        ))
    }


    const handleLike = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: number) => {
        let data;
        userData?.registration_type == 1 ?
            data = {
                like_type: LIKE_TYPE_CLIENT,
                source_id: id
            }
            :
            data = {
                like_type: LIKE_TYPE_SIDE_CHARACTER,
                source_id: id
            }
        await ApiMemberPost(MEMBER_LIKE_UNLIKE, data).then(async (response: any) => {
            if (response.data && response.success) {
                setIsLike(!isLike)
                setLikeCounter(response.data.like_flag ? likeCounter + 1 : likeCounter - 1)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    useEffect(() => {
        getSideCharecterDetail()
    }, [])

    const is_Empty = (val: any) => {
        return isEmpty(val) ? t('common.n_a') : val
    }

    function __renderSideCharacter() {
        return (<>
            <AppLayout title="Received Requests of Side Character" whiteHeader={true}>
                <div className="fe-page-outer ft-sc-received-request-page ft-request-details">
                    <div className="ft-footer-static">
                        <div className="ft-page-container">
                            <h1 className='ft-heading'>
                                {t('common.request.ReceivedRequest')}
                            </h1>
                            <div className="ft-apply-block ft-pa-card">
                                <div className="top">
                                    <div className="ft-report-count">
                                        {/* <span>{reportCounter}</span>
                                        <img onClick={(id) => handleReport(requestDetails?.profile?.request?.id)} src="/white-report-icon.svg" className="ft-icon" alt="Report Icon" /> */}
                                    </div>
                                    {isEmpty(requestDetails?.profile?.profile_picture) ? <img src="/grayuser.png" className="ft-apply-profile" /> : <img src={requestDetails?.profile?.profile_picture} className="ft-apply-profile" />
                                    }
                                    <div className="detail">
                                        <div className="name">{requestDetails?.profile?.nick_name}</div>
                                        <div className="count">
                                            {id == memberid ? ((<img src="/heart.svg" className="heart-icon" alt="Heart Icon" />)) :
                                                (isLike ? <img src="/heart.svg" onClick={(e) => handleLike(e, requestDetails.profile.id)} className="heart-icon" alt="Heart Icon" /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, requestDetails.profile.id)} className="heart-icon" alt="Heart Icon" />)}
                                            <span>{likeCounter}</span>
                                        </div>
                                    </div>
                                    <div className="desc">
                                        {requestDetails?.profile?.request?.message?.message}
                                    </div>
                                    <div className="ft-sec-bottom">
                                        <div className="left">{t("dynamic." + requestDetails?.profile?.request?.wage_type)}</div>
                                        <div className="right">
                                            <div className="price">
                                                {requestDetails?.profile?.request?.is_negotiable == "yes" ? t('projectCreation.Negotiable') : numberWithCommas(requestDetails?.profile?.request?.amount)}
                                                {requestDetails?.profile?.request?.is_negotiable == "yes" ? null : <span>{t('projectCreation.won')}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom">
                                    <div className="part-one">
                                        <h2 className="ftpa-title">{t('sideCharacterProfile.BasicInformation')}</h2>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.PhoneNumber')}</div>
                                            {(!isEmpty(requestDetails?.profile?.request) ?
                                                requestDetails?.profile?.request?.status == KEYWORDS.PROJECT_EVENT.ACCEPTED ?
                                                    <div className="value">{isEmpty(requestDetails?.profile?.phone) ? t('common.n_a') : phoneNumberMasking(requestDetails?.profile?.phone, "-")}</div> :
                                                    <div className="value fe-phonenumber-hide">{isEmpty(requestDetails?.profile?.phone) ? t('common.n_a') : requestDetails?.profile?.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>

                                                :
                                                <div className="value fe-phonenumber-hide">{isEmpty(requestDetails?.profile?.phone) ? t('common.n_a') : requestDetails?.profile?.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>)
                                            }
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.Profession')}</div>
                                            <div className="value">{is_Empty(requestDetails?.profile?.profession.map((value: any) => {
                                                return t('dynamic.profession.' + value)
                                            }).join(", "))}</div>
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.Field')}</div>
                                            <div className="value">{is_Empty(requestDetails?.profile?.fields)}</div>
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.Location')}</div>
                                            <div className="value">{provices == null ? t('common.n_a') : provices.name} , {(districts == null || districts[0] == undefined) ? "" : districts[0].name}</div>
                                        </div>
                                    </div>
                                    {requestDetails?.profile?.is_experienced == "no" ?
                                        (<div className="part-two">
                                            <h2 className="ftpa-title">{t('sideCharacterProfile.WorkExperience')}</h2>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.TotalExperience')}</div>
                                                <div className="value">{t('sideCharacterProfile.workExp.unExp')}</div>
                                            </div>
                                        </div>)
                                        : <WorkExpSideCharecter experience={requestDetails?.profile?.experiences} />
                                    }

                                    <div className="part-three">
                                        <h2 className="ftpa-title">{t('sideCharacterProfile.ActivityInformation')}</h2>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.DesiredDate')}</div>
                                            <div className="value"> <div className="value">{requestDetails?.profile?.desired_date == null ? t('common.n_a') : t('dynamic.desired_date.' + requestDetails?.profile?.desired_date)}</div></div>
                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.DesiredTime')}</div>
                                            <div className="value">{requestDetails?.profile?.desired_time == null ? t('common.n_a') : t('dynamic.desired_time.' + requestDetails?.profile?.desired_time)}</div>

                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.DesiredProjectType')}</div>
                                            <div className="value">{requestDetails?.profile?.desired_project_type == null ? t('common.n_a') : t('dynamic.desired_project_type.' + requestDetails?.profile?.desired_project_type)}</div>

                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.Insurance')}</div>
                                            <div className="value">{requestDetails?.profile?.insurance_status == null ? t('common.n_a') : t('dynamic.insurance_status.' + requestDetails?.profile?.insurance_status)}</div>

                                        </div>
                                        <div className="ft-info-wrapper">
                                            <div className="title">{t('sideCharacterProfile.DesiredWorkType')}</div>
                                            <div className="value">{requestDetails?.profile?.desired_work_type == null ? t('common.n_a') : t('dynamic.desired_work_type.' + requestDetails?.profile?.desired_work_type)}</div>
                                        </div>
                                    </div>

                                    <div className="ft-apply-btn-wrap">
                                        {projectApplicationStatus == PROJECT_EVENT.WAITING &&
                                            <>
                                                <Button onClick={(e) => handleRequest(e, PROJECT_EVENT.REJECTED, requestDetails?.profile?.request?.id)} className="ft-cancel-project-btn">
                                                    {t('seeProjectDetails.Reject')}
                                                </Button>
                                                <Button onClick={(e) => handleRequest(e, PROJECT_EVENT.ACCEPTED, requestDetails?.profile?.request?.id)} className="ft-apply-project-btn">
                                                    {t('seeProjectDetails.Acceptcoins')}
                                                </Button>
                                            </>
                                        }
                                        {projectApplicationStatus == PROJECT_EVENT.REJECTED &&
                                            <Button className="ft-grey-border-btn1 ft-pa-rejected-btn">
                                                {t('featureSearch.Rejected')}
                                            </Button>}
                                        {projectApplicationStatus == PROJECT_EVENT.ACCEPTED &&
                                            <Button className="ft-light-theme-btn1 ft-pa-accepted-btn">
                                                {t('featureSearch.Accepted')}
                                            </Button>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BootstrapModel
                    show={isCoin}
                    onHide={() => setIsCoin(false)}
                    aria-labelledby="contained-BootstrapModel-title-vcenter"
                    className="ft-custom-modal"
                    dialogClassName="ft-make-profile"
                    centered
                >
                    <BootstrapModel.Header closeButton className="ft-pop-header">
                        <BootstrapModel.Title> {t('requestpopup.NotEnough')}</BootstrapModel.Title>
                    </BootstrapModel.Header>
                    <BootstrapModel.Body className="ft-pop-body">
                        <div className="desc">{t('requestpopup.Youdonothaveenough')}</div>
                        <div className="desc">{t('requestpopup.Pleaseagain')}</div>
                    </BootstrapModel.Body>
                    <BootstrapModel.Footer className="ft-pop-footer">
                        <Button onClick={gotoPurchase} className="ft-pop-theme-btn">
                            {t('requestpopup.PurchaseBCoins')}
                        </Button>
                    </BootstrapModel.Footer>
                </BootstrapModel>
            </AppLayout>
        </>);
    }

    function __renderClient() {
        return (<>
            <AppLayout title="Received Requests of Client" whiteHeader={true}>
                <div className="fe-page-outer ft-client-received-request-page ft-request-details">
                    <div className="ft-footer-static">
                        <div className="ft-page-container">
                            <h1 className='ft-heading'>
                                {t('common.request.ReceivedRequest')}
                            </h1>
                            {requestDetails &&
                                <div className="ft-apply-block ft-pa-card">
                                    <div className="top">
                                        <div className="ft-report-count">
                                            {/* <span>{reportCounter}</span>
                                            <img onClick={(id) => handleReport(requestDetails?.profile?.request?.id)} src="/white-report-icon.svg" className="ft-icon" alt="Report Icon" /> */}
                                        </div>
                                        {isEmpty(requestDetails?.profile?.profile_picture) ? <img src="/grayuser.png" className="ft-apply-profile" /> : <img src={requestDetails?.profile?.profile_picture} className="ft-apply-profile" />
                                        }
                                        <div className="detail">
                                            {requestDetails?.profile?.is_company == "no" ? null : <span className="ft-comp-lbl">{t('featureSearch.Company')}</span>}
                                            <div className="name">{is_Empty(requestDetails?.profile?.nick_name)}</div>
                                            <div className="count">
                                                {id == memberid ? ((<img src="/heart.svg" className="heart-icon" alt="Heart Icon" />)) :
                                                    (isLike ? <img src="/heart.svg" onClick={(e) => handleLike(e, requestDetails.profile.id)} className="heart-icon" alt="Heart Icon" /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, requestDetails.profile.id)} className="heart-icon" alt="Heart Icon" />)}
                                                <span>{likeCounter}</span>
                                            </div>
                                        </div>
                                        <div className="desc">
                                            {requestDetails?.profile?.request?.message?.message}
                                        </div>
                                        <div className="ft-sec-bottom">
                                            <div className="left">{t("dynamic." + requestDetails?.profile?.request?.wage_type)}</div>
                                            <div className="right">
                                                <div className="price">
                                                    {requestDetails?.profile?.request?.is_negotiable == "yes" ? t('projectCreation.Negotiable') : numberWithCommas(requestDetails?.profile?.request?.amount)}
                                                    {requestDetails?.profile?.request?.is_negotiable == "yes" ? null : <span>{t('projectCreation.won')}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <div className="part-one">
                                            <h2 className="ftpa-title">{t('sideCharacterProfile.BasicInformation')}</h2>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.PhoneNumber')}</div>
                                                {(!isEmpty(requestDetails?.profile?.request) ?
                                                    requestDetails?.profile?.request?.status == KEYWORDS.PROJECT_EVENT.ACCEPTED ?
                                                        <div className="value">{isEmpty(requestDetails?.profile?.phone) ? t('common.n_a') : phoneNumberMasking(requestDetails?.profile?.phone, "-")}</div> :
                                                        <div className="value fe-phonenumber-hide">{isEmpty(requestDetails?.profile?.phone) ? t('common.n_a') : requestDetails?.profile?.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>

                                                    :
                                                    <div className="value fe-phonenumber-hide">{isEmpty(requestDetails?.profile?.phone) ? t('common.n_a') : requestDetails?.profile?.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>)
                                                }
                                            </div>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.Profession')}</div>
                                                <div className="value">{is_Empty(requestDetails?.profile?.profession.map((value: any) => {
                                                    return t('dynamic.profession.' + value)
                                                }).join(", "))}</div>
                                            </div>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.Field')}</div>
                                                <div className="value at-info-field">{is_Empty(field)}</div>
                                            </div>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.Location')}</div>
                                                <div className="value">{provices == null ? t('common.n_a') : provices.name} , {(districts == null || districts[0] == undefined) ? "" : districts[0].name}</div>
                                            </div>
                                        </div>
                                        {isEmpty(requestDetails?.profile?.company) ? null :
                                            <div className="part-two company-info">
                                                <h2 className="ftpa-title">{t('clientProfile.company.CompanyInformation')}</h2>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.CompanyName')}</div>
                                                    <div className="value">{is_Empty(requestDetails?.profile?.company?.name)}</div>
                                                </div>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.PhoneNumber')}</div>
                                                    <div className="value">{isEmpty(requestDetails?.profile?.company?.contact_information) ? t('common.n_a') : phoneNumberMasking(requestDetails?.profile?.company?.contact_information, "-")}</div>
                                                </div>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.CompanyProfession')}</div>
                                                    <div className="value">{is_Empty(requestDetails?.profile?.company?.profession.split(",").map((value: any) => {
                                                        if(value !== ""){
                                                            return t('dynamic.profession.' + value)
                                                        }
                                                        return  t('common.n_a')
                                                    }).join(", "))}</div>
                                                </div>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.CompanyField')}</div>
                                                    <div className="value at-info-field">{is_Empty(companyField)}</div>
                                                </div>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.Location')}</div>
                                                    <div className="value">{requestDetails?.profile.company == null ? t('common.n_a') : companyProvices == null ? "" : companyProvices.name},{requestDetails?.profile.company == null ? t('common.n_a') : (companyDistricts == null || districts[0] == undefined) ? "" : companyDistricts[0].name}</div>
                                                </div>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.CompanyRegistrationNumber')}</div>
                                                    <div className="value">{isEmpty(requestDetails?.profile?.company?.registation_number) ? t('common.n_a') : phoneNumberMasking(requestDetails?.profile?.company?.registation_number, "-")}</div>
                                                </div>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.FoundationYear')}</div>
                                                    <div className="value">Year {is_Empty(requestDetails?.profile?.company?.foundation_year)}</div>
                                                </div>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.RepresentativeName')}</div>
                                                    <div className="value">{is_Empty(requestDetails?.profile?.company?.representative_name)}</div>
                                                </div>
                                                <div className="ft-info-wrapper">
                                                    <div className="title">{t('clientProfile.company.NumberofEmployees')}</div>
                                                    <div className="value">{is_Empty(requestDetails?.profile?.company?.total_employees)} {t('common.People')}</div>
                                                </div>
                                            </div>
                                        }
                                        <div className="part-three">
                                            <h2 className="ftpa-title">{t('sideCharacterProfile.ActivityInformation')}</h2>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.DesiredDate')}</div>
                                                <div className="value"> <div className="value">{requestDetails?.profile?.desired_date == null ? t('common.n_a') : t('dynamic.desired_date.' + requestDetails?.profile?.desired_date)}</div></div>
                                            </div>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.DesiredTime')}</div>
                                                <div className="value">{requestDetails?.profile?.desired_time == null ? t('common.n_a') : t('dynamic.desired_time.' + requestDetails?.profile?.desired_time)}</div>

                                            </div>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.DesiredProjectType')}</div>
                                                <div className="value">{requestDetails?.profile?.desired_project_type == null ? t('common.n_a') : t('dynamic.desired_project_type.' + requestDetails?.profile?.desired_project_type)}</div>

                                            </div>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.Insurance')}</div>
                                                <div className="value">{requestDetails?.profile?.insurance_status == null ? t('common.n_a') : t('dynamic.insurance_status.' + requestDetails?.profile?.insurance_status)}</div>

                                            </div>
                                            <div className="ft-info-wrapper">
                                                <div className="title">{t('sideCharacterProfile.DesiredWorkType')}</div>
                                                <div className="value">{requestDetails?.profile?.desired_work_type == null ? t('common.n_a') : t('dynamic.desired_work_type.' + requestDetails?.profile?.desired_work_type)}</div>
                                            </div>
                                        </div>
                                        {isEmpty(requestDetails?.profile?.company) ? null :
                                            <>
                                                {(!isEmpty(requestDetails?.profile?.projects)) ?
                                                    <>
                                                        <div className="part-four">
                                                            <h2 className="ftpa-title">{t('clientProfile.PlannedProjects')}</h2>
                                                            <div className="ft-needed-pos hm-needed-pos">
                                                                {requestDetails?.profile?.projects.map((project: any, index: number) => (
                                                                    <div className="ftbtn" onClick={() => router.push(getUrl(router.locale, PROJECT_ID_PROPOSAL.replace("%id%", project?.id + "")))}>{project?.field}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                                }
                                                <div className="part-five">
                                                    <h2 className="ftpa-title">{t('clientProfile.CompanyIntroduction')}</h2>
                                                    <div className="ft-com-intro">
                                                        <div className="desc">{requestDetails?.profile?.company?.introduction}</div>
                                                        {/* <ul className="ft-steps-info">
                                                    <li>스타트업 개발사</li>
                                                    <li>교육 사업</li>
                                                    <li>신규 서비스 론칭</li>
                                                </ul> */}
                                                    </div>
                                                </div>
                                                <div className="part-six">
                                                    <h2 className="ftpa-title">{t('clientProfile.Hashtags')}</h2>
                                                    <div className="ft-hashs">
                                                        {isEmpty(requestDetails?.profile?.company?.hashtags) ? "" : requestDetails?.profile?.company?.hashtags.map((hashTeg: any) => (
                                                            <div className="ft-hashbtn at-word-break-tag">#{hashTeg}</div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* <div className="ft-pa-btn-wrap">
                                                    {projectApplicationStatus == PROJECT_EVENT.WAITING &&
                                                        <Button className="ft-grey-default-btn1 ft-waiting-btn">
                                                            {t('featureSearch.Pending')}
                                                        </Button>
                                                    }
                                                    {projectApplicationStatus == PROJECT_EVENT.REJECTED &&
                                                        <Button className="ft-grey-border-btn1 ft-pa-rejected-btn">
                                                            {t('featureSearch.Rejected')}
                                                        </Button>}
                                                    {projectApplicationStatus == PROJECT_EVENT.ACCEPTED &&
                                                        <Button className="ft-light-theme-btn1 ft-pa-accepted-btn">
                                                            {t('featureSearch.Accepted')}
                                                        </Button>
                                                    }
                                                </div> */}
                                            </>
                                        }
                                        <div className="ft-apply-btn-wrap">
                                            {projectApplicationStatus == PROJECT_EVENT.WAITING &&
                                                <>
                                                    <Button onClick={(e) => handleRequest(e, PROJECT_EVENT.REJECTED, requestDetails?.profile?.request?.id)} className="ft-cancel-project-btn">
                                                        {t('seeProjectDetails.Reject')}
                                                    </Button>
                                                    <Button onClick={(e) => handleRequest(e, PROJECT_EVENT.ACCEPTED, requestDetails?.profile?.request?.id)} className="ft-apply-project-btn">
                                                        {t('seeProjectDetails.Accept')}
                                                    </Button>
                                                </>
                                            }
                                            {projectApplicationStatus == PROJECT_EVENT.REJECTED &&
                                                <Button className="ft-grey-border-btn1 ft-pa-rejected-btn">
                                                    {t('featureSearch.Rejected')}
                                                </Button>}
                                            {projectApplicationStatus == PROJECT_EVENT.ACCEPTED &&
                                                <Button className="ft-light-theme-btn1 ft-pa-accepted-btn">
                                                    {t('featureSearch.Accepted')}
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>);
    }

    return (
        <div>
            {renderingType ? __renderSideCharacter() : __renderClient()}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default receive