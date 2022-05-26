
import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../../styles/Registration.module.css'
import { Button, Modal, Tabs, Upload } from 'antd';
import camera from '../../public/camera.svg'
import Image from 'next/image'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import styles1 from '../../styles/components/pop.module.css'
import { SideCharacterStep2, Footer, SideCharStep1, SideCharStep3, AppLayout } from '../../components'
import { useDispatch, useSelector } from 'react-redux';
import HeaderForMobile from '../../components/HeaderForMobile';
import { ApiMemberGet, ApiMemberPost } from '../../service/api';
import { PROFILE_RELATED_IMAGES, PROFILE_UPLOAD_PORTFOLIO, SIDE_CHARACTER_EDIT_PROFILE_STEP1, SIDE_CHARACTER_EDIT_PROFILE_STEP2, SIDE_CHARACTER_EDIT_PROFILE_STEP3, SIDE_CHARACTER_PROFILE } from '../../constants/api';
import moment from 'moment';
import { changeSideCharacterStates, updateSideCharacterProfileEditStep } from '../../redux/actions';
import Storage from '../../service/storage';
import { State } from '../../redux/reducers/rootReducer';
import { KEYWORDS, ROUTES } from '../../constants';
import { getUrl } from '../../utils/helper';
import { nike_name_Change, Profile_Picture_Change, progress_Change_SideChar } from '../../redux/actions/memberAction';
import { Modal as BootstrapModal } from 'react-bootstrap'
import { LOGIN } from '../../constants/routes';
import { updateSideCharecterProfile } from '../../redux/actions/sideCharacterAction';

function SideCharacter() {

    const router = useRouter()
    const { type } = router.query;
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const { TabPane } = Tabs;
    const [loading, setLoading] = useState(false)
    const [fetchProfileLoading, setFetchProfileLoading] = useState(true)
    const sideCharProgress = useSelector((state: State) => state.auth.sideCharProgress)
    const [activeTab, setActiveTab] = useState<any>('1');
    const [, forceUpdate] = useState({});
    const [i, seti] = useState<any>(null);
    const [stepComplete, setStepComplete] = useState<boolean>(false);
    const profileImageLink = useSelector((state: State) => state.sideChar.step.profile_picture)
    const [ProfleImage, setProfleImage] = useState(profileImageLink)
    const userData = useSelector((state: State) => state.auth.userData)
    const [imageUrl, setImageUrl] = useState<any>(null)
    const token = Storage.get('token');
    const [formError, setFormError] = useState<any>()
    const registration_type = useSelector((state: State) => state.auth.userData.registration_type)
    const [profileWithBonusCompletePopup, setProfileWithBonusCompletePopup] = useState(false);
    const [profileWithoutBonusCompletePopup, setProfileWithoutBonusCompletePopup] = useState(false);
    const [memberName, setMemberName] = useState("")
    const memberid = useSelector((state: State) => state.auth.userData.member.id)


    const moveProfilePage = () => {
        router.push(getUrl(router.locale, ROUTES.SIDECHARACTERPROFILE.replace('%id%', memberid + "")))
    }
    useEffect(() => {
        forceUpdate({});
    }, []);

    useEffect(() => {
        getdata();
    }, [fetchProfileLoading]);

    const getdata = async () => {
        await ApiMemberGet(`${SIDE_CHARACTER_PROFILE}/${memberid}`).then(async (response: any) => {
            if (response.data && response.success) {
                dispatch(progress_Change_SideChar(response.data.progress))
                dispatch(changeSideCharacterStates({
                    profilePercentage: response.data.progress,
                    step: response.data.side_character,
                }))
                setFetchProfileLoading(false)
                setMemberName(response.data.name)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            if (error?.code == 400 && error?.error?.message == "User Not Found") {
                router.push(getUrl(router.locale, LOGIN))
            }
            console.log("Error", error)
        })
    }

    const changeTab = (activeKey: any) => {
        dispatch(updateSideCharacterProfileEditStep(activeKey))
        setActiveTab(activeKey)
    };

    function getBase64(img: any, callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file: any) {
        let message: any;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const dummyRequest = ({ onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imgUrl: any) => {
                setLoading(false)
                setProfleImage(imgUrl)
                setImageUrl(info.file.originFileObj)
            });
        }
    };

    const onFormFinish = async (form1Data: any, changeTab: any, key: string) => {
        setStepComplete(true)
        const sideCharacter = {
            nick_name: form1Data.values.nickName,
            introduction: form1Data.values.introduction,
            phone: form1Data.values.phoneNumber,
            profession: form1Data.values.profession,
            homepage_link: form1Data.links.homepageLink,
            facebook_link: form1Data.links.facebookLink,
            instagram_link: form1Data.links.instagramLink,
            other_link: form1Data.links.otherLink,
            fields: form1Data.arr,
            locations: [
                form1Data.myLocationOne,
                form1Data.myLocationTwo
            ].filter(location => location.province_id && location.district_id)
        }
        if (imageUrl) {
            const formData = new FormData();
            formData.append('profile_image', imageUrl)
            formData.append('registration_type', registration_type)
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'content-type': 'multipart/form-data'
                }
            }
            await ApiMemberPost(PROFILE_UPLOAD_PORTFOLIO, formData, config).then(async (response: any) => {
                if (response.data && response.success) {
                } else {
                    console.log("No Data found")
                }
            }).catch((error: any) => console.log("Error", error))
        }

        // filter new files
        form1Data.fileList = form1Data.fileList.filter((item: any, index: number) => Number.isInteger(item.uid) != true)
        if (form1Data.fileList.length > 0) {
            const formData1 = new FormData();
            for (var x = 0; x < form1Data.fileList.length; x++) {
                formData1.append("related_images", form1Data.fileList[x].originFileObj);
            }
            formData1.append('registration_type', registration_type)
            const config1 = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'content-type': 'multipart/form-data'
                }
            }
            form1Data.fileList.length > 0 ?
                await ApiMemberPost(PROFILE_RELATED_IMAGES, formData1, config1).then(async (response: any) => {
                    if (response.data && response.success) {
                    } else {
                        console.log("No Data found")
                    }
                }).catch((error: any) => console.log("Error", error))
                : console.log("No Api Call")
        }

        await ApiMemberPost(SIDE_CHARACTER_EDIT_PROFILE_STEP1, sideCharacter).then(async (response: any) => {
            if (response.data && response.success) {
                const sideCharecterData = {
                    id: response.data?.side_character?.id,
                    name: userData?.member?.name,
                    nick_name: response.data?.side_character?.nick_name,
                    profile_picture: response.data?.side_character?.profile_picture
                }
                dispatch(progress_Change_SideChar(response.data.progress))
                dispatch(updateSideCharecterProfile(sideCharecterData))
                dispatch(Profile_Picture_Change(response.data?.side_character?.profile_picture))
                dispatch(nike_name_Change(response.data?.side_character?.nick_name))
                dispatch(changeSideCharacterStates({
                    profilePercentage: response.data.progress,
                    step: response.data.side_character,
                }))
                setFormError(null)
                changeTab(key)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => {
            console.log("Error", error)
            setFormError(error.error)
        })
        setStepComplete(false)
    }

    const onFormFinishStep2 = async (form2Data: any, changeTab: any, key: string) => {
        setStepComplete(true)
        let format = 'YYYY-M';
        let experiences = form2Data.isExperienced ? form2Data.experience.map((ex: any, index: number) => {
            return {
                ...ex,
                employment_end_date: index == 0 ? (form2Data.employeeStatus ? null : moment(ex.employment_end_date).format(format)) : moment(ex.employment_end_date).format(format),
                employment_start_date: moment(ex.employment_start_date).format(format),
                id: ex.id == undefined ? 0 : ex.id,
                is_employed_currently: index == 0 ? form2Data.employeeStatus : false,
            }
        }) : []
        await ApiMemberPost(SIDE_CHARACTER_EDIT_PROFILE_STEP2, {
            experience: experiences
        }).then(async (response: any) => {

            if (response.data && response.success) {
                dispatch(progress_Change_SideChar(response.data.progress))
                dispatch(changeSideCharacterStates({
                    profilePercentage: response.data.progress,
                    step: response.data.side_character,
                }))
                changeTab(key)
            } else {
                console.log("No Data found")
            }
        }).catch((error: any) => console.log("Error", error))
        setStepComplete(false)
    }

    const onFormFinishStep3 = async (formData: any) => {
        setStepComplete(true)
        await ApiMemberPost(SIDE_CHARACTER_EDIT_PROFILE_STEP3, formData)
            .then(async (response: any) => {
                setStepComplete(false)
                if (response.data && response.success) {
                    if (sideCharProgress < 80) {
                        setProfileWithBonusCompletePopup(true)
                    }
                    dispatch(progress_Change_SideChar(response.data.progress))
                    setFormError(null)
                    dispatch(changeSideCharacterStates({
                        profilePercentage: response.data.progress,
                        step: response.data.side_character,
                    }))
                    dispatch(nike_name_Change(response.data?.side_character?.nick_name))
                    if (sideCharProgress >= 80) {
                        moveProfilePage()
                    }
                } else {
                    console.log("No Data found")
                }
            }).catch((error: any) => {
                console.log("Error", error)
                setFormError(error.error)
            })
        setStepComplete(false)
    }

    return (
        <>
            {fetchProfileLoading ? null :
                <AppLayout title={t('clientProfile.clientProfileStep1.enterProfile')} whiteHeader={true}>
                    {i !== null ?
                        <img className="previewimg" src={i} alt="UploadImage" />
                        : null}
                    <div className={`${styles.mainContainer} pb-5 h-100 fe-page-outer fe-padding-bottom-fix ft-profile-pg ft-sc-profile-page`}>
                        <div className="ft-footer-static fe-padding-bottom">
                            <div className="ft-page-container">
                                <div className="mobilegone">
                                    <h1 className='ft-heading'>{t('clientProfile.clientProfileStep1.enterProfile')}</h1>
                                </div>
                                <div className={`${styles.maindiv} justify-content-center text-align-center ft-profile-card`}>
                                    <div className="registrationinner">
                                        <div>
                                            <div className="row d-flex justify-content-center text-align-center">
                                                <Upload
                                                    name="img"
                                                    listType="picture-card"
                                                    className="avatarUpload"
                                                    showUploadList={false}
                                                    beforeUpload={beforeUpload}
                                                    customRequest={dummyRequest}
                                                    onChange={handleChange}
                                                >
                                                    {ProfleImage ? <img src={ProfleImage} alt="avatar" style={{ width: '100%', borderRadius: '50%', height: '100%' }} /> : (<div>
                                                        <Image src={camera} alt="Profile Image" width={38} height={30} />
                                                    </div>)}
                                                </Upload>
                                            </div>

                                            <h2 className="ft-profile-name at-profile">{memberName}</h2>
                                            <Tabs activeKey={activeTab} onChange={changeTab} className="registerSteps sidecharacterreg ft-profile-tab" centered>
                                                <TabPane className="row-3" disabled={true} key={1} tab={<span  >STEP 1</span>} >
                                                    <SideCharStep1 stepComplete={stepComplete} setFormError={setFormError} formError={formError} onFinish={(values: any) => {
                                                        onFormFinish(values, changeTab, '2')
                                                    }} />
                                                </TabPane>
                                                <TabPane className="row-3" key={2} disabled={true} tab={<span className={styles.tabHeading} >STEP 2</span>} >
                                                    <SideCharacterStep2 stepComplete={stepComplete} onFinish={(values: any) => {
                                                        onFormFinishStep2(values, changeTab, '3')
                                                    }} onPreviousBtn={() => {
                                                        changeTab('1')
                                                    }} />
                                                </TabPane>

                                                <TabPane className="row-3" key={3} disabled={true} tab={<span className={styles.tabHeading} >STEP 3</span>} >
                                                    <SideCharStep3 stepComplete={stepComplete} formError={formError} onFinish={(values: any) => {
                                                        onFormFinishStep3(values)
                                                    }} onPreviousBtn={() => {
                                                        changeTab('2')
                                                    }} />
                                                </TabPane>
                                            </Tabs>
                                        </div>
                                    </div>
                                </div >
                            </div>
                        </div>
                    </div>

                    <BootstrapModal
                        show={profileWithBonusCompletePopup}
                        onHide={moveProfilePage}
                        className="at-bonus-model"
                        aria-labelledby="contained-modal-title-vcenter"
                        dialogClassName="bonusCashModal"
                        centered
                    >
                        <div className="jackpot-layer">
                            <div className="bonus-cash">
                                <h4>BONUS <br /> CASH!</h4>
                                <div className="star-one"><img src="/star1.png" /></div>
                                <div className="star-two"><img src="/start2.png" /></div>
                                <div className="round-1"><img src="/round-1.png" /></div>
                                <div className="round-2"><img src="/round-2.png" /></div>
                                <div className="round-3"><img src="/round-3.png" /></div>
                                <div className="coin-1"><img src="/coin-1.png" className="hide-mobile" /><img src="/coin-1-min.png" className="view-mobile" /></div>
                                <div className="coin-2"><img src="/coin-2.png" className="hide-mobile" /><img src="/coin-2-min.png" className="view-mobile" /></div>
                                <div className="coin-3"><img src="/coin-3.png" className="hide-mobile" /><img src="/coin-3-min.png" className="view-mobile" /></div>
                                <div className="coin-4"><img src="/coin-4.png" className="hide-mobile" /><img src="/coin-4-min.png" className="view-mobile" /></div>
                                <div className="coin-5"><img src="/coin-5.png" className="hide-mobile" /><img src="/coin-5-min.png" className="view-mobile" /></div>
                                <div className="coin-6"><img src="/coin-6.png" className="hide-mobile" /><img src="/coin-6-min.png" className="view-mobile" /></div>
                                <div className="coin-7"><img src="/coin-6.png" className="hide-mobile" /><img src="/coin-7-min.png" className="view-mobile" /></div>
                            </div>
                        </div>
                        <BootstrapModal.Header closeButton className="p-0">
                            <BootstrapModal.Title>{t('common.title1')}<span>{t('common.title2')}</span></BootstrapModal.Title>
                        </BootstrapModal.Header>
                        <BootstrapModal.Body className="p-0">
                            <h3>{t('common.desc')}</h3>
                            <BootstrapModal.Footer className="p-0" >
                                <Button onClick={moveProfilePage}>
                                    {t('popUps.Confirm')}
                                </Button>
                            </BootstrapModal.Footer>
                        </BootstrapModal.Body>
                    </BootstrapModal>
                    {/* <Modal
                        visible={profileWithBonusCompletePopup}
                        maskClosable={false}
                        title={<div>
                            <img src="/BonusCoins2.svg" className="regiscomp2" />
                            <p style={{ fontWeight: "bold", fontSize: "30px", fontFamily: "SpoqaHanSansbold", lineHeight: "36px", color: "#16181C" }}>{t('popUps.Congratulations')}</p>
                            <p style={{ fontWeight: "bold", fontSize: "30px", fontFamily: "SpoqaHanSansbold", lineHeight: "36px", marginBottom: "20px", color: '#16181C' }}>
                                {t('popUps.80Done')}
                            </p>
                        </div>} 
                        centered
                        onOk={moveProfilePage}
                        onCancel={moveProfilePage}
                        className="pop-title-coin regiscomp2-model at-coin-model"
                        bodyStyle={{ fontFamily: "SpoqaHanSans", fontStyle: "normal", fontWeight: "normal", fontSize: "18px", lineHeight: "28px", color: " #16181C" }}
                        footer={[
                            <Button key="back" className={`${styles1.footerbtn} d-flex justify-content-center align-items-center`} onClick={moveProfilePage}>
                                {t('popUps.Confirm')}
                            </Button>
                        ]}
                    >
                        <p>{t('popUps.Youprofilecomplete')}

                            {t('popUps.Nowprojects')}
                        </p>
                    </Modal> */}

                    <BootstrapModal
                        onHide={moveProfilePage}
                        onExit={moveProfilePage}
                        show={profileWithoutBonusCompletePopup}
                        aria-labelledby="contained-modal-title-vcenter"
                        className="ft-custom-modal"
                        dialogClassName="ft-profile-reg-complete"
                        centered
                    >
                        <BootstrapModal.Header closeButton className="ft-pop-header">
                            <BootstrapModal.Title>{t('popUps.profile_register.title')}</BootstrapModal.Title>
                        </BootstrapModal.Header>
                        <BootstrapModal.Body className="ft-pop-body">
                            <div className="desc">
                                {t('popUps.profile_register.description')}
                            </div>
                        </BootstrapModal.Body>
                        <BootstrapModal.Footer className="ft-pop-footer">
                            <Button className="ft-pop-theme-btn" onClick={moveProfilePage}>
                                {t('common.Confirm')}
                            </Button>
                        </BootstrapModal.Footer>
                    </BootstrapModal>
                </AppLayout>
            }
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});


export default SideCharacter