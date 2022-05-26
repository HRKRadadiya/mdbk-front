import { Button, Form, Input, Modal, Select, Dropdown, Menu } from 'antd';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import router from 'next/router';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import styles from "../../../styles/components/pop.module.css";
import { AppLayout, MakeProfilePopup } from '../../../components'
import checkCircle from '../../../public/check-circle.svg'
import checkCircleFill from '../../../public/check-circle-fill.svg'
import { ApiMemberDelete, ApiMemberGet, ApiMemberPost } from '../../../service/api';
import { MEMBER_LIKE_UNLIKE, MESSAGE, MESSAGE_CREATE, MESSAGE_LIST, PROJECT, PROJECT_APPLY_PROJECT_APPLICATION, REQUEST_CREATE, REQUEST_MEMBER_PROFILE, SIDE_CHARACTER_PROFILE } from '../../../constants/api';
import { useEffect } from 'react';
import moment from 'moment';
import { getUrl, isEmpty, numberWithCommas } from '../../../utils/helper';

import { Modal as BootstrapModel } from 'react-bootstrap'
import { BCOINGUIDE, CLIENTPROFILEPROFILE, PROJECT_SIDECHARACTER, SIDECHARACTERPROFILE } from '../../../constants/routes';
import { useSelector } from 'react-redux';
import { State } from '../../../redux/reducers/rootReducer';
import { LIKE_TYPE_SIDE_CHARACTER } from '../../../constants/keywords';
import response from '../../forum/response';
import MakeRequestPopUp from '../../../components/popup/requestProfile';
import { ROUTES } from '../../../constants';
import NumberFormat from 'react-number-format';

function RequestContactInfomration() {
    const MAX_VAL = 999999999;
    const withValueCap = (inputObj: any) => {
        const { value } = inputObj;
        if (value <= MAX_VAL) return true;
        return false;
    };
    const { t } = useTranslation();
    const { Option } = Select
    const [amountDisable, setAmountDisable] = useState(false)
    const [is_Disable, setIs_Disable] = useState(true)
    const [isApply, setIsApply] = useState(false)
    const [isApplyError, setIsApplyError] = useState(false)
    const [isRequstDone, setIsRequstDone] = useState(false)
    const userData = useSelector((state: State) => state.auth.userData)
    const [isLike, setIsLike] = useState<boolean>()
    const [isCoin, setIsCoin] = useState(false)
    const [likeCounter, setLikeCounter] = useState<number>(0)
    const [selectMessage, setSelectMessage] = useState('common.ImportMessages')
    const { id } = router.query
    const [applyRequestDetails, setApplyRequestDetails] = useState<any>({
        to_member_id: 0,
        amount: 0,
        wage_type: "hourly",
        is_negotiable: "no",
        message_id: 0,
        message: "",
        registration_type: userData?.registration_type
    })
    const [leftCoin, setLeftCoin] = useState(0)
    const [clientRequest, setClientRequest] = useState<any>()
    const [visible, setVisible] = useState(false);
    const [sideCharData, setSideCharData] = useState<any>();
    const handleOk = () => {
        setVisible(false);
    };
    const memberid = useSelector((state: State) => state.auth.userData?.member?.id)

    const handleApplySuccess = () => {
        router.push(getUrl(router.locale, PROJECT_SIDECHARACTER))
    };

    const gotoPurchase = () => {
        router.push(getUrl(router.locale, BCOINGUIDE))
    };

    const gotoProfile = () => {
        router.push(getUrl(router.locale, CLIENTPROFILEPROFILE.replace("%id%", memberid)))
    }

    const [projectInformation, setProjectInformation] = useState<any>()
    const [memberMessage, setMemberMessage] = useState<any>()

    const getSideCharData = async () => {
        await ApiMemberGet(`${REQUEST_MEMBER_PROFILE}/${id}`, {
            registration_type: userData?.registration_type
        })
            .then(async (response: any) => {
                if (response.data && response.success) {
                    setSideCharData(response.data?.profile)
                    setClientRequest(response.data?.profile?.request)
                    setLikeCounter(response.data?.profile?.total_likes)
                    setApplyRequestDetails({ ...applyRequestDetails, to_member_id: response.data?.profile?.id })
                    setIsLike(response.data?.profile?.like_flag)
                } else {
                    console.log("No Data found")
                }
            })
            .catch((error: any) => {
                console.log("Error", error)
            })
    }

    const getMemberMessage = async () => {
        await ApiMemberGet(`${MESSAGE_LIST}`)
            .then(async (response: any) => {
                if (response.data && response.success) {
                    setMemberMessage(response.data)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }
    const [messageAction, setMessageAction] = useState(false)
    const [message, setMessage] = useState<any>("")
    useEffect(() => {
        if (message != "") {
            setMessageAction(false)
        } else {
            setMessageAction(true)
        }
    }, [message, applyRequestDetails])

    useEffect(() => {
        getSideCharData()
        getMemberMessage()
    }, [])

    useEffect(() => {
        if (applyRequestDetails.message != "" && applyRequestDetails.amount != 0) {
            setIs_Disable(false)
        } else if (applyRequestDetails.is_negotiable == "yes" && applyRequestDetails.message != "") {
            setIs_Disable(false)
        }
        else {
            setIs_Disable(true)
        }
    }, [applyRequestDetails])

    const TimeOptionsHourly = t('common.hourly')
    const TimeOptionsDaily = t('common.daily')
    const TimeOptionsMonthly = t('common.monthly')

    const ALL_TIMES: any = {
        [TimeOptionsHourly]: 'hourly',
        [TimeOptionsDaily]: 'daily',
        [TimeOptionsMonthly]: 'monthly',
    }


    const handleRequest = async () => {
        await ApiMemberPost(REQUEST_CREATE, applyRequestDetails)
            .then(async (response: any) => {
                if (response.data && response.success) {
                    setLeftCoin(response.data.available_coin)
                    setIsRequstDone(true)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(errorResult => {
                console.log("Error", errorResult)
                if (errorResult?.code == 400 && errorResult?.error?.is_profile_complete == false) {
                    setIsApplyError(true);
                }
                if (errorResult?.code == 400 && errorResult?.error?.is_enough_coin == false && errorResult?.error?.is_free_request == false) {
                    setIsCoin(true);
                }
            })
    }

    const handleSaveMessage = async () => {
        await ApiMemberPost(MESSAGE_CREATE, { message })
            .then(async (response: any) => {
                if (response.data && response.success) {
                    const data = memberMessage.filter((data: any) => data.id == response.data.id)
                    if (data.length == 0) {
                        setMemberMessage([...memberMessage, response.data])
                    }
                    setApplyRequestDetails({ ...applyRequestDetails, message_id: response.data.id })
                    setSelectMessage(response.data.message)
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

    function handleMenuClick(id: any) {
        setApplyRequestDetails({ ...applyRequestDetails, message_id: id })
        if (id == "0") {
            setSelectMessage('common.ImportMessages')
        } else {
            const data = memberMessage.find((m: any) => m.id == id)
            setApplyRequestDetails({ ...applyRequestDetails, message: data.message, message_id: data.id })
            setSelectMessage(data.message)
            setMessage(data.message)
        }
    }

    const handleMessageDelete = async (deleteId: number) => {
        const data = applyRequestDetails.message_id == deleteId
        const msg = memberMessage.find((m: any) => m.id == applyRequestDetails.message_id)
        setSelectMessage(data ? 'common.ImportMessages' : (isEmpty(msg) ? 'common.ImportMessages' : msg.message))
        setApplyRequestDetails({ ...applyRequestDetails, message_id: data ? 0 : (isEmpty(msg) ? 0 : msg.id) })
        setMemberMessage(memberMessage.filter((m: any) => m.id != deleteId))
        await ApiMemberDelete(`${MESSAGE}/${deleteId}`)
            .then((response: any) => {
                if (response.data && response.success) {

                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            }).finally(() => {
            })
    }


    return (
        <AppLayout title="Request contact information" whiteHeader={true}>
            {clientRequest && <div className="fe-page-outer ft-request-contact-info-page fe-dropdown-fix">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <h1 className='ft-heading'>
                            {t('common.Requestcontactinformation')}
                        </h1>
                        <div className="ft-apply-block">
                            <div className="top">
                                {sideCharData && sideCharData?.profile_picture != null ? <img src={sideCharData?.profile_picture} className="ft-apply-profile" />
                                    : <img src="/grayuser.png" className="ft-apply-profile" />}
                                <div className="detail">
                                    <div className="name">{sideCharData && sideCharData?.nick_name}</div>
                                    <div className="count">
                                        {id == memberid ? ((<img src="/heart.svg" className={`ft-heart-svg ${styles.heartimg}`} alt="Heart Icon" />)) :
                                            (isLike ? <img src="/heart.svg" onClick={(e) => handleLike(e, sideCharData.id)} className="heart-icon" alt="Heart Icon" /> : <img src="/unfavorite.png" onClick={(e) => handleLike(e, sideCharData.id)} className="heart-icon" alt="Heart Icon" />)}
                                        <span>{likeCounter}</span>
                                    </div>
                                </div>
                                <div className="desc">
                                    {sideCharData && sideCharData?.introduction}
                                </div>
                            </div>
                            <div className="bottom">
                                <Form name="apply-project" layout="vertical">
                                    {/* suggest amount */}
                                    <div className={`row l1 mb-40 ${amountDisable ? "disable" : ""}`}>
                                        <div className="col-12">
                                            <span className="ft-lbl">
                                                {t('projectCreation.SuggestedAmount')}
                                            </span>
                                        </div>
                                        <div className="col-12 mt-20">
                                            <div className="ft-input-box-wrap">
                                                <Select
                                                    disabled={amountDisable}
                                                    className="new-select-box ft-select-control cs-1 ft-hour-wage"
                                                    onChange={(e) => setApplyRequestDetails({ ...applyRequestDetails, wage_type: Object.values(ALL_TIMES)[Object.keys(ALL_TIMES).findIndex(type => type == e)] })}
                                                    defaultValue={TimeOptionsHourly}
                                                >
                                                    {ALL_TIMES && Object.keys(ALL_TIMES).map((value: string) => {
                                                        return <Option key={value} value={value}>{value}</Option>
                                                    })}
                                                </Select>
                                                <div className="ft-bugget fe-input">
                                                    <Form.Item
                                                        name="suggested_amount"
                                                        className="ft-control-wrap"
                                                    >
                                                        <NumberFormat thousandSeparator={true}
                                                            disabled={amountDisable}
                                                            placeholder="0"
                                                            autoComplete="off"
                                                            isAllowed={withValueCap}
                                                            value={applyRequestDetails.amount}
                                                            className={`ft-input-control ${amountDisable ? "disabled" : ""} ${router.locale == "kr" ? "kr" : "en"} fe-width-100`}
                                                            onValueChange={(value: any) => {
                                                                setApplyRequestDetails({ ...applyRequestDetails, amount: value.value })
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    <div className="ft-sug-amt">
                                                        <span className={`txt ${amountDisable ? "disabled" : ""}`}>{t('projectCreation.won')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`ft-budget-nb ft-ne ${amountDisable ? "ft-check" : ""}`}>
                                                <input type="checkbox" className="ft-budget-check" id="ft-budget-check" onChange={(e) => {
                                                    setApplyRequestDetails({ ...applyRequestDetails, is_negotiable: e.target.checked ? "yes" : "no" })
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

                                    {/* import saved message */}
                                    <div className="row l2 mb-40">
                                        <div className="col-12">
                                            <span className="ft-lbl">
                                                {t('applySideCharecter.ImportSavedMessages')}
                                            </span>
                                        </div>
                                        <div className="col-12 mt-20">
                                            <Dropdown
                                                className="ft-custom-dropdown-one"
                                                overlay={(
                                                    <Menu className="ft-custom-item-drop"  >
                                                        {/* <Menu.Item key={0} >
                                                            <div className="ft-drop-item fe-placeholder-select">
                                                                <div className="left" onClick={() => handleMenuClick(0)}>
                                                                    {t('common.ImportMessages')}
                                                                </div>
                                                                <div className="right">

                                                                </div>
                                                            </div>
                                                        </Menu.Item> */}
                                                        {memberMessage && memberMessage.map((message: any, index: number) => {
                                                            return (
                                                                <Menu.Item key={message.id}>
                                                                    <div className="ft-drop-item">
                                                                        <div className="left" onClick={() => handleMenuClick(message.id)}>
                                                                            {message.message}
                                                                        </div>
                                                                        <div className="right">
                                                                            <a onClick={() => handleMessageDelete(message.id)} className="ft-delete-link">{t('common.Delete')}</a>
                                                                        </div>
                                                                    </div>
                                                                </Menu.Item>
                                                            )
                                                        })}
                                                    </Menu>
                                                )} trigger={['click']}>
                                                <Button className={selectMessage == 'common.ImportMessages' ? `placeholder-txt` : ""}>
                                                    {selectMessage == 'common.ImportMessages' ? t('common.ImportMessages') : selectMessage}
                                                    <img src="/down-arr.svg" className="ft-drop-arr" />
                                                </Button>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    {/* contact info */}
                                    <div className="l3">
                                        <div
                                            className="ft-control-wrap">
                                            <div>
                                                <span className="ft-lbl">
                                                    {t('applySideCharecter.Addamessage')}
                                                </span>
                                            </div>
                                            <Input.TextArea
                                                rows={4}
                                                // maxLength={160}
                                                value={message}
                                                onChange={(e) => {
                                                    setApplyRequestDetails({ ...applyRequestDetails, message: e.target.value, message_id: 0 })
                                                    setMessageAction(false)
                                                    setMessage(e.target.value)
                                                }}
                                                placeholder={t('applySideCharecter.Requestcontactinfo')}
                                                className="ft-textarea-control mt-20" />
                                        </div>
                                        <div className="ft-save-msg">
                                            <Button className={`ft-default-rounded-btn1  ${messageAction ? "disable" : ""}`}
                                                disabled={messageAction} onClick={handleSaveMessage}>
                                                {t('common.SaveMessage')}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="ft-apply-btn-wrap">
                                        <Button className="ft-cancel-project-btn" onClick={() => router.back()}>
                                            {t('featureSearch.cancel')}
                                        </Button>
                                        <Button onClick={handleRequest} disabled={is_Disable} className={`ft-apply-project-btn ${is_Disable ? "disable" : ""}`} htmlType="submit">
                                            {clientRequest?.is_free_request ? (clientRequest?.total_free_request == 2 ? t('common.RequestwithR1') : t('common.RequestwithR2')) : t('common.Requestwithcoins')}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }

            <MakeRequestPopUp
                isProfileUncomplete={isRequstDone} desc={t('requestpopup.Youhavesuccessfullyrequested')} desc2={clientRequest?.is_free_request ? (clientRequest?.total_free_request == 2 ? t('requestpopup.request1') : t('requestpopup.request2')) : numberWithCommas(leftCoin)} desc3={clientRequest?.is_free_request ? t('requestpopup.copuen') : t('requestpopup.Bcoinsleft')}
                desc1={t('requestpopup.Younowhave')} />

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


            <MakeProfilePopup
                isProfileUncomplete={isApplyError}
                closePopup={setIsApplyError}
                desc={t('makeProfilePopUp.contactinfo')} />
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default RequestContactInfomration
