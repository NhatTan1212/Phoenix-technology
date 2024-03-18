import React from 'react';
// import '../../../component/management/ModalViewDetails.scss'
import {
    Input, Typography, Row, Col
} from 'antd';
const { Text } = Typography;

const ModalUserViewDetails = ({ actioningUser }) => {

    return (
        <div className='wrap-modal-view w-full'>
            {actioningUser &&
                <div>
                    <Input type="hidden" name="IDProduct" value={actioningUser.id} />
                    <Row className='mt-[15px]'>
                        <Col span={24} className='px-[15px]'>
                            <h3 className='font-bold text-[16px] text-[#464646] bg-[#f8f9fa] py-1 mb-4'>Thông tin tài khoản</h3>
                            <div className="mb-2">
                                <Text strong className="mr-2">Username:</Text>
                                <Text>{actioningUser.name}</Text>
                            </div>
                            <div className="mb-2">
                                <Text strong className="mr-2">Email:</Text>
                                <Text>{actioningUser.email}</Text>
                            </div>
                            <div className="mb-2">
                                <Text strong className="mr-2">Role:</Text>
                                <Text>{actioningUser.role}</Text>
                            </div>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    );
}

export default ModalUserViewDetails