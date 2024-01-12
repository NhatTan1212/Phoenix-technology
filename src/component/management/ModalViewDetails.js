import React, { useState, useEffect, useContext } from 'react';
import {
    Input, Select, Image, Row, Col, Upload
} from 'antd';
import '../../component/management/ModalViewDetails.scss'

const ModalViewDetails = ({ actioningProduct, fileList, brandDefault,
    categoryDefault }) => {

    return (
        <div className='wrap-modal-view w-full'>
            {console.log(fileList)}
            <div className='relative'>
                <Image
                    src={actioningProduct.avatar}
                    className='avatar-modal-view max-w-[450px] ml-[15%]'
                ></Image>

                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >
                    <div className='img-gr-modal-view absolute top-0 right-0 flex flex-col 
                    justify-center h-full
                    '>
                        {
                            fileList.map((img) => (
                                <Image
                                    className='border-solid border-[1px] border-[#dee2e6] rounded-[5px]
                                    p-[10px]'
                                    width={85}
                                    key={img.image_id}
                                    src={img.url}>
                                </Image>
                            ))
                        }


                    </div>
                </Image.PreviewGroup>

            </div>

            {actioningProduct &&
                <div>
                    <Input type="hidden" name="IDProduct"
                        value={actioningProduct.id} />
                    <Row className='mt-[15px]'>
                        <Col span={24}
                            className='text-start px-[15px] pl-0'
                        >
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Thông tin hàng hóa</h3>
                            <ul>
                                <li className='pb-1'><span className='text-red-500'>* </span>
                                    Thương hiệu:
                                    <span>{' ' + brandDefault}</span>
                                </li>

                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Danh mục:
                                    <span>{' ' + categoryDefault}</span>
                                </li>
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Thiết kế & Trọng lượng</h3>
                            <ul>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Trọng lượng:
                                    <span>{' ' + actioningProduct.prod_weight}</span>
                                </li>
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Bộ xử lý</h3>
                            <ul>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Hãng CPU:
                                    <span>{' ' + actioningProduct.cpu.split(',')[0]}</span>
                                </li>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Công nghệ CPU:
                                    <span>{' ' + actioningProduct.cpu.split(',')[1]}</span>
                                </li>
                                {
                                    actioningProduct.cpu.split(',')[2] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Loại CPU:
                                        <span>{' ' + actioningProduct.cpu.split(',')[2]}</span>
                                    </li>
                                }
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>RAM</h3>
                            <ul></ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Màn hình</h3>
                            <ul>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Màn hình:
                                    <span>{' ' + actioningProduct.screen}</span>
                                </li>
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Lưu trữ</h3>
                            <ul>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Ổ cứng:
                                    <span>
                                        {' ' + actioningProduct.hard_drive}
                                    </span>
                                </li>
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Đồ họa</h3>
                            <ul></ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Giao tiếp & Kết nối</h3>
                            <ul>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Kết nối:
                                    <span>{' ' + actioningProduct.connection}</span>
                                </li>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Webcam:
                                    <span>{' ' + actioningProduct.webcam}</span>
                                </li>
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Thông tin pin & Sạc</h3>
                            <ul>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Pin:
                                    <span>{' ' + actioningProduct.pin}</span>
                                </li>
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Hệ điều hành</h3>
                            <ul>
                                <li className='pb-1'>
                                    <span className='text-red-500'>* </span>
                                    Hệ điều hành:
                                    <span>{' ' + actioningProduct.operation_system}</span>
                                </li>
                            </ul>

                        </Col>

                    </Row>
                </div>
            }
        </div>
    )
}

export default ModalViewDetails