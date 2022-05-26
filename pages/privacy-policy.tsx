import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify'
import { AppLayout, LoginFooter, LoginHeader, LoginHeaderMobile } from '../components'
import styles from '../styles/Register.module.css'

function PrivacyPolicy() {
    const { t } = useTranslation();

    const handleClick=()=>{
        close();
    }

    return (
        <>
            <div className={`${styles.container} minhight pp-privacypolicy-page `}>
                <div className="pp-bg" ></div>
                <LoginHeader headingtext={t('login.heading')} />
                <ToastContainer />
                <LoginHeaderMobile headingtext={t('login.heading')} />

                <div className="privacy-policy-box">
                    <div className="privacypolicy-main-page">
                        <div className="pp-main-title">
                            <p>개인정보 처리방침</p>
                        </div>
                        <div className="pp-scroll-content-bar">
                            <div className="pp-main-title-content pp-custom-scroll1">
                                <p>본 개인정보 처리방침(이하 “개인정보 처리방침”이라 합니다)은 모두의부캐(이하 “모두의부캐”이라 합니다)의 개인정보의 수집에
                                    대한 취급 및 처리 방침과 방법을 규정합니다. 또한 본 개인정보 처리방침은모두의부캐가 개인정보를 보유, 사용, 공개하는 방법을
                                    규정합니다. 본 개인정보 처리방침은 본 웹사이트 및 여러 하위 도메인 (이하 총칭하여 “웹사이트”라 합니다), 앱, 매장(이하
                                    “매장”이라 합니다), 게스트 에듀케이션 센터(이하 “GEC”라 합니다) 및 그 외 모두의부캐가 개인정보를 수집할 가능성이
                                    있는 장소를 통하여 고객으로부터 수집되는 정보에 적용됩니다. 본 개인정보 처리방침은 또한 모두의부캐가 고객으로부터
                                    소집할 수 있는 정보에 고객이 어떻게 접근할 수 있는지 공지하고 있습니다.
                                    본 개인정보 처리방침에서 “개인정보”라 함은
                                    개인에 관한 정보 또는 의견으로서 당해 정보 또는 의견에 의하여 특정 개인의 신원을 식별할 수 있거나 합리적인 수준으로
                                    확인할 수 있는 정보를 의미하며 개인정보 관련 법률에 더 구체적으로 정의된 것과 같은 정보를 의미합니다.
                                    <br />
                                    <br />
                                    웹사이트는 모두의부캐가 운영하거나 통제하지 않는 외부 웹사이트로의 링크를 포함할 수 있습니다. 본 개인정보 처리방침은
                                    그러한 외부 웹사이트에는 적용되지 않으며 모두의부캐는 그러한 외부 웹사이트의 내용이나 개인정보 처리에 대하여 책임을
                                    부담하지 않습니다. 따라서 모두의부캐는 외부 웹사이트를 방문하거나 외부 웹사이트에 고객의 개인정보를 제공하는 경우
                                    해당 웹사이트에 개인정보 처리방침을 요청하여 검토하는 것을 권장합니다.
                                    <br />
                                    <br />


                                    법률에 따라 명시적인 동의를 제공함으로써 고객은 모두의부캐가 고객의 개인정보를 수집할 수 있음과 모두의부캐가 본
                                    개인정보 처리방침에 따라 또한 관련 법령이 허용하거나 요구하는 바에 따라 개인정보를 사용, 공개 및 제공하는 것에 동의합니다.
                                    법적, 계약적 요건을 근거로 고객은 언제든지 확인된 특정 목적을 위하여 아래 명시된 모두의부캐의 주소로 연락하여 이러한 동의를
                                    거절하거나 철회할 수 있습니다. 만약 고객이 동의를 거절하거나 철회하는 경우 고객은 본 개인정보 처리방침의 개정의를 거절하거나
                                    철회할 수 있습니다. 만약 고객이 동의를 거절하거나 철회하는 경우 고객은 본 개인정보 처리방침의 개정의를 거절하거나 철회할 수
                                    있습니다. 만약 고객이 동의를 거절하거나 철회하는 경우 고객은 본 개인정보 처리방침의 개정의를 거절하

                                </p>
                            </div>
                        </div>
                        <div className="pp-conform-btn">
                            <button onClick={handleClick}>확인</button>
                        </div>


                    </div>

                </div>
                <LoginFooter />
            </div>

            {/* <div className="privacypolicy-main-page">
                <div className="pp-main-title">
                    <p>개인정보 처리방침</p>
                </div>
                <div className="pp-scroll-content-bar">
                    <div className="pp-main-title-content pp-custom-scroll1">
                        <p>본 개인정보 처리방침(이하 “개인정보 처리방침”이라 합니다)은 모두의부캐(이하 “모두의부캐”이라 합니다)의 개인정보의 수집에
                            대한 취급 및 처리 방침과 방법을 규정합니다. 또한 본 개인정보 처리방침은모두의부캐가 개인정보를 보유, 사용, 공개하는 방법을
                            규정합니다. 본 개인정보 처리방침은 본 웹사이트 및 여러 하위 도메인 (이하 총칭하여 “웹사이트”라 합니다), 앱, 매장(이하
                            “매장”이라 합니다), 게스트 에듀케이션 센터(이하 “GEC”라 합니다) 및 그 외 모두의부캐가 개인정보를 수집할 가능성이
                            있는 장소를 통하여 고객으로부터 수집되는 정보에 적용됩니다. 본 개인정보 처리방침은 또한 모두의부캐가 고객으로부터
                            소집할 수 있는 정보에 고객이 어떻게 접근할 수 있는지 공지하고 있습니다.
                            본 개인정보 처리방침에서 “개인정보”라 함은
                            개인에 관한 정보 또는 의견으로서 당해 정보 또는 의견에 의하여 특정 개인의 신원을 식별할 수 있거나 합리적인 수준으로
                            확인할 수 있는 정보를 의미하며 개인정보 관련 법률에 더 구체적으로 정의된 것과 같은 정보를 의미합니다.
                            <br />
                            <br />
                            웹사이트는 모두의부캐가 운영하거나 통제하지 않는 외부 웹사이트로의 링크를 포함할 수 있습니다. 본 개인정보 처리방침은
                            그러한 외부 웹사이트에는 적용되지 않으며 모두의부캐는 그러한 외부 웹사이트의 내용이나 개인정보 처리에 대하여 책임을
                            부담하지 않습니다. 따라서 모두의부캐는 외부 웹사이트를 방문하거나 외부 웹사이트에 고객의 개인정보를 제공하는 경우
                            해당 웹사이트에 개인정보 처리방침을 요청하여 검토하는 것을 권장합니다.
                            <br />
                            <br />


                            법률에 따라 명시적인 동의를 제공함으로써 고객은 모두의부캐가 고객의 개인정보를 수집할 수 있음과 모두의부캐가 본
                            개인정보 처리방침에 따라 또한 관련 법령이 허용하거나 요구하는 바에 따라 개인정보를 사용, 공개 및 제공하는 것에 동의합니다.
                            법적, 계약적 요건을 근거로 고객은 언제든지 확인된 특정 목적을 위하여 아래 명시된 모두의부캐의 주소로 연락하여 이러한 동의를
                            거절하거나 철회할 수 있습니다. 만약 고객이 동의를 거절하거나 철회하는 경우 고객은 본 개인정보 처리방침의 개정의를 거절하거나
                            철회할 수 있습니다. 만약 고객이 동의를 거절하거나 철회하는 경우 고객은 본 개인정보 처리방침의 개정의를 거절하거나 철회할 수
                            있습니다. 만약 고객이 동의를 거절하거나 철회하는 경우 고객은 본 개인정보 처리방침의 개정의를 거절하

                        </p>
                    </div>
                </div>
                <div className="pp-conform-btn">
                    <button>확인</button>
                </div>


            </div> */}


        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});

export default PrivacyPolicy
