import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import { Button, InputNumber, Space, Table, Input, Radio, Row, Select } from 'antd';
import './order.scss'
import { Link } from 'react-router-dom';
import Instance from '../../../axiosInstance';

function Order() {
    const token = Cookies.get('token');
    const tokenGID = Cookies.get('tokenGID');
    const [order, setOrder] = useState([]);

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Hình sản phẩm',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (_, record) => (
                <div className='avatar w-[108px]'>
                    < img
                        src={record.avatar}
                        className='w-full h-auto border-[1px] border-[#e1dada]'
                    ></img >

                </div>
            )
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            dataIndex: 'total',
            render: (_, record) => (
                <span>{record.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            )
        },
        {
            title: 'Địa chỉ nhận hàng',
            key: 'user_address',
            dataIndex: 'user_address',
        },
        {
            title: 'Hình thức thanh toán',
            key: 'paymentMethods',
            dataIndex: 'paymentMethods',
            render: (_, record) => {
                let paymentMethod;
                if (record.paymentMethods === 'COD') {
                    paymentMethod = 'Thanh toán khi nhận hàng'
                } else if (record.paymentMethods === 'Bank') {
                    paymentMethod = 'Thanh toán qua tài khoản ngân hàng'
                }
                return (<div>
                    {paymentMethod}
                </div>)
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => {
                const matchedOrder = order.find(item => item.id === record.id);

                return matchedOrder ? (
                    <div>
                        {matchedOrder.user_address === 'Nhận hàng tại cửa hàng' ? 'Đặt hàng thành công'
                            : matchedOrder.is_success === 1 ? 'Đơn hàng đã hoàn tất'
                                : matchedOrder.is_transported ? 'Đơn hàng đã được giao đến nơi'
                                    : matchedOrder.is_being_shipped ? 'Đơn hàng đang được giao đến bạn'
                                        : matchedOrder.is_approved ? 'Đơn hàng đã được xác nhận. (Đang chuẩn bị hàng)'
                                            : 'Đang chờ phê duyệt'
                        }
                    </div>
                ) : null;
            },
        },
        {
            title: 'Ngày đặt',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text, record) => {
                const date = new Date(record.created_at).toLocaleDateString();
                const time = new Date(record.created_at).toISOString().slice(11, 19);
                const created_at = date + ' ' + time
                return <span className='flex'>{created_at}</span>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            dataIndex: 'action',
            render: (text, record) => (
                <Link to={`../order-detail/${record.id}`}>
                    <Button>Xem chi tiết</Button>
                </Link>
            ),
        },

    ];

    const dataTable = order.map((item) => ({
        ...item,
        key: item.id
    }));

    useEffect(() => {
        getOrder();
    }, []);
    const getOrder = () => {

        const keyToken = token ? 'token' : 'tokenGID'
        const valueToken = token ? token : tokenGID

        Instance.post('/order', { [keyToken]: valueToken }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                console.log(response.data);
                setOrder(response.data)

            })
            .catch(error => {
                // Xử lý lỗi ở đây
                console.error('Error fetching data:', error);
            });

    }
    return (

        <div className='bg-[#f0f0f0] py-3'>
            <div className='w-10/12  mx-[auto] '>
                <div className='bg-[#ffffff] mx-[263px] flex'>
                    <Table
                        className='flex-1'
                        columns={columns}
                        dataSource={dataTable} />
                </div>
            </div>
        </div>

    );
}

export default Order