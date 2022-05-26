import registerstyles from '../styles/Register.module.css'
import loginstyles from '../styles/login.module.css'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Card, Form, Input, Button, Switch, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import user from '../public/usergray.png'
import coin from '../public/coin.png'
import Image from 'next/image'
import { RightOutlined } from '@ant-design/icons'
import { CaretDownOutlined } from '@ant-design/icons';
import Head from 'next/head'
import styles from '../styles/Search.module.css'
import { GetServerSideProps } from 'next'
import { AppLayout } from '../components';
import { ApiMemberGet } from '../service/api';
import { PAYMENT_COIN_HISTORY } from '../constants/api';
import { isEmpty, numberWithCommas } from '../utils/helper';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { State } from '../redux/reducers/rootReducer';


function PurchaseBcoin() {
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
    const [bcoinData, setBcoinData] = useState<any>()
    const [filterYear, setFilterYear] = useState("");
    const [filterMonth, setFilterMonth] = useState("")
    const userData = useSelector((state: State) => state.auth.userData)

    const getCoinData = async () => {
        await ApiMemberGet(PAYMENT_COIN_HISTORY, { registration_type: userData.registration_type })
            .then((response: any) => {
                if (response.data && response.success) {
                    setBcoinData(response.data)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    useEffect(() => {
        getCoinData();
    }, [])

    const handleYear = async (date: any, dateString: any) => {
        console.log(date, "===", dateString)
        setFilterYear(dateString)
        await ApiMemberGet(`${PAYMENT_COIN_HISTORY}?year=${dateString}&month=${filterMonth}`, { registration_type: userData.registration_type })
            .then((response: any) => {
                if (response.data && response.success) {
                    setBcoinData(response.data)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }

    const handleMonth = async (date: any, dateString: any) => {
        setFilterMonth(dateString)
        await ApiMemberGet(`${PAYMENT_COIN_HISTORY}??year=${filterYear}&month=${dateString}`, { registration_type: userData.registration_type })
            .then((response: any) => {
                if (response.data && response.success) {
                    setBcoinData(response.data)
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }


    return (
        <AppLayout title={t('myPages.purchasehistory')} whiteHeader={true}>
            {bcoinData && <div className="jumbotron fe-page-outer ft-purchase-history">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <div className="ft-head-outer">
                            <h1 className='ft-heading'>
                                {width < 640 ? t('myPages.Purchase/UseHistory') : t('myPages.purchasehistory')}
                            </h1>
                            <div className="right-dropdown">
                                <div className="ft-year-drop">
                                    <DatePicker onChange={handleYear} suffixIcon={<CaretDownOutlined />} picker="year" className="ft-select-date fe-pdate-year" />
                                    {isEmpty(filterYear) ? null : <span className="txt">년</span>}
                                    {/* <div className="txt">년</div> */}
                                </div>
                                <div className="ft-month-drop">
                                    <DatePicker onChange={handleMonth} format="MM" suffixIcon={<CaretDownOutlined />} picker="month" className="ft-select-date fe-pdate-year" />
                                    {isEmpty(filterMonth) ? null : <span className="txt">월</span>}
                                </div>
                            </div>
                        </div>
                        <div className="ft-histroy-main">
                            <div className="ft-card-top">
                                <div className="ft-block">
                                    <Image src={coin} alt="User Image" />
                                    <p className="ft-coins">
                                        {numberWithCommas(bcoinData.total_coins)} {t('common.bcoin.coins')}
                                    </p>
                                    <p className="ft-bcoins">{t('myPages.bCoinOwn')}</p>
                                </div>
                                <div className="ft-block">
                                    <Image src={coin} alt="User Image" />
                                    <p className="ft-coins">
                                        {numberWithCommas(bcoinData.purchase_coins)} {t('common.bcoin.coins')}
                                    </p>
                                    <p className="ft-bcoins">{t('common.bcoin.BCoinsPurchased')}</p>
                                </div>
                                <div className="ft-block">
                                    <Image src={coin} alt="User Image" />
                                    <p className="ft-coins">
                                        {numberWithCommas(bcoinData.bonus_coins)} {t('common.bcoin.coins')}
                                    </p>
                                    <p className="ft-bcoins">{t('myPages.bonusbcoin')}</p>
                                </div>
                            </div>
                            <div className="ft-card-bottom">
                                {isEmpty(bcoinData.coin_history) ? null :
                                    bcoinData.coin_history.map((coins: any) => {
                                        return (
                                            <>
                                                {coins.is_purchase ?
                                                    <div className="ft-coin-detail">
                                                        <div className="left">
                                                            <Image src={coin} alt="User Image" />
                                                            <span className={`ft-coin-value`} style={{ color: "#00d6e3" }}>+ {numberWithCommas(coins.coins)} {t('common.bcoin.coins')}</span>
                                                        </div>
                                                        <div className="right">
                                                            <p className={`ft-purchase`}>{t('myPages.bCoinPurchase')}</p>
                                                            <p className="ft-purchase-date">{moment(coins.created_at).format("YYYY.MM.DD")}</p>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="ft-coin-detail">
                                                        <div className="left">
                                                            <Image src={coin} alt="User Image" />
                                                            <span className={`ft-coin-value`} style={{ color: "#FF5C00" }}>- {numberWithCommas(coins.coins)} {t('common.bcoin.coins')}</span>
                                                        </div>
                                                        <div className="right">
                                                            <p className={`ft-purchase`}>{coins?.details == "request-interview" ? t('myPages.interviewReq') : t('common.Requestcontactinformation')}</p>
                                                            <p className="ft-purchase-date">{moment(coins.created_at).format("YYYY.MM.DD")}</p>
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            }
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default PurchaseBcoin