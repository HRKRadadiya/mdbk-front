import React from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { Modal as BootstrapModel } from 'react-bootstrap'


interface IProps {
    isPhoneVerify: boolean;
    handlePhoneVerifyClose: any;
}

function PhoneVerifyPopup({ isPhoneVerify, handlePhoneVerifyClose }: IProps) {

    const { t } = useTranslation();

    return (
        // <Modal
        //     show={isPhoneVerify}
        //     onHide={handlePhoneVerifyClose}
        //     aria-labelledby="contained-BootstrapModel-title-vcenter"
        //     className="ft-custom-modal"
        //     dialogClassName="phoneVerifyModal"
        //     centered
        // >
        //     <Modal.Header closeButton className="p-0 ft-pop-header">
        //         <Modal.Title>{t('popUps.PhoneNumberVerified')}</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body className="p-0 ft-pop-body">
        //         <h3 className="desc">{t('popUps.Yourphonenumberhasbeenverified')}</h3>

        //         <Modal.Footer className="p-0 ft-pop-footer">
        //             <Button onClick={handlePhoneVerifyClose} className="ft-pop-theme-btn">
        //                 {t('popUps.Confirm')}
        //             </Button>
        //         </Modal.Footer>
        //     </Modal.Body>
        // </Modal>


        <BootstrapModel
            show={isPhoneVerify}
            onHide={handlePhoneVerifyClose}
            aria-labelledby="contained-BootstrapModel-title-vcenter"
            className="ft-custom-modal"
            dialogClassName="ft-make-profile"
            centered>
            <BootstrapModel.Header closeButton className="ft-pop-header">
                <BootstrapModel.Title>  {t('popUps.PhoneNumberVerified')}</BootstrapModel.Title>
            </BootstrapModel.Header>
            <BootstrapModel.Body className="ft-pop-body">
                <div className="desc">{t('popUps.Yourphonenumberhasbeenverified')}</div>
            </BootstrapModel.Body>
            <BootstrapModel.Footer className="ft-pop-footer">
                <Button onClick={handlePhoneVerifyClose} className="ft-pop-theme-btn">
                    {t('popUps.Confirm')}
                </Button>
            </BootstrapModel.Footer>
        </BootstrapModel>
    )
}


export default PhoneVerifyPopup;