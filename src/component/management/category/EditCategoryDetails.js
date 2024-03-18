import { EditCategory } from '../../../callAPI/api';
import React, { useState, useContext } from 'react';
import {
    Input, Row, Col
} from 'antd';
import Cookies from 'js-cookie';
import Context from '../../../store/Context';
import TextArea from 'antd/es/input/TextArea';


const EditCategoryDetails = ({ setIsActioning, setActioningCategory, actioningCategory }) => {
    let token = Cookies.get('token')
    const context = useContext(Context)

    const [name, setName] = useState(actioningCategory.name)
    const [description, setDescription] = useState(actioningCategory.description)

    const onFinish = (values) => {
        values.preventDefault();

        const formData = {
            token: token,
            category_id: actioningCategory.category_id,
            name: name,
            description: description
        };

        EditCategory(formData).then(response => {
            console.log(response);
            if (response.success) {
                setIsActioning(false);
                context.Message("success", response.message)
            }
        })
    };

    return (
        <div className='wrap-modal-fpm w-full'>
            {actioningCategory &&
                <div>
                    <form
                        onSubmit={onFinish}
                        method="post"
                        encType="multipart/form-data"
                        className='text-end'
                    >
                        <Input type="hidden" name="id"
                            value={actioningCategory.id} />
                        <Row className='mt-[15px]'>
                            <Col span={24} className='text-start px-[15px] pl-0'>
                                <h3><span className='text-red-500'>* </span>Tên danh mục:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='name'
                                    onChange={(e) => {
                                        setName(e.target.value)
                                    }}
                                    value={name || actioningCategory.name}
                                />

                                <h3><span className='text-red-500'>* </span>Mô tả:</h3>
                                <TextArea
                                    rows={5}
                                    className='mb-2 mt-0 input-description-edituserdetails'
                                    name='description'
                                    value={description || actioningCategory.description}
                                    onChange={(e) => {
                                        setDescription(e.target.value)
                                    }}
                                />
                            </Col>

                        </Row>

                        <div className='inline-block mt-5'>
                            <Input type='submit' defaultValue={"Lưu thay đổi"}
                                className='bg-[#c8191f] text-white'>
                            </Input>
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

export default EditCategoryDetails