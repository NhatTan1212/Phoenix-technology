import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './orderDetail.scss'
import Instance from '../../../axiosInstance';
import DeliveryAddressOrderDetail from '../../../component/management/DeliveryAddress';
import TableOrderDetail from '../../../component/management/TableOrderDetail';
import Context from '../../../store/Context';

function OrderDetail() {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

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
                    <div className='w-[108px] '>
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

    const deviceColumns = [
        {
            title: 'Danh sách sản phẩm',
            render: (_, record) => {
                const product = products.find((item) => (
                    item.id === record.product_id
                ))
                return (
                    // console.log("record", record)
                    <div >
                        <div className='flex max-[650px]:flex-col'>
                            <div className='mr-4 w-[108px] min-w-[108px]'>
                                < img
                                    src={product.avatar}
                                    className='w-full h-auto border-[1px] border-[#e1dada]'
                                ></img >
                            </div>
                            <p className='font-bold text-[17px] text-[#333]   max-[470px]:max-w-[300px]'>{product.prod_description}</p>

                        </div>
                        <div className='flex justify-between'>
                            <span className='ml-[124px] max-[650px]:mx-0'>x{record.quantity}</span>
                            <span>{record.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>

                        </div>
                    </div>
                )

            }
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

        Instance.get(`/orderdetails/${id}`)
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

        Instance.post('/order', { [keyToken]: valueToken }, {
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
            <div className='w-10/12  mx-[auto] max-[1550px]:w-full '>
                <div className=' mx-[263px] mb-3 max-[1550px]:mx-[293px] max-[1360px]:mx-[30px]'>
                    <div className='flex items-center justify-between mb-3 max-[730px]:flex-col max-[730px]:items-start'>
                        <Link to={'/order'} className='flex items-center '>
                            <FontAwesomeIcon
                                className='text-[gray] pr-2'
                                icon={faAngleLeft}></FontAwesomeIcon>
                            <h5 className=''>Quay lại các đơn đặt hàng của bạn</h5>
                        </Link>
                        <div className='max-[435px]:flex max-[435px]:flex-col'>
                            <span>Mã đơn hàng: {order ? order.id : 'N/A'} |</span>
                            <span className='text-[#ed1d24] uppercase font-bold ml-4 max-[435px]:ml-0'>
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
                        <DeliveryAddressOrderDetail order={order} />
                    </div>

                </div>
                <div className='bg-[#ffffff] mx-[263px] flex flex-col max-[1550px]:mx-[293px] max-[1360px]:mx-[30px]'>
                    <TableOrderDetail
                        columns={isHiddenAutoCpl ? columns : deviceColumns}
                        dataSource={dataTable}
                        order={order} />
                </div>
            </div>
        </div >

    );
}

export default OrderDetail