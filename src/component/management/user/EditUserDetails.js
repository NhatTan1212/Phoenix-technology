import { EditUser } from '../../../callAPI/api';
import React, { useState, useEffect, useContext } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {
    Input, Select, Row, Col
} from 'antd';
import './EditUserDetails.scss'
import Cookies from 'js-cookie';
import Context from '../../../store/Context';


const EditUserDetails = ({ setIsActioning, setActioningUser, actioningUser }) => {
    let token = Cookies.get('token')
    const context = useContext(Context)

    const [name, setName] = useState(actioningUser.name)
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [isRePassword, setIsRePassword] = useState(false)
    const [role, setRole] = useState(actioningUser.role)

    const onFinish = (values) => {
        values.preventDefault();
        if (rePassword !== password) {
            context.Message("error", "Mật khẩu nhập lại không trùng khớp.")
            return
        }
        const formData = {
            token: token,
            id: actioningUser.id,
            name: name,
            password: password,
            role: role
        }

        EditUser(formData).then(response => {
            console.log(response);
            if (response.success) {
                setIsActioning(false);
                // setActioningUser(null);
                context.Message("success", "Cập nhật tài khoản thành công.")

            }
        })
    };

    return (
        <div className='wrap-modal-fpm w-full'>
            {actioningUser &&
                <div>
                    <form
                        onSubmit={onFinish}
                        method="post"
                        encType="multipart/form-data"
                        className='text-end'
                    >
                        <Input type="hidden" name="id"
                            value={actioningUser.id} />
                        <Row className='mt-[15px]'>
                            <Col span={24}
                                className='text-start px-[15px] pl-0'>
                                <h3><span className='text-red-500'>* </span>Tên tài khoản:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='name'

                                    onChange={(e) => {
                                        setName(e.target.value)
                                    }}
                                    value={name || actioningUser.name}
                                />

                                <h3><span className='text-red-500'>* </span>Mật khẩu:</h3>
                                <Input.Password
                                    className='mb-2 mt-0 input-password-edituserdetails'
                                    placeholder="nhập mật khẩu mới"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                />

                                <h3><span className='text-red-500'>* </span>Nhập lại mật khẩu:</h3>
                                <Input.Password
                                    className='mb-2 mt-0 input-password-edituserdetails'
                                    placeholder="nhập lại mật khẩu"
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    value={rePassword}
                                    onChange={(e) => {
                                        setRePassword(e.target.value)
                                        setIsRePassword(true)
                                    }}
                                />

                                <h3><span className='text-red-500'>* </span>Vai trò:</h3>
                                <Select
                                    className='mb-2 mt-0'
                                    name='role'
                                    value={role || actioningUser.role}
                                    onChange={(e) => {
                                        setRole(e)
                                    }}
                                    style={{
                                        width: '100%',
                                    }}

                                    options={
                                        [{
                                            value: 'admin',
                                            label: 'admin'
                                        },
                                        {
                                            value: 'user',
                                            label: 'user'
                                        }]

                                    }
                                />
                            </Col>

                        </Row>

                        <div className='inline-block mt-5'>
                            <Input type='submit' defaultValue={"Lưu thay đổi"}
                                className='bg-[#c8191f] text-white'>
                            </Input>
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

export default EditUserDetails