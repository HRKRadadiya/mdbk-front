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
    showMakeProfile: boolean;
    closeMakeProfile: any;
}

function MakeProfile({ showMakeProfile, closeMakeProfile }: IProps) {

    const { t } = useTranslation();
    const userData = useSelector((state: State) => state.auth.userData)

    const gotoEditProfile = () => {
        // let page = userData.registration_type == KEYWORDS.MEMBER.CLIENT ? ROUTES.EDIT_CLIENT_PROFILE : ROUTES.EDIT_SIDE_CHARACTER_PROFILE;
        // router.push(getUrl(router.locale, page))
    }

    return (
        <BootstrapModel
            show={showMakeProfile}
            onHide={closeMakeProfile}
            aria-labelledby="contained-BootstrapModel-title-vcenter"
            className="ft-custom-modal"
            dialogClassName="ft-make-profile"
            centered>
            <BootstrapModel.Header closeButton className="ft-pop-header">
                <BootstrapModel.Title>  {t('formQuestionPop.title')}</BootstrapModel.Title>
            </BootstrapModel.Header>
            <BootstrapModel.Body className="ft-pop-body">
                <div className="desc">{t('formQuestionPop.subTitle')}</div>
            </BootstrapModel.Body>
            <BootstrapModel.Footer className="ft-pop-footer">
                <Button onClick={gotoEditProfile} className="ft-pop-theme-btn">
                    {t('formQuestionPop.buttonTitle')}
                </Button>
            </BootstrapModel.Footer>
        </BootstrapModel>
    )
}
export default MakeProfile