import React, { useState } from 'react';
import Head from 'next/head'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ProjectCard } from '../../components'
import { Menu, Dropdown, Button, Tabs, Divider, Radio, Form, Input } from 'antd';
import styles from '../../styles/Search.module.css'
import stylessec from '../../styles/searchdetail.module.css';
import profiles from '../../public/data'
import { GetServerSideProps } from 'next'

function Project() {
    const { t } = useTranslation();

    return (
        <div className="jumbotron">
            <Head>
                <title>{t('home.search')}</title>
                <meta name="description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Divider className="p-0 m-0" />
            <div className={`${styles.mainContainer} pt-5 pb-5 h-100`}>
                <div className="col4-cmn-cntr-800">
                    <div className="row pt-4 d-flex justify-content-center">
                        <div className="col-6">
                            <p className={styles.heading}>
                                {t('header.project')}
                            </p>
                            <p className={styles.projectH2}>
                                {t('project.myProject')}
                            </p>
                        </div>
                        <div className="col-6">
                            <div className="dropdown" style={{ float: "right" }}>
                                <Dropdown overlay={() => (<Menu>
                                    <Menu.Item className={styles.dropdownitem}>{t('search.dropdown.val1')}</Menu.Item>
                                    <Menu.Item className={styles.dropdownActiveitem}>{t('search.dropdown.val2')}</Menu.Item>
                                    <Menu.Item className={styles.dropdownitem}>{t('search.dropdown.val3')}</Menu.Item>
                                    <Menu.Item className={styles.dropdownitem}>{t('search.dropdown.val4')}</Menu.Item>
                                    <Menu.Item className={styles.dropdownitem}>{t('search.dropdown.val5')}</Menu.Item>
                                </Menu>)
                                }>
                                    <Button className={styles.dropdownBtn}>{t('search.dev')}<img src="/arrowdown.svg" style={{ float: "right", paddingTop: "10px" }} /></Button>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8 offset-2">
                            <Button className={styles.primaryButton} > {t('home.forth.para4')}</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Divider className="p-0 m-0" />
            <div className="h-100 pb-5">
                {(<div className="col4-cmn-cntr-800">
                    {profiles.project.map((profile, index) => <ProjectCard key={index} profile={profile} />)}
                </div>)}
            </div>
        </div >
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});


export default Project