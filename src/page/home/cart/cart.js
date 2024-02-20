import React, { useState, useEffect, useContext } from 'react';
import Context from '../../../store/Context';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import { Button, InputNumber, Space, Table, Input, Radio, Row, Select, Modal } from 'antd';
import './cart.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import Instance from '../../../axiosInstance';
import CryptoJS from 'crypto-js';
import qs from 'qs';


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
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const tokenGID = Cookies.get('tokenGID');
    const context = useContext(Context)
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
    const [avatar, setAvatar] = useState('')
    const [listProduct, setListProduct] = useState([])
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    //Xử lý VNPAY
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [vnpayStatus, setVnpayStatus] = useState(null);
    let secureHash = ''

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
            render: (_, record) => (
                // console.log("record", record)
                <div className='w-[108px]'>
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
            render: (_, record) => (
                // console.log("record", record)
                <p className='font-bold text-[17px] text-[#333]'>{record.description}</p>
            )
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
            key: 'count',
            dataIndex: 'count',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    max={record.is_possible_to_order}
                    value={record.count}
                    onChange={(newQuantity) => handleQuantityChange(record.id, newQuantity)} />
            )
        },
        {
            title: 'Xóa',
            key: 'action',
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
                // getCart();
                // setIsCartChange(true);
                context.Message("success", "Cập nhật giỏ hàng thành công.")
            })
            .catch(error => {
                console.error('Error updating cart:', error);
            });
    };


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
        if (queryParams.has('vnp_ResponseCode')) {
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
            if (signed === secureHash) {
                if (responseCode === '00') {
                    // Thanh toán thành công
                    setVnpayStatus('success');
                } else {
                    // Thanh toán thất bại
                    setVnpayStatus('failed');
                }

            } else {
                setVnpayStatus('failed');
            }
        }
    }, [location]);

    const getDiaGioiHanhChinhVN = () => {
        var Parameter = {
            url: "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
            method: "GET",
            responseType: "application/json",
        };
        var promise = axios(Parameter);
        promise.then(function (result) {
            let data = JSON.parse(result.data)
            // console.log("dghc", data);

            // setOptionsSelectProvince(result.data)
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

        // console.log(token, tokenGID);

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

        cart.forEach(item => {
            console.log(item)
            listProduct.push(item)
        });
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
            listProduct: listProduct,
            avatar: cart[0].avatar
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
        if (valueRadioPay !== 'VNPAY') {
            Instance.post('/dataorder', dataOder, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    context.Message("success", "Quý khách đã đặt hàng thành công.")
                })
                .catch(error => {
                    console.error('Error updating cart:', error);
                    context.Message("error", "Đã có lỗi xảy ra khi đặt hàng.")

                });
        }
        else {
            Instance.post('/create_payment_url', dataOder, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    console.log(response);
                    if (response.data.success) {
                        context.Message("success", "Quý khách đã đặt hàng thành công.")
                        // navigate(response.data.redirect)
                        window.open(response.data.redirect, "_blank");
                    }
                })
                .catch(error => {
                    console.error('Error updating cart:', error);
                    context.Message("error", "Đã có lỗi xảy ra khi đặt hàng.")

                });
        }
        setListProduct([])
    }

    return (

        <div className='bg-[#f0f0f0] py-3'>
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
            <Modal
                title="Thông tin thanh toán"
                open={vnpayStatus}
                width={700}
                onOk={() => {
                    setVnpayStatus(null)
                }}
                onCancel={() => setVnpayStatus(null)} // Đóng modal khi bấm hủy
                className='model-payment-status'
                footer={null}
            >
                {
                    vnpayStatus === 'success'
                        ?
                        <>
                            <FontAwesomeIcon
                                className='text-[#4ea722] text-[40px]'
                                icon={faCircleCheck}></FontAwesomeIcon>
                            <p className='text-[#e5101d] text-[20px]'>Đơn hàng của quý khách đã thanh toán thành công!</p>
                            <ul>
                                <li>Tên người nhận: {customerName}</li>
                                <li>Email người nhận: {customerEmail}</li>
                                <li>Số điện thoại người nhận: {customerPhone}</li>
                                <li>Địa chỉ nhận hàng: {detailAddress + ', ' + wardSelected + ', ' + districtSelected + ', ' + provinceSelected}</li>
                                <li>Tổng số tiền đã thanh toán: {queryParams.get('vnp_Amount')}</li>
                                <li>Phương thức thanh toán: Thanh toán qua ATM-Tài khoản ngân hàng nội địa (VNPAY)</li>
                            </ul>
                            <div>
                                <Button className='mr-2'>Tiếp tục mua hàng</Button>
                                <Button className='ml-2'>Xem chi tiết đơn hàng</Button>
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
            <div className='w-10/12  mx-[auto] '>
                <Link to={'/'} className='flex items-center mx-[263px] mb-3'>
                    <FontAwesomeIcon
                        className='text-[gray] pr-2'
                        icon={faAngleLeft}></FontAwesomeIcon>
                    <h5>Quay lại mua thêm sản phẩm khác</h5>
                </Link>
                <div className='bg-[#ffffff] mx-[263px] inline-block'>
                    <Table
                        className=''
                        columns={columns}
                        dataSource={data} />
                    <div className='flex justify-between font-bold text-[20px]
                '>
                        <span className='pl-5'>Tổng tiền:</span>
                        <span
                            className='text-[#e5101d] pr-[30px]'
                        >{sum.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>


                    <div className='mx-5 my-5 px-3 py-5 border-[1px] border-[#d9d9d9]'>
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
                                <Row>
                                    <Radio
                                        className={valueRadioReceive === "Giao hàng tận nơi"
                                            ? 'rad-after relative' : 'relative'}
                                        value={"Giao hàng tận nơi"}>Giao hàng tận nơi (Có phí giao hàng)</Radio>
                                    <Radio
                                        className={valueRadioReceive === "Nhận hàng tại cửa hàng"
                                            ? 'rad-after relative' : 'relative'}
                                        value={"Nhận hàng tại cửa hàng"}>Nhận hàng tại cửa hàng</Radio>
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
                                            placeholder='Địa chỉ'></Input>
                                        <div className='flex items-center justify-between '>
                                            <Select
                                                className='my-3 flex-1 mr-2 items-center'
                                                showSearch
                                                value={provinceSelected || "Chọn Tỉnh/Thành phố"}
                                                options={optionsSelectProvince}
                                                onChange={(e) => handleChangeProvince(e)}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }>

                                            </Select>
                                            <Select
                                                className='my-3 flex-1 mx-2'
                                                showSearch
                                                value={districtSelected || "Chọn Quận/Huyện"}
                                                options={optionsSelectDistricts}
                                                filterOption={(input, option) =>
                                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                onChange={(e) => handleChangeDistrict(e)}>

                                            </Select>
                                            <Select
                                                className='my-3 flex-1 ml-2'
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
                        <div className='flex items-center justify-between'>
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