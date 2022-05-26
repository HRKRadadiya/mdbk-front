import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/header.svg'
import Head from 'next/head'
interface Iprops {
    headingtext: string
}

function LoginHeader({ headingtext }: Iprops) {
    return (
        <>
            <Head>
                <title>{headingtext}</title>
                <meta name="description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="login-header">
                <div className="header-common-inner-before-login">
                    <div className="header-logo">
                        <Link href='/'>
                            <a href="#" className="navbar-brand d-flex align-items-center">
                                <Image src={logo} alt="Blue Navbar Logo" />
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )

}
export default LoginHeader