import React from 'react';
import moment from 'moment'
import {
    Input, Row, Col
} from 'antd';

const ModalBrandViewDetails = ({ actioningBrand }) => {
    const created_at = moment(actioningBrand.created_at).format('YYYY-MM-DD HH:mm:ss')
    const updated_at = moment(actioningBrand.updated_at).format('YYYY-MM-DD HH:mm:ss')

    return (
        <div className='wrap-modal-view w-full'>
            {actioningBrand &&
                <div>
                    <Row className='mt-[15px]'>
                        <Col span={24} className='px-[15px]'>
                            <h3
                                className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1 mb-4'>
                                Thông tin thương hiệu
                            </h3>
                            <table className='border-[1px] border-[solid] w-full'>
                                <tbody>
                                    {
                                        <tr className=''>
                                            <td className='p-2 border-b-[1px] w-1/3 font-bold'>
                                                Tên thương hiệu:
                                            </td>
                                            <td className='p-2 border-b-[1px] w-2/3'>
                                                {actioningBrand.name}
                                            </td>
                                        </tr>
                                    }
                                    {
                                        <tr className=''>
                                            <td className='p-2 border-b-[1px] w-1/3 font-bold'>
                                                Mô tả:
                                            </td>
                                            <td className='p-2 border-b-[1px] w-2/3'>
                                                {actioningBrand.description}
                                            </td>
                                        </tr>

                                    }
                                    {
                                        <tr className=''>
                                            <td className='p-2 border-b-[1px] w-1/3 font-bold'>
                                                Slug:
                                            </td>
                                            <td className='p-2 border-b-[1px] w-2/3'>
                                                {actioningBrand.slug}
                                            </td>
                                        </tr>
                                    }
                                    {
                                        <tr className=''>
                                            <td className='p-2 border-b-[1px] w-1/3 font-bold'>
                                                Ngày tạo thương hiệu:
                                            </td>
                                            <td className='p-2 border-b-[1px] w-2/3'>
                                                {created_at}
                                            </td>
                                        </tr>
                                    }
                                    {
                                        <tr className=''>
                                            <td className='p-2 border-b-[1px] w-1/3 font-bold'>
                                                Ngày cập nhật thương hiệu:
                                            </td>
                                            <td className='p-2 border-b-[1px] w-2/3'>
                                                {updated_at}
                                            </td>
                                        </tr>
                                    }
                                    {
                                        <tr className=''>
                                            <td className='p-2 border-b-[1px] w-1/3 font-bold'>
                                                Hình ảnh:
                                            </td>
                                            <td className='p-2 border-b-[1px] w-2/3'>
                                                <img src={actioningBrand.image} alt={actioningBrand.name} />
                                            </td>
                                        </tr>
                                    }

                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    );
}

export default ModalBrandViewDetails