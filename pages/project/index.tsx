import React, { useState } from 'react'
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components';
import { Button, Select } from 'antd'
import DefaultProfile from '../../public/profile-default.svg'
import { useEffect } from 'react';
import { PROJECT } from '../../constants/api';
import { ApiMemberGet } from '../../service/api';
import { useCallback } from 'react';
import { useRef } from 'react';
import useProjectData from '../../hooks/useAllProject';
import ProjectCard from '../../components/card/projectCard'
import router from 'next/router';
import { getUrl } from '../../utils/helper';
import { PROJECT_ID_CREATE } from '../../constants/routes';
import { useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import NotFound from '../../components/notFound';
import { isEmpty } from 'lodash';
import { Modal } from 'react-bootstrap'

function index() {
    const { t } = useTranslation();
    const { Option } = Select;
    const observer = useRef<any>()
    const [projectFilter, setProjectFilter] = useState({
        page: 1,
        profession: "all"
    })
    const userData = useSelector((state: State) => state.auth.userData)
    const [isPhoneVerify, setIsPhoneVerify] = useState(true)

    function handleChangeField(value: any) {
        setProjectFilter({ page: 1, profession: value })
    }

    const {
        getAllProject,
        hasMoreProject,
        loadingProject,
        errorProject
    } = useProjectData(projectFilter)

    const lastCardElementRefProject = useCallback((node) => {
        if (loadingProject) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMoreProject) {
                setProjectFilter({ ...projectFilter, page: projectFilter.page + 1 })
            }
        })
        if (node) observer.current.observe(node)
    }, [loadingProject, hasMoreProject])
    console.log(getAllProject)
    return (
        <AppLayout title="Project" whiteHeader={true}>
            <div className="fe-page-outer ft-project-list-page">
                <div className="ft-footer-static">
                    <div className="ft-search-section">
                        <div className="ft-page-container">
                            <div className="ft-subtitle-main">
                                <h1 className='ft-sub-title'>
                                    {t('featureSearch.Project')}
                                </h1>
                                <div className="right">
                                    <Select defaultValue={projectFilter.profession} onChange={handleChangeField} className="ft-custom-ant-select">
                                        <Option value="all">{t('search.dropdown.val1')}</Option>
                                        <Option value="development">{t('search.dropdown.val2')}</Option>
                                        <Option value="design">{t('search.dropdown.val3')}</Option>
                                        <Option value="marketing">{t('search.dropdown.val4')}</Option>
                                        <Option value="other">{t('search.dropdown.val5')}</Option>
                                    </Select>
                                </div>
                            </div>
                            <div className="ft-pp-btn-main">
                                <div className="ft-title-botton">{t('project.myProject')}</div>
                                <div className="ft-post-project-btn">
                                    <Button onClick={() => router.push(getUrl(router.locale, PROJECT_ID_CREATE))}>{t('header.PostaProject')}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ft-fabg">
                        <div className="ft-project-detail-card">
                            <div className="ft-page-container">
                                {!isEmpty(getAllProject) ?
                                    <div className="ft-project-card-wrap">
                                        {getAllProject.map((project: any, index: number) => {
                                            if (getAllProject.length === index + 1) {
                                                return (
                                                    <ProjectCard key={index} project={project} lastCardElementRef={lastCardElementRefProject} />
                                                )
                                            } else {
                                                return (
                                                    <ProjectCard key={index} project={project} />
                                                )
                                            }
                                        })
                                        }
                                    </div> :
                                    // Not found
                                    <NotFound />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* please make your profile modal popup */}
            {/* <Modal
                show={isPhoneVerify}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-make-profile"
                centered
            >
                <Modal.Header closeButton className="ft-pop-header">
                    <Modal.Title>프로필을 등록해주세요</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ft-pop-body">
                    <div className="desc">
                        지식톡에 노출될 고객님의 프로필을 먼저 등록하신 후
                        질문을 작성해 주세요!
                    </div>
                </Modal.Body>
                <Modal.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn">
                        프로필 등록하러 가기
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* profile edit complete modal popup */}
            {/* <Modal
                show={true}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-profile-edit-complete"
                centered
            >
                <Modal.Header closeButton className="ft-pop-header">
                    <Modal.Title>{t('popUps.editProject.ProjectEditComplete')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ft-pop-body">
                    <div className="desc">
                        {t('popUps.editProject.Youfinishededitingproject')}
                    </div>
                </Modal.Body>
                <Modal.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn">
                        {t('popUps.editProject.Confirm')}
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* not enough b-coins modal popup */}
            {/* <Modal
                show={isPhoneVerify}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-not-enough-bcoin"
                centered
            >
                <Modal.Header closeButton className="ft-pop-header">
                    <Modal.Title>B캐시 부족</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ft-pop-body">
                    <div className="desc">
                        B캐시가 부족합니다!<br/>
                        B캐시를 충전하신 후 이용해주세요! :)
                    </div>
                </Modal.Body>
                <Modal.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn">
                        네
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* Request Complete modal popup
            <Modal
                show={isPhoneVerify}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-request-Complete "
                centered
            >
                <Modal.Header closeButton className="ft-pop-header">
                    <Modal.Title>요청 완료</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ft-pop-body">
                    <div className="desc">
                    성공적으로 인터뷰 요청이 완료되었습니다.
                    </div>
                </Modal.Body>
                <Modal.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn">
                       확인
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* contact request complete modal popup */}
            {/* <Modal
                show={isPhoneVerify}
                aria-labelledby="contained-modal-title-vcenter"
                className="ft-custom-modal"
                dialogClassName="ft-contact-request-complete"
                centered
            >
                <Modal.Header closeButton className="ft-pop-header">
                    <Modal.Title>요청 완료</Modal.Title>
                </Modal.Header>
                <Modal.Body className="ft-pop-body">
                    <div className="desc">
                        성공적으로 연락처 요청이 완료되었습니다.<br />
                        현재 <span className="ft-coin-value">10,000</span> 캐시가 남았습니다.

                    </div>
                </Modal.Body>
                <Modal.Footer className="ft-pop-footer">
                    <Button className="ft-pop-theme-btn">
                        확인
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </AppLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default index
