import React, { useState, useEffect, useContext } from 'react';
import {
    Input, Select, Image, Row, Col, Upload
} from 'antd';
import '../../component/management/ModalViewDetails.scss'
import Context from '../../store/Context';

const ModalViewDetails = ({ actioningProduct, fileList, brandDefault,
    categoryDefault }) => {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    return (
        <div className='wrap-modal-view w-full'>
            {/* {console.log(fileList)} */}
            <div className='relative min-h-[450px] overflow-hidden'>
                <Image
                    src={actioningProduct.avatar}
                    className={`avatar-modal-view max-w-[450px] object-contain ml-[5%] sm:ml-[15%] md:ml-[25%] lg:ml-[15%]
                    ${isHiddenAutoCpl ? '' : '-translate-x-[60px]'} `}
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
                                {
                                    actioningProduct.cpu.split(',')[3] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Tốc độ CPU:
                                        <span>{' ' + actioningProduct.cpu.split(',')[3]}</span>
                                    </li>
                                }
                                {
                                    actioningProduct.cpu.split(',')[4] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Tốc độ tối đa:
                                        <span>{' ' + actioningProduct.cpu.split(',')[4]}</span>
                                    </li>
                                }
                                {
                                    actioningProduct.cpu.split(',')[5] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Số nhân:
                                        <span>{' ' + actioningProduct.cpu.split(',')[5]}</span>
                                    </li>
                                }
                                {
                                    actioningProduct.cpu.split(',')[6] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Số luồng:
                                        <span>{' ' + actioningProduct.cpu.split(',')[6]}</span>
                                    </li>
                                }
                                {
                                    actioningProduct.cpu.split(',')[7] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Bộ nhớ đệm:
                                        <span>{' ' + actioningProduct.cpu.split(',')[7]}</span>
                                    </li>
                                }
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>RAM</h3>
                            <ul>
                                {actioningProduct.ram.split(',')[0] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Dung lượng RAM:
                                        <span>{' ' + actioningProduct.ram.split(',')[0]}</span>
                                    </li>
                                }

                                {actioningProduct.ram.split(',')[1] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Loại RAM:
                                        <span>{' ' + actioningProduct.ram.split(',')[1]}</span>
                                    </li>
                                }

                                {actioningProduct.ram.split(',')[2] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Tốc độ RAM:
                                        <span>{' ' + actioningProduct.ram.split(',')[2]}</span>
                                    </li>
                                }

                                {actioningProduct.ram.split(',')[3] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Số khe cắm rời:
                                        <span>{' ' + actioningProduct.ram.split(',')[3]}</span>
                                    </li>
                                }

                                {actioningProduct.ram.split(',')[4] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Số khe RAM còn lại:
                                        <span>{' ' + actioningProduct.ram.split(',')[4]}</span>
                                    </li>
                                }

                                {actioningProduct.ram.split(',')[5] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Số RAM onboard:
                                        <span>{' ' + actioningProduct.ram.split(',')[5]}</span>
                                    </li>
                                }

                                {actioningProduct.ram.split(',')[6] &&
                                    <li className='pb-1'>
                                        <span className='text-red-500'>* </span>
                                        Hỗ trợ RAM tối đa:
                                        <span>{' ' + actioningProduct.ram.split(',')[6]}</span>
                                    </li>
                                }

                            </ul>
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
                                <li className='pb-1 flex flex-col'>
                                    <div>
                                        <span className='text-red-500'>* </span>
                                        Kiểu ổ cứng:
                                        <span>
                                            {' ' + actioningProduct.hard_drive.split(',')[0]}
                                        </span>
                                    </div>
                                    {actioningProduct.hard_drive.split(',')[3] &&
                                        <div>
                                            <span className='text-red-500'>* </span>
                                            Tổng số khe cắm SSD/HDD:
                                            <span>
                                                {' ' + actioningProduct.hard_drive.split(',')[3]}
                                            </span>
                                        </div>
                                    }
                                    {actioningProduct.hard_drive.split(',')[4] &&
                                        <div>
                                            <span className='text-red-500'>* </span>
                                            Số khe SSD/HDD còn lại:
                                            <span>
                                                {' ' + actioningProduct.hard_drive.split(',')[4]}
                                            </span>
                                        </div>
                                    }
                                    <table className='border-[1px] border-[solid] w-full'>
                                        <thead className='w-full'>
                                            <th className='p-2 border-b-[1px] w-1/2'>{actioningProduct.hard_drive.split(',')[0]}</th>
                                            <th className='p-2 border-b-[1px] w-1/2'></th>
                                        </thead>
                                        <tbody>
                                            {
                                                actioningProduct.hard_drive.split(',')[1] !== '' &&
                                                <tr className=''>
                                                    <td className='p-2 border-b-[1px]'>
                                                        Loại SSD
                                                    </td>
                                                    <td className='p-2 border-b-[1px]'>
                                                        {actioningProduct.hard_drive.split(',')[1]}
                                                    </td>
                                                </tr>
                                            }
                                            {
                                                actioningProduct.hard_drive.split(',')[2] &&
                                                <tr className=''>
                                                    <td className='p-2 border-b-[1px]'>Dung lượng</td>
                                                    <td className='p-2 border-b-[1px]'>
                                                        {actioningProduct.hard_drive.split(',')[2]}
                                                    </td>
                                                </tr>
                                            }


                                        </tbody>
                                    </table>
                                </li>
                            </ul>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1'>Đồ họa</h3>
                            <ul className='flex w-full'>
                                <li className='w-1/2 pr-2'>
                                    {
                                        (actioningProduct.graphics !== null && actioningProduct.graphics !== ''
                                            && actioningProduct.graphics !== ' ' && actioningProduct.graphics !== "null") &&
                                        <table className='border-[1px] border-[solid] w-full'>
                                            <thead className='w-full'>
                                                <th className='p-2 border-b-[1px] w-1/2'>Card rời</th>
                                                <th className='p-2 border-b-[1px] w-1/2'></th>
                                            </thead>
                                            <tbody>
                                                {
                                                    actioningProduct.graphics.split(',')[0] &&
                                                    <tr className=''>
                                                        <td className='p-2 border-b-[1px]'>
                                                            Model
                                                        </td>
                                                        <td className='p-2 border-b-[1px]'>
                                                            {actioningProduct.graphics.split(',')[0]}
                                                        </td>
                                                    </tr>
                                                }
                                                {
                                                    actioningProduct.graphics.split(',')[1] &&
                                                    <tr className=''>
                                                        <td className='p-2 border-b-[1px]'>Bộ nhớ</td>
                                                        <td className='p-2 border-b-[1px]'>
                                                            {actioningProduct.graphics.split(',')[1]}
                                                        </td>
                                                    </tr>
                                                }

                                            </tbody>
                                        </table>
                                    }
                                </li>
                                <li className='w-1/2 pl-2'>
                                    {
                                        (actioningProduct.on_board !== null && actioningProduct.on_board !== '' && actioningProduct.on_board !== "null") &&
                                        <table className='border-[1px] border-[solid] w-full'>
                                            <thead className='w-full'>
                                                <th className='p-2 border-b-[1px] w-1/2'>Card tích hợp</th>
                                                <th className='p-2 border-b-[1px] w-1/2'></th>
                                            </thead>
                                            <tbody>
                                                {
                                                    actioningProduct.on_board.split(',')[0] &&
                                                    <tr className=''>
                                                        <td className='p-2 border-b-[1px]'>
                                                            Model
                                                        </td>
                                                        <td className='p-2 border-b-[1px]'>
                                                            {actioningProduct.on_board.split(',')[0]}
                                                        </td>
                                                    </tr>
                                                }
                                                {
                                                    actioningProduct.on_board.split(',')[1] &&
                                                    <tr className=''>
                                                        <td className='p-2 border-b-[1px]'>Bộ nhớ</td>
                                                        <td className='p-2 border-b-[1px]'>
                                                            {actioningProduct.on_board.split(',')[1]}
                                                        </td>
                                                    </tr>
                                                }

                                            </tbody>
                                        </table>
                                    }
                                </li>
                            </ul>
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