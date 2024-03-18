/* eslint-disable jsx-a11y/alt-text */
import { EditBrand, EditCategory } from '../../../callAPI/api';
import React, { useState, useContext } from 'react';
import { Input, Row, Col, Tooltip } from 'antd';
import '../brand/EditBrandDetails.scss'
import Cookies from 'js-cookie';
import Context from '../../../store/Context';
import TextArea from 'antd/es/input/TextArea';


const EditBrandDetails = ({ isActioning, setIsActioning, setActioningCategory, actioningBrand }) => {
    let token = Cookies.get('token')
    const context = useContext(Context)

    const [name, setName] = useState(actioningBrand.name)
    const [description, setDescription] = useState(actioningBrand.description)
    const [image, setImage] = useState(actioningBrand.image)
    const [slug, setSlug] = useState(actioningBrand.slug)

    const onFinish = (values) => {
        values.preventDefault();
        const formData = new FormData();
        formData.append('token', token);
        formData.append('brand_id', actioningBrand.brand_id);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('slug', slug);
        formData.append('avatar', image);

        EditBrand(formData).then(response => {
            console.log(response);
            if (response.success) {
                setIsActioning(false);
                context.Message("success", response.message)
            }
        })
    };

    return (
        <div className='wrap-modal-fpm w-full'>
            {actioningBrand &&
                <div>
                    <form
                        onSubmit={onFinish}
                        method="post"
                        encType="multipart/form-data"
                        className='text-end'
                    >
                        <Input type="hidden" name="id"
                            value={actioningBrand.id} />
                        <Row className='mt-[15px]'>
                            <Col span={24} className='text-start px-[15px] pl-0'>
                                <h3><span className='text-red-500'>* </span>Tên danh mục:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='name'
                                    onChange={(e) => {
                                        setName(e.target.value)
                                    }}
                                    value={name || actioningBrand.name}
                                />

                                <h3><span className='text-red-500'>* </span>Hình ảnh thương hiệu:</h3>
                                <Tooltip
                                    placement='bottomRight'
                                    title='Click để đổi ảnh đại diện cho thương hiệu'
                                >
                                    <div
                                        className='fpm-wrap-input-file cursor-pointer'
                                        onClick={() => {
                                            let fpmInputFile = document.querySelector(".fpm-input-file")
                                            fpmInputFile.click()
                                        }}
                                        onMouseEnter={() => {
                                            document.querySelector('.avatar-modal-view').classList.add('hide-image');
                                        }}
                                        onMouseLeave={() => {
                                            document.querySelector('.avatar-modal-view').classList.remove('hide-image');
                                        }}
                                    >
                                        <img
                                            id='image-preview'
                                            src={actioningBrand.image}
                                            className='avatar-modal-view max-w-[337px] object-contain'
                                        />
                                        <Input
                                            className='fpm-input-file mb-2 mt-0' type="file" name="avatar" hidden
                                            onChange={(e) => {
                                                setImage(e.target.files[0])
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    document.querySelector('.avatar-modal-view').src = event.target.result;
                                                };
                                                reader.readAsDataURL(e.target.files[0]);
                                            }} />
                                    </div>
                                </Tooltip>

                                <h3 className='mt-10'><span className='text-red-500 '>* </span>Mô tả:</h3>
                                <TextArea
                                    rows={4}
                                    className='mb-2 mt-0 input-description-edituserdetails'
                                    name='description'
                                    value={description || actioningBrand.description}
                                    onChange={(e) => {
                                        setDescription(e.target.value)
                                    }}
                                />

                                <h3><span className='text-red-500'>* </span>Slug:</h3>
                                <Tooltip
                                    placement='bottomLeft'
                                    title={
                                        <div>
                                            <div>- Nhập tiếng việt không dấu</div>
                                            <div>- Ngăn cách bằng dấu gạch ngang</div>
                                            <div>- Không chứa khoảng trống</div>
                                        </div>
                                    }
                                >
                                    <Input
                                        className='mb-2 mt-0'
                                        name='slug'
                                        onChange={(e) => {
                                            setSlug(e.target.value)
                                        }}
                                        value={slug || actioningBrand.slug}
                                    />
                                </Tooltip>
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

export default EditBrandDetails