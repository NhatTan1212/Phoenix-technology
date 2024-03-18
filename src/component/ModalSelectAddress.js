import { Button, Input, Radio, Row, Select, Modal, Result } from 'antd';
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useContext } from 'react';
import { AddNewDeliveryAddress, DeleteDeliveryAdress, GetDeliveryAddress } from '../callAPI/api';
import Cookies from 'js-cookie';
import Context from '../../src/store/Context';
import { Link } from 'react-router-dom';

const ModalSelectAddress = ({ addressSaved, isSelectingDeliveryAddress, setIsSelectingDeliveryAddress, optionsSelectProvince, optionsSelectWards,
    optionsSelectDistricts, setDetailAddress, setProvinceSelected, setDistrictSelected, setWardSelected, setOptionsSelectDistricts, setOptionsSelectWards,
    isAddressDeliveryChange, setIsAddressDeliveryChange, getDeliveryAddress
}) => {
    const [addNewDetailAddress, setAddNewDetailAddress] = useState("");
    const [addNewProvinceSelected, setAddNewProvinceSelected] = useState(null)
    const [addNewDistrictSelected, setAddNewDistrictSelected] = useState(null)
    const [addNewWardSelected, setAddNewWardSelected] = useState(null)
    const [radioAddressSelected, setRadioAddressSelected] = useState(null)
    const token = Cookies.get('token');

    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const handleOkBtnSelectAddress = (id) => {
        console.log(id);
        console.log(addressSaved);
        addressSaved.forEach(address => {
            if (address.id === id) {
                setDetailAddress(address.detail_address)
                setProvinceSelected(address.province)
                setDistrictSelected(address.district)
                setWardSelected(address.ward)
            }
        });
        setIsSelectingDeliveryAddress(false); // Đóng modal
        setRadioAddressSelected(null)
    }

    const handleAddNewAddress = () => {
        const requestData = {
            token: token,
            detail_address: addNewDetailAddress,
            province: addNewProvinceSelected,
            district: addNewDistrictSelected,
            ward: addNewWardSelected
        }
        AddNewDeliveryAddress(requestData).then(() => {
            context.Message('success', 'Thêm địa chỉ giao hàng thành công!')
            setIsAddressDeliveryChange(true)
        })
    }
    const handleChangeAddNewProvince = (e) => {
        let findProvince = optionsSelectProvince.find((province) => {
            return province.Name === e
        })
        console.log(findProvince)
        setAddNewProvinceSelected(findProvince.Name)
        setOptionsSelectDistricts(findProvince.Districts)
    }

    const handleChangeAddNewDistrict = (e) => {
        let findDistrict = optionsSelectDistricts.find((district) => {
            return district.Name === e
        })
        console.log(findDistrict)
        setAddNewDistrictSelected(findDistrict.Name)
        setOptionsSelectWards(findDistrict.Wards)
    }

    const handleChangeAddNewWard = (e) => {
        let findWard = optionsSelectWards.find((ward) => {
            return ward.Name === e
        })
        console.log(findWard)
        setAddNewWardSelected(findWard.Name)
    }

    const handleRemoveAddress = (address_id) => {
        console.log(address_id);
        const requestData = {
            token: token,
            address_id: address_id
        }
        DeleteDeliveryAdress(requestData).then(data => {
            context.Message('success', 'Xóa địa chỉ giao hàng thành công!')
            setIsAddressDeliveryChange(true)

        })
    }

    useEffect(() => {
        if (token) {
            getDeliveryAddress();
        }
    }, [isAddressDeliveryChange]);
    useEffect(() => {
        setIsAddressDeliveryChange(false)
    }, [isAddressDeliveryChange]);

    return (
        <>
            {token ?
                <Modal
                    title="Chọn địa chỉ giao hàng"
                    width={800}
                    open={isSelectingDeliveryAddress}
                    onOk={() => { // Gọi hàm xóa sau khi xác nhận
                        handleOkBtnSelectAddress(radioAddressSelected)
                    }}
                    onCancel={() => {
                        setIsSelectingDeliveryAddress(false)
                        setAddNewDetailAddress('')
                        setAddNewProvinceSelected('')
                        setAddNewDistrictSelected('')
                        setAddNewWardSelected('')
                        setRadioAddressSelected(null)
                    }} // Đóng modal khi bấm hủy
                    className='model-cart'
                >
                    {
                        addressSaved ?
                            <div>
                                <Radio.Group
                                    className='my-3'
                                    onChange={(e) => {
                                        console.log("radio checked", e.target.value);
                                        setRadioAddressSelected(e.target.value);
                                    }}
                                    value={radioAddressSelected}
                                    style={{ width: "100%" }}
                                >
                                    {
                                        addressSaved.map((address, index) => (
                                            <Row className={radioAddressSelected === address.id
                                                ? 'flex justify-between hover:bg-[#f2f2f2] px-2 bg-[#f2f2f2] '
                                                : 'flex justify-between hover:bg-[#f2f2f2] px-2'}>
                                                <Radio closeIcon={<CloseOutlined />} value={address.id}
                                                    className={radioAddressSelected === address.id
                                                        ? 'py-1 hover:text-red-700 text-red-700'
                                                        : 'py-1 hover:text-red-700'}>
                                                    Địa chỉ {index + 1}: {address.detail_address}, {address.province}, {address.district}, {address.ward}.
                                                </Radio>
                                                {/* <FontAwesomeIcon icon={faX} className='text-red-500' /> */}
                                                <span className='text-gray-500 hover:text-red-700 my-auto
                                            hover:cursor-pointer hover:underline'
                                                    onClick={() => { handleRemoveAddress(address.id) }}>Xóa</span>
                                            </Row>
                                        ))
                                    }
                                </Radio.Group>

                                <div className='bg-[#f8f8f8] p-5 border-[1px] 
                                border-[#d4d4d4]'>
                                    <Input
                                        className='text-[15px]'
                                        value={addNewDetailAddress}
                                        onChange={(e) => {
                                            setAddNewDetailAddress(e.target.value)
                                        }}
                                        placeholder='Chi tiết tên đường, số nhà'></Input>
                                    <div className={`items-center justify-between ${isHiddenAutoCpl ? 'flex' : ''} `}>
                                        <Select
                                            className={` my-3 flex-1 mr-2 items-center  ${!isHiddenAutoCpl ? 'w-full mx-0' : 'ml-0'}`}
                                            showSearch
                                            value={addNewProvinceSelected || "Chọn Tỉnh/Thành phố"}
                                            options={optionsSelectProvince}
                                            onChange={(e) => handleChangeAddNewProvince(e)}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }>

                                        </Select>
                                        <Select
                                            className={` my-3 flex-1  ${!isHiddenAutoCpl ? 'w-full mx-0' : 'mx-2'}`}
                                            showSearch
                                            value={addNewDistrictSelected || "Chọn Quận/Huyện"}
                                            options={optionsSelectDistricts}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(e) => handleChangeAddNewDistrict(e)}>

                                        </Select>
                                        <Select
                                            className={` my-3 flex-1  ${!isHiddenAutoCpl ? 'w-full mx-0' : 'mr-0'}`}
                                            showSearch
                                            value={addNewWardSelected || "Chọn Phường/Xã"}
                                            options={optionsSelectWards}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(e) => handleChangeAddNewWard(e)}>

                                        </Select>
                                    </div>
                                    {
                                        (addNewDetailAddress && addNewProvinceSelected && addNewDistrictSelected && addNewWardSelected) ?
                                            <Button className='mt-2' onClick={() => {
                                                handleAddNewAddress()
                                            }}>
                                                <FontAwesomeIcon icon={faPlus} />
                                                <span className='pl-1 font-bold hover:underline hover:cursor-pointer'>Thêm địa chỉ giao hàng</span>
                                            </Button >
                                            :
                                            <Button disabled className='btn-antd-disabled mt-2'>
                                                <FontAwesomeIcon icon={faPlus} />
                                                <span className='pl-1 font-bold hover:underline hover:cursor-pointer'>Thêm địa chỉ giao hàng</span>
                                            </Button >
                                    }
                                </div>
                            </div>
                            : <p>Chưa có địa chỉ nào được lưu</p>
                    }


                </Modal>
                :
                <Modal
                    footer={null}
                    width={700}
                    open={isSelectingDeliveryAddress}
                    onCancel={() => {
                        setIsSelectingDeliveryAddress(false)
                    }} // Đóng modal khi bấm hủy
                >
                    <Result
                        title="Bạn cần phải đăng nhập để lưu địa chỉ giao hàng"
                        extra={
                            <Button type="primary" key="console">
                                <Link to={'/auth'}>Đăng nhập</Link>
                            </Button>
                        }
                    />
                </Modal>
            }
        </>
    )
}
export default ModalSelectAddress