import styles from "../styles/Register.module.css";
import loginstyles from "../styles/login.module.css";
import verifystyles from "../styles/emailVerify.module.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Card, Form, Input, Button } from "antd";
import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../redux/reducers/rootReducer";
import blueLogo from "../public/header.svg";
import mobieLightLogo from "../public/mobile-hero-light-logo.png";
import { LoginFooter, LoginHeader, LoginHeaderMobile } from "../components";
import router, { useRouter } from "next/router";
import { passwordreset } from "../redux/actions/memberAction";

function reset_password_email() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isPassWord, setIsPassWord] = useState(true);
  const [passwordPatten, setPasswordPatten] = useState(false);
  const router = useRouter();
  const [passwordVal, setPasswordVal] = useState("");
  const { token } = router.query;
  const [password, setPassword] = useState<any>(
    t("index.formItem1.labelPassword1")
  );
  const [, forceUpdate] = useState({});
  const [msg, setMsg] = useState(t("emailConfirm.blueMsg"));
  useEffect(() => {
    forceUpdate({});
  }, []);
  const dispatch = useDispatch();
  const store = useSelector((state: State) => state.validation.emailError);
  // const codeEmailValidation = useSelector((state: State) => state.validation.validationCode.data)
  const onFinish = (values: any) => {
    // const prevEmail = codeEmailValidation && codeEmailValidation.config && JSON.parse(codeEmailValidation.config.data)
    // const prevCode = codeEmailValidation && codeEmailValidation.data && codeEmailValidation.data.code
    // const data = { email: values.email, verification_code: values.code }
    // router.push("/change-password")
    const data = {
      password: values.password,
      token: token,
    };
    dispatch(passwordreset(data));
  };

  // onFinish={() => setMsg(t('emailConfirm.codeIncorrect'))}
  return (
    <div className={`${styles.container} minhight ph-custom-resetpassword`}>
      <LoginHeader headingtext={t("changePwd.login")} />
      <LoginHeaderMobile headingtext={t("resetPwd.passwordResetTitle")} />

      <div
        className={`${styles.heading} col4-cmn-cntr-640 register-outer reset-register-password`}
      >
        <div className="mobile-hero">
          {/* <div className="mobile-hero-logo">
                        <Link href='/'>
                            <a href="#" className="">
                                <Image src={mobieLightLogo} alt="Mobile Hero Logo" />
                            </a>
                        </Link>
                    </div> */}
          <div
            className="mobile-hero-heading ph-reset-password-heading"
            style={{ fontSize: 20 }}
          >
            {t("resetPwd.passwordResetTitle")}
          </div>
          <div className="mobile-hero-overlay"></div>
        </div>
      </div>
      <Card
        className={`${styles.registerCard} col4-cmn-cntr-640 ph-resetpassword-card`}
      >
        <p
          className={`${verifystyles.subheading} mb-5 ph-reset-password-title`}
        >
          {t("resetPwd.passwordResetTitle")}
        </p>
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          className="ph-reset-password-box"
        >
          {/* <label className="login-form-label mb-3" htmlFor="email">{t('resetPwd.newPassword')}</label> */}
          <Form.Item
            name="password"
            className="ph-resetpass-label "
            label={
              <span
                className={`${styles.formLabel} ph-resetpassword-newpass-title `}
              >
                {t("resetPwd.newPassword")}
              </span>
            }
            rules={[
              {
                required: true,
                message: t("index.formItem1.nameRequired"),
              },
            ]}
            hasFeedback
          >
            <Input
              type="password"
              onChange={(e) => {
                setPasswordVal(e.target.value);
                setIsPassWord(false);
                setPasswordPatten(true);
              }}
              autoComplete="nope"
              placeholder={t("resetPwd.newPasswordplaceHolder")}
              className="form-input pm-custom-resetpassword-input-text"
            />
          </Form.Item>

          {passwordPatten && passwordVal.length > 2 ? (
            <div className={`fe-input-error ph-resetpassword-confirmation`}>
              <p className="ph-resetpassword-confirmation-title">
                {t("index.formItem1.labelPassword1")}
              </p>
            </div>
          ) : null}
          {isPassWord && (
            <span
              className={
                password == t("index.formItem1.labelPassword1")
                  ? `${styles.passwordLabel} ph-custom-resetpassword-span`
                  : `${verifystyles.redMsg}`
              }
              style={{ marginTop: "-10px" }}
            >
              {password}
            </span>
          )}

          <Form.Item
            name="confirmPassword"
            label={
              <span
                className={`${styles.formLabel} ph-resetpassword-newpass-title`}
              >
                {t("resetPwd.confirmNewPassword")}
              </span>
            }
            style={{ paddingTop: "20px" }}
            className="ph-resetpass-inputbox pm-confirmpassword-ctn pm-error-ctn"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: t("index.formItem1.nameRequired"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("index.formItem1.passwordNotMatch"))
                  );
                },
              }),
            ]}
          >
            <Input
              type="password"
              autoComplete="nope"
              placeholder={t("resetPwd.Enteragain")}
              className="form-input pm-custom-resetpassword-input-text"
            />
          </Form.Item>
          <Form.Item
            shouldUpdate
            className="ph-resetpassword-box pm-absolute-btn"
          >
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
                className={
                  !form.isFieldsTouched(true) ||
                    !!form.getFieldsError().filter(({ errors }) => errors.length)
                      .length
                    ? `${loginstyles.savebutton} ${loginstyles.disabledbutton} primary-button email-verify mt-4 ph-ressetpassword-primary-btn pm-disabled-btn pm-disabled-btn-opa`
                    : `${loginstyles.savebutton} primary-button mt-4  ph-resetpassword-save-btn`
                }
              >
                {t("resetPwd.passwordResetTitle")}
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>

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
export default reset_password_email;
