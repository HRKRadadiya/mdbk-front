import React from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import logo from '../public/h3.svg'

interface Iprops {
    headingtext: string
}

function LoginHeaderMobile({ headingtext }: Iprops) {

    return (
        <>
            <Head>
                <title>{headingtext}</title>
                <meta name="description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="login-header-mobile ft-mobile">

                <div className="mobile-hero">
                    <div className="mobile-hero-logo">
                        <Link href='/'>
                            <a href="#" className="navbar-brand d-flex align-items-center p-0 ft-mobile-header-logo">
                                <Image src={logo} alt="Blue Navbar Logo" />
                            </a>
                        </Link>
                        <div >
                            <p className="mobile-hero-heading" >{headingtext}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-shadow">

                </div>
            </div>
        </>
    )

}
export default LoginHeaderMobile