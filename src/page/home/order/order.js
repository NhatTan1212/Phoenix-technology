import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import { Button, InputNumber, Space, Table, Input, Radio, Row, Select, Col } from 'antd';
import './order.scss'
import { Link } from 'react-router-dom';
import Instance from '../../../axiosInstance';
import Context from '../../../store/Context';

function Order() {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const token = Cookies.get('token');
    const tokenGID = Cookies.get('tokenGID');
    const [order, setOrder] = useState([]);

    const OrderStatusCpn = ({ record }) => {
        const matchedOrder = order.find(item => item.id === record.id);

        return matchedOrder ? (
            <div className='text-[#26aa5f] font-bold'>
                {matchedOrder.user_address === 'Nhận hàng tại cửa hàng' ? 'Đặt hàng thành công'
                    : matchedOrder.is_success === 1 ? 'Đơn hàng đã hoàn tất'
                        : matchedOrder.is_transported ? 'Đơn hàng đã được giao đến nơi'
                            : matchedOrder.is_being_shipped ? 'Đơn hàng đang được giao đến bạn'
                                : matchedOrder.is_approved ? 'Đơn hàng đã được xác nhận. (Đang chuẩn bị hàng)'
                                    : 'Đang chờ phê duyệt'
                }
            </div>
        ) : null;
    }

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            sorter: (record1, record2) => { return record1.id - record2.id }
        },
        {
            title: 'Hình sản phẩm',
            dataIndex: 'avatar',
            key: 'avatar',
            // sortDirections: ["descend", "ascend"],
            // responsive: ["xxl"],
            render: (_, record) => (
                <div className='avatar w-[108px] '>
                    <img
                        src={record.avatar}
                        className='w-full h-auto border-[1px] border-[#e1dada] '
                    />
                </div>
            )
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            dataIndex: 'total',
            sortDirections: ["descend", "ascend"],
            responsive: ["xxl"],
            render: (_, record) => (
                <span>{record.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            ),
            sorter: (record1, record2) => { return record1.total - record2.total }
        },
        {
            title: 'Địa chỉ nhận hàng',
            key: 'user_address',
            dataIndex: 'user_address',
            render: (_, record) => {
                return <div className=' max-h-[5em] min-w-[210px] max-[1366px]:min-w-[180px] overflow-hidden'>{record.user_address}</div>
            }
        },
        {
            title: 'Hình thức thanh toán',
            key: 'paymentMethods',
            dataIndex: 'paymentMethods',
            render: (_, record) => {
                let paymentMethod;
                if (record.paymentMethods === 'COD') {
                    paymentMethod = 'Thanh toán khi nhận hàng'
                } else if (record.paymentMethods === 'BANK') {
                    paymentMethod = 'Thanh toán qua tài khoản ngân hàng'
                } else {
                    paymentMethod = 'ATM-Tài khoản ngân hàng nội địa (VNPAY)'
                }
                return (<div className='min-w-[117px]'>
                    {paymentMethod}
                </div>)
            },
            filters: [
                {
                    text: 'Thanh toán qua tài khoản ngân hàng',
                    value: 'BANK'
                },
                {
                    text: 'Thanh toán khi nhận hàng',
                    value: 'COD'
                },
                {
                    text: 'ATM-Tài khoản ngân hàng nội địa (VNPAY)',
                    value: 'Credit Card'
                },

            ]
            ,
            onFilter: (value, record) => {
                return record.paymentMethods === value;
            }
        },
        {
            title: 'Trạng thái đơn hàng',
            key: 'order_status',
            render: (_, record) => {
                return <OrderStatusCpn record={record} />
            },
            filters: [
                { text: 'Đang chờ phê duyệt', value: 'is_pending_approval' },
                { text: 'Đã xác nhận', value: 'is_approved' },
                { text: 'Đang giao hàng', value: 'is_being_shipped' },
                { text: 'Đã giao hàng thành công', value: 'is_transported' },
                { text: 'Đơn hàng đã hoàn tất', value: 'is_success' },
            ],
            onFilter: (value, record) => {
                const matchedOrder = order.find(item => item.id === record.id);
                switch (value) {
                    case 'is_pending_approval':
                        return matchedOrder.is_approved !== 1 && matchedOrder.is_being_shipped !== 1
                            && matchedOrder.is_transported !== 1 && matchedOrder.is_success !== 1
                            && matchedOrder.user_address !== 'Nhận hàng tại cửa hàng';
                    case 'is_approved':
                        return matchedOrder.is_approved === 1 && matchedOrder.is_being_shipped !== 1
                            && matchedOrder.user_address !== 'Nhận hàng tại cửa hàng';
                    case 'is_being_shipped':
                        return matchedOrder.is_being_shipped === 1 && matchedOrder.is_transported !== 1;
                    case 'is_transported':
                        return matchedOrder.is_transported === 1 && matchedOrder.is_success !== 1;
                    case 'is_success':
                        return matchedOrder.is_success === 1;
                    default:
                        return false;
                }
            }
        },
        {
            title: 'Trạng thái thanh toán',
            key: 'status',
            dataIndex: 'is_payment',
            render: (_, record) => {

                return (
                    <div>
                        {record.is_payment === 1
                            ? <span>Đã thanh toán</span>
                            : <span>Chưa thanh toán</span>
                        }
                    </div>
                );
            },
            filters: [
                {
                    text: 'Chưa thanh toán',
                    value: 0
                },
                {
                    text: 'Đã thanh toán',
                    value: 1
                }

            ]
            ,
            onFilter: (value, record) => {
                return record.is_payment === value;
            }
        },
        {
            title: 'Ngày đặt',
            key: 'created_at',
            dataIndex: 'created_at',
            sortDirections: ["descend", "ascend"],
            responsive: ["xxl"],
            sorter: (record1, record2) => { return record1.id - record2.id },
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
                <Link to={`../order-detail/${record.id}`}
                >
                    <Button className='bg-[#c8191f] text-white hover:shadow-[0_0_6px_0_#333]'>Xem chi tiết</Button>
                </Link>
            ),
        },

    ];

    const deviceColumns = [
        {
            title: 'Thông tin sản phẩm',
            render: (record, key, index) => {
                return (
                    <div className=''>
                        <Row className=''>
                            <Col sm={{ span: 12 }} xs={{ span: 24 }}
                            >
                                <div className='pb-2 '>Mã đơn hàng: {record.id}</div>

                            </Col>
                            <Col sm={{ span: 12 }} xs={{ span: 24 }}
                                className='text-end max-sm:text-start'>
                                <OrderStatusCpn record={record} />

                            </Col>
                        </Row>
                        <Row className='overflow-hidden text-ellipsis max-[470px]:max-w-[300px]'>
                            <Col
                                className='max-[490px]:max-w-full pr-3'>

                                <div
                                    className='w-[108px]'
                                >
                                    < img
                                        src={record.avatar}
                                        className='w-full h-auto border-[1px] border-[#e1dada]'
                                    ></img >

                                </div>
                            </Col>
                            <Col
                                className=''
                            >

                                <p className='font-bold text-[17px] text-[#333] max-h-[3em] overflow-hidden max-w-[330px] text-ellipsis
                                max-[525px]:max-w-[200px]'>
                                    {record.prod_name}
                                </p>
                                <p>x{record.quantity}</p>

                            </Col>

                        </Row>
                        <div className='pt-2 flex justify-between max-sm:flex-col'>
                            <p>Tổng sản phẩm: {record.total_product}</p>
                            <p >
                                <span>
                                    Tổng tiền:
                                </span>
                                <span className='text-[#e5101ec4] font-semibold'>
                                    {' ' + record.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </span>
                            </p>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            dataIndex: 'action',
            width: '15%',
            render: (text, record) => (
                <Link to={`../order-detail/${record.id}`}
                >
                    <Button
                        className='min-w-[60px] bg-[#c8191f] text-white hover:shadow-[0_0_6px_0_#333]'>
                        {isHiddenAutoCpl ? 'Xem chi tiết' : <FontAwesomeIcon icon={faEye} />}
                    </Button>
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
            <div className='max-w-[1590px]  mx-[auto] '>
                <div className='bg-[#ffffff] flex  max-[1615px]:mx-[30px] max-[430px]:mx-[10px]'>
                    <Table
                        className='flex-1'
                        columns={!isScreenSmaller1280 ? columns : deviceColumns}
                        dataSource={dataTable} />
                </div>
            </div>
        </div>

    );
}

export default Order