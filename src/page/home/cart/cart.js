import React, { useState, useEffect, useContext } from 'react';
import Context from '../../../store/Context';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import { Button, InputNumber, Space, Table, Input, Radio, Row, Select, Modal, Col } from 'antd';
import './cart.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import Instance from '../../../axiosInstance';
import CryptoJS from 'crypto-js';
import qs from 'qs';
import { AddNewDeliveryAddress, GetDeliveryAddress } from '../../../callAPI/api';
import ModalSelectAddress from '../../../component/ModalSelectAddress';

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

function Cart() {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const navigate = useNavigate();
    const token = Cookies.get('token');
    const tokenGID = Cookies.get('tokenGID');
    const isFinishAddNewOrderVNPAY = context.isFinishAddNewOrderVNPAY
    const setIsFinishAddNewOrderVNPAY = context.setIsFinishAddNewOrderVNPAY
    const isCartChange = context.isCartChange
    const setIsCartChange = context.setIsCartChange
    const [cart, setCart] = useState([]);
    const [sum, setSum] = useState(0);
    const [valueRadioReceive, setValueRadioReceive] = useState("Giao hàng tận nơi");
    const [valueRadioPay, setValueRadioPay] = useState("COD");
    const [valueRadioLanguage, setValueRadioLanguage] = useState("vn");
    const [detailAddress, setDetailAddress] = useState("");
    const [optionsSelectProvince, setOptionsSelectProvince] = useState(null)
    const [optionsSelectDistricts, setOptionsSelectDistricts] = useState(null)
    const [optionsSelectWards, setOptionsSelectWards] = useState(null)
    const [provinceSelected, setProvinceSelected] = useState(null)
    const [districtSelected, setDistrictSelected] = useState(null)
    const [wardSelected, setWardSelected] = useState(null)
    const [customerName, setCustomerName] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [note, setNote] = useState('')
    const [listProduct, setListProduct] = useState([])
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [isSelectingDeliveryAddress, setIsSelectingDeliveryAddress] = useState(false);
    const [addressSaved, setAddressSaved] = useState(null);
    const [isFinish, setIsFinish] = useState(false)
    const [isAddressDeliveryChange, setIsAddressDeliveryChange] = useState(false)
    const [idNavigateOrderDetail, setIdNavigateOrderDetail] = useState('')

    //Xử lý VNPAY
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [vnpayStatus, setVnpayStatus] = useState(null);

    const addClassCSS = () => {
        //add class antd input
        const antInput = document.querySelector('.ant-input')
        antInput.classList.add('ant-input-cart')
    }

    const columns = [
        {
            title: 'Hình sản phẩm',
            dataIndex: 'avatar',
            key: 'avatar',
            sortDirections: ["descend", "ascend"],

            render: (_, record) => (
                // console.log("record", record)
                <div
                    className='w-[108px]'
                >
                    < img
                        src={record.avatar}
                        className='w-full h-auto border-[1px] border-[#e1dada]'
                    ></img >

                </div>
            )
        },
        {
            title: 'Miêu tả',
            dataIndex: 'description',
            key: 'description',
            sortDirections: ["descend", "ascend"],

            render: (_, record) => (
                // console.log("record", record)
                <p className='font-bold text-[17px] text-[#333]'>{record.description}</p>
            )
        },
        {
            title: 'Đơn giá',
            key: 'price',
            dataIndex: 'price',
            sortDirections: ["descend", "ascend"],

            render: (_, record) => (
                <span>{record.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            )
        },
        {
            width: 100,
            title: 'Số lượng',
            key: 'count',
            dataIndex: 'count',
            sortDirections: ["descend", "ascend"],

            render: (_, record) => (
                record.is_possible_to_order !== 0 ?
                    <InputNumber
                        min={1}
                        max={record.is_possible_to_order}
                        value={record.count}
                        onChange={(newQuantity) => handleQuantityChange(record.id, newQuantity)} />
                    : <span className='text-[#e6101d] font-bold'>Hết hàng</span>
            )
        },
        {
            title: 'Xóa',
            key: 'action',
            sortDirections: ["descend", "ascend"],

            render: (_, record) => (
                <Space size="middle">
                    <a onClick={async () => {
                        setProductIdToDelete(record.product_id)
                        await setShowDeleteConfirmation(true)

                        const okButtonModal = document.querySelector('.ant-btn-primary')
                        okButtonModal.id = 'okButtonModal'
                    }}>
                        <FontAwesomeIcon icon={faXmark} className='text-[#c8191f]' ></FontAwesomeIcon>
                    </a>
                </Space>
            ),
        },
    ];

    const deviceColumns = [
        {
            title: "Giỏ hàng",
            render: (record, key, index) => {
                return (
                    <div>
                        <Row>
                            <Col md={{ span: 6, offset: 1 }} sm={{ span: 6, offset: 1 }} xs={{ span: 24, offset: 0 }}>
                                <div
                                    className='w-[108px]'
                                >
                                    < img
                                        src={record.avatar}
                                        className='w-full h-auto border-[1px] border-[#e1dada]'
                                    ></img >

                                </div>
                            </Col>
                            <Col md={{ span: 17 }} sm={{ span: 17 }} xs={{ span: 24 }}>
                                <p className='font-bold text-[17px] text-[#333] max-[420px]:max-w-[300px]'>{record.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 1 }} sm={{ span: 6, offset: 1 }} xs={{ span: 8, offset: 0 }} />
                            <Col md={{ span: 17 }} sm={{ span: 17 }} xs={{ span: 24 }}>{record.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 6, offset: 1 }} sm={{ span: 6, offset: 1 }} xs={{ span: 8, offset: 0 }}></Col>
                            <Col md={{ span: 17 }} sm={{ span: 17 }} xs={{ span: 24 }}>
                                {
                                    record.is_possible_to_order !== 0 ?
                                        <InputNumber
                                            min={1}
                                            max={record.is_possible_to_order}
                                            value={record.count}
                                            onChange={(newQuantity) => handleQuantityChange(record.id, newQuantity)} />
                                        : <span className='text-[#e6101d] font-bold'>Hết hàng</span>
                                }
                                <span>
                                    <Space size="middle" className='pl-3'>
                                        <a onClick={async () => {
                                            setProductIdToDelete(record.product_id)
                                            await setShowDeleteConfirmation(true)

                                            const okButtonModal = document.querySelector('.ant-btn-primary')
                                            okButtonModal.id = 'okButtonModal'
                                        }}>
                                            <FontAwesomeIcon icon={faXmark} className='text-[#c8191f]' ></FontAwesomeIcon>
                                        </a>
                                    </Space>
                                </span>
                            </Col>
                        </Row>
                    </div>
                )
            }
        }
    ];

    const data = cart.map((item) => ({
        ...item,
        key: item.id
    }));

    const handleQuantityChange = (productId, newQuantity) => {
        const updatedCart = cart.map(item => {
            if (item.id === productId) {
                // Update the quantity for the specific item
                item.count = newQuantity;
                item.product_total = item.price * newQuantity;
            }
            return item;
        });

        setCart(updatedCart);
        console.log(cart)
    };
    const getDeliveryAddress = () => {
        if (token) {
            console.log('hi');
            console.log(token);
            let requestData = {
                token: token
            }
            GetDeliveryAddress(requestData).then((data) => {
                console.log(data.delivery_address);
                setAddressSaved(data.delivery_address)
            })
        }

    }

    const handleSelectingDeliveryAddress = () => {
        getDeliveryAddress()
        setIsSelectingDeliveryAddress(true)
    }

    const handleDeleteCart = (productId) => {
        // Xác định giá trị token hoặc tokenGID để sử dụng
        const authValue = token ? token : tokenGID;
        const authKey = token ? 'token' : 'tokenGID';

        const requestData = {
            [authKey]: authValue,
            product_id: productId,
        };

        Instance.post('/deletecart', requestData, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                getCart();
                setIsCartChange(true)
            })
            .catch(error => {
                console.error('Error deleting item from cart:', error);
            });
    };

    const handleUpdateCart = () => {
        // Xác định giá trị token hoặc tokenGID để sử dụng
        const authValue = token ? token : tokenGID;
        const authKey = token ? 'token' : 'tokenGID';

        const requestData = {
            [authKey]: authValue,
            cart: cart
        };

        Instance.post('/updatecart', requestData, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                context.Message("success", "Cập nhật giỏ hàng thành công.")
            })
            .catch(error => {
                console.error('Error updating cart:', error);
            });
    };



    const postToCreateNewOrder = () => {
        console.log(isFinishAddNewOrderVNPAY);
        if (queryParams.has('vnp_ResponseCode') && !isFinishAddNewOrderVNPAY) {
            setIsFinishAddNewOrderVNPAY(true)
            console.log(isFinishAddNewOrderVNPAY);
            // Thực hiện xử lý dựa trên ResponseCode từ VNPAY
            let objParams = Object.fromEntries(queryParams);
            let newObjParams = { ...objParams };
            delete newObjParams['vnp_SecureHash'];
            const responseCode = queryParams.get('vnp_ResponseCode');
            const secureHash = queryParams.get('vnp_SecureHash');
            console.log(secureHash);
            const sortedParams = sortObject(newObjParams);
            console.log(sortedParams);
            const tmnCode = process.env.REACT_APP_VNP_TMNCODE
            const secretKey = process.env.REACT_APP_VNP_HASHSECRET
            const signData = qs.stringify(sortedParams, { encode: false });
            console.log(signData);
            const hmac = CryptoJS.HmacSHA512(signData, secretKey);
            const signed = hmac.toString(CryptoJS.enc.Hex);
            console.log(signData, secretKey);
            console.log(signed);
            console.log(secureHash);
            const getDataOder = sessionStorage.getItem('dataOrder');
            if (signed === secureHash) {
                if (responseCode === '00') {
                    if (getDataOder) {
                        const dataOder = JSON.parse(getDataOder);
                        let vnp_BankCode = queryParams.get('vnp_BankCode')
                        let vnp_CardType = queryParams.get('vnp_CardType')
                        let vnp_OrderInfo = queryParams.get('vnp_OrderInfo')
                        let vnp_PayDate = queryParams.get('vnp_PayDate')
                        let vnp_TransactionNo = queryParams.get('vnp_TransactionNo')
                        dataOder["vnp_BankCode"] = vnp_BankCode
                        dataOder["vnp_CardType"] = vnp_CardType
                        dataOder["vnp_OrderInfo"] = vnp_OrderInfo
                        dataOder["vnp_PayDate"] = vnp_PayDate
                        dataOder["vnp_TransactionNo"] = vnp_TransactionNo
                        // console.log(dataOder);
                        Instance.post('/dataorder', dataOder, {
                            headers: {
                                "Content-Type": "application/json",
                            }
                        })
                            .then(response => {
                                sessionStorage.removeItem("dataOrder")
                                // Thanh toán thành công
                                console.log(response);
                                setVnpayStatus('success');
                                if (response.data.order_id) {
                                    setIdNavigateOrderDetail(response.data.order_id)
                                }
                                setIsCartChange(true)
                            })
                            .catch(error => {
                                console.error('Error updating cart:', error);
                                context.Message("error", "Đã có lỗi xảy ra khi đặt hàng.")

                            });
                    }
                } else {
                    // Thanh toán thất bại
                    setVnpayStatus('failed');
                }

            } else {
                setVnpayStatus('failed');
            }
        }
    }

    const getDiaGioiHanhChinhVN = () => {
        var Parameter = {
            url: "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
            method: "GET",
            responseType: "application/json",
        };
        var promise = axios(Parameter);
        promise.then(function (result) {
            let data = JSON.parse(result.data)
            const transformedData = data.map(province => {
                const transformedProvince = {
                    ...province,
                    value: province.Name,
                    label: province.Name,
                    Districts: province.Districts.map(district => {
                        const transformedDistrict = {
                            ...district,
                            value: district.Name,
                            label: district.Name,
                            Wards: district.Wards.map(ward => ({
                                ...ward,
                                value: ward.Name,
                                label: ward.Name,
                            })),
                        };
                        return transformedDistrict;
                    }),
                };
                return transformedProvince;
            });

            setOptionsSelectProvince(transformedData)
            console.log(transformedData)
        });
    }

    const getCart = () => {
        if (token !== undefined) {
            Instance.post('/cart', { token }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    console.log(response.data);
                    setCart(response.data)

                })
                .catch(error => {
                    // Xử lý lỗi ở đây
                    console.error('Error fetching data:', error);
                });
        } else if (tokenGID !== undefined) {
            Instance.post('/cart', { tokenGID }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    console.log(response.data);
                    setCart(response.data)

                })
                .catch(error => {
                    // Xử lý lỗi ở đây
                    console.error('Error fetching data:', error);
                });
        }
    }

    const handleChangeProvince = (e) => {
        let findProvince = optionsSelectProvince.find((province) => {
            return province.Name === e
        })
        console.log(findProvince)
        setProvinceSelected(findProvince.Name)
        setOptionsSelectDistricts(findProvince.Districts)
    }

    const handleChangeDistrict = (e) => {
        let findDistrict = optionsSelectDistricts.find((district) => {
            return district.Name === e
        })
        console.log(findDistrict)
        setDistrictSelected(findDistrict.Name)
        setOptionsSelectWards(findDistrict.Wards)
    }

    const handleChangeWard = (e) => {
        let findWard = optionsSelectWards.find((ward) => {
            return ward.Name === e
        })
        console.log(findWard)
        setWardSelected(findWard.Name)
    }

    const handleOrder = () => {
        if (cart.length !== 0) {
            const authValue = token ? token : tokenGID;
            const authKey = token ? 'token' : 'tokenGID';

            // Kiểm tra xem tất cả thông tin cần thiết đã được điền đầy đủ
            if (!customerName || !customerPhone || !customerEmail) {
                context.Message("error", "Vui lòng điền đầy đủ thông tin khách hàng.");
                return;
            }
            if (valueRadioReceive === "Giao hàng tận nơi") {
                if (detailAddress === "") {
                    context.Message("error", "Quý khách vui lòng nhập địa chỉ giao hàng.");
                } else if (provinceSelected === null) {
                    context.Message("error", "Quý khách vui lòng chọn tỉnh/thành phố nhận hàng.");
                } else if (districtSelected === null) {
                    context.Message("error", "Quý khách vui lòng chọn quận/huyện nhận hàng.");
                } else if (wardSelected === null) {
                    context.Message("error", "Quý khách vui lòng chọn phường/xã nhận hàng.");
                }

            }

            let newList = []
            cart.forEach(item => {
                console.log(item)
                newList.push(item)
            });
            setListProduct(newList)

            // console.log(listProduct)
            const dataOder = {
                [authKey]: authValue,
                total: sum,
                email: customerEmail,
                phone: customerPhone,
                name: customerName,
                userAddress: valueRadioReceive === "Nhận hàng tại cửa hàng" ? "Nhận hàng tại cửa hàng" : `${detailAddress}, ${wardSelected}, ${districtSelected}, ${provinceSelected}`,
                note: note,
                paymentMethod: valueRadioPay,
                listProduct: newList,
                avatar: cart[0].avatar,
                prod_name: cart[0].prod_name,
                quantity: cart[0].count,
                total_product: newList.length,

            }
            if (valueRadioPay === 'VNPAY') {
                if (valueRadioLanguage === 'vn' || valueRadioLanguage === '' || valueRadioLanguage === null) {
                    dataOder['language'] = 'vn'
                    dataOder['amount'] = sum
                    dataOder['bankCode'] = 'VNBANK'
                } else {
                    dataOder['language'] = 'en'
                    dataOder['amount'] = sum
                    dataOder['bankCode'] = 'VNBANK'
                }
            }
            console.log(dataOder)
            const dataString = JSON.stringify(dataOder);
            sessionStorage.setItem('dataOrder', dataString);
            if (valueRadioPay !== 'VNPAY') {
                Instance.post('/dataorder', dataOder, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then(response => {
                        if (!response.data.success) {
                            return context.Message("error", response.data.msg)
                        }
                        setVnpayStatus('success');
                        console.log(response);
                        if (response.data.order_id) {
                            setIdNavigateOrderDetail(response.data.order_id)
                        }
                        setIsCartChange(true)
                    })
                    .catch(error => {
                        console.error('Error updating cart:', error);
                        context.Message("error", "Đã có lỗi xảy ra khi đặt hàng.")

                    });
                setListProduct([])
            } else {
                Instance.post('/create_payment_url', dataOder, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then(response => {
                        console.log(response);
                        if (response.data.success) {
                            // context.Message("success", "Quý khách đã đặt hàng thành công.")
                            // navigate(response.data.redirect)
                            // window.open(response.data.redirect, "_blank");
                            window.location.href = response.data.redirect;

                        } else {
                            return context.Message("error", response.data.msg)
                        }
                    })
                    .catch(error => {
                        console.error('Error updating cart:', error);
                        context.Message("error", "Đã có lỗi xảy ra khi đặt hàng.")

                    });
                setListProduct([])
                return
            }
            return
        } else {
            context.Message('error', 'Giỏ hàng hiện không có sản phẩm nào.')
        }

    }

    useEffect(() => {
        getCart();
        addClassCSS();
        getDiaGioiHanhChinhVN();
    }, [isCartChange]);

    useEffect(() => {
        // Calculate the sum whenever the cart changes
        const newSum = cart.reduce((accumulator, item) => accumulator + item.product_total, 0);
        setSum(newSum);
    }, [cart]);

    useEffect(() => {
        postToCreateNewOrder()
    }, []);

    return (

        <div className='bg-[#f0f0f0] py-3   mx-[auto] max-w-[805px]'>
            <Modal
                title="Xác nhận xóa sản phẩm"
                open={showDeleteConfirmation}
                onOk={() => {
                    handleDeleteCart(productIdToDelete); // Gọi hàm xóa sau khi xác nhận
                    setShowDeleteConfirmation(false); // Đóng modal
                }}
                onCancel={() => setShowDeleteConfirmation(false)} // Đóng modal khi bấm hủy
                className='model-cart'
            >
                <p>Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?</p>
            </Modal>
            <ModalSelectAddress
                addressSaved={addressSaved}
                isSelectingDeliveryAddress={isSelectingDeliveryAddress}
                setIsSelectingDeliveryAddress={setIsSelectingDeliveryAddress}
                optionsSelectProvince={optionsSelectProvince}
                optionsSelectWards={optionsSelectWards}
                optionsSelectDistricts={optionsSelectDistricts}
                setDetailAddress={setDetailAddress}
                setProvinceSelected={setProvinceSelected}
                setDistrictSelected={setDistrictSelected}
                setWardSelected={setWardSelected}
                setOptionsSelectDistricts={setOptionsSelectDistricts}
                setOptionsSelectWards={setOptionsSelectWards}
                isAddressDeliveryChange={isAddressDeliveryChange}
                setIsAddressDeliveryChange={setIsAddressDeliveryChange}
                getDeliveryAddress={getDeliveryAddress}
            />


            <Modal
                open={vnpayStatus}
                width={700}
                onOk={() => {
                    setVnpayStatus(null)
                    setIsFinishAddNewOrderVNPAY(false)
                }}
                onCancel={() => {
                    setIsFinishAddNewOrderVNPAY(false)
                    setVnpayStatus(null)
                } // Đóng modal khi bấm hủy
                }
                className='model-payment-status'
                footer={null}
            >
                {
                    vnpayStatus === 'success'
                        ?
                        <>
                            <FontAwesomeIcon
                                className='text-[#4ea722] text-[60px]'
                                icon={faCircleCheck}></FontAwesomeIcon>
                            <p className='text-[#4ea722] text-[20px] my-6'>Đơn hàng của quý khách đã thanh toán thành công!</p>
                            <div className=''>
                                <Button
                                    className='w-[180px] mr-6'
                                    onClick={() => {
                                        setVnpayStatus(null)
                                        setIsFinishAddNewOrderVNPAY(false)
                                    }}
                                >Tiếp tục mua hàng</Button>
                                <Button
                                    className='w-[180px]'
                                    onClick={() => {
                                        navigate(`../order-detail/${idNavigateOrderDetail}`)
                                    }}
                                >Xem chi tiết đơn hàng</Button>
                            </div>
                        </>
                        :
                        <>
                            <FontAwesomeIcon
                                className='text-[#e5101d] text-[40px]'
                                icon={faCircleXmark}></FontAwesomeIcon>
                            <p className='text-[] text-[20px]'>Đơn hàng của quý khách thanh toán không thành công!</p>
                            <div>
                                <Button className='ml-2'>Quay lại</Button>
                            </div>
                        </>
                }
            </Modal>
            <div className=''>
                <Link to={'/'} className='flex items-center  mb-3'>
                    <FontAwesomeIcon
                        className='text-[gray] pr-2'
                        icon={faAngleLeft}></FontAwesomeIcon>
                    <h5>Quay lại mua thêm sản phẩm khác</h5>
                </Link>
                <div className='bg-[#ffffff] inline-block'>
                    <Table
                        className=''
                        columns={isHiddenAutoCpl ? columns : deviceColumns}
                        dataSource={data} />
                    <div className='flex justify-between font-bold text-[20px]
                '>
                        <span className='pl-5'>Tổng tiền:</span>
                        <span
                            className='text-[#e5101d] pr-[30px]'
                        >{sum.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>


                    <div className='mx-5 my-5 px-3 py-5 border-[1px] border-[#d9d9d9] max-[400px]:mx-0'>
                        <h3 className='font-bold text-[18px] text-[#333333]'>1. Thông tin khách hàng</h3>
                        <div className='px-5 '>
                            <Input
                                className='my-3 text-[15px]' type='text'
                                placeholder='Họ và tên'
                                value={customerName}
                                onChange={(e) => {
                                    setCustomerName(e.target.value)
                                }} />
                            <Input
                                className='my-3 text-[15px]' type='text'
                                placeholder='Số điện thoại'
                                value={customerPhone}
                                onChange={(e) => {
                                    setCustomerPhone(e.target.value)
                                }} />
                            <Input
                                className='my-3 text-[15px]' type='text'
                                placeholder='Email (Để nhận thông tin đơn hàng)'
                                value={customerEmail}
                                onChange={(e) => {
                                    setCustomerEmail(e.target.value)
                                }} />
                            <Input
                                className='mt-3 text-[15px]' type='text'
                                placeholder='Ghi chú'
                                value={note}
                                onChange={(e) => {
                                    setNote(e.target.value)
                                }} />
                        </div>

                        <h3 className='font-bold mt-5 text-[18px] text-[#333333]'>2. Chọn cách thức nhận hàng</h3>
                        <div className='px-5'>
                            <Radio.Group
                                onChange={(e) => {
                                    console.log("radio checked", e.target.value);
                                    setValueRadioReceive(e.target.value);
                                }}
                                value={valueRadioReceive}
                                style={{ width: "100%" }}
                                className='my-3'
                            >
                                <Row className='flex justify-between'>
                                    <div className=''>
                                        <Radio
                                            className={valueRadioReceive === "Giao hàng tận nơi"
                                                ? 'rad-after relative' : 'relative'}
                                            value={"Giao hàng tận nơi"}>Giao hàng tận nơi (Có phí giao hàng)</Radio>
                                        <Radio
                                            className={valueRadioReceive === "Nhận hàng tại cửa hàng"
                                                ? 'rad-after relative' : 'relative'}
                                            value={"Nhận hàng tại cửa hàng"}>Nhận hàng tại cửa hàng</Radio>
                                    </div>
                                    <div onClick={
                                        () => handleSelectingDeliveryAddress()
                                    }>
                                        <FontAwesomeIcon icon={faPlus} />
                                        <span className='text-[15px] pl-1 font-bold hover:underline hover:cursor-pointer '>Chọn địa chỉ giao hàng</span>
                                    </div>
                                </Row>
                            </Radio.Group>

                            {
                                valueRadioReceive === "Nhận hàng tại cửa hàng"
                                    ?
                                    <div className='bg-[#f8f8f8] p-5 border-[1px] 
                                    border-[#d4d4d4]'>
                                        <p className='text-[15px]'>Phoenix Technology - 362 Hoàng Diệu, Quận Hải Châu, Tp Đà Nẵng </p>
                                    </div>
                                    :
                                    <div className='bg-[#f8f8f8] p-5 border-[1px] 
                            border-[#d4d4d4]'>
                                        <Input
                                            className='text-[15px]'
                                            value={detailAddress}
                                            onChange={(e) => {
                                                setDetailAddress(e.target.value)
                                            }}
                                            placeholder='Chi tiết tên đường, số nhà'></Input>
                                        <div className={`${isHiddenAutoCpl ? 'flex' : ''} items-center justify-between `}>
                                            <Select
                                                className={` my-3 flex-1 mr-2 items-center  ${!isHiddenAutoCpl ? 'w-full mx-0' : 'ml-0'}`}
                                                showSearch
                                                value={provinceSelected || "Chọn Tỉnh/Thành phố"}
                                                options={optionsSelectProvince}
                                                onChange={(e) => handleChangeProvince(e)}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }>

                                            </Select>
                                            <Select
                                                className={` my-3 flex-1  ${!isHiddenAutoCpl ? 'w-full mx-0' : 'mx-2'}`}
                                                showSearch
                                                value={districtSelected || "Chọn Quận/Huyện"}
                                                options={optionsSelectDistricts}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                onChange={(e) => handleChangeDistrict(e)}>

                                            </Select>
                                            <Select
                                                className={` my-3 flex-1  ${!isHiddenAutoCpl ? 'w-full mx-0' : 'mr-0'}`}
                                                showSearch
                                                value={wardSelected || "Chọn Phường/Xã"}
                                                options={optionsSelectWards}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                onChange={(e) => handleChangeWard(e)}>

                                            </Select>
                                        </div>
                                    </div>
                            }
                        </div>

                        <h3 className='font-bold text-[18px] mt-5 text-[#333333]'>3. Chọn hình thức thanh toán</h3>
                        <div className='mx-5'>
                            <Radio.Group
                                className='my-3'
                                onChange={(e) => {
                                    console.log("radio checked", e.target.value);
                                    setValueRadioPay(e.target.value);
                                }}
                                value={valueRadioPay}
                                style={{ width: "100%" }}
                            >
                                <Row className='flex flex-col justify-start'>
                                    <Radio
                                        value={"COD"}>Thanh toán tiền mặt khi nhận hàng (COD)
                                    </Radio>
                                    <Radio
                                        value={"BANK"}>Thanh toán qua chuyển khoản qua tài khoản ngân hàng (khuyên dùng)
                                    </Radio>
                                    <Radio
                                        value={"VNPAY"}>Thanh toán qua ATM-Tài khoản ngân hàng nội địa (VNPAY)
                                    </Radio>
                                </Row>
                            </Radio.Group>
                            {
                                valueRadioPay == "COD"
                                    ?
                                    <p className='px-5 py-7 bg-[#f8f8f8] text-[15px]
                            border-[1px] border-[#d4d4d4]'>Quý khách sẽ thanh toán bằng tiền mặt
                                        khi nhận hàng. Vui lòng bấm nút " Đặt hàng" để hoàn tất.
                                    </p>
                                    : valueRadioPay === 'VNPAY'
                                        ? <div className='px-5 py-7 bg-[#f8f8f8] text-[15px]
                                        border-[1px] border-[#d4d4d4]'>
                                            <p >Quý khách sẽ thanh toán qua ATM - Tài khoản ngân hàng nội địa.<br></br>
                                                Vui lòng chọn ngôn ngữ hiển thị trong quá trình thanh toán.
                                            </p>
                                            <Radio.Group
                                                className='my-3'
                                                onChange={(e) => {
                                                    console.log("radio checked", e.target.value);
                                                    setValueRadioLanguage(e.target.value);
                                                }}
                                                value={valueRadioLanguage}
                                                style={{ width: "100%" }}
                                            >
                                                <Row className='flex flex-col justify-start'>
                                                    <Radio
                                                        value={"vn"}>Tiếng việt
                                                    </Radio>
                                                    <Radio
                                                        value={"end"}>Tiếng anh
                                                    </Radio>
                                                </Row>
                                            </Radio.Group>
                                        </div>
                                        :
                                        <p className='flex flex-col px-5 py-7 bg-[#f8f8f8] text-[15px]
                                border-[1px] border-[#d4d4d4]'>
                                            <span>
                                                HO NHAT TAN - Ngân Hàng Ngoại Thương Việt Nam (Vietcombank) - CN Quảng Nam STK: 1014391411

                                            </span>
                                            <span>Vui lòng bấm nút "Đặt hàng" để hoàn tất. Hoặc liên hệ Hotline: 0359.973.209 để được tư vấn.</span>
                                        </p>
                            }
                        </div>
                        <div className={` items-center justify-between ${isHiddenAutoCpl ? 'flex' : ''}`}>
                            <p className='px-5'>
                                <b className='text-[red]'>(*)</b>
                                Quý khách hàng vui lòng kiểm tra lại thông
                                tin trước khi đặt hàng.
                            </p>
                            <div className='flex justify-end px-5 py-6'>
                                <Button className='bg-[#c8191f] text-white h-[45px]
                        w-[140px] text-[18px]'
                                    onClick={handleUpdateCart}>
                                    Cập nhật
                                    <FontAwesomeIcon
                                        className='pl-4 text-[17px]'
                                        icon={faAngleRight}></FontAwesomeIcon>
                                </Button>
                                <Button className='bg-[#c8191f] text-white h-[45px]
                        w-[140px] text-[18px] ml-4'
                                    onClick={handleOrder}>
                                    Đặt hàng
                                    <FontAwesomeIcon
                                        className='pl-4 text-[17px]'
                                        icon={faAngleRight}></FontAwesomeIcon>
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Cart