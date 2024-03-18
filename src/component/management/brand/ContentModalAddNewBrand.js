import { AddNewBrand, AddNewCategory } from '../../../callAPI/api';
import React, { useState, useContext } from 'react';
import {
    Input, Select, Row, Col, Tooltip
} from 'antd';
import '../../management/product/modalFPM.scss'
import Cookies from 'js-cookie';
import Context from '../../../store/Context';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';


const ContentModalAddNewBrand = ({ setIsActioning }) => {
    let token = Cookies.get('token');
    const context = useContext(Context);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState(null)

    const [hasNameChanged, setHasNameChanged] = useState(false);
    const [hasDescriptionChanged, setHasDescriptionChanged] = useState(false);
    const [hasSlugChanged, setHasSlugChanged] = useState(false);
    const [hasImageChanged, setHasImageChanged] = useState(false);

    const [nameIsNull, setNameIsNull] = useState(false);
    const [descriptionIsNull, setDescriptionIsNull] = useState(false);
    const [slugIsNull, setSlugIsNull] = useState(false);
    const [imageIsNull, setImageIsNull] = useState(false);

    const [newBrandFailed, setNewBrandFailed] = useState(false);

    const onChangeName = (e) => {
        setName(e.target.value);
        setHasNameChanged(true)
        setNameIsNull(false);
    }

    const onChangeDescription = (e) => {
        setDescription(e.target.value)
        setHasDescriptionChanged(true);
        setDescriptionIsNull(false);
    };

    const onChangeSlug = (e) => {
        let newSlug = e.target.value
            .trim()
            .replace(/\s+/g, '-') // Thay thế dấu cách bằng dấu gạch ngang
            .replace(/[^a-zA-Z0-9-]/g, '') // Loại bỏ các ký tự không phải a-z, A-Z, 0-9, hoặc dấu gạch ngang
            .toLowerCase(); // Chuyển đổi thành chữ thường
        setSlug(newSlug);
        setHasSlugChanged(true)
        setSlugIsNull(false);
    }

    const onChangeImage = (e) => {
        setImage(e.target.files[0])
        setHasImageChanged(true)
        setImageIsNull(false)
        const reader = new FileReader();
        reader.onload = (event) => {
            document.querySelector('.avatar-modal-view').src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    const onFinish = (values) => {
        values.preventDefault();

        const formData = new FormData();
        formData.append('token', token);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('slug', slug);
        formData.append('avatar', image);

        let hasError = false;
        if (!name) {
            setNameIsNull(true);
            hasError = true;
        }
        if (!description) {
            setDescriptionIsNull(true);
            hasError = true;
        }
        if (!slug) {
            setSlugIsNull(true);
            hasError = true;
        }
        if (!image) {
            setImageIsNull(true);
            hasError = true;
        }

        console.log(formData);
        if (hasError) {
            setNewBrandFailed(true);
            context.Message("warning", "Vui lòng điền đầy đủ thông tin");
            return;
        }


        AddNewBrand(formData).then(response => {
            console.log(response)
            if (response.success) {
                context.Message("success", response.message)
                setIsActioning(false);
            }
        })
    };

    return (
        <div className='wrap-modal-fpm w-full'>
            <div>
                <form
                    onSubmit={onFinish}
                    method="post"
                    encType="multipart/form-data"
                    className='text-end'
                >

                    <Row className='mt-[15px]'>
                        <Col span={24} className='text-start px-[15px] pl-0'>

                            <h3><span className='text-red-500'>* </span>Tên thương hiệu:</h3>
                            <Input
                                className='mb-2 mt-0'
                                name='name'
                                autoComplete="off"
                                onChange={(e) => { onChangeName(e) }}
                                value={name}
                            />

                            <div className='wrap-err-mess'>
                                {(hasNameChanged && name === '') || (newBrandFailed && nameIsNull)
                                    ? <p className='err-mess'>Tên thương hiệu không được để trống</p> : null}
                            </div>

                            <h3><span className='text-red-500'>* </span>Mô tả:</h3>
                            <TextArea
                                rows={4}
                                className='mb-2 mt-0 input-description-edituserdetails'
                                name='description'
                                value={description}
                                onChange={(e) => {
                                    onChangeDescription(e)
                                }} />
                            <div className='wrap-err-mess'>
                                {(hasDescriptionChanged && description === '') || (newBrandFailed && descriptionIsNull)
                                    ? <p className='err-mess'>Mô tả không được để trống</p> : null
                                }
                            </div>
                            <h3><span className='text-red-500'>* </span>Mã thương hiệu (slug):</h3>
                            <Tooltip
                                className='bg-white text-black'
                                placement='topRight'
                                title={
                                    <div>
                                        <div>- Nhập tiếng việt không dấu</div>
                                        <div>- Ngăn cách bằng dấu gạch ngang</div>
                                        <div>- Không chứa khoảng trống</div>
                                    </div>
                                }>
                                <Input
                                    className='mb-2 mt-0'
                                    name='slug'
                                    onChange={(e) => { onChangeSlug(e) }}
                                    value={slug}
                                />
                            </Tooltip>

                            <div className='wrap-err-mess'>
                                {(hasSlugChanged && slug === '') || (newBrandFailed && slugIsNull)
                                    ? <p className='err-mess'>Mã thương hiệu không được để trống</p> : null}
                            </div>

                            <h3><span className='text-red-500'>* </span>Hình ảnh thương hiệu:</h3>
                            <Tooltip
                                placement='topRight'
                                title='Click để đổi ảnh đại diện cho thương hiệu'
                            >
                                <div
                                    className='fpm-wrap-input-file cursor-pointer min-h-[200px]'
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
                                        src={image}
                                        className='avatar-modal-view max-w-[337px] object-contain'
                                    />
                                    <Input
                                        className='fpm-input-file mb-2 mt-0' type="file" name="avatar" hidden
                                        onChange={(e) => { onChangeImage(e) }} />
                                </div>
                            </Tooltip>

                            <div className='wrap-err-mess pt-2'>
                                {(hasImageChanged && image === '') || (newBrandFailed && imageIsNull)
                                    ? <p className='err-mess'>Hình ảnh thương hiệu không được để trống</p> : null}
                            </div>
                        </Col>
                    </Row>

                    <div className='inline-block mt-5'>
                        <Input type='submit' defaultValue={"Thêm thương hiệu"}
                            className='bg-[#c8191f] text-white'>
                        </Input>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContentModalAddNewBrand