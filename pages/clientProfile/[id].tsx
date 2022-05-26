import styles from '../../styles/components/Blueprofile.module.css';
import stylessec from '../../styles/components/ReqConInfo.module.css';
import stylesforth from '../../styles/clientProfile.module.css';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { ApiMemberGet, ApiMemberPost } from '../../service/api';
import { CLIENT_PROFILE, MEMBER_LIKE_UNLIKE, MEMBER_REPORT_UNREPORT } from '../../constants/api';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import { AppLayout } from '../../components';
import { getDistricts, getProvinces } from '../../redux/actions';
import { getUrl, isEmpty, isValidUrl, phoneNumberMasking } from '../../utils/helper';
import { LIKE_TYPE_CLIENT, LIKE_TYPE_SIDE_CHARACTER } from '../../constants/keywords';
import { progress_Change_Client } from '../../redux/actions/memberAction';
import { KEYWORDS, ROUTES } from '../../constants';
import { INDEX, PROJECT_ID_PROPOSAL } from '../../constants/routes';

function ClientProfile() {
    const { t } = useTranslation();
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
    const router = useRouter()
    const { type } = router.query;
    const [memberClientData, setMemberClientData] = useState<any>()
    const [isCompany, setIsCompany] = useState<any>()
    const [field, setField] = useState<any>()
    const [reportId, setReportId] = useState(0)
    const [isLike, setIsLike] = useState<boolean>()
    const [reportCounter, setReportCounter] = useState<number>(0)
    const [likeCounter, setLikeCounter] = useState<number>(0)
    const [companyField, setCompanyField] = useState<any>()
    const locationDataProvinces = useSelector((state: State) => state.client.provinces)
    const locationDataDistricts = useSelector((state: State) => state.client.districts)
    const [provices, setProvices] = useState<any>()
    const [districts, setDistricts] = useState<any>()
    const [companyProvices, setCompanyProvices] = useState<any>()
    const [companyDistricts, setCompanyDistricts] = useState<any>()
    const dispatch = useDispatch()
    const [isMore, setIsMore] = useState(true);
    const memberid = useSelector((state: State) => state.auth.userData.member.id)
    const { id } = router.query
    const registration_type = useSelector((state: State) => state.auth.userData.registration_type)
    const getClientData = async () => {
        await dispatch(getProvinces())
        await dispatch(getDistricts())
        await ApiMemberGet(`${CLIENT_PROFILE}/${id}`)
            .then(async (response: any) => {
                if (response.data && response.success) {
                    dispatch(progress_Change_Client(response.data?.progress))
                    setMemberClientData(response.data.client_profile)
                    setReportId(response.data.client_profile.id)
                    setReportCounter(response.data.client_profile.report_count)
                    setIsCompany(response.data.client_profile.is_company)
                    setLikeCounter(response.data.client_profile.total_likes)
                    setIsLike(response.data.client_profile.like_flag)
                    let field = "";
                    response.data.client_profile.fields.map((ex: any) => {
                        field = field + `${ex}/`
                    })
                    setField(field.slice(0, -1))

                    await setProvices(locationDataProvinces.find((provinces: any) => (
                        provinces.id == response.data.client_profile.locations[0].city
                    )))
                    await setDistricts(locationDataDistricts.filter((districts: any) => (
                        districts.id == response.data.client_profile.locations[0].district
                    )))


                    let companyfield = "";
                    if (response.data.client_profile.company != null) {
                        response.data.client_profile.company.fields.map((ex: any) => {
                            companyfield = companyfield + `${ex}/`
                        })
                        setCompanyField(companyfield.slice(0, -1))
                        await setCompanyProvices(locationDataProvinces.find((provinces: any) => (
                            provinces.id == response.data.client_profile.company.locations[0].city
                        )))
                        await setCompanyDistricts(locationDataDistricts.filter((districts: any) => (
                            districts.id == response.data.client_profile.company.locations[0].district
                        )))
                    }
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
                if (error?.code == 422 && error?.error?.profile == "Profile Not Found") {
                    router.push(getUrl(router.locale, INDEX))
                }
            })
    }


    useEffect(() => {
        getClientData()
    }, [])

    const handleReport = async () => {
        const data = {
            report_type: LIKE_TYPE_CLIENT,
            source_id: reportId
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

    const is_Empty = (val: any) => {
        return isEmpty(val) ? t('common.n_a') : val
    }

    const is_Empty_Employee = (val: any) => {
        return isEmpty(val) ? "0" : val
    }

    const starPatten = () => {
        return [1, 2, 3, 4].map(() => (
            <img src="/contectnumber.png" />
        ))
    }

    const handleLike = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: number) => {
        let data = {
            like_type: LIKE_TYPE_CLIENT,
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

    return (
        <>
            <AppLayout title={t('clientProfile.clientProfileStep1.enterProfile')} whiteHeader={true}>
                {memberClientData ?
                    <div className="clientprofile-2 mainContainercmn fe-page-outer hm-clientprofile">
                        <div className="ft-footer-static">
                            <div className="cmn-profile-section col4-cmn-cntr-800 Clientprofile-box-headeing">
                                <div style={{ float: "left", width: "100%" }}>
                                    {id == memberid ? <span className={`${styles.heading} at-head-profile hm-head-profile `} style={{ float: "left" }}>{t('sideCharacterProfile.MyProfile')}</span>
                                        : <span className={`${styles.heading} at-head-profile`} style={{ float: "left" }}>{t('memberProfile.ClientProfile')}</span>}
                                    {id == memberid ? <Button className={`${stylesforth.topbtn} edit-profile-btn at-edit-btn hm-sc-pr-edit-btn`} onClick={() => router.push('/profile/client')}>
                                        {t('sideCharacterProfile.EditProfile')}
                                    </Button> : null}
                                </div>

                            </div>
                            <div className="cmn-profile-section col4-cmn-cntr-800 box-section Clientprofile-box at-client-box hm-client-box">
                                <div className={`${stylesforth.userprofilesectop} at-user-profile hm-user-profile`}>
                                    {id == memberid ? null : <div className="ft-report-count">
                                        <span>{reportCounter}</span>
                                        <img onClick={handleReport} src="/profile-report-icon.svg" className="ft-icon" alt="Report Icon" />
                                    </div>}
                                    <div className="cmn-profile-img at-profile-img">
                                        <div className="d-flex justify-content-center hm-profile-image-ctn">
                                            <img src={(memberClientData.profile_picture == null || memberClientData.profile_picture == "") ? "/grayuser.svg" : memberClientData.profile_picture} alt="User Image" />
                                        </div>
                                        <div className={`d-flex justify-content-center align-items-center profile-name at-profile hm-heart-icon-ctn`} >
                                            <span className={`${styles.name} d-flex  align-items-center at-nickname`} style={{ color: "#16181C" }}>{memberClientData.company == null ? "" : <span className="clientcompany at-company">{t('common.Company')}</span>}{is_Empty(memberClientData.nick_name)}</span>
                                            <span>
                                                {id == memberid ? (<img src="/heart.svg" className={`ft-heart-svg at-heart-img ${styles.heartimg}`} alt="Heart Icon" />) :
                                                    (isLike ? <img src="/heart.svg" onClick={(e) => handleLike(e, memberClientData.id)} className={`ft-heart-svg at-heart-img ${styles.heartimg}`} alt="Heart Icon" /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, memberClientData.id)} className={`ft-heart-svg at-heart-img ${styles.heartimg}`} alt="Heart Icon" />)}
                                            </span>
                                            <span className={`${styles.name} total-likes at-like-counter`}>
                                                {likeCounter}
                                            </span>
                                        </div>
                                    </div>
                                    {/* <div className={`${stylesforth.h2} d-flex justify-content-center align-items-center nick-name`}> <span>{is_Empty(memberClientData.nick_name)} </span></div> */}
                                    <div className={`${stylesforth.p} d-flex justify-content-center align-items-center introductions`}> {is_Empty(memberClientData.introduction)}</div>
                                    <div className="profrate-inner-devider at-prof-inner"></div>
                                </div>

                                <div className="blue-profile-btm with-no-shadow pt-0 ">
                                    <div className="profrate-inner basic-info">
                                        <div className="row">
                                            <div className="col-md-12 proinr-title py-0 at-pro-title">{t('sideCharacterProfile.BasicInformation')}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.PhoneNumber')}</div>
                                            {id == memberid ?
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{isEmpty(memberClientData.phone) ? t('common.n_a') : phoneNumberMasking(memberClientData.phone, "-")}</div>
                                                :
                                                (!isEmpty(memberClientData.request) ?
                                                    memberClientData.request.status == KEYWORDS.PROJECT_EVENT.ACCEPTED ?
                                                        <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{isEmpty(memberClientData.phone) ? t('common.n_a') : phoneNumberMasking(memberClientData.phone, "-")}</div> :
                                                        <div className="col-md-6 alnright proinr-right proinr-cmn py-0 fe-phonenumber-hide">{isEmpty(memberClientData.phone) ? t('common.n_a') : memberClientData.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>

                                                    :
                                                    <div className="col-md-6 alnright proinr-right proinr-cmn py-0 fe-phonenumber-hide">{isEmpty(memberClientData.phone) ? t('common.n_a') : memberClientData.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>)
                                            }
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.Profession')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{is_Empty(memberClientData.profession.map((value: any) => {
                                              
                                                    return t('dynamic.profession.' + value)
                                                
                                            }).join(", "))}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.Field')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0 at-word-break-tag">{is_Empty(field)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.Location')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{provices == null ? t('common.n_a') : provices.name} {(districts == null || districts[0] == undefined) ? "" : districts[0].name}</div>
                                        </div>

                                        <div className="profrate-inner-devider at-prof-inner"></div>
                                    </div>


                                    {isCompany == 'yes' ? <>
                                        <div className="profrate-inner basic-info">
                                            <div className="row">
                                                <div className="col-md-12 proinr-title py-0">{t('clientProfile.company.CompanyInformation')}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.CompanyName')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{is_Empty(memberClientData?.company?.name)}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.PhoneNumber')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{isEmpty(memberClientData?.company?.contact_information) ? t('common.n_a') : phoneNumberMasking(memberClientData?.company?.contact_information, "-")}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.CompanyProfession')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{is_Empty(memberClientData?.company?.profession.split(",").map((value: any) => {
                                                    if(value != ""){
                                                        return t('dynamic.profession.' + value)
                                                    }
                                                    return  t('common.n_a')
                                                }).join(", "))}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.CompanyField')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0 at-word-break-tag">{is_Empty(companyField)}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.Location')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberClientData.company == null ? t('common.n_a') : companyProvices == null ? "" : companyProvices.name},{memberClientData.company == null ? t('common.n_a') : (companyDistricts == null || districts[0] == undefined) ? "" : companyDistricts[0].name}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.CompanyRegistrationNumber')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{isEmpty(memberClientData?.company?.registation_number) ? t('common.n_a') : phoneNumberMasking(memberClientData?.company?.registation_number, "-")}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.FoundationYear')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{is_Empty(memberClientData?.company?.foundation_year)}{t('workExperienceDate.newYear')}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.RepresentativeName')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{is_Empty(memberClientData?.company?.representative_name)}</div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('clientProfile.company.NumberofEmployees')}</div>
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{is_Empty_Employee(memberClientData?.company?.total_employees)} {t('common.People')}</div>
                                            </div>
                                            <div className="profrate-inner-devider at-prof-inner"></div>
                                        </div>


                                    </> : ''}
                                    <div className="profrate-inner basic-info">
                                        <div className="row">
                                            <div className="col-md-12 proinr-title ">{t('sideCharacterProfile.ActivityInformation')}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.DesiredDate')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberClientData.desired_date == null ? t('common.n_a') : t('dynamic.desired_date.' + memberClientData.desired_date)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.DesiredTime')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberClientData.desired_time == null ? t('common.n_a') : t('dynamic.desired_time.' + memberClientData.desired_time)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.DesiredProjectType')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberClientData.desired_project_type == null ? t('common.n_a') : t('dynamic.desired_project_type.' + memberClientData.desired_project_type)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.Insurance')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberClientData.insurance_status == null ? t('common.n_a') : t('dynamic.insurance_status.' + memberClientData.insurance_status)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.DesiredWorkType')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberClientData.desired_work_type == null ? t('common.n_a') : t('dynamic.desired_work_type.' + memberClientData.desired_work_type)}</div>
                                        </div>

                                        {((isEmpty(memberClientData?.company))) ? null
                                            : (<div className="profrate-inner-devider at-prof-inner"></div>)}
                                    </div>


                                    {isCompany == 'yes' ? <>
                                        {(!isEmpty(memberClientData?.projects)) ?
                                            <>
                                                <div className="profrate-inner basic-info">
                                                    <div className="row">
                                                        <div className="col-md-12 proinr-title">{t('clientProfile.PlannedProjects')}</div>
                                                    </div>
                                                    <div className="row ux-ui-Tbas at-ux-ui-Tbas-ctn hm-ui-ux-tabs-ctn">
                                                        {memberClientData?.projects.map((project: any, index: number) => (
                                                            <div className="col-md-6  alnleft proinr-left  py-0">
                                                                <Button className={`${stylesforth.twobtn} at-has-btn hm-has-btn`} onClick={() => router.push(getUrl(router.locale, PROJECT_ID_PROPOSAL.replace("%id%", project?.id + "")))}>{project?.field}</Button>
                                                            </div>
                                                        ))}

                                                    </div>
                                                    <div className="profrate-inner-devider at-prof-inner"></div>
                                                </div>
                                            </>
                                            : null
                                        }


                                        <div className="profrate-inner basic-info">
                                            <div className="row">
                                                <div className="col-md-12 proinr-title">{t('clientProfile.CompanyIntroduction')}</div>
                                            </div>
                                            <div className="row company-info">
                                                <div className="col-md-12 alnleft proinr-left proinr-cmn py-0">{memberClientData?.company?.introduction}</div>
                                                {/* <div className="col-md-12 alnleft proinr-left proinr-cmn py-0">IT 스타트업 앱/웹 전문으로 하고 있는 개발사입니다.</div>
                                                <div className="col-md-12 p-0">
                                                    <ol className="mb-0">
                                                        <li className="col-md-12 alnleft proinr-left proinr-cmn py-0">스타트업 개발사</li>
                                                        <li className="col-md-12 alnleft proinr-left proinr-cmn py-0">교육 사업</li>
                                                        <li className="col-md-12 alnleft proinr-left proinr-cmn py-0">신규 서비스 론칭</li>
                                                    </ol>
                                                </div> */}
                                            </div>

                                            <div className="profrate-inner-devider at-prof-inner"></div>
                                        </div>


                                        <div className="profrate-inner basic-info">
                                            <div className="row">
                                                <div className="col-md-12 proinr-title at-hastag-title">{t('clientProfile.Hashtags')}</div>
                                            </div>
                                            <div className="row">
                                                <div className={`${(width < 640) ? "" : "proinr-cmn Clienttag-rows"} col-md-12 alnleft proinr-left  py-0  at-client-row`}>
                                                    {isEmpty(memberClientData.company) ? "" : memberClientData?.company?.hashtags.map((hashTeg: any) => (
                                                        <Button className={`${stylesforth.graybtnstyl} at-hastag-btn at-word-break-tag`}>#{hashTeg}</Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </> : ""}
                                    {((isEmpty(memberClientData.homepage_link) && isEmpty(memberClientData.facebook_link) && isEmpty(memberClientData.instagram_link) && isEmpty(memberClientData.other_link)) && isEmpty(memberClientData.introductories)) ? null
                                        : (
                                            <div className='at-line-fixed'>
                                                <div className="profrate-inner-devider at-prof-inner"></div>
                                            </div>
                                        )}

                                    {(isEmpty(memberClientData.homepage_link) && isEmpty(memberClientData.facebook_link) && isEmpty(memberClientData.instagram_link) && isEmpty(memberClientData.other_link)) ? null : (
                                        <div className="profrate-inner basic-info">
                                            <div className="row">
                                                <div className="col-md-12 proinr-title">{t('sideCharacterProfile.Links')}</div>
                                            </div>
                                            {/* <div className={`${stylessec.flw} at-link-main hm-social-profile-lists-ctn`} >
                                                <ul className="proflist at-list-prof hm-social-profile-lists">
                                                    {!isEmpty(memberClientData.homepage_link) && (<li>
                                                        <a href={isValidUrl(memberClientData.homepage_link) ? memberClientData.homepage_link : "http://" + memberClientData.homepage_link} target="_blank">
                                                            <Button><img src='../home.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberClientData.facebook_link) && (<li>
                                                        <a href={isValidUrl(memberClientData.facebook_link) ? memberClientData.facebook_link : "http://" + memberClientData.facebook_link} target="_blank">
                                                            <Button> <img src='../Fb.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberClientData.instagram_link) && (<li>
                                                        <a href={isValidUrl(memberClientData.instagram_link) ? memberClientData.instagram_link : "http://" + memberClientData.instagram_link} target="_blank">
                                                            <Button><img src='../insta.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberClientData.other_link) && (<li>
                                                        <a href={isValidUrl(memberClientData.other_link) ? memberClientData.other_link : "http://" + memberClientData.other_link} target="_blank">
                                                            <Button><img src='../pc.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                </ul>
                                            </div> */}

                                            <div className="hm-social-link-list-ctn">
                                                <ul className="hm-social-link-btn-list">
                                                    {!isEmpty(memberClientData.homepage_link) && (<li>
                                                        <a href={isValidUrl(memberClientData.homepage_link) ? memberClientData.homepage_link : "http://" + memberClientData.homepage_link} target="_blank">
                                                            <Button><img src='../home.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberClientData.facebook_link) && (<li>
                                                        <a href={isValidUrl(memberClientData.facebook_link) ? memberClientData.facebook_link : "http://" + memberClientData.facebook_link} target="_blank">
                                                            <Button> <img src='../Fb.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberClientData.instagram_link) && (<li>
                                                        <a href={isValidUrl(memberClientData.instagram_link) ? memberClientData.instagram_link : "http://" + memberClientData.instagram_link} target="_blank">
                                                            <Button><img src='../insta.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberClientData.other_link) && (<li>
                                                        <a href={isValidUrl(memberClientData.other_link) ? memberClientData.other_link : "http://" + memberClientData.other_link} target="_blank">
                                                            <Button><img src='../pc.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                </ul>
                                            </div>
                                            {!isEmpty(memberClientData.introductories) && (
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="profrate-inner-devider at-prof-inner  hm-work-end-port"></div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>)}
                                    {(width < 640) ?
                                        !isEmpty(memberClientData.introductories) && (
                                            <>
                                                <div className="profrate-inner basic-info">
                                                    <div className="row">
                                                        <div className="col-md-12 proinr-title">{t('clientProfile.IntroductoryImages')}</div>
                                                    </div>
                                                    <div className="row imgupload-inner-row at-imgup-main">
                                                        <div className="imgupload-inner at-imgupload">
                                                            {isMore ? memberClientData.introductories.slice(0, 2).map((image: any) => (
                                                                <img src={image.file_path} />
                                                            )) : memberClientData.introductories.map((image: any) => (
                                                                <img src={image.file_path} />
                                                            ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='profrate-inner profile-ViewMoreBtn at-profile-vm'>
                                                    {memberClientData.introductories.length > 2 && <Button className={`${stylesforth.lstbtn} ${id == memberid ? "at-seemore-btn-mid" : "at-seemore-btn"} `} onClick={() => setIsMore(!isMore)}>{isMore ? t('sideCharacterProfile.SeeMore') : t('common.close')}</Button>}
                                                </div>
                                            </>
                                        )

                                        :

                                        !isEmpty(memberClientData.introductories) && (
                                            <>
                                                <div className="profrate-inner basic-info">
                                                    <div className="row">
                                                        <div className="col-md-12 proinr-title">{t('clientProfile.IntroductoryImages')}</div>
                                                    </div>
                                                    <div className="row imgupload-inner-row">
                                                        <div className="imgupload-inner at-imgupload">
                                                            {isMore ? memberClientData.introductories.slice(0, 3).map((image: any) => (
                                                                <img src={image.file_path} />
                                                            )) : memberClientData.introductories.map((image: any) => (
                                                                <img src={image.file_path} />
                                                            ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='profrate-inner profile-ViewMoreBtn hm-profile-ViewMoreBtn'>
                                                    {memberClientData.introductories.length > 3 && <Button className={stylesforth.lstbtn} onClick={() => setIsMore(!isMore)}>{isMore ? t('sideCharacterProfile.SeeMore') : t('common.close')}</Button>}
                                                </div>
                                            </>
                                        )}
                                    {id == memberid ? null : <div className='profrate-inner basic-info'>

                                        {(width < 640) ? isEmpty(memberClientData.introductories) ? <div className="profrate-inner-devider at-prof-inner at-mb-20"></div> : <div className="profrate-inner-devider at-prof-inner at-mb-20 at-rm-mt-20"></div> :
                                            <hr className="at-inner-btn" />}

                                        {/* <Button className={stylesforth.lstbtn} style={"requestedd" === "requested" ? { background: "#F4F4F4", borderRadius: "100px", color: "#9A9A9A" } : { background: "#00D6E3", borderRadius: "20px", color: "white" }}>인터뷰 요청하기</Button> */}

                                        <Button disabled={memberClientData.is_already_requested} onClick={() => router.push(getUrl(router.locale, ROUTES.PROFILE_REQUEST_INTERVIEW.replace('%id%', memberClientData.id + "")))} className={`${stylesforth.lstbtn} ${memberClientData.is_already_requested && "at-req-disable"} at-fullsize-btn-md`}>
                                            {memberClientData.is_already_requested ? t('featureSearch.Requested') : t('featureSearch.Request_Interview')}</Button>

                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    : null}
            </AppLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default ClientProfile
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

