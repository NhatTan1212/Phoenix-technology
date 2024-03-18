import { AddNewUser } from '../../../callAPI/api';
import React, { useState, useContext } from 'react';
import {
    Input, Select, Row, Col
} from 'antd';
import '../product/modalFPM.scss'
import Cookies from 'js-cookie';
import Context from '../../../store/Context';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';


const ContentModalAddNewUser = ({ isActioning, setIsActioning }) => {
    let token = Cookies.get('token');
    const context = useContext(Context);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');
    const [hasNameChanged, setHasNameChanged] = useState(false);
    const [hasEmailChanged, setHasEmailChanged] = useState(false);
    const [hasPasswordChanged, setHasPasswordChanged] = useState(false);
    const [hasRePasswordChanged, setHasRePasswordChanged] = useState(false);
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [passwordInValid, setPasswordInvalid] = useState(false);
    const [rePasswordInValid, setRePasswordInvalid] = useState(false);
    const [newUserFailed, setNewUserFailed] = useState(false);
    const [nameIsNull, setNameIsNull] = useState(false);
    const [passwordIsNull, setPasswordIsNull] = useState(false);
    const [emailIsNull, setEmailIsNull] = useState(false);

    const onChangeName = (e) => {
        setName(e.target.value);
        setHasNameChanged(true)
        setNameIsNull(false);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
        const newPassword = e.target.value;
        setHasPasswordChanged(true);
        setPassword(newPassword);
        const regexPassword = /^.{6,}$/;
        const isPasswordValid = regexPassword.test(newPassword);
        setPasswordInvalid(!isPasswordValid);
        setPasswordIsNull(false);
    };
    const onChangeRePassword = (e) => {
        setRePassword(e.target.value)
        const newPassword = e.target.value;
        setHasRePasswordChanged(true);
        setRePassword(newPassword);
        const regexPassword = /^.{6,}$/;
        const isPasswordValid = regexPassword.test(newPassword);
        setRePasswordInvalid(!isPasswordValid);
        // setPasswordIsNull(false);
    };

    const onChangeEmail = (e) => {
        const newEmail = e.target.value;
        setHasEmailChanged(true);
        setEmail(newEmail);
        const regexEmail = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        const isEmailValid = regexEmail.test(newEmail) && newEmail.length <= 255;
        setEmailInvalid(!isEmailValid);
        setEmailIsNull(false);
    };

    const onFinish = (values) => {

        values.preventDefault();
        const formData = {
            token: token,
            name: name,
            password: password,
            email: email,
            role: role
        }

        let hasError = false;
        if (!name) {
            setNameIsNull(true);
            hasError = true;
        }
        if (!email) {
            setEmailIsNull(true);
            hasError = true;
        }
        if (!password) {
            setPasswordIsNull(true);
            hasError = true;
        }

        if (hasError) {
            setNewUserFailed(true);
            context.Message("warning", "Vui lòng điền đầy đủ thông tin");
            return;
        }

        AddNewUser(formData).then(response => {
            console.log(response.status)
            if (!response.success && response.message === "Email đã tồn tại") {
                context.Message("error", "Email đã tồn tại.")
                return;
            }
            if (response.success) {
                setIsActioning(false);
                context.Message("success", "Thêm tài khoản thành công.")
            }
        })
    };

    return (
        <div className='wrap-modal-fpm w-full'>
            <div>
                <form
                    onSubmit={onFinish}
                    method="post"
                    encType="multipart/form-data"
                    className='text-end'
                >

                    <Row className='mt-[15px]'>
                        <Col span={24} className='text-start px-[15px] pl-0'>

                            <h3><span className='text-red-500'>* </span>Tên tài khoản:</h3>
                            <Input
                                className='mb-2 mt-0'
                                name='name'
                                onChange={(e) => { onChangeName(e) }}
                                value={name}
                            />

                            <div className='wrap-err-mess'>
                                {(hasNameChanged && name === '') || (newUserFailed && nameIsNull)
                                    ? <p className='err-mess'>Tên tài khoản không được để trống</p> : null}
                            </div>

                            <h3><span className='text-red-500'>* </span>Mật khẩu:</h3>
                            <Input.Password
                                className='mb-2 mt-0 input-password-edituserdetails'
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                name='password'
                                value={password}
                                onChange={(e) => {
                                    onChangePassword(e)
                                }}></Input.Password>

                            <div className='wrap-err-mess'>
                                {(hasPasswordChanged && password === '') || (newUserFailed && passwordIsNull)
                                    ? <p className='err-mess'>Mật khẩu không được để trống</p> : passwordInValid
                                        ? <p className='err-mess'>Mật khẩu phải có ít nhất 6 ký tự</p> : password.length > 255
                                            ? <p className='err-mess'>Mật khẩu không được vượt quá 255 ký tự</p> : null
                                }
                            </div>

                            <h3><span className='text-red-500'>* </span>Nhập lại mật khẩu:</h3>
                            <Input.Password
                                className='mb-2 mt-0 input-password-edituserdetails'
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                name='rePassword'
                                value={rePassword}
                                onChange={(e) => {
                                    onChangeRePassword(e)
                                }}></Input.Password>

                            <div className='wrap-err-mess'>
                                {(rePassword === '' && hasRePasswordChanged) ?
                                    <p className='err-mess'>Mật khẩu không được để trống</p> :
                                    rePasswordInValid ?
                                        <p className='err-mess'>Mật khẩu phải có ít nhất 6 ký tự</p> :
                                        rePassword.length > 255 ?
                                            <p className='err-mess'>Mật khẩu không được vượt quá 255 ký tự</p> :
                                            (rePassword !== password && hasRePasswordChanged) ?
                                                <p className='err-mess'>Mật khẩu nhập lại không trùng khớp</p> :
                                                null
                                }
                            </div>

                            <h3><span className='text-red-500'>* </span>Email:</h3>
                            <Input
                                className='mb-2 mt-0'
                                name='email'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    onChangeEmail(e)
                                }}></Input>
                            <div className='wrap-err-mess'>
                                {(hasEmailChanged && email == '') || (newUserFailed && emailIsNull)
                                    ? <p className='err-mess'>Email không được để trống</p> : emailInvalid
                                        ? <p className='err-mess'>Email không đúng định dạng</p> : null
                                }
                            </div>

                            <h3><span className='text-red-500'>* </span>Vai trò:</h3>
                            <Select
                                className='mb-2 mt-0'
                                name='role'
                                defaultValue="admin"
                                onChange={(e) => {
                                    setRole(e)
                                }}
                                style={{ width: '100%' }}
                                options={[
                                    { value: 'admin', label: 'admin' },
                                    { value: 'user', label: 'user' }
                                ]}
                            />
                        </Col>

                    </Row>

                    <div className='inline-block mt-5'>
                        <Input type='submit' defaultValue={"Thêm tài khoản"}
                            className='bg-[#c8191f] text-white'>
                        </Input>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContentModalAddNewUser