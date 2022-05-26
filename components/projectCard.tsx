import React from 'react';
import styles from '../styles/components/Searchcard.module.css'
import { Button } from 'antd'
import Image from 'next/image'
import DR from '../public/grayprofile.png'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';


function ProjectCard({ profile }: any) {
    const router = useRouter()
    const { t } = useTranslation();

    return (<div className={`${styles.div1}`} style={{ marginTop: "30px" }}>
        <div className="row" style={{ padding: "20px 0px 20px 0px" }}>
            <div className="col-8" style={{ paddingLeft: "0px" }}>
                <div className="row">
                    <div className="col-12 d-flex align-items-start">
                        <div className="row">
                            <div className={`${styles.card1Text} col-12 d-block justify-content-start align-items-start`}>
                                {profile.webService}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-4" >
                <Button className={styles.seeMoreBtn}> {t('search.detail')}</Button>
            </div>
        </div>
        <hr className="w-100" />
        <div className="row" style={{ padding: "10px 0px 0px 20px" }}>
            {profile && profile.projectdetails && profile.projectdetails.map((detail: any, i: number) => {
                return (<Button key={i} className={styles.buttonTextSec}>
                    <span className={styles.butttonLabel}>{detail.label}</span>&nbsp;
                    <span>{detail.value}</span>
                </Button>)
            })}
        </div>
        <div className="row" style={{ padding: "20px 20px 20px 20px" }}>
            <div className="col-4">
                <span className={styles.topMenu} style={{ lineHeight: "36px" }}>
                    {profile.footerlabel}
                </span>
            </div>

            <div className={`${styles.topMenu} col-8 d-flex justify-content-end align-items-center`} style={{ lineHeight: "26px" }}>
                <span className={`${styles.avatarProject}`}>
                    <Image src={DR} alt="user" />
                </span>
                <span className={`${styles.avatarProject}`}>
                    <Image src={DR} alt="user" />
                </span>
                <span className={`${styles.avatarProject}`}>
                    <Image src={DR} alt="user" />
                </span>
                <span className={`${styles.avatarProject}`}>
                    <Image src={DR} alt="user" />
                </span>
                {profile.applicant}
            </div>

        </div>
    </div >

    )
}

export default ProjectCard