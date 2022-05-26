import { useRouter } from 'next/router';
import React from 'react'
import Head from 'next/head'
import { useTranslation } from 'react-i18next';
import { CommonHeader, FullFooter, Footer } from '.';
import { KEYWORDS } from '../constants'

interface IProps {
    title: string;
    whiteHeader?: boolean;
    footerType?: number;
    children: any;
    page?:any;
}

const AppLayout: React.FC<IProps> = (props) => {

    const { whiteHeader = true, footerType = KEYWORDS.APP_FOOTER_TYPE.onlyCopyright, children, title, page = '' } = props;

    const { t } = useTranslation();
    const router = useRouter();


    const __renderHead = () => (
        <Head>
            <title>{title}</title>
            <meta name="description" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )

    const __renderFooter = () => {
        return (
            <>
                {(() => {
                    if (footerType == KEYWORDS.APP_FOOTER_TYPE.onlyCopyright) {
                        return (<Footer />);
                    } else if (footerType == KEYWORDS.APP_FOOTER_TYPE.full) {
                        return (<FullFooter />);
                    }
                })()}
            </>
        )
    }

    return (
        <>
            <div className={page}>
                {__renderHead()}
                <CommonHeader whiteHeader={whiteHeader} />
                {children}
                {__renderFooter()}
            </div>
        </>
    )
}

export default AppLayout;