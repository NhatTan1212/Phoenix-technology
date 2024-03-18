import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';
import { HomeOutlined, ShoppingOutlined, InboxOutlined, PlusOutlined, } from '@ant-design/icons';
import {
    Breadcrumb, Space, Input, Button, Table, Modal,
    Form, Select, Row, Col,
} from 'antd';
import AdminHome from '../adminHome';
import axios, { AxiosHeaders } from 'axios';
import { text } from '@fortawesome/fontawesome-svg-core';
import Cookies from 'js-cookie';
import './orderManagement.scss'
import Context from '../../../store/Context';
import { DeleteOrder, GetOrder, UpdateOrder } from '../../../callAPI/api';
import Instance from '../../../axiosInstance';
import DeliveryAddressOrderDetail from '../../../component/management/DeliveryAddress';
import TableOrderDetail from '../../../component/management/TableOrderDetail';

const { Option } = Select;

const OrderManagement = () => {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const [form] = Form.useForm();
    const token = Cookies.get('token');
    const [orders, setOrders] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [isViewing, setIsViewing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [orderEditing, setOrderEditing] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [order, setOrder] = useState(null);
    const [orderDetail, setOrderDetail] = useState([]);
    const [products, setProducts] = useState([]);
    const [id, setId] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);




    const dataTable = orderDetail.map((item) => ({
        ...item,
        key: item.id
    }));
    const OrderStatusCpn = ({ record }) => {
        const matchedOrder = orders.find(item => item.id === record.id);

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
                const matchedOrder = orders.find(item => item.id === record.id);
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
            render: (text, record) => {
                return (<div className='flex flex-col h-auto'>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 w-[97px] max-[1281px]:w-[auto] '
                        onClick={(e) => {
                            // console.log(record)
                            handleViewOrderDetail(record)
                        }}>
                        {!isScreenSmaller1280 ? 'Xem chi tiết' : <FontAwesomeIcon className='min-w-[60px]' icon={faEye} />}
                    </button>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2 w-[97px] max-[1281px]:w-[auto]'
                        onClick={(e) => {
                            // console.log(record)
                            handleEditOrder(record)
                        }}>
                        {!isScreenSmaller1280 ? 'Chỉnh sửa' : <FontAwesomeIcon icon={faPenToSquare} />}
                    </button>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2 w-[97px] max-[1281px]:w-[auto]'
                        onClick={(e) => {
                            setOrderIdToDelete(record.id)
                            setShowDeleteConfirmation(true)
                        }}>
                        {!isScreenSmaller1280 ? 'Xóa' : <FontAwesomeIcon icon={faTrash} />}
                    </button>
                </div>)
            }
        },

    ];
    const columnsDetailOrder = [
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
            render: (text, record) => {
                return (<div className='flex flex-col h-auto'>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 min-w-[60px]  '
                        onClick={(e) => {
                            // console.log(record)
                            handleViewOrderDetail(record)
                        }}>
                        {!isScreenSmaller1280 ? 'Xem chi tiết' : <FontAwesomeIcon icon={faEye} />}
                    </button>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2 min-w-[60px] '
                        onClick={(e) => {
                            // console.log(record)
                            handleEditOrder(record)
                        }}>
                        {!isScreenSmaller1280 ? 'Chỉnh sửa' : <FontAwesomeIcon icon={faPenToSquare} />}
                    </button>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2 min-w-[60px] '
                        onClick={(e) => {
                            setOrderIdToDelete(record.id)
                            setShowDeleteConfirmation(true)
                        }}>
                        {!isScreenSmaller1280 ? 'Xóa' : <FontAwesomeIcon icon={faTrash} />}
                    </button>
                </div>)
            }
        },
    ];

    const deviceColumnsOrderDetails = [
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



    const handleViewOrderDetail = (order) => {
        setIsViewing(true)
        setOrder(order)
        setId(order.id)
        // console.log(order.id);

    }

    const handleEditOrder = (order) => {
        setIsEditing(true)
        // console.log(order)
        setOrderEditing(order)
        form.setFieldsValue({
            paymentStatus: order.is_payment === 0 ? 'Chưa thanh toán' : 'Đã thanh toán',
            status: getStatusValue(order), // Implement this function
        });
    }

    useEffect(() => {
        // Hàm này chạy khi component được mount
        getOrders();
        if (isViewing) getorderDetail()
    }, [searchText, isEditing, isViewing, showDeleteConfirmation]);

    useEffect(() => {
        filterOrders();
    }, [searchText, orders]);

    const getOrders = () => {
        const reqData = { token: token }
        GetOrder(reqData).then(response => {
            // console.log(response);
            setOrders(response)
        })
    }

    const getorderDetail = () => {

        Instance.get(`/orderdetails/${id}`)
            .then(response => {
                // console.log(response.data);
                setOrderDetail(response.data.orderDetails);
                setProducts(response.data.dataProduct)
                // console.log(productDetail)
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });

    }
    const handleChangeInputSearch = (e) => {
        setSearchText(e.target.value)

    }

    const filterOrders = () => {
        const filteredOrders = orders.filter((order) => {
            const orderId = order.id + '';
            return orderId.includes(searchText);
        });
        // console.log(orders, filteredOrders)
        setFilteredOrders(filteredOrders);
    }

    const onFinish = (values) => {
        console.log(values);
        const paymentStatus = values.paymentStatus
        const status = values.status
        const statusOrderChanged = {
            token: token,
            is_payment: paymentStatus === 'Chưa thanh toán' ? 0 : paymentStatus === '0' ? 0 : 1,
            is_success: status === 'is_success' ? 1 : orderEditing.is_success,
            is_transported: status === 'is_transported' ? 1 : orderEditing.is_transported,
            is_being_shipped: status === 'is_being_shipped' ? 1 : orderEditing.is_being_shipped,
            is_approved: status === 'is_approved' ? 1 : orderEditing.is_approved,
        }
        console.log(statusOrderChanged);
        UpdateOrder(orderEditing.id, statusOrderChanged).then(response => {
            console.log(response);
            context.Message("success", "Cập nhật đơn hàng thành công.")
            setIsEditing(false);
            setOrderEditing(null);
        })
            .catch(error => {
                context.Message("error", "Đã có lỗi xảy ra khi cập nhật đơn hàng.")
            });
    };

    const getStatusValue = (order) => {
        if (order.is_success === 1) {
            return 'is_success';
        } else if (order.is_transported === 1) {
            return 'is_transported';
        } else if (order.is_being_shipped === 1) {
            return 'is_being_shipped';
        } else if (order.is_approved === 1) {
            return 'is_approved';
        } else {
            return 'is_pending_approval';
        }
    }

    const handleDeleteOrder = (order_id) => {

        const requestData = {
            token: token,
            order_id: order_id,
        };

        DeleteOrder(requestData).then(response => {
            if (response.success) {
                context.Message("success", "Xóa order thành công.")

            }
        })
    }


    return (
        <div className='flex-1'>
            <Modal
                title='Chi tiết đơn hàng'
                open={isViewing === true}
                footer={null}
                width={1200}
                className='modal-order-management-view-detail'
                onOk={() => {
                    // Handle save logic here
                    setIsViewing(false);
                    setOrderEditing(null); // Clear the editingProduct when closing the modal
                }}
                onCancel={() => {
                    setIsViewing(false);
                    setOrderEditing(null); // Clear the editingProduct when closing the modal
                }}>
                <div className='pl-4'>
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
                <div className='bg-[#fff]'>
                    <DeliveryAddressOrderDetail order={order} />
                    <div className='bg-[#ffffff] flex flex-col'>
                        <TableOrderDetail
                            columns={isHiddenAutoCpl ? columnsDetailOrder : deviceColumnsOrderDetails}
                            dataSource={dataTable}
                            order={order} />
                    </div>
                </div>
            </Modal>
            <Modal
                title="Xác nhận xóa sản phẩm"
                open={showDeleteConfirmation}
                onOk={() => {
                    handleDeleteOrder(orderIdToDelete); // Gọi hàm xóa sau khi xác nhận
                    setShowDeleteConfirmation(false); // Đóng modal
                }}
                onCancel={() => setShowDeleteConfirmation(false)} // Đóng modal khi bấm hủy
                className='model-cart'
            >
                <p>Bạn có chắc chắn muốn xóa sản phẩm khỏi cửa hàng?</p>
            </Modal>
            <Modal
                className='edit-modal-orderManagement'
                title={`Cập nhật đơn hàng - ${orderEditing ? orderEditing.id : null}`}
                open={isEditing === true}
                width={600}
                onOk={() => {
                    // Handle save logic here
                    setIsEditing(false);
                    // setEditingProduct(null); // Clear the editingProduct when closing the modal
                }}
                onCancel={() => {
                    setIsEditing(false);
                    // setEditingProduct(null); // Clear the editingProduct when closing the modal
                }}
                footer={null}>
                <Form
                    form={form}
                    name="editProduct"
                    onFinish={onFinish}
                // style={{
                //     maxWidth: 600,
                // }}
                >
                    <Form.Item
                        name="paymentStatus"
                        label="Trạng thái thanh toán"
                    >
                        <Select
                            onChange={(e) => { console.log(e); setPaymentStatus(e) }}
                            allowClear
                        >
                            <Option value="0">Chưa thanh toán</Option>
                            <Option value="1">Đã thanh toán</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái đơn hàng"
                    >
                        <Select
                            onChange={(e) => { console.log(e) }}
                            allowClear
                        >
                            <Option value="is_pending_approval">Đang chờ phê duyệt</Option>
                            <Option value="is_approved">Đã xác nhận</Option>
                            <Option value="is_being_shipped">Đang giao hàng</Option>
                            <Option value="is_transported">Đã giao hàng thành công</Option>
                            <Option value="is_success">Đơn hàng đã hoàn tất</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item className='text-end'>
                        <Button
                            className=''
                            htmlType="button"
                            onClick={() => { setIsEditing(false) }}>
                            Đóng
                        </Button>
                        <Button
                            className='ml-3'
                            type="primary" htmlType="submit">
                            Cập nhật
                        </Button>

                    </Form.Item>
                </Form>
            </Modal>
            {/* <AdminHome></AdminHome> */}
            <div className='bg-[#f0f0f0] flex-1 p-3'>
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <span className='flex items-center'>
                                <HomeOutlined />
                            </span>,
                        },
                        {
                            title: <span className='flex items-center'>
                                <ShoppingOutlined className='mr-2' /> Order Management
                            </span>,
                        },
                    ]}
                />
                <div className={`flex justify-between bg-white items-center  ${isHiddenAutoCpl ? 'p-4' : 'flex-col-reverse p-0'}`}>

                    <Input.Search
                        allowClear
                        className={`searchPM ${isHiddenAutoCpl ? '' : 'w-full pt-2'}`}
                        placeholder='Nhập mã đơn hàng, từ khóa cần tìm kiếm,...'
                        onSearch={(e) => { console.log('hi') }}
                        onChange={(e) => { handleChangeInputSearch(e) }}
                        onPressEnter={(e) => { console.log('hi') }}
                        style={{ width: '45%' }}></Input.Search>
                    {/* <Button className='btn-add-prd bg-[#c8191f] text-white 
                    h-auto'>
                        <span className='font-bold text-[18px] mr-2'>
                            +
                        </span>
                        <span>
                            Thêm đơn hàng
                        </span>
                    </Button> */}
                </div>
                <div className='flex flex-col bg-white p-4
                mt-[20px]'>
                    <h3>Quản lý đơn hàng</h3>
                    <Table
                        className='table-order-management'
                        columns={!isScreenSmaller1280 ? columns : deviceColumns}
                        dataSource={filteredOrders.map((order) => ({
                            ...order,
                            key: order.id
                        }))}>
                    </Table>
                </div>
            </div>
        </div >

    );
};
export default OrderManagement;