import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import { Button, InputNumber, Space, Table, Input, Radio, Row, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './orderDetail.scss'

function OrderDetail() {
    const { id } = useParams();
    const token = Cookies.get('token');
    const tokenGID = Cookies.get('tokenGID');
    const [orderDetail, setOrderDetail] = useState([]);
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState([]);

    const columns = [
        {
            title: 'Hình sản phẩm',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (_, record) => {
                const product = products.find((item) => (
                    item.id === record.product_id
                ))
                return (
                    // console.log("record", record)
                    <div className='w-[108px]'>
                        < img
                            src={product.avatar}
                            className='w-full h-auto border-[1px] border-[#e1dada]'
                        ></img >

                    </div>
                )

            }
        },
        {
            title: 'Miêu tả',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) => {
                const product = products.find((item) => (
                    item.id === record.product_id
                ))
                return (
                    <p className='font-bold text-[17px] text-[#333]'>{product.prod_description}</p>
                )

            }
        },
        {
            title: 'Đơn giá',
            key: 'price',
            dataIndex: 'price',
            render: (_, record) => (
                <span>{record.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            )
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            render: (_, record) => (
                <span>{record.quantity}</span>
            )
        },
    ];

    const dataTable = orderDetail.map((item) => ({
        ...item,
        key: item.id
    }));

    useEffect(() => {
        getorderDetail();
        getOrder()
    }, []);
    const getorderDetail = () => {

        axios.get(`http://localhost:8000/orderdetails/${id}`)
            .then(response => {
                console.log(response.data);
                setOrderDetail(response.data.orderDetails);
                setProducts(response.data.dataProduct)
                // console.log(productDetail)
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });

    }

    const getOrder = () => {

        const keyToken = token ? 'token' : 'tokenGID'
        const valueToken = token ? token : tokenGID

        axios.post('http://localhost:8000/order', { [keyToken]: valueToken }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                console.log(response.data);
                const dataOrder = response.data.find((order) => (order.id + '' === id + ''))
                setOrder(dataOrder)

            })
            .catch(error => {
                // Xử lý lỗi ở đây
                console.error('Error fetching data:', error);
            });

    }
    return (

        <div className='bg-[#f0f0f0] py-3'>
            <div className='w-10/12  mx-[auto] '>
                <div className=' mx-[263px] mb-3'>
                    <div className='flex items-center justify-between mb-3'>
                        <Link to={'/order'} className='flex items-center'>
                            <FontAwesomeIcon
                                className='text-[gray] pr-2'
                                icon={faAngleLeft}></FontAwesomeIcon>
                            <h5 className=''>Quay lại các đơn đặt hàng của bạn</h5>
                        </Link>
                        <div>
                            <span>Mã đơn hàng: {order ? order.id : 'N/A'}</span>
                            <span className='mx-4'>|</span>
                            <span className='text-[#ed1d24] uppercase font-bold'>
                                {order ? order.user_address === 'Nhận hàng tại cửa hàng' ? 'Đặt hàng thành công'
                                    : order.is_success === 1 ? 'Đơn hàng đã hoàn tất'
                                        : order.is_transported === 1 ? 'Đơn hàng đã được giao đến nơi'
                                            : order.is_being_shipped === 1 ? 'Đơn hàng đang được giao đến bạn'
                                                : order.is_approved === 1 ? 'Đơn hàng đã được xác nhận. (Đang chuẩn bị hàng)'
                                                    : 'Đang chờ phê duyệt' : ''
                                }</span>

                        </div>
                    </div>
                    <div className='bg-[#fff]'>
                        <h3 className='text-[20px] p-4'>Địa chỉ nhận hàng</h3>
                        <div className='flex justify-between p-4 pt-0'>
                            {order ?
                                <>
                                    <ul>
                                        <li>{order.name}</li>
                                        <li>{order.phone}</li>
                                        <li>{order.user_address}</li>
                                    </ul>

                                    <ul>
                                        {order.user_address === 'Nhận hàng tại cửa hàng'
                                            ? <li>
                                                <span>
                                                    {new Date(order.created_at).toISOString().slice(11, 19)}
                                                </span>
                                                <span className='ml-2'>
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                                <span className='ml-3 active-status font-bold'>Đặt hàng thành công</span>
                                            </li>
                                            : null}
                                        {order.is_success === 1 ? <li>Đơn hàng đã hoàn tất</li>
                                            : null}
                                        {order.is_transported === 1 ? <li>Đơn hàng đã được giao đến nơi</li>
                                            : null}
                                        {order.is_being_shipped === 1 ? <li>
                                            <span>
                                                {order.being_shipped_at.slice(11, 19)}
                                            </span>
                                            <span className='ml-2'>
                                                {new Date(order.being_shipped_at).toLocaleDateString()}
                                            </span>
                                            <span className='ml-3 active-status font-bold'>
                                                Đơn hàng đang được giao đến bạn
                                            </span>
                                        </li>
                                            : null}
                                        {order.is_approved === 1 ? <li>
                                            <span>
                                                {order.approved_at.slice(11, 19)}
                                            </span>
                                            <span className='ml-2'>
                                                {new Date(order.approved_at).toLocaleDateString()}
                                            </span>
                                            <span className='ml-3 active-status font-bold'>Đơn hàng đã được xác nhận. (Đang chuẩn bị hàng)</span>
                                        </li>
                                            : null
                                        }
                                        {order.is_payment === 1 ? <li>
                                            <span>
                                                {order.paid_at.slice(11, 19)}
                                            </span>
                                            <span className='ml-2'>
                                                {new Date(order.paid_at).toLocaleDateString()}
                                            </span>
                                            <span className='ml-3 active-status font-bold'>Đơn hàng đã thanh toán</span>
                                        </li>
                                            : null
                                        }
                                        {order ? order.created_at ? order.user_address === 'Nhận hàng tại cửa hàng'
                                            ? null :
                                            <li>
                                                <span>
                                                    {order.created_at.slice(11, 19)}
                                                </span>
                                                <span className='ml-2'>
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                                <span className='ml-3 active-status font-bold'>Đặt hàng thành công</span>
                                            </li>
                                            : null : null}
                                    </ul>
                                </>
                                : ''
                            }
                        </div>
                    </div>

                </div>
                <div className='bg-[#ffffff] mx-[263px] flex flex-col'>
                    <Table
                        className='flex-1 table-order-detail'
                        columns={columns}
                        dataSource={dataTable} />
                    <div className='mb-3'>
                        <div className='flex justify-between font-bold text-[20px]'>
                            <span className='pl-5'>Tổng tiền:</span>
                            <span className='text-[#e5101d] pr-[30px]'>
                                {order ? order.total ? order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '' : ''}
                            </span>

                        </div>
                        <div className='flex justify-between'>
                            <span className='pl-5'>Hình thức thanh toán:</span>
                            <span className='text-[#000] pr-[30px]'>
                                {order ? order.total ? order.paymentMethods === 'COD' ? 'Thanh toán tiền mặt khi nhận hàng'
                                    : 'Thanh toán qua chuyển khoản qua tài khoản ngân hàng' : '' : ''}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div >

    );
}

export default OrderDetail