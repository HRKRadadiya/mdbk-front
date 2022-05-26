/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from 'react';
import Head from 'next/head'
import styles from '../../styles/Registration.module.css'
import { Header, Footer } from "../../components"
import { Divider, DatePicker, Button, Tabs, Progress, Form, Input, Radio, Dropdown, Menu, Upload } from 'antd';
import stylessec from '../../styles/searchdetail.module.css';
import camera from '../../public/camera.svg'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Router from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeaderForMobile from '../../components/HeaderForMobile';


function Client() {
    const [imageUrl, setImageUrl] = useState(null)
    const { TabPane } = Tabs;
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const formRef = useRef()
    const [form] = Form.useForm();
    function getBase64(img: any, callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file: any) {
        let message: any;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const dummyRequest = ({ onSuccess }: any) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imgUrl: any) => {
                setLoading(false)
                setImageUrl(imgUrl)
            });
        }
    };


    return (
        <div className="jumbotron">
            <HeaderForMobile />
            <Divider className="p-0 m-0" />
            <div className="mainContainercmn pb-5 h-100 ">
                <div className="col4-cmn-cntr-800 mobilegone">
                    <h1 className={styles.heading1}>경력사항을 등록하세요</h1>
                </div>
                <div className={`${styles.maindiv} col4-cmn-cntr-800`}>
                    <div className="cmn-inner-p15">
                        <div className="pb-5 pt-5">
                            <div className="row d-flex justify-content-center text-align-center">
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatarUpload"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    customRequest={dummyRequest}
                                    onChange={handleChange}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : (<div>
                                        <Image src={camera} alt="Profile Image" width={38} height={30} />
                                    </div>)}
                                </Upload>
                            </div>
                            <h2 className="pb-5 pt-3 d-flex justify-content-center text-align-center" style={{ color: "#9A9A9A", fontSize: "18px" }}>이모아</h2>
                            <Tabs defaultActiveKey={"2"} className="registerSteps" centered>
                                <TabPane className="row-3" key={"1"} tab={<span className={styles.tabHeading} >STEP 1</span>} />
                                <TabPane className="row-3" key={"2"} tab={<span className={styles.tabHeading} >STEP 2</span>} />
                                <TabPane className="row-3" key={"3"} tab={<span className={styles.tabHeading} >STEP 3</span>} />
                            </Tabs>

                        </div>
                        <div className="row">
                            <div className="col-6">
                                33%
                            </div>
                            <div className="col-6 d-flex justify-content-end">
                                <span style={{ color: "red" }}>*</span>필수항목
                            </div>
                        </div>
                        <div className="">
                            <Progress percent={33} showInfo={false} strokeColor="#00d6e3" />
                        </div>
                        <div className="pt-3 pb-2">
                            <label style={{
                                fontFamily: "SpoqaHanSans",
                                fontWeight: "bold",
                                fontSize: 20
                            }}>신입이신가요? 경력이신가요? <span style={{ color: "red" }}>*</span></label>
                        </div>
                        <div className="pb-2">
                            <Radio.Group defaultValue="2" className="w-100">
                                <Radio.Button value="1" onClick={() => { setDisabled(true) }} className={`${stylessec.bigbtn}`} style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}>신입</Radio.Button>
                                <Radio.Button value="2" onClick={() => { setDisabled(false) }} className={stylessec.bigbtn} style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}>경력</Radio.Button>
                            </Radio.Group>
                        </div>
                        <Form name="register" layout="vertical" className="pt-5 pb-5"
                            onFinish={(values) => { console.log(values) }}>
                            <div className="row pt-2 pb-2">
                                <div className="col-4">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: disabled ? "gray" : "black"
                                    }}>회사명</label>
                                </div>
                                <div className="col-8 d-flex justify-content-end">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 17,
                                        color: 'black'
                                    }}>총 경력<span style={{ color: "#00D6E3" }}>1년</span></label>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="nickName"
                                        className="pb-3"

                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Nickname!',
                                            },
                                        ]}>
                                        <Input type="text" disabled={disabled}
                                            placeholder={"당근마켓"} style={{ borderRadius: 20, height: 64 }} />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row pt-2 pb-2">
                                <div className="col-12">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: disabled ? "gray" : "black"
                                    }}>재직기간</label>
                                </div>
                                <div className="col-12">

                                    <Form.Item
                                        name="nickName"
                                        className="pb-3"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Nickname!',
                                            },
                                        ]}>

                                        <Input type="text" disabled={disabled}
                                            placeholder={"YYYY MM"} style={{ borderRadius: 20, height: 64 }} />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row pt-2 pb-2">
                                <div className="col-12">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: disabled ? "gray" : "black"
                                    }}>직급/직책</label>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="nickName"
                                        className="pb-3"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Nickname!',
                                            },
                                        ]}>
                                        <Input type="text" disabled={disabled} defaultValue={"대리"} style={{ borderRadius: 20, height: 64 }} />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row pt-2 pb-2">
                                <div className="col-12">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: disabled ? "gray" : "black"
                                    }}>직종</label>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="nickName"
                                        className="pb-3"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Nickname!',
                                            },
                                        ]}>
                                        <Input type="text" disabled={disabled} defaultValue={"웹프로그램개발"} style={{ borderRadius: 20, height: 64 }} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="row pt-2 pb-2">
                                <div className="col-12">
                                    <Button style={{ float: "right", width: "100px", height: "40px", borderRadius: "30px", background: "#FF5C00", color: "white", fontWeight: "bold", fontSize: "14px" }}>경력 삭제</Button>
                                </div>
                            </div>
                            <div className="row pt-2 pb-2">
                                <div className="col-4">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: disabled ? "gray" : "black"
                                    }}>회사명</label>
                                </div>

                                <div className="col-12">
                                    <Form.Item
                                        name="nickName"
                                        className="pb-3"

                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Nickname!',
                                            },
                                        ]}>
                                        <Input type="text" disabled={disabled}
                                            placeholder={"당근마켓"} style={{ borderRadius: 20, height: 64 }} />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row pt-2 pb-2">
                                <div className="col-12">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: disabled ? "gray" : "black"
                                    }}>재직기간</label>
                                </div>
                                <div className="col-12">

                                    <Form.Item
                                        name="nickName"
                                        className="pb-3"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Nickname!',
                                            },
                                        ]}>

                                        <Input type="text" disabled={disabled}
                                            placeholder={"YYYY MM"} style={{ borderRadius: 20, height: 64 }} />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row pt-2 pb-2">
                                <div className="col-12">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: disabled ? "gray" : "black"
                                    }}>직급/직책</label>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="nickName"
                                        className="pb-3"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Nickname!',
                                            },
                                        ]}>
                                        <Input type="text" disabled={disabled} defaultValue={"대리"} style={{ borderRadius: 20, height: 64 }} />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="row pt-2 pb-2">
                                <div className="col-12">
                                    <label style={{
                                        fontFamily: "SpoqaHanSans",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        color: disabled ? "gray" : "black"
                                    }}>직종</label>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="nickName"
                                        className="pb-3"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your Nickname!',
                                            },
                                        ]}>
                                        <Input type="text" disabled={disabled} defaultValue={"웹프로그램개발"} style={{ borderRadius: 20, height: 64 }} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="row pt-2 pb-2">
                                <div className="col-12">
                                    <Button disabled={disabled} style={{ float: "right", width: "100px", height: "40px", borderRadius: "30px", background: "#00D6E3", color: "white", fontWeight: "bold", fontSize: "14px" }}>경력 추가</Button>

                                    <Button disabled={disabled} style={{ float: "right", width: "100px", height: "40px", borderRadius: "30px", background: "#FF5C00", color: "white", fontWeight: "bold", fontSize: "14px", marginLeft: "20px" }}>경력 삭제</Button>
                                </div>
                            </div>

                            <div className="row pt-5 d-flex justify-content-center align-items-center">
                                <div className="col-4">

                                    <Button style={{ border: '1px solid #00D6E3', color: '#00D6E3', width: '100%', height: 68, borderRadius: 20 }} >
                                        이전
                                    </Button>
                                </div>
                                <div className="col-4">
                                    <Button disabled={
                                        !form.isFieldsTouched(true) ||
                                        !!form.getFieldsError().filter(({ errors }) => errors.length).length
                                    } style={{ background: '#00D6E3', color: '#FFF', width: '100%', height: 68, borderRadius: 20 }} >
                                        다음
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div >
            </div>
            <Footer />
        </div >

    )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common']))
    }
});



export default Client