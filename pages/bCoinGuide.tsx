import Head from 'next/head'
import styles from '../styles/Request.module.css'
import React from 'react';
import { AppLayout, BCoinCard } from "../components"
import { Button, Divider, Modal } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import profiles from '../public/data'
import { GetServerSideProps } from 'next'
import { useState } from 'react';
import styles1 from "../styles/components/pop.module.css";
import { useEffect } from 'react';
import { ApiMemberGet } from '../service/api';
import { BCOIN_PACKAGES } from '../constants/api';
import Storage from '../service/storage';
import { TOKEN } from '../constants/storagekey';

function BCoinGuide() {
    const { t } = useTranslation();
    const [bcoinData, setBcoinData] = useState<any>()
    const token = Storage.get(TOKEN)
    const classValue = (token == undefined || token == null) ? "ft-bl-pages" : "ft-al-pages"
    const containerValue = (token == undefined || token == null) ? "w-800" : ""
    const getCoinData = async () => {
        await ApiMemberGet(BCOIN_PACKAGES)
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

    return (
        <AppLayout title={t('bCoin.purchaseBcoin')} whiteHeader={true} page={classValue} >
            <div className="coin-guide jumbotron fe-page-outer ft-bcoin-guide-page">
                <div className="ft-footer-static">
                    <div className={`ft-page-container ${containerValue}`}>
                        <h1 className='ft-heading'>
                            {t('bCoin.purchaseBcoin')}
                        </h1>
                        <div className="ft-bcoin-list">
                            {bcoinData && bcoinData.map((profile: any, index: number) =>
                                <BCoinCard key={index} profile={profile} />
                            )}
                        </div>
                    </div>
                    <div className="ft-notice">
                        <div className="ft-page-container w-800">
                            <div className="ft-coin-instruction at-coin-list">
                                <div className={`heading`}>{t('bCoin.notice')}</div>
                                <ul className="ft-detail">
                                    <li>
                                        {t('bCoin.list4')}
                                    </li>
                                    <li>
                                        {t('bCoin.list1')}
                                    </li>
                                    <li>
                                        {t('bCoin.list2')}
                                    </li>
                                    <li>
                                        {t('bCoin.list3')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default BCoinGuide