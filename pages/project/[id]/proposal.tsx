import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../../components';
import { Button, Modal } from 'antd';
import { GetServerSideProps } from 'next';
import Dummy from '../../../public/PopupImage.svg'
import CloseIcon from '../../../public/grey-close.svg'
import Image from 'next/image'
import { useEffect } from 'react';
import styles from "../../../styles/components/pop.module.css";
import { PROJECT } from '../../../constants/api';
import router from 'next/router';
import { ApiMemberDelete, ApiMemberGet } from '../../../service/api';
import { useState } from 'react';
import { getUrl, isEmpty, numberWithCommas, projectAmount } from '../../../utils/helper';
import { PROJECT_ID_APPLICATION, PROJECT_ID_APPLY, PROJECT_ID_EDIT, PROJECT_SIDECHARACTER } from '../../../constants/routes';
import { State } from '../../../redux/reducers/rootReducer';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Modal as BootstrapModal } from 'react-bootstrap'
import { PROJECT_EVENT } from '../../../constants/keywords';

function ProposalPage() {
    const { t } = useTranslation();
    const { id } = router.query
    const [visible, setVisible] = useState(false);
    const userData = useSelector((state: State) => state.auth.userData)
    const [projectApplicationStatus, setProjectApplicationStatus] = useState("")
    const handleOk = async () => {
        await ApiMemberDelete(`${PROJECT}/${id}`)
            .then((response: any) => {
                if (response.data && response.success) {
                    router.push(getUrl(router.locale, PROJECT))
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    };

    const handleCancel = () => {
        setVisible(false);
    };
    const [projectPerposalData, setProjectPerposalData] = useState<any>()
    useEffect(() => {
        getPerposalData()
    }, [])

    const getPerposalData = async () => {
        await ApiMemberGet(`${PROJECT}/${id}`, { registration_type: userData?.registration_type })
            .then(async (response: any) => {
                if (response.data && response.success) {
                    setProjectPerposalData(response.data.project)
                    setProjectApplicationStatus((userData?.registration_type == 2 ? (isEmpty(response.data.project?.available_request) ? "" : response.data.project?.available_request?.status) : ""))
                } else {
                    console.log("No Data found")
                }
            })
            .catch(error => {
                console.log("Error", error)
            })
    }


    return (
        <AppLayout title={t('projectRegistrationClient.pageTitle')} whiteHeader={true}>
            <div className="fe-page-outer ft-proposal-page">
                <div className="ft-footer-static">
                    <div className="ft-page-container">
                        <h1 className='ft-heading'>
                            {userData.registration_type == 1 ? t('project.seeMyProposal') : t('project.seeMyProposal1')}
                        </h1>
                        {projectPerposalData &&
                            <div className="ft-post-project-card ft-proposal-detail-block">
                                <div className="close-icon" onClick={() => userData?.registration_type == 1 ? router.push(getUrl(router.locale, PROJECT)) : router.push(getUrl(router.locale, PROJECT_SIDECHARACTER))}>
                                    <Image src={CloseIcon} />
                                </div>
                                <div className="wrap">
                                    <div className="ft-plbl"> {t('seeProjectDetails.Projectprofession')}</div>
                                    <div className="ft-pval">{t('dynamic.profession.' + projectPerposalData.profession)}</div>
                                </div>
                                <div className="wrap">
                                    <div className="ft-plbl">{t('seeProjectDetails.Projectfield')}</div>
                                    <div className="ft-pval">{projectPerposalData.field}</div>
                                </div>
                                <div className="wrap">
                                    <div className="ft-plbl">{t('seeProjectDetails.Projectplanningstage')}</div>
                                    <div className="ft-pval">{projectPerposalData.current_planning_stage == "other" ? projectPerposalData.direct_input : t('dynamic.' + projectPerposalData.current_planning_stage)}</div>
                                </div>
                                <div className="wrap">
                                    <div className="ft-plbl">{t('seeProjectDetails.Projectbudget')}</div>
                                    {projectPerposalData?.is_negotiable == "yes" ?
                                        <div className="ft-pval">{t('common.TBD')}</div>
                                        :
                                        <div className="ft-pval">{numberWithCommas(projectAmount(projectPerposalData.suggested_amount, router))}{t('common.won1')}</div>
                                    }
                                </div>
                                <div className="wrap">
                                    <div className="ft-plbl">{t('seeProjectDetails.Projectscheduledfor')}</div>
                                    <div className="ft-pval">{projectPerposalData.schedule == "direct" ? `${moment(projectPerposalData.schedule_direct_start_date).format('YYYY.MM.DD')} - ${moment(projectPerposalData.schedule_direct_end_date).format('YYYY.MM.DD')}` : t("dynamic.Schedule." + projectPerposalData.schedule)}</div>
                                </div>
                                <div className="wrap">
                                    <div className="ft-plbl">{t('seeProjectDetails.Desiredlocation')}</div>
                                    <div className="ft-pval">{projectPerposalData.location?.city_name}, {projectPerposalData.location?.district_name}</div>
                                </div>
                                <div className="wrap">
                                    <div className="ft-plbl">{t('seeProjectDetails.Otherdetails')}</div>
                                    <div className="ft-pval at-proposel-break">
                                        {projectPerposalData.work_related_details}
                                    </div>
                                </div>
                                <div className="wrap">
                                    <div className="ft-plbl">{t('seeProjectDetails.ProjectImages')}</div>
                                    <div className="ft-pic-outer">
                                        {projectPerposalData.project_images.map((image: any, index: number) => (
                                            <div className="ft-project-img" key={index}>
                                                <img src={image.file_path} alt="projectimage" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="ft-pp-btn-wrap hk-center-container">
                                    {userData?.registration_type == 2 ? (
                                        <>
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
                                            {projectApplicationStatus == "" &&
                                                <>
                                                    <Button
                                                        className="ant-btn ft-pp-prev-btn hm-proposal-btn1"
                                                        onClick={() =>
                                                            router.push(
                                                                getUrl(router.locale, PROJECT_SIDECHARACTER)
                                                            )
                                                        }
                                                    >
                                                        {t("featureSearch.cancel")}
                                                    </Button>
                                                    <Button
                                                        className="ant-btn ft-pp-next-btn hm-proposal-btn2 "
                                                        onClick={() =>
                                                            router.push(
                                                                getUrl(
                                                                    router.locale,
                                                                    PROJECT_ID_APPLY.replace("%id%", id + "")
                                                                )
                                                            )
                                                        }
                                                    >
                                                        {t("featureSearch.Apply")}
                                                    </Button>
                                                </>
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                className="ant-btn ft-pp-prev-btn hm-proposal-btn1"
                                                onClick={() => setVisible(true)}
                                            >
                                                {t("seeProjectDetails.Delete")}
                                            </Button>
                                            <Button
                                                className="ant-btn ft-pp-next-btn hm-proposal-btn2 "
                                                onClick={() =>
                                                    router.push(
                                                        getUrl(
                                                            router.locale,
                                                            PROJECT_ID_EDIT.replace("%id%", id + "")
                                                        )
                                                    )
                                                }
                                            >
                                                {t("seeProjectDetails.Edit")}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <BootstrapModal
                show={visible}
                onHide={() => setVisible(false)}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-proposal-delete "
                centered
            >
                <BootstrapModal.Header closeButton className="ft-pop-header">
                    <BootstrapModal.Title>{t("proposalDeletion.title")}</BootstrapModal.Title>
                </BootstrapModal.Header>
                <BootstrapModal.Body className="ft-pop-body">
                    <div className="desc">{t("proposalDeletion.description")}</div>
                </BootstrapModal.Body>
                <BootstrapModal.Footer className="ft-pop-footer">
                    <div className="ft-footer-btns ft-two-btn">
                        <Button className="ft-pop-border-btn" onClick={handleOk}>
                            {t("proposalDeletion.yes")}
                        </Button>
                        <Button className="ft-pop-theme-btn" onClick={() => setVisible(false)}>
                            {t("proposalDeletion.no")}
                        </Button>
                    </div>
                </BootstrapModal.Footer>
            </BootstrapModal>

        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default ProposalPage;
