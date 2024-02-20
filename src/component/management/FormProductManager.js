import { EditProduct, GetBrands, GetCategories, GetImages, GetProducts } from '../../callAPI/api';
import React, { useState, useEffect, useContext } from 'react';
import {
    Input, Select, Image, Row, Col, Upload
} from 'antd';
import { PlusOutlined, } from '@ant-design/icons';
import '../../component/management/modalFPM.scss'
import Cookies from 'js-cookie';
import TextArea from 'antd/es/input/TextArea';
import Context from '../../store/Context';


const FormProductManager = ({ isActioning, setIsActioning, setActioningProduct, actioningProduct, fileList, setFileList, brandDefault,
    categoryDefault, brands, categories, brandsSelect, categorySelect }) => {
    let token = Cookies.get('token')
    const context = useContext(Context)
    const [productName, setProductName] = useState('')
    const [price, setPrice] = useState('')
    const [cost, setCost] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [quantity, setQuantity] = useState('')
    const [productPercent, setProductPercent] = useState('')
    const [cpu, setCPU] = useState('')
    const [hardDrive, setHardDrive] = useState('')
    const [ram, setRam] = useState('')
    const [muxSwitch, setMuxSwitch] = useState('')
    const [screen, setScreen] = useState('')
    const [connection, setConnection] = useState('')
    const [prodWeight, setprodWeight] = useState('')
    const [webcam, setWebcam] = useState('')
    const [operationSystem, setOperationSystem] = useState('')
    const [graphics, setGraphics] = useState('')
    const [pin, setPin] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [selectedItems, setSelectedItems] = useState('');
    const [brandSelected, setBrandSelected] = useState('')
    const [categoryIDSelected, setCategoryIDSelected] = useState('');
    const [categorySelected, setCategorySelected] = useState('')
    const [searchText, setSearchText] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    const handlePreview = async (file) => {
        // console.log("file", file)
        if (!file.url && !file.preview) {
            // file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }, fileListPost) => {
        // console.log(newFileList)
        // console.log("flp", fileListPost)
        // console.log({ fileList: newFileList })
        setFileList(newFileList)
    };

    const onFinish = (values) => {
        // if (avatar === '') 
        values.preventDefault();
        const formData = new FormData();
        formData.append('token', token);
        formData.append('IDProduct', actioningProduct.id);
        formData.append('brand_id', selectedItems + 1);
        formData.append('category_id', categoryIDSelected + 1);
        formData.append('prod_name', productName || actioningProduct.prod_name);
        formData.append('prod_description', productDescription || actioningProduct.prod_description);
        formData.append('price', price || actioningProduct.price);
        formData.append('cost', cost || actioningProduct.cost);
        formData.append('quantity', quantity || actioningProduct.quantity);
        formData.append('prod_percent', productPercent || actioningProduct.prod_percent);
        formData.append('cpu', cpu || actioningProduct.cpu);
        formData.append('hard_drive', hardDrive || actioningProduct.hard_drive);
        formData.append('ram', ram || actioningProduct.ram);
        formData.append('screen', screen || actioningProduct.screen);
        formData.append('webcam', webcam || actioningProduct.webcam);
        formData.append('connection', connection || actioningProduct.connection);
        formData.append('prod_weight', prodWeight || actioningProduct.prod_weight);
        formData.append('pin', pin || actioningProduct.pin);
        formData.append('operation_system', operationSystem || actioningProduct.operation_system);
        formData.append('graphics', graphics || actioningProduct.graphics);
        formData.append('avatar', avatar || actioningProduct.avatar);
        // formData.append('images', fileList);
        fileList.forEach(image => {
            if (image.originFileObj) {
                formData.append('images', image.originFileObj);
            }
            else {
                // console.log(image)
                formData.append('images', image.url);
                formData.append('image_id', image.image_id);

            }
        });

        EditProduct(formData).then(response => {
            // console.log(response);
            if (response.success) {
                setIsActioning(false);
                setActioningProduct(null);
                context.Message("success", "Cập nhật sản phẩm thành công.")

            }
        })
    };

    return (
        <div className='wrap-modal-fpm w-full'>
            {actioningProduct &&
                <div
                    className='fpm-wrap-input-file h-[450px] cursor-pointer'
                    onClick={() => {
                        let fpmInputFile = document.querySelector(".fpm-input-file")
                        fpmInputFile.click()
                    }}
                    onMouseEnter={() => {
                        // Add the 'hide-image' class when hovering
                        document.querySelector('.avatar-modal-view').classList.add('hide-image');
                    }}
                    onMouseLeave={() => {
                        // Remove the 'hide-image' class when not hovering
                        document.querySelector('.avatar-modal-view').classList.remove('hide-image');
                    }}
                >
                    <div className='fpm-text-hidden absolute text-xl hidden font-bold' >
                        Click để đổi ảnh đại diện cho sản phẩm
                    </div>
                    <img
                        id='image-preview'
                        src={actioningProduct.avatar}
                        className='avatar-modal-view max-w-[450px] object-contain'
                    ></img>
                    <Input
                        className='fpm-input-file mb-2 mt-0' type="file" name="avatar" hidden
                        onChange={(e) => {
                            // console.log(e.target.files[0])
                            setAvatar(e.target.files[0])
                            // Update the image preview here
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                // Set the preview image source
                                document.querySelector('.avatar-modal-view').src = event.target.result;
                            };
                            reader.readAsDataURL(e.target.files[0]);
                        }} />
                </div>
            }
            {actioningProduct &&
                <div>
                    <form
                        // action='http://localhost:8000/editproduct'
                        onSubmit={onFinish}
                        method="post"
                        encType="multipart/form-data"
                        className='text-end'
                    >
                        {/* <Form.Item className='flex-1 mr-2'> */}
                        <Input type="hidden" name="IDProduct"
                            value={actioningProduct.id} />
                        <Row className='mt-[15px]'>
                            <Col span={12}
                                className='text-start px-[15px] pl-0'>
                                <h3><span className='text-red-500'>* </span>Tên sản phẩm:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='prod_name'

                                    onChange={(e) => {
                                        setProductName(e.target.value)
                                        // console.log(productName)
                                    }}
                                    value={productName || actioningProduct.prod_name}
                                />
                                <h3><span className='text-red-500'>* </span>Miêu tả:</h3>
                                <TextArea
                                    className='mb-2 mt-0'
                                    name='prod_description'
                                    style={{ height: 100 }}
                                    onChange={(e) => {
                                        setProductDescription(e.target.value)
                                        // console.log(productName)
                                    }}
                                    value={productDescription || actioningProduct.prod_description}
                                ></TextArea>
                                <h3><span className='text-red-500'>* </span>Giá bán:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='price'
                                    value={price || actioningProduct.price}
                                    onChange={(e) => {
                                        setPrice(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Giá chính hãng:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='cost'
                                    value={cost || actioningProduct.cost}
                                    onChange={(e) => {
                                        setCost(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Số lượng còn lại:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='quantity'
                                    value={quantity || actioningProduct.quantity}
                                    onChange={(e) => {
                                        setQuantity(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Phần trăm giảm giá:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='prod_percent'
                                    value={productPercent || actioningProduct.prod_percent}
                                    onChange={(e) => {
                                        setProductPercent(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>CPU:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='cpu'
                                    value={cpu || actioningProduct.cpu}
                                    onChange={(e) => {
                                        setCPU(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Ổ cứng:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='hard_drive'
                                    value={hardDrive || actioningProduct.hard_drive}
                                    onChange={(e) => {
                                        setHardDrive(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>RAM:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='ram'
                                    value={ram || actioningProduct.ram}
                                    onChange={(e) => {
                                        setRam(e.target.value)
                                    }}></Input>
                            </Col>
                            <Col span={12} className='text-start px-[15px] pr-0'>
                                <h3><span className='text-red-500'>* </span>Thương hiệu:</h3>
                                <Select
                                    // mode="multiple"
                                    className='mb-2 mt-0'
                                    name='brand_id'
                                    value={brandSelected || brandDefault}
                                    onChange={(e) => {
                                        const getBrand = brands.find((brand) => {
                                            // console.log(brand.brand_id)
                                            // console.log(actioningProduct)
                                            return brand.brand_id === e + 1

                                        });
                                        // console.log(getBrand);
                                        setBrandSelected(getBrand.name)
                                        // value ở đây là một mảng các giá trị đã được chọn
                                        setSelectedItems(e);
                                        // console.log(e + 1)
                                    }}
                                    style={{
                                        width: '100%',
                                    }}

                                    options={
                                        brandsSelect.map((item, index) => ({

                                            value: index,
                                            label: item,
                                        }))}
                                />
                                <h3><span className='text-red-500'>* </span>Danh mục:</h3>
                                <Select
                                    // mode="multiple"
                                    className='mb-2 mt-0'
                                    name='category_id'
                                    value={categorySelected || categoryDefault}
                                    onChange={(e) => {
                                        const getCategory = categories.find((category) => {
                                            // console.log(category.brand_id)
                                            // console.log(actioningProduct)
                                            return category.category_id === e + 1

                                        });
                                        // console.log(getBrand);
                                        setCategorySelected(getCategory.name)
                                        // value ở đây là một mảng các giá trị đã được chọn
                                        setCategoryIDSelected(e);
                                        // console.log(e + 1)
                                    }}
                                    style={{
                                        width: '100%',
                                    }}

                                    options={
                                        categorySelect.map((item, index) => ({

                                            value: index,
                                            label: item,
                                        }))}
                                />
                                <h3><span className='text-red-500'>* </span>Màn hình:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='screen'
                                    value={screen || actioningProduct.screen}
                                    onChange={(e) => {
                                        setScreen(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Webcam:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='webcam'
                                    value={webcam || actioningProduct.webcam}
                                    onChange={(e) => {
                                        setWebcam(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Kết nối:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='connection'
                                    value={connection || actioningProduct.connection}
                                    onChange={(e) => {
                                        setConnection(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Trọng lượng:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='prod_weight'
                                    value={prodWeight || actioningProduct.prod_weight}
                                    onChange={(e) => {
                                        setprodWeight(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Pin:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='pin'
                                    value={pin || actioningProduct.pin}
                                    onChange={(e) => {
                                        setPin(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Hệ điều hành:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='operation_system'
                                    value={operationSystem || actioningProduct.operation_system}
                                    onChange={(e) => {
                                        setOperationSystem(e.target.value)
                                    }}></Input>
                                <h3><span className='text-red-500'>* </span>Đồ họa:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='graphics'
                                    value={graphics || actioningProduct.graphics}
                                    onChange={(e) => {
                                        setGraphics(e.target.value)
                                    }}></Input>
                                <Upload
                                    // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                    listType="picture-card"
                                    name='images'
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    beforeUpload={() => false}
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
                            </Col>

                        </Row>

                        <div className='inline-block'>
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

export default FormProductManager