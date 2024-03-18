import React, { useState, useContext } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import 'tailwindcss/tailwind.css';
import { EditUserInfoById } from '../../../callAPI/api'
import Context from '../../../store/Context';

const EditUserInfo = ({ visible, onCancel, onSave, userData }) => {
    const context = useContext(Context)
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(userData.name);
    const [email, setEmail] = useState(userData.email);
    const [phone, setPhone] = useState(userData.phone);

    const handleChangeName = (e) => {
        setName(e.target.value);
    };

    const handleChangePhone = (e) => {
        setPhone(e.target.value);
    };

    const handleSave = () => {

        if (!name || !phone) {
            context.Message("warning", "Vui lòng điền đầy đủ thông tin.")
            form.validateFields()
        } else {
            form.validateFields().then((values) => {
                setLoading(true);

                const newUserInfo = {
                    id: userData.id,
                    ...values
                }

                EditUserInfoById(newUserInfo).then((data) => {
                    if (data.success) {
                        context.Message("success", "Cập nhật thông tin thành công.")
                    }
                })

                onSave(Object.assign(values, { id: userData.id })).then(() => {
                    setLoading(false);
                    form.resetFields();
                    onCancel();
                });
            });
        }
    };

    return (
        <Modal
            open={visible}
            title="Chỉnh sửa thông tin cá nhân"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="save" type="primary" loading={loading} onClick={handleSave}>
                    Lưu thay đổi
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ name, email, phone }}
            >
                <Form.Item
                    name="name"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                    <Input
                        placeholder="Nhập Tên của bạn"
                        value={name}
                        onChange={handleChangeName}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                >
                    <Input
                        disabled={true}
                        value={email}
                    />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                    <Input
                        placeholder="Nhập Số điện thoại của bạn"
                        value={phone}
                        onChange={handleChangePhone}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUserInfo;
