import styles from "../styles/Register.module.css";
import loginstyles from "../styles/login.module.css";
import verifystyles from "../styles/emailVerify.module.css";
import popUpstyles from "../styles/components/pop.module.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Card, Form, Input, Button, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import GiftBox from "../public/PopupImage.svg";
import Close from "../public/close.png";
import Image from "next/image";
import Link from "next/link";
import mobieLightLogo from "../public/mobile-hero-light-logo.png";
import { LoginFooter, LoginHeader, LoginHeaderMobile } from "../components";
import { useDispatch } from "react-redux";
import { resetLinkSend } from "../redux/actions/clientAction";
import { RESET_PASSWORD_LINK } from "../constants/api";
import { ApiPostNoAuth } from "../service/api";
import router from "next/router";

function ResetPwd() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [msg, setMsg] = useState<boolean>();
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const currentLanguage = router.locale ?? "kr";
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values: any) => {
    console.log();
    ApiPostNoAuth(RESET_PASSWORD_LINK, {
      email: values.email,
      locale: currentLanguage,
    })
      .then((response: any) => {
        if (response.data && response.success) {
          setVisible(true);
          setMsg(false);
        } else {
          console.log("No Data found");
        }
      })
      .catch((error: any) => {
        setVisible(false);
        setMsg(true);
        console.log("Error", error);
      });
  };
  const onFinish1 = (values: any) => {
    router.push("/login");
  };

  const onChange = (values: any) => {
    setMsg(false);
  };

  return (
    <div className={`${styles.container} minhight emailverifySection`}>
      <div className="bg-pc-overlay"></div>
      <LoginHeader headingtext={t("changePwd.login")} />
      <LoginHeaderMobile headingtext={t("resetPwd.resetPassword")} />
      <div className="main-content-outer">
        <div className={`${styles.heading} col4-cmn-cntr-640 register-outer`}>
          <div className="mobile-hero">
            {/* <div className="mobile-hero-logo">
                            <Link href='/'>
                                <a href="#" className="">
                                    <Image src={mobieLightLogo} alt="Mobile Hero Logo" />
                                </a>
                            </Link>
                        </div> */}

            <div className="mobile-hero-heading">
              {t("resetPwd.resetPassword")}
            </div>
            <div className="mobile-hero-overlay"></div>
          </div>
        </div>
        <Card
          className={`${styles.registerCard} col4-cmn-cntr-640 register-confirm-msg mb-100`}
        >
          {!visible && (
            <Form
              form={form}
              name="login"
              layout="vertical"
              onFinish={onFinish}
            >
              <label
                className="login-form-label custom-reset-password-title"
                htmlFor="email"
              >
                {t("emailvarify.emailAddress")}
              </label>
              <Form.Item
                name="email"
                className="email-verify custom-emailverify pm-email-verify-error-ctn"
                rules={[
                  {
                    required: true,
                    min: 0,
                    message: t("login.emailErrorMessage"),
                  },
                ]}
              >
                <Input
                  type="email"
                  className="form-input pm-custom-reset-password-text"
                  onChange={onChange}
                  placeholder={t("resetPwd.emailPlaceholder")}
                />
              </Form.Item>
              {msg ? (
                <p
                  className={`${verifystyles.redMsg} Custum-reset-password-contant`}
                >
                  {t("index.formItem1.checkEmail")}
                </p>
              ) : null}
              {/* <p className={`${verifystyles.redMsg}`}>{msg}</p> */}

              <p
                className={`${verifystyles.forgotPwdLink} custom-datails Custom-repass-details ph-resetpass-details ph-resetpass-details  `}
              >
                {t("resetPwd.emailLinkMsg")}
              </p>
              <Form.Item shouldUpdate className="ev-btn">
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                    className={
                      !form.isFieldsTouched(true) ||
                        !!form
                          .getFieldsError()
                          .filter(({ errors }) => errors.length).length
                        ? `${loginstyles.savebutton} ${loginstyles.disabledbutton} primary-button email-verify ph-custom-password1 pm-disabled-btn  pm-reset-password-btn pm-disabled-btn-opa`
                        : `${loginstyles.savebutton} primary-button ph-custom-password1`
                    }
                  >
                    {t("resetPwd.sendButton")}
                  </Button>
                )}
              </Form.Item>
            </Form>
          )}
          {visible && (
            <div>
              <p
                className={`${verifystyles.confirmMsg} custom-repass custom-repass-1`}
              >
                {t("resetPwd.passwordResetLink")}
              </p>
              <p
                className={`${verifystyles.confirmMsg} custom-repass custom-repass-2`}
              >
                {t("resetPwd.resetPasswordMsg")}
              </p>

              <Button
                type="primary"
                className={`${loginstyles.savebutton} primary-button ph-custom-password1  `}
                onClick={onFinish1}
              >
                {t("resetPwd.confirm")}
              </Button>
            </div>
          )}
        </Card>
      </div>
      <LoginFooter />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default ResetPwd;
