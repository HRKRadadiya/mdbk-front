import React from 'react';
import { Button, Modal } from 'antd'
import Image from 'next/image'
import { ArrowRightOutlined } from '@ant-design/icons'
import SearchUserPlaceholder from '../public/SearchUserPlaceholder.svg'
import Heart from '../public/heart.svg'
import DR from '../public/coin.png'
import RightArrow from '../public/right-arrow.svg'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import styles1 from "../styles/components/pop.module.css";
import { useState } from 'react';
import { getUrl, numberWithCommas } from '../utils/helper';
import { ROUTES } from '../constants';
import { ApiMemberPost } from '../service/api';
import { PAYMENT_PURCHASE_PACKAGE } from '../constants/api';
import Storage from '../service/storage';
import { LOGIN } from '../constants/routes';
import moment from 'moment';
import { Modal as BootstrapModal } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';

function BCoinCard({ profile }: any) {
    const router = useRouter()
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const userData = useSelector((state: State) => state.auth.userData)
    const token = Storage.get('token');
    const [loadingState, setLoadingState] = useState<any>();
    const handleOk = async (package_id: number) => {
        setLoadingState(true)
        await ApiMemberPost(PAYMENT_PURCHASE_PACKAGE, {
            package_id,
            registration_type: userData.registration_type
        })
            .then((response: any) => {
                if (response.data && response.success) {
                    setVisible(false);
                    setLoadingState(false)
                    setPaymentSuccess(true)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    };

    const handlePayment = () => {
        router.push(getUrl(router.locale, ROUTES.MYPAGE))
    };

    const handleCancel = () => {
        setVisible(false);
        setPaymentSuccess(false);
    };

    return (
        <>
            <div className="ft-coin-card">
                <div className="left">
                    <div className="coins-main">
                        <Image src={DR} alt="User Image" />
                        <div className="coins">
                            <span className="value">{numberWithCommas(profile.coins)}</span>
                            <span className="txt">{t('bCoin.coins')}</span>
                        </div>
                    </div>
                    <div className="won-coin">
                        <span className="value">{numberWithCommas(profile.price)}</span>
                        <span className="txt at-won-text">{t('bCoin.won')}</span>
                    </div>
                </div>
                <div className="right">
                    <Button className={`rounded-btn`} onClick={() => (token != null || token != undefined) ? setVisible(true) : router.push(getUrl(router.locale, LOGIN))}>
                        <img src={RightArrow.src} />
                    </Button>
                </div>
            </div>

            <Modal maskClosable={false}
                visible={visible}
                title={
                    <div className="ft-title">
                        {t("common.bcoin.Payment")}
                    </div>
                }
                centered
                onOk={() => handleOk(profile.id)}
                onCancel={handleCancel}
                className="paymentPopup ft-payment-popup"
                footer={[
                    <Button
                        loading={loadingState}
                        key="back"
                        className={`${styles1.footerbtn} ft-pay-btn`}
                        onClick={() => handleOk(profile.id)}
                    >
                        <span className="ft-paytime">{numberWithCommas(profile.price)}</span>{t("common.bcoin.paytime")}
                    </Button>,
                ]}
            >
                <div className="ft-payment-detail-wrap">
                    <div className="left">
                        <img src="/bcoin_popup_image.png" className="coin-icon" />
                        <div className="desc">
                            <div className="coins">
                                {numberWithCommas(profile.coins)} <span>{t("common.bcoin.coins")}</span>
                            </div>
                            <div className="date">{moment(new Date()).format("YYYY.MM.DD")} {t("common.bcoin.yearsstarting")}</div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="won">
                            {numberWithCommas(profile.price)} <span>{t("common.bcoin.won")}</span>
                        </div>
                    </div>
                </div>
            </Modal>

            <BootstrapModal
                show={paymentSuccess}
                onHide={() => setPaymentSuccess(false)}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-payment-Complete "
                centered
            >
                <BootstrapModal.Header closeButton className="ft-pop-header">
                    <BootstrapModal.Title>{t("paymentDone.PaymentComplete")}</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body className="ft-pop-body">
                    <div className="desc">{t("paymentDone.Paymenthascompleted")}</div>
                    <div className="desc">{t("paymentDone.paymentdetails")}</div>
                </BootstrapModal.Body>
                <BootstrapModal.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn" onClick={handlePayment}>
                        {t("paymentDone.Confirm")}
                    </Button>
                </BootstrapModal.Footer>
            </BootstrapModal>
        </ >

    )
}

export default BCoinCard