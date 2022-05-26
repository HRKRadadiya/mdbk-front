import React from 'react';
import { Button } from 'antd';
import { Modal as BootstrapModel } from 'react-bootstrap'
import router from 'next/router';
import { getUrl } from '../../utils/helper';
import { KEYWORDS, ROUTES } from '../../constants';
import { useSelector } from 'react-redux';
import { State } from '../../redux/reducers/rootReducer';
import { useTranslation } from 'react-i18next';

interface IProps {
    isProfileUncomplete: boolean;
    desc1: string;
    desc2: any;
    desc3: string;
    desc: string;
}

function MakeRequestPopUp({ isProfileUncomplete, desc, desc1, desc2, desc3 }: IProps) {

    const { t } = useTranslation();
    const userData = useSelector((state: State) => state.auth.userData)

    const gotoEditProfile = () => {
        let page = userData.registration_type == KEYWORDS.MEMBER.SIDE_CHARACTER ? ROUTES.MEMBER_CLIENT_SEARCH_PROJECT : ROUTES.MEMBER_SEARCH_PROJECT;
        router.push(getUrl(router.locale, page))
    }

    return (
        <BootstrapModel
            show={isProfileUncomplete}
            onHide={gotoEditProfile}
            aria-labelledby="contained-BootstrapModel-title-vcenter"
            className="ft-custom-modal"
            dialogClassName="ft-make-profile"
            centered
        >
            <BootstrapModel.Header closeButton className="ft-pop-header">
                <BootstrapModel.Title> {t('requestpopup.RequestComplete')}</BootstrapModel.Title>
            </BootstrapModel.Header>
            <BootstrapModel.Body className="ft-pop-body">
                <div className="desc">{desc}</div>
                <div className="desc">{desc1}<span className="fe-requestcolor">{desc2}</span>{desc3}</div>
            </BootstrapModel.Body>
            <BootstrapModel.Footer className="ft-pop-footer">
                <Button onClick={gotoEditProfile} className="ft-pop-theme-btn">
                    {t('requestpopup.Confirm')}
                </Button>
            </BootstrapModel.Footer>
        </BootstrapModel>
    )
}
export default MakeRequestPopUp