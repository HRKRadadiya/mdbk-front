import styles from '../../styles/components/Blueprofile.module.css';
import stylessec from '../../styles/components/ReqConInfo.module.css';
import stylesforth from '../../styles/clientProfile.module.css';
import React, { useState } from 'react';
import { AppLayout, WorkExp } from "../../components"
import { GetServerSideProps } from 'next'
import { Button } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { MEMBER_LIKE_UNLIKE, MEMBER_REPORT_UNREPORT, SIDE_CHARACTER_PROFILE, } from '../../constants/api';
import { ApiMemberGet, ApiMemberPost } from '../../service/api';
import router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import { getDistricts, getProvinces } from '../../redux/actions';
import { Modal } from 'react-bootstrap'
import { getUrl, isEmpty, isValidUrl, phoneNumberMasking } from '../../utils/helper';
import { LIKE_TYPE_CLIENT, LIKE_TYPE_SIDE_CHARACTER } from '../../constants/keywords';
import { progress_Change_SideChar } from '../../redux/actions/memberAction';
import { KEYWORDS, ROUTES } from '../../constants';
import { INDEX } from '../../constants/routes';

function SideCharecterProfile() {

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
    const [memberSideData, setMemberSideData] = useState<any>()
    const locationDataProvinces = useSelector((state: State) => state.client.provinces)
    const locationDataDistricts = useSelector((state: State) => state.client.districts)
    const [provices, setProvices] = useState<any>()
    const [districts, setDistricts] = useState<any>()
    const [likeCounter, setLikeCounter] = useState<number>(0)
    const [isLike, setIsLike] = useState<boolean>()
    const [isMore, setIsMore] = useState(true);
    const dispatch = useDispatch()
    const [reportId, setReportId] = useState(0)
    const [reportCounter, setReportCounter] = useState<number>(0)
    const memberid = useSelector((state: State) => state.auth.userData?.member?.id)
    const registration_type = useSelector((state: State) => state.auth.userData?.registration_type)
    const { id } = router.query


    const getSideData = async () => {
        dispatch(getProvinces())
        dispatch(getDistricts())
        await ApiMemberGet(`${SIDE_CHARACTER_PROFILE}/${id}`)
            .then(async (response: any) => {
                if (response.data && response.success) {
                    dispatch(progress_Change_SideChar(response.data?.progress))
                    setMemberSideData(response.data.side_character)
                    setReportId(response.data.side_character.id)
                    setReportCounter(response.data.side_character.report_count)
                    setLikeCounter(response.data.side_character.total_likes)
                    setIsLike(response.data.side_character.like_flag)
                    setFileList(response.data.side_character.portfolios.map((ex: any) => {
                        const { file_path, id, file_name } = ex;
                        return {
                            uid: id,
                            name: file_name,
                            status: 'done',
                            url: file_path,
                        }
                    }))
                    let field = "";
                    response.data.side_character.fields.map((ex: any) => {
                        field = field + `${ex}/`
                    })
                    setField(field.slice(0, -1))
                    await setProvices(locationDataProvinces.find((provinces: any) => (
                        provinces.id == response.data.side_character.locations[0].city
                    )))
                    await setDistricts(locationDataDistricts.filter((districts: any) => (
                        districts.id == response.data.side_character.locations[0].district
                    )))
                } else {
                    console.log("No Data found")
                }
            })
            .catch((error: any) => {
                console.log("Error", error)
                if (error?.code == 422 && error?.error?.profile == "Profile Not Found") {
                    router.push(getUrl(router.locale, INDEX))
                }
            })
    }

    useEffect(() => {
        getSideData()
    }, [])

    const [fileList, setFileList] = useState<any>()
    const [field, setField] = useState<any>([])
    const handleEdit = () => {
        router.push("/profile/side-character")
    }
    const starPatten = () => {
        return [1, 2, 3, 4].map(() => (
            <img src="/contectnumber.png" />
        ))
    }

    const handleReport = async () => {
        const data = {
            report_type: LIKE_TYPE_SIDE_CHARACTER,
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

    const handleLike = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, id: number) => {
        let data = {
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

    return (
        <>
            {locationDataProvinces != null && locationDataDistricts != null ?
                <AppLayout title={t('clientProfile.clientProfileStep1.enterProfile')} whiteHeader={true}>
                    {memberSideData ? <div className="clientprofile-2  mainContainercmn fe-page-outer hm-sc-profile">
                        <div className="ft-footer-static">
                            <div className="cmn-profile-section col4-cmn-cntr-800 Clientprofile-box-headeing">
                                <div style={{ float: "left", width: "100%" }}>

                                    {id == memberid ? <span className={`${styles.heading} at-head-profile hm-head-profile `} style={{ float: "left" }}>{t('sideCharacterProfile.MyProfile')}</span>
                                        : <span className={`${styles.heading} at-head-profile`} style={{ float: "left" }}>{t('clientProfile.clientProfileStep1.SideCharacterProfile1')}</span>}
                                    {id == memberid ? <Button className={`${stylesforth.topbtn}  at-edit-btn hm-sc-pr-edit-btn`} onClick={handleEdit}>
                                        {t('sideCharacterProfile.EditProfile')}
                                    </Button> : null}
                                </div>
                            </div>
                            <div className="cmn-profile-section col4-cmn-cntr-800 box-section profile-box  Clientprofile-box at-client-box hm-sc-box">
                                <div className={`${stylesforth.userprofilesectop} at-user-profil hm-user-profile`}>
                                    {id == memberid ? null : <div className="ft-report-count">
                                        <span>{reportCounter}</span>
                                        <img onClick={handleReport} src="/profile-report-icon.svg" className="ft-icon" alt="Report Icon" />
                                    </div>}
                                    <div className="cmn-profile-img at-profile-img">
                                        <div className="d-flex justify-content-center hm-profile-image-ctn">
                                            <img src={(memberSideData.profile_picture == null || memberSideData.profile_picture == "") ? "/grayuser.svg" : memberSideData.profile_picture} alt="User Image" />
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center profile-name at-profile">
                                            <span className={`${styles.name}  at-nickname`} style={{ color: "#16181C" }}>{memberSideData.nick_name}</span>
                                            <span>
                                                {id == memberid ? (<img src="/heart.svg" className={`ft-heart-svg at-heart-img ${styles.heartimg}`} alt="Heart Icon" />) :
                                                    (isLike ? <img src="/heart.svg" onClick={(e) => handleLike(e, memberSideData.id)} className={`ft-heart-svg at-heart-img ${styles.heartimg}`} alt="Heart Icon" /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, memberSideData.id)} className={`ft-heart-svg at-heart-img ${styles.heartimg}`} alt="Heart Icon" />)
                                                }
                                            </span>
                                            <span className={`${styles.name}   ${(width < 640) ? "total-likes at-like-counter" : "link-counter-btn"}`} >
                                                {likeCounter}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`${stylesforth.p} d-flex justify-content-center align-items-center at-intro introductions`}>{memberSideData.introduction}</div>
                                    <div className="profrate-inner-devider at-prof-inner"></div>

                                </div>
                                <div className="blue-profile-btm with-no-shadow pt-0">
                                    <div className="profrate-inner basic-info">
                                        <div className="row">
                                            <div className="col-md-12 proinr-title py-0">{t('sideCharacterProfile.BasicInformation')}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.PhoneNumber')}</div>
                                            {id == memberid ?
                                                <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{isEmpty(memberSideData.phone) ? t('common.n_a') : phoneNumberMasking(memberSideData.phone, "-")}</div>
                                                :
                                                (!isEmpty(memberSideData.request) ?
                                                    memberSideData.request.status == KEYWORDS.PROJECT_EVENT.ACCEPTED ?
                                                        <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{isEmpty(memberSideData.phone) ? t('common.n_a') : phoneNumberMasking(memberSideData.phone, "-")}</div> :
                                                        <div className="col-md-6 alnright proinr-right proinr-cmn py-0 fe-phonenumber-hide">{isEmpty(memberSideData.phone) ? t('common.n_a') : memberSideData.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>

                                                    :
                                                    <div className="col-md-6 alnright proinr-right proinr-cmn py-0 fe-phonenumber-hide">{isEmpty(memberSideData.phone) ? t('common.n_a') : memberSideData.phone.slice(0, 3) + " -"}{starPatten()}{" -"}{starPatten()}</div>)
                                            }
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.Profession')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberSideData.profession.length == 0 ? t('common.n_a') : memberSideData.profession.map((value: any) => {
                                                return t('dynamic.profession.' + value)
                                            }).join(", ")}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.Field')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0 at-word-break-tag">{field.length == 0 ? t('common.n_a') : field}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.Location')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{provices == null ? t('common.n_a') : provices.name}  {(districts == null || districts[0] == undefined) ? "" : districts[0].name}</div>
                                        </div>
                                        {(width < 640) ? <div className="profrate-inner-devider at-prof-inner"></div> :
                                            <div className="row">
                                                <div className="col-md-12 ">
                                                    <div className="profrate-inner-devider"></div>
                                                </div>
                                            </div>}
                                    </div>
                                    {memberSideData?.is_experienced == "no" ? (
                                        <div className="profrate-inner basic-info">
                                            <div className="row">
                                                <div className="col-md-12 proinr-title">{t('sideCharacterProfile.WorkExperience')}</div>
                                            </div>
                                            <div className="row ">
                                                <div className="col-md-6 col-6 alnleft proinr-left proinr-cmn py-0 total-exp">{t('sideCharacterProfile.TotalExperience')}</div>
                                                <div className="col-md-6 col-6 alnright proinr-right proinr-cmn py-0 total-exp">{t('sideCharacterProfile.workExp.unExp')}</div>
                                            </div>
                                        </div>
                                    ) : <WorkExp memberSideData={memberSideData} />}
                                    <div className="profrate-inner basic-info">
                                        <div className="row">
                                            <div className="col-md-12 proinr-title py-0">{t('sideCharacterProfile.ActivityInformation')}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.DesiredDate')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberSideData.desired_date == null ? t('common.n_a') : t('dynamic.desired_date.' + memberSideData.desired_date)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.DesiredTime')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberSideData.desired_time == null ? t('common.n_a') : t('dynamic.desired_time.' + memberSideData.desired_time)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.DesiredProjectType')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberSideData.desired_project_type == null ? t('common.n_a') : t('dynamic.desired_project_type.' + memberSideData.desired_project_type)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.Insurance')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberSideData.insurance_status == null ? t('common.n_a') : t('dynamic.insurance_status.' + memberSideData.insurance_status)}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 alnleft proinr-left proinr-cmn py-0">{t('sideCharacterProfile.DesiredWorkType')}</div>
                                            <div className="col-md-6 alnright proinr-right proinr-cmn py-0">{memberSideData.desired_work_type == null ? t('common.n_a') : t('dynamic.desired_work_type.' + memberSideData.desired_work_type)}</div>
                                        </div>

                                        {((isEmpty(memberSideData.homepage_link) && isEmpty(memberSideData.facebook_link) && isEmpty(memberSideData.instagram_link) && isEmpty(memberSideData.other_link)) && isEmpty(memberSideData.portfolios)) ? null :
                                            (<div className="row">
                                                <div className="col-md-12">
                                                    <div className="profrate-inner-devider at-work-end"></div>
                                                </div>
                                            </div>)}
                                    </div>


                                    {(isEmpty(memberSideData.homepage_link) && isEmpty(memberSideData.facebook_link) && isEmpty(memberSideData.instagram_link) && isEmpty(memberSideData.other_link)) ? null : (
                                        <div className="profrate-inner basic-info">
                                            <div className="row">
                                                <div className="col-md-12 proinr-title">{t('sideCharacterProfile.Links')}</div>
                                            </div>
                                            {/* <div className={`${stylessec.flw} at-link-main hm-social-profile-lists-ctn`} >
                                            <ul className="proflist at-list-prof hm-social-profile-lists">
                                                {!isEmpty(memberSideData.homepage_link) && (<li>
                                                    <a href={isValidUrl(memberSideData.homepage_link) ? memberSideData.homepage_link : "http://" + memberSideData.homepage_link} target="_blank">
                                                        <Button><img src='../home.svg' /></Button>
                                                    </a>
                                                </li>)}
                                                {!isEmpty(memberSideData.facebook_link) && (<li>
                                                    <a href={isValidUrl(memberSideData.facebook_link) ? memberSideData.facebook_link : "http://" + memberSideData.facebook_link} target="_blank">
                                                        <Button> <img src='../Fb.svg' /></Button>
                                                    </a>
                                                </li>)}
                                                {!isEmpty(memberSideData.instagram_link) && (<li>
                                                    <a href={isValidUrl(memberSideData.instagram_link) ? memberSideData.instagram_link : "http://" + memberSideData.instagram_link} target="_blank">
                                                        <Button><img src='../insta.svg' /></Button>
                                                    </a>
                                                </li>)}
                                                {!isEmpty(memberSideData.other_link) && (<li>
                                                    <a href={isValidUrl(memberSideData.other_link) ? memberSideData.other_link : "http://" + memberSideData.other_link} target="_blank">
                                                        <Button><img src='../pc.svg' /></Button>
                                                    </a>
                                                </li>)}
                                            </ul>
                                        </div> */}

                                            <div className="hm-social-link-list-ctn">
                                                <ul className="hm-social-link-btn-list">
                                                    {!isEmpty(memberSideData.homepage_link) && (<li>
                                                        <a href={isValidUrl(memberSideData.homepage_link) ? memberSideData.homepage_link : "http://" + memberSideData.homepage_link} target="_blank">
                                                            <Button><img src='../home.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberSideData.facebook_link) && (<li>
                                                        <a href={isValidUrl(memberSideData.facebook_link) ? memberSideData.facebook_link : "http://" + memberSideData.facebook_link} target="_blank">
                                                            <Button> <img src='../Fb.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberSideData.instagram_link) && (<li>
                                                        <a href={isValidUrl(memberSideData.instagram_link) ? memberSideData.instagram_link : "http://" + memberSideData.instagram_link} target="_blank">
                                                            <Button><img src='../insta.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                    {!isEmpty(memberSideData.other_link) && (<li>
                                                        <a href={isValidUrl(memberSideData.other_link) ? memberSideData.other_link : "http://" + memberSideData.other_link} target="_blank">
                                                            <Button><img src='../pc.svg' /></Button>
                                                        </a>
                                                    </li>)}
                                                </ul>
                                            </div>
                                            {!isEmpty(memberSideData.portfolios) && (
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="profrate-inner-devider hm-work-end-port"></div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>)}
                                    {/* {!isEmpty(memberSideData.portfolios) && (
                                    <>
                                        <div className="profrate-inner basic-info">
                                            <div className="row">
                                                <div className="col-md-12 proinr-title">{t('sideCharacterProfile.Portfolio')}</div>
                                            </div>
                                            <div className="row imgupload-inner-row">
                                                <div className="imgupload-inner at-imgupload">
                                                    {isMore ? memberSideData.portfolios.slice(0, 3).map((image: any) => (
                                                        <img src={image.file_path} />
                                                    )) : memberSideData.portfolios.map((image: any) => (
                                                        <img src={image.file_path} />
                                                    ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='profrate-inner profile-ViewMoreBtn'>
                                            {memberSideData.portfolios.length > 3 && <Button className="at-lstbtn" onClick={() => setIsMore(!isMore)}>{isMore ? t('sideCharacterProfile.SeeMore') : t('common.close')}</Button>}
                                        </div>
                                    </>
                                )} */}

                                    {(width < 640) ?
                                        !isEmpty(memberSideData.portfolios) && (
                                            <>
                                                <div className="profrate-inner basic-info">
                                                    <div className="row">
                                                        <div className="col-md-12 proinr-title">{t('clientProfile.IntroductoryImages')}</div>
                                                    </div>
                                                    <div className="row imgupload-inner-row at-imgup-main">
                                                        <div className="imgupload-inner at-imgupload">
                                                            {isMore ? memberSideData.portfolios.slice(0, 2).map((image: any) => (
                                                                <img src={image.file_path} />
                                                            )) : memberSideData.portfolios.map((image: any) => (
                                                                <img src={image.file_path} />
                                                            ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='profrate-inner profile-ViewMoreBtn at-profile-vm'>
                                                    {memberSideData.portfolios.length > 2 && <Button className={`${stylesforth.lstbtn} ${id == memberid ? "at-seemore-btn-mid" : "at-seemore-btn"} `} onClick={() => setIsMore(!isMore)}>{isMore ? t('sideCharacterProfile.SeeMore') : t('common.close')}</Button>}
                                                </div>
                                            </>
                                        )

                                        :

                                        !isEmpty(memberSideData.portfolios) && (
                                            <>
                                                <div className="profrate-inner basic-info">
                                                    <div className="row">
                                                        <div className="col-md-12 proinr-title">{t('clientProfile.IntroductoryImages')}</div>
                                                    </div>
                                                    <div className="row imgupload-inner-row">
                                                        <div className="imgupload-inner at-imgupload">
                                                            {isMore ? memberSideData.portfolios.slice(0, 3).map((image: any) => (
                                                                <img src={image.file_path} />
                                                            )) : memberSideData.portfolios.map((image: any) => (
                                                                <img src={image.file_path} />
                                                            ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='profrate-inner profile-ViewMoreBtn hm-profile-ViewMoreBtn'>
                                                    {memberSideData.portfolios.length > 3 && <Button className={stylesforth.lstbtn} onClick={() => setIsMore(!isMore)}>{isMore ? t('sideCharacterProfile.SeeMore') : t('common.close')}</Button>}
                                                </div>
                                            </>
                                        )}

                                    {id == memberid ? null : <div className='profrate-inner basic-info'>
                                        {(width < 640) ? isEmpty(memberSideData.portfolios) ? <div className="profrate-inner-devider at-prof-inner at-mb-20"></div> : <div className="profrate-inner-devider at-prof-inner at-mb-20 at-rm-mt-20"></div> :
                                            <hr className="mt-5 mb-5" />}

                                        {/* <Button className={stylesforth.lstbtn} style={"requestedd" === "requested" ? { background: "#F4F4F4", borderRadius: "100px", color: "#9A9A9A" } : { background: "#00D6E3", borderRadius: "20px", color: "white" }}>인터뷰 요청하기</Button> */}
                                        <Button disabled={memberSideData.is_already_requested} onClick={() => router.push(getUrl(router.locale, ROUTES.PROFILE_REQUEST_CONTACT_INFOMRATION.replace('%id%', memberSideData.id + "")))} className={`  ${stylesforth.lstbtn}  ${memberSideData.is_already_requested && "at-req-disable"} at-fullsize-btn-md`}>
                                            {memberSideData.is_already_requested ? t('featureSearch.Requested') : t('featureSearch.RequestContactInformation2')}
                                        </Button>

                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div> : null}
                </AppLayout>
                : <h1>Loding..</h1>}
        </>
    )
}
export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default SideCharecterProfile



