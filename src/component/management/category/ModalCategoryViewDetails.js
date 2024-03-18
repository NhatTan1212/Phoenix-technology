import React from 'react';
import moment from 'moment'
import {
    Input, Typography, Row, Col
} from 'antd';
const { Text } = Typography;

const ModalCategoryViewDetails = ({ actioningCategory }) => {
    const created_at = moment(actioningCategory.created_at).format('YYYY-MM-DD HH:mm:ss')
    const updated_at = moment(actioningCategory.updated_at).format('YYYY-MM-DD HH:mm:ss')

    return (
        <div className='wrap-modal-view w-full'>
            {actioningCategory &&
                <div>
                    <Input type="hidden" name="IDProduct" value={actioningCategory.id} />
                    <Row className='mt-[15px]'>
                        <Col span={24} className='px-[15px]'>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1 mb-4'>Thông tin tài khoản</h3>
                            <div className="mb-2">
                                <Text strong className="mr-2">Tên danh mục:</Text>
                                <Text>{actioningCategory.name}</Text>
                            </div>
                            <div className="mb-2">
                                <Text strong className="mr-2">Mô tả:</Text>
                                <Text>{actioningCategory.description}</Text>
                            </div>
                            <div className="mb-2">
                                <Text strong className="mr-2">Ngày tạo danh mục:</Text>
                                <Text>{created_at}</Text>
                            </div>
                            <div className="mb-2">
                                <Text strong className="mr-2">Ngày cập nhật danh mục:</Text>
                                <Text>{updated_at}</Text>
                            </div>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    );
}

export default ModalCategoryViewDetails