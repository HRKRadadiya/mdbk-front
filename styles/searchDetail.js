/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import styles from '../styles/Search.module.css';
import stylessec from '../styles/searchdetail.module.css';
import React from 'react';
import { Footer, Header, Giftbox, HeaderTab, SearchCard } from "../components"
import { Menu, Dropdown, Button, Divider, Radio, Form, Input, } from 'antd';

function SearchDetail() {
    const labels = ['희망직종', '희망지역', '희망일자', '희망시간', '희망형태', '근무형태']
    const val = ['IT/웹개발.기획/웹서비스기획', '서울시 마포구, 서울시 양천구', '주중/주말', '저녁', '단기 프로젝트(3개월 미만)', '상주']
    return (
        <>
            <Head>
                <title></title>
                <meta name="description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <div className={`row`}>
                <Divider className="p-0 m-0" />
                <div className={`${styles.pt40} col-6 offset-3`} >
                    <div className="row" style={{ paddingBottom: "30px" }}>
                        <Giftbox />
                    </div>
                    <div className={`row ${styles.pt40}`}>
                        <div className={`col-6`}>
                            <p className={styles.p1}>
                                부캐를 찾으세요
                            </p>
                        </div>
                        <div className="col-6" >
                            <Button className={stylessec.cardBtn}>새로고침</Button>
                         
                        </div>
                    </div>
                    <div className={`row ${styles.pt40}`}>
                        <HeaderTab val={1} />
                    </div>
                    <div className={`row ${styles.pt40}`}>
                        {labels && labels.map((btn, i) => <Button key={btn} className={styles.buttonTextSec}>
                            <span style={{ fontWeight: 700 }}>{`${btn}`}</span>:<span>{val[i]}</span>
                        </Button>)}
                    </div>
                </div>
            </div>
            <Divider style={{ marginTop: "50px" }} />
            <div className="row">
                <div className={`${styles.pt40} col-6 offset-3`} >
                    <span className={stylessec.p1}>
                        희망 직종은 무엇인가요?
                    </span>
                    <span className={stylessec.p2}>
                        복수선택 가능
                    </span>

                    <div className="row " style={{ width: "100%", paddingTop: "30px", paddingBottom: "30px" }}>
                        <Radio.Group defaultValue="4" >
                            <Radio.Button value="1" className={`${stylessec.radiobtntxt}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>개발</Radio.Button>
                            <Radio.Button value="2" className={stylessec.radiobtntxt}>디자인</Radio.Button>
                            <Radio.Button value="3" className={stylessec.radiobtntxt} >마케팅</Radio.Button>
                            <Radio.Button value="4" className={stylessec.radiobtntxt} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px",borderColor:"#00D6E3" }}>기타</Radio.Button>
                        </Radio.Group>
                    </div>

                    <span className={`${stylessec.p1}`}>
                        희망 분야는 무엇인가요?
                    </span>
                    <span className={stylessec.p2}>
                        최대 3개 선택 가능
                    </span>
                    <div className="row" style={{ width: "100%", paddingTop: "30px", paddingBottom: "30px" }}>
                        <div className="col-11">
                            <Form name="register" layout="vertical">
                                <Input type="text"
                                    placeholder="직종 입력" className={stylessec.txtbox} />
                            </Form>
                        </div>
                        <div className="col-1">
                            <img src="/plus.svg" alt="Plus Icon" />
                        </div>
                    </div>
                    <div className="row">
                        <Button className={stylessec.btn}>기타 <img src="./cross.svg" /></Button>
                        <Button className={stylessec.btn} style={{ marginLeft: "10px" }}>웹기획.PM <img src="./cross.svg" /></Button>
                    </div>
                    <div className="row" style={{ width: "100%", paddingTop: "30px" }}>
                        <span className={`${stylessec.p1}`}>
                            희망 지역은 어디인가요?
                        </span>
                        <div className="row" style={{ width: "100%", paddingTop: "20px", paddingBottom: "10px" }}>
                            <div className="col-6">
                                <div className="dropdown" style={{ color: "white" }}>
                                    <Dropdown overlay={() => (<Menu>
                                        <Menu.Item className={stylessec.dropdownitem}>전체</Menu.Item>
                                        <Menu.Item className={stylessec.dropdownActiveitem}> 시 선택</Menu.Item>
                                    </Menu>)
                                    }>
                                        <Button className={stylessec.dropdownBtn} style={{ width: "100%", borderRadius: "20px" }}> 시 선택 <img src="/arrowdown.svg" style={{ float: "right", paddingTop: "10px" }} /></Button>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="dropdown" style={{ color: "white" }}>
                                    <Dropdown overlay={() => (<Menu>
                                        <Menu.Item className={stylessec.dropdownitem}>전체</Menu.Item>
                                        <Menu.Item className={stylessec.dropdownitem}> 구 선택</Menu.Item>
                                    </Menu>)
                                    }>
                                        <Button className={stylessec.dropdownBtn} style={{ width: "100%", borderRadius: "20px" }}> 구 선택 <img src="/arrowdown.svg" style={{ float: "right", paddingTop: "10px" }} /></Button>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ width: "100%", paddingTop: "10px", paddingBottom: "10px" }}>
                            <div className="col-6">
                                <div className="dropdown" style={{ color: "white" }}>
                                    <Dropdown overlay={() => (<Menu>
                                        <Menu.Item className={stylessec.dropdownitem}>전체</Menu.Item>
                                        <Menu.Item className={stylessec.dropdownActiveitem}> 시 선택</Menu.Item>
                                    </Menu>)
                                    }>
                                        <Button className={stylessec.dropdownBtn} style={{ width: "100%", borderRadius: "20px" }}> 시 선택 <img src="/arrowdown.svg" style={{ float: "right", paddingTop: "10px" }} /></Button>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="dropdown" style={{ color: "white" }}>
                                    <Dropdown overlay={() => (<Menu>
                                        <Menu.Item className={stylessec.dropdownitem}>전체</Menu.Item>
                                        <Menu.Item className={stylessec.dropdownitem}> 구 선택</Menu.Item>
                                    </Menu>)
                                    }>
                                        <Button className={stylessec.dropdownBtn} style={{ width: "100%", borderRadius: "20px" }}> 구 선택 <img src="/arrowdown.svg" style={{ float: "right", paddingTop: "10px" }} /></Button>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        <div className={`${stylessec.pt30} row`}>
                            <span className={`${stylessec.p1}`}>
                                희망 일자는 언제인가요?
                            </span>
                            <div className="row " style={{ width: "100%", paddingTop: "10px" }}>
                                <Radio.Group value="3">
                                    <Radio.Button value="1" className={`${stylessec.radiobtntxt2}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>주중</Radio.Button>
                                    <Radio.Button value="2" className={stylessec.radiobtntxt2}>주말</Radio.Button>
                                    <Radio.Button value="3" className={stylessec.radiobtntxt2} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>주중/주말</Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={`${stylessec.pt30} row`}>
                            <span className={`${stylessec.p1}`}>
                                희망 시간은 언제인가요?
                            </span>
                            <div className="row " style={{ width: "100%", paddingTop: "10px" }}>
                                <Radio.Group value="3">
                                    <Radio.Button value="1" className={`${stylessec.radiobtntxt2}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>오전</Radio.Button>
                                    <Radio.Button value="2" className={stylessec.radiobtntxt2}>오전</Radio.Button>
                                    <Radio.Button value="3" className={stylessec.radiobtntxt2} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>저녁</Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={`${stylessec.pt30} row`}>
                            <span className={`${stylessec.p1}`}>
                                희망 프로젝트 형태는 무엇인가요?
                            </span>
                            <div className="row " style={{ width: "100%", paddingTop: "10px" }}>
                                <Radio.Group value="3">
                                    <Radio.Button value="1" className={`${stylessec.bigbtn}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>
                                        <span className={stylessec.firsttext}>단기 프로젝트</span> <br />
                                        <span className={stylessec.sectext}>
                                            3개월 미만</span></Radio.Button>

                                    <Radio.Button value="3" className={stylessec.bigbtn} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}> 
                                    <span className={stylessec.firsttext}>단기 프로젝트</span> <br />
                                        <span className={stylessec.sectext}>
                                            3개월 미만</span></Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={`${stylessec.pt30} row`}>
                            <span className={`${stylessec.p1}`}>
                            4대보험이 가능하신가요?
                            </span>
                            <div className="row " style={{ width: "100%", paddingTop: "10px" }}>
                                <Radio.Group value="3">
                                    <Radio.Button value="1" className={`${stylessec.radiobtntxt2}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", width:"50%" }}>4대보험 가능</Radio.Button>                      
                                    <Radio.Button value="3" className={stylessec.radiobtntxt2} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px",width:"50%" }}>4대보험 불가능</Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={`${stylessec.pt30} row`}>
                            <span className={`${stylessec.p1}`}>
                            희망 근무 형태는 무엇인가요?
                            </span>
                            <div className="row " style={{ width: "100%", paddingTop: "10px" }}>
                                <Radio.Group value="3">
                                    <Radio.Button value="1" className={`${stylessec.radiobtntxt2}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", width:"50%" }}>상주</Radio.Button>                      
                                    <Radio.Button value="3" className={stylessec.radiobtntxt2} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px",width:"50%" }}>재택</Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                        <div className={`${stylessec.pt30} row`} style={{paddingBottom:"20px"}}>
                            <div className="col-6">
                            <Button style={{float:"right", borderRadius:"10px",color:"black"}}>
                                Save
                            </Button>
                            </div>
                            <div className="col-6">
                            <Button style={{borderRadius:"10px",color:"black"}}>
                                Save search option
                            </Button>
                            </div>
                           
                            </div>
                    </div>
                </div>
            </div>
            <Footer />

        </>
    )
}



export default SearchDetail