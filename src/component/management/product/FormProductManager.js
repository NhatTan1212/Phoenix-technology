import { EditProduct, GetBrands, GetCategories, GetImages, GetProducts } from '../../../callAPI/api';
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Input, Select, Image, Row, Col, Upload, Tooltip, Modal
} from 'antd';
import { PlusOutlined, } from '@ant-design/icons';
import './modalFPM.scss'
import Cookies from 'js-cookie';
import TextArea from 'antd/es/input/TextArea';
import Context from '../../../store/Context';
import JoditEditor from 'jodit-react';


const FormProductManager = ({ isActioning, setIsActioning, setActioningProduct, actioningProduct, fileList, setFileList, brandDefault,
    categoryDefault, brands, categories, brandsSelect, categorySelect }) => {
    let token = Cookies.get('token')
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    const [productName, setProductName] = useState('')
    const [price, setPrice] = useState('')
    const [cost, setCost] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [quantity, setQuantity] = useState('')
    const [productPercent, setProductPercent] = useState('')
    const [cpu, setCPU] = useState('')
    const [cpuBrand, setCPUBrand] = useState('')
    const [cpuTech, setCPUTech] = useState('')
    const [cpuType, setCPUType] = useState('')
    const [cpuSpeed, setCPUSpeed] = useState('')
    const [cpuMaxSpeed, setCPUMaxSpeed] = useState('')
    const [cpuCoreNumber, setCPUCoreNumber] = useState('')
    const [cpuThreadNumber, setCPUThreadNumber] = useState('')
    const [cpuCache, setCPUCache] = useState('')
    const [hardDrive, setHardDrive] = useState('')
    const [hardDriveType, setHardDriveType] = useState('')
    const [SSDOrHDD, setSSDOrHDD] = useState('')
    const [hardDriveCapacity, setHardDriveCapatity] = useState('')
    const [totalSSDAndHDD, setTotalSSDAndHDD] = useState('')
    const [SSDAndHDDRemaining, setSSDAndHDDRemaining] = useState('')
    const [ram, setRam] = useState('')
    const [ramCapacity, setRamCapacity] = useState('')
    const [ramType, setRamType] = useState('')
    const [ramSpeed, setRamSpeed] = useState('')
    const [numRamRemovableSlots, setNumRamRemovableSlots] = useState('')
    const [numRamRemainingSlots, setNumRamRemainingSlots] = useState('')
    const [numRamOnBoard, setNumRamOnBoard] = useState('')
    const [maximumRAMSupport, setMaximumRAMSupport] = useState('')
    const [screen, setScreen] = useState('')
    const [connection, setConnection] = useState('')
    const [prodWeight, setprodWeight] = useState('')
    const [webcam, setWebcam] = useState('')
    const [operationSystem, setOperationSystem] = useState('')
    const [graphics, setGraphics] = useState('')
    const [onBoard, setOnBoard] = useState('')
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
    const [detailedEvaluation, setDetailedEvaluation] = useState('');
    const editor = useRef(null);

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

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        console.log("file", file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewOpen(false);

    const handleChange = ({ fileList: newFileList }, fileListPost) => {
        // console.log(newFileList)
        // console.log("flp", fileListPost)
        // console.log({ fileList: newFileList })
        setFileList(newFileList)
    };

    const onFinish = (values) => {
        // if (avatar === '') 
        // console.log('action', actioningProduct.brand_id);
        // console.log('select', selectedItems);
        values.preventDefault();
        const formData = new FormData();
        formData.append('token', token);
        formData.append('IDProduct', actioningProduct.id);
        formData.append('brand_id', selectedItems || actioningProduct.brand_id);
        formData.append('category_id', categoryIDSelected || actioningProduct.category_id);
        formData.append('prod_name', productName || actioningProduct.prod_name);
        formData.append('prod_description', productDescription || actioningProduct.prod_description);
        formData.append('detailed_evaluation', detailedEvaluation || actioningProduct.detailed_evaluation);
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
        formData.append('on_board', onBoard || actioningProduct.on_board);
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
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
            {actioningProduct &&
                <div
                    className='fpm-wrap-input-file h-[450px] cursor-pointer overflow-hidden'
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
                            <Col span={isHiddenAutoCpl ? 12 : 24}
                                className='text-start px-[15px] pl-0'>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Tên sản phẩm:</h3>
                                    <Input
                                        className='w-2/3 mb-2 mt-0'
                                        name='prod_name'

                                        onChange={(e) => {
                                            setProductName(e.target.value)
                                            // console.log(productName)
                                        }}
                                        value={productName || actioningProduct.prod_name}
                                    />
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Miêu tả:</h3>
                                    <TextArea
                                        className='w-2/3 mb-2 mt-0'
                                        name='prod_description'
                                        style={{ height: 88 }}
                                        onChange={(e) => {
                                            setProductDescription(e.target.value)
                                            // console.log(productName)
                                        }}
                                        value={productDescription || actioningProduct.prod_description}
                                    ></TextArea>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Giá bán:</h3>
                                    <Input
                                        className='w-2/3 mb-2 mt-0'
                                        name='price'
                                        value={price || actioningProduct.price}
                                        onChange={(e) => {
                                            setPrice(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Giá chính hãng:</h3>
                                    <Input
                                        className='w-2/3 mb-2 mt-0'
                                        name='cost'
                                        value={cost || actioningProduct.cost}
                                        onChange={(e) => {
                                            setCost(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Số lượng còn lại:</h3>
                                    <Input
                                        className='w-2/3 mb-2 mt-0'
                                        name='quantity'
                                        value={quantity || actioningProduct.quantity}
                                        onChange={(e) => {
                                            setQuantity(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Phần trăm giảm giá:</h3>
                                    <Input
                                        className='w-2/3 mb-2 mt-0'
                                        name='prod_percent'
                                        value={productPercent || actioningProduct.prod_percent}
                                        onChange={(e) => {
                                            setProductPercent(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>CPU:</h3>
                                    <Tooltip
                                        placement='topRight'
                                        title={
                                            <div>
                                                <div>- Nhập theo thứ tự: Hãng CPU, Công nghệ CPU, Loại CPU</div>
                                                <div>- Các thành phần cách nhau bởi dấu ','</div>
                                                <div>  &ensp; Ví dụ: Intel,Core i5,1240P,3.30 GHz,	4.50 GHz</div>
                                            </div>
                                        }
                                    >
                                        <Input
                                            className='w-2/3 mb-2 mt-0'
                                            name='cpu'
                                            value={cpu || actioningProduct.cpu}
                                            onChange={(e) => {
                                                setCPU(e.target.value)
                                                setCPUBrand(e.target.value.split(','[0]))
                                                setCPUTech(e.target.value.split(','[1]))
                                                setCPUType(e.target.value.split(','[2]))
                                                setCPUSpeed(e.target.value.split(','[3]))
                                                setCPUMaxSpeed(e.target.value.split(','[4]))
                                                setCPUCoreNumber(e.target.value.split(','[5]))
                                                setCPUThreadNumber(e.target.value.split(','[6]))
                                                setCPUCache(e.target.value.split(','[7]))
                                            }}></Input>
                                    </Tooltip>
                                </div>
                                <ul>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Hãng CPU:</h3>
                                            <Input
                                                className=' mb-2 mt-0'
                                                name='cpuBrand'
                                                value={cpuBrand || actioningProduct.cpu.split(',')[0]}
                                                onChange={(e) => {
                                                    const newCPUBrand = e.target.value;
                                                    setCPUBrand(newCPUBrand);
                                                    const cpuValues = [
                                                        newCPUBrand,
                                                        cpuTech || actioningProduct.cpu.split(',')[1],
                                                        cpuType || actioningProduct.cpu.split(',')[2],
                                                        cpuSpeed || actioningProduct.cpu.split(',')[3],
                                                        cpuMaxSpeed || actioningProduct.cpu.split(',')[4],
                                                        cpuCoreNumber || actioningProduct.cpu.split(',')[5],
                                                        cpuThreadNumber || actioningProduct.cpu.split(',')[6],
                                                        cpuCache || actioningProduct.cpu.split(',')[7]
                                                    ];
                                                    setCPU(cpuValues.join(','));
                                                    setCPUTech(cpuValues[1]);
                                                    setCPUType(cpuValues[2]);
                                                    setCPUSpeed(cpuValues[3]);
                                                    setCPUMaxSpeed(cpuValues[4]);
                                                    setCPUCoreNumber(cpuValues[5]);
                                                    setCPUThreadNumber(cpuValues[6]);
                                                    setCPUCache(cpuValues[7]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Công nghệ CPU:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='cpuTech'
                                                value={cpuTech || actioningProduct.cpu.split(',')[1]}
                                                onChange={(e) => {
                                                    const newCPUTech = e.target.value;
                                                    setCPUTech(newCPUTech);
                                                    const cpuValues = [
                                                        cpuBrand || actioningProduct.cpu.split(',')[0],
                                                        newCPUTech,
                                                        cpuType || actioningProduct.cpu.split(',')[2],
                                                        cpuSpeed || actioningProduct.cpu.split(',')[3],
                                                        cpuMaxSpeed || actioningProduct.cpu.split(',')[4],
                                                        cpuCoreNumber || actioningProduct.cpu.split(',')[5],
                                                        cpuThreadNumber || actioningProduct.cpu.split(',')[6],
                                                        cpuCache || actioningProduct.cpu.split(',')[7]
                                                    ];
                                                    setCPU(cpuValues.join(','));
                                                    setCPUBrand(cpuValues[0]);
                                                    setCPUType(cpuValues[2]);
                                                    setCPUSpeed(cpuValues[3]);
                                                    setCPUMaxSpeed(cpuValues[4]);
                                                    setCPUCoreNumber(cpuValues[5]);
                                                    setCPUThreadNumber(cpuValues[6]);
                                                    setCPUCache(cpuValues[7]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Loại CPU:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='cpuType'
                                                value={cpuType || actioningProduct.cpu.split(',')[2]}
                                                onChange={(e) => {
                                                    const newCPUType = e.target.value;
                                                    setCPUType(newCPUType);
                                                    const cpuValues = [
                                                        cpuBrand || actioningProduct.cpu.split(',')[0],
                                                        cpuTech || actioningProduct.cpu.split(',')[1],
                                                        newCPUType,
                                                        cpuSpeed || actioningProduct.cpu.split(',')[3],
                                                        cpuMaxSpeed || actioningProduct.cpu.split(',')[4],
                                                        cpuCoreNumber || actioningProduct.cpu.split(',')[5],
                                                        cpuThreadNumber || actioningProduct.cpu.split(',')[6],
                                                        cpuCache || actioningProduct.cpu.split(',')[7]
                                                    ];
                                                    setCPU(cpuValues.join(','));
                                                    setCPUBrand(cpuValues[0]);
                                                    setCPUTech(cpuValues[1]);
                                                    setCPUSpeed(cpuValues[3]);
                                                    setCPUMaxSpeed(cpuValues[4]);
                                                    setCPUCoreNumber(cpuValues[5]);
                                                    setCPUThreadNumber(cpuValues[6]);
                                                    setCPUCache(cpuValues[7]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Tốc độ CPU:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='cpuSpeed'
                                                value={cpuSpeed || actioningProduct.cpu.split(',')[3]}
                                                onChange={(e) => {
                                                    const newCPUSpeed = e.target.value;
                                                    setCPUSpeed(newCPUSpeed);
                                                    const cpuValues = [
                                                        cpuBrand || actioningProduct.cpu.split(',')[0],
                                                        cpuTech || actioningProduct.cpu.split(',')[1],
                                                        cpuType || actioningProduct.cpu.split(',')[2],
                                                        newCPUSpeed,
                                                        cpuMaxSpeed || actioningProduct.cpu.split(',')[4],
                                                        cpuCoreNumber || actioningProduct.cpu.split(',')[5],
                                                        cpuThreadNumber || actioningProduct.cpu.split(',')[6],
                                                        cpuCache || actioningProduct.cpu.split(',')[7]
                                                    ];
                                                    setCPU(cpuValues.join(','));
                                                    setCPUBrand(cpuValues[0]);
                                                    setCPUTech(cpuValues[1]);
                                                    setCPUType(cpuValues[2]);
                                                    setCPUMaxSpeed(cpuValues[4]);
                                                    setCPUCoreNumber(cpuValues[5]);
                                                    setCPUThreadNumber(cpuValues[6]);
                                                    setCPUCache(cpuValues[7]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Tốc độ tối đa:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='cpuMaxSpeed'
                                                value={cpuMaxSpeed || actioningProduct.cpu.split(',')[4]}
                                                onChange={(e) => {
                                                    const newCPUMaxSpeed = e.target.value;
                                                    setCPUMaxSpeed(newCPUMaxSpeed);
                                                    const cpuValues = [
                                                        cpuBrand || actioningProduct.cpu.split(',')[0],
                                                        cpuTech || actioningProduct.cpu.split(',')[1],
                                                        cpuType || actioningProduct.cpu.split(',')[2],
                                                        cpuSpeed || actioningProduct.cpu.split(',')[3],
                                                        newCPUMaxSpeed,
                                                        cpuCoreNumber || actioningProduct.cpu.split(',')[5],
                                                        cpuThreadNumber || actioningProduct.cpu.split(',')[6],
                                                        cpuCache || actioningProduct.cpu.split(',')[7]
                                                    ];
                                                    setCPU(cpuValues.join(','));
                                                    setCPUBrand(cpuValues[0]);
                                                    setCPUTech(cpuValues[1]);
                                                    setCPUType(cpuValues[2]);
                                                    setCPUSpeed(cpuValues[3]);
                                                    setCPUCoreNumber(cpuValues[5]);
                                                    setCPUThreadNumber(cpuValues[6]);
                                                    setCPUCache(cpuValues[7]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Số nhân:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='cpuCoreNumber'
                                                value={cpuCoreNumber || actioningProduct.cpu.split(',')[5]}
                                                onChange={(e) => {
                                                    const newCPUCoreNumber = e.target.value;
                                                    setCPUCoreNumber(newCPUCoreNumber);
                                                    const cpuValues = [
                                                        cpuBrand || actioningProduct.cpu.split(',')[0],
                                                        cpuTech || actioningProduct.cpu.split(',')[1],
                                                        cpuType || actioningProduct.cpu.split(',')[2],
                                                        cpuSpeed || actioningProduct.cpu.split(',')[3],
                                                        cpuMaxSpeed || actioningProduct.cpu.split(',')[4],
                                                        newCPUCoreNumber,
                                                        cpuThreadNumber || actioningProduct.cpu.split(',')[6],
                                                        cpuCache || actioningProduct.cpu.split(',')[7]
                                                    ];
                                                    setCPU(cpuValues.join(','));
                                                    setCPUBrand(cpuValues[0]);
                                                    setCPUTech(cpuValues[1]);
                                                    setCPUType(cpuValues[2]);
                                                    setCPUSpeed(cpuValues[3]);
                                                    setCPUMaxSpeed(cpuValues[4]);
                                                    setCPUThreadNumber(cpuValues[6]);
                                                    setCPUCache(cpuValues[7]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Số luồng:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='cpuThreadNumber'
                                                value={cpuThreadNumber || actioningProduct.cpu.split(',')[6]}
                                                onChange={(e) => {
                                                    const newCPUThreadNumber = e.target.value;
                                                    setCPUThreadNumber(newCPUThreadNumber);
                                                    const cpuValues = [
                                                        cpuBrand || actioningProduct.cpu.split(',')[0],
                                                        cpuTech || actioningProduct.cpu.split(',')[1],
                                                        cpuType || actioningProduct.cpu.split(',')[2],
                                                        cpuSpeed || actioningProduct.cpu.split(',')[3],
                                                        cpuMaxSpeed || actioningProduct.cpu.split(',')[4],
                                                        cpuCoreNumber || actioningProduct.cpu.split(',')[5],
                                                        newCPUThreadNumber,
                                                        cpuCache || actioningProduct.cpu.split(',')[7]
                                                    ];
                                                    setCPU(cpuValues.join(','));
                                                    setCPUBrand(cpuValues[0]);
                                                    setCPUTech(cpuValues[1]);
                                                    setCPUType(cpuValues[2]);
                                                    setCPUSpeed(cpuValues[3]);
                                                    setCPUMaxSpeed(cpuValues[4]);
                                                    setCPUCoreNumber(cpuValues[5]);
                                                    setCPUCache(cpuValues[7]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Bộ nhớ đệm:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='cpuCache'
                                                value={cpuCache || actioningProduct.cpu.split(',')[7]}
                                                onChange={(e) => {
                                                    const newCPUCache = e.target.value;
                                                    setCPUCache(newCPUCache);
                                                    const cpuValues = [
                                                        cpuBrand || actioningProduct.cpu.split(',')[0],
                                                        cpuTech || actioningProduct.cpu.split(',')[1],
                                                        cpuType || actioningProduct.cpu.split(',')[2],
                                                        cpuSpeed || actioningProduct.cpu.split(',')[3],
                                                        cpuMaxSpeed || actioningProduct.cpu.split(',')[4],
                                                        cpuCoreNumber || actioningProduct.cpu.split(',')[5],
                                                        cpuThreadNumber || actioningProduct.cpu.split(',')[6],
                                                        newCPUCache
                                                    ];
                                                    setCPU(cpuValues.join(','));
                                                    setCPUBrand(cpuValues[0]);
                                                    setCPUTech(cpuValues[1]);
                                                    setCPUType(cpuValues[2]);
                                                    setCPUSpeed(cpuValues[3]);
                                                    setCPUMaxSpeed(cpuValues[4]);
                                                    setCPUCoreNumber(cpuValues[5]);
                                                    setCPUThreadNumber(cpuValues[6]);
                                                }}></Input>
                                        </div>
                                    </li>
                                </ul>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>RAM:</h3>
                                    <Tooltip
                                        placement='topRight'
                                        title={
                                            <div>
                                                <div>- Cách 1: Nhập theo thứ tự, các thuộc tính cách nhau bởi dấu ','</div>
                                                <div>  &ensp; Ví dụ: 	8 GB,DDR4,,2 ,1,0,32 GB</div>
                                                <div>- Cách 2: Nhập từng thuộc tính theo ô phía dưới</div>
                                            </div>
                                        }
                                    >
                                        <Input
                                            className='w-2/3 mb-2 mt-0'
                                            name='ram'
                                            value={ram || actioningProduct.ram}
                                            onChange={(e) => {
                                                setRam(e.target.value)
                                                setRamCapacity(e.target.value.split(',')[0])
                                                setRamType(e.target.value.split(',')[1])
                                                setRamSpeed(e.target.value.split(',')[2])
                                                setNumRamRemovableSlots(e.target.value.split(',')[3])
                                                setNumRamRemainingSlots(e.target.value.split(',')[4])
                                                setNumRamOnBoard(e.target.value.split(',')[5])
                                                setMaximumRAMSupport(e.target.value.split(',')[6])
                                            }}></Input>
                                    </Tooltip>
                                </div>
                                <ul>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Dung lượng RAM:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='ramCapacity'
                                                value={ramCapacity || actioningProduct.ram.split(',')[0]}
                                                onChange={(e) => {
                                                    const newRamCapacity = e.target.value;
                                                    setRamCapacity(newRamCapacity);
                                                    const ramValues = [
                                                        newRamCapacity,
                                                        ramType || actioningProduct.ram.split(',')[1],
                                                        ramSpeed || actioningProduct.ram.split(',')[2],
                                                        numRamRemovableSlots || actioningProduct.ram.split(',')[3],
                                                        numRamRemainingSlots || actioningProduct.ram.split(',')[4],
                                                        numRamOnBoard || actioningProduct.ram.split(',')[5],
                                                        maximumRAMSupport || actioningProduct.ram.split(',')[6]
                                                    ];
                                                    setRam(ramValues.join(','));
                                                    setRamType(ramValues[1]);
                                                    setRamSpeed(ramValues[2]);
                                                    setNumRamRemovableSlots(ramValues[3]);
                                                    setNumRamRemainingSlots(ramValues[4]);
                                                    setNumRamOnBoard(ramValues[5]);
                                                    setMaximumRAMSupport(ramValues[6]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Loại RAM:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='ramType'
                                                value={ramType || actioningProduct.ram.split(',')[1]}
                                                onChange={(e) => {
                                                    const newRamType = e.target.value;
                                                    setRamType(newRamType);
                                                    const ramValues = [
                                                        ramCapacity || actioningProduct.ram.split(',')[0],
                                                        newRamType,
                                                        ramSpeed || actioningProduct.ram.split(',')[2],
                                                        numRamRemovableSlots || actioningProduct.ram.split(',')[3],
                                                        numRamRemainingSlots || actioningProduct.ram.split(',')[4],
                                                        numRamOnBoard || actioningProduct.ram.split(',')[5],
                                                        maximumRAMSupport || actioningProduct.ram.split(',')[6]
                                                    ];
                                                    setRam(ramValues.join(','));
                                                    setRamCapacity(ramValues[0]);
                                                    setRamSpeed(ramValues[2]);
                                                    setNumRamRemovableSlots(ramValues[3]);
                                                    setNumRamRemainingSlots(ramValues[4]);
                                                    setNumRamOnBoard(ramValues[5]);
                                                    setMaximumRAMSupport(ramValues[6]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Tốc độ RAM:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='ramSpeed'
                                                value={ramSpeed || actioningProduct.ram.split(',')[2]}
                                                onChange={(e) => {
                                                    const newRamSpeed = e.target.value;
                                                    setRamSpeed(newRamSpeed);
                                                    const ramValues = [
                                                        ramCapacity || actioningProduct.ram.split(',')[0],
                                                        ramType || actioningProduct.ram.split(',')[1],
                                                        newRamSpeed,
                                                        numRamRemovableSlots || actioningProduct.ram.split(',')[3],
                                                        numRamRemainingSlots || actioningProduct.ram.split(',')[4],
                                                        numRamOnBoard || actioningProduct.ram.split(',')[5],
                                                        maximumRAMSupport || actioningProduct.ram.split(',')[6]
                                                    ];
                                                    setRam(ramValues.join(','));
                                                    setRamCapacity(ramValues[0]);
                                                    setRamType(ramValues[1]);
                                                    setNumRamRemovableSlots(ramValues[3]);
                                                    setNumRamRemainingSlots(ramValues[4]);
                                                    setNumRamOnBoard(ramValues[5]);
                                                    setMaximumRAMSupport(ramValues[6]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Số khe cắm rời:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='numRamRemovableSlots'
                                                value={numRamRemovableSlots || actioningProduct.ram.split(',')[3]}
                                                onChange={(e) => {
                                                    const newNumRamRemovableSlots = e.target.value;
                                                    setNumRamRemovableSlots(newNumRamRemovableSlots);
                                                    const ramValues = [
                                                        ramCapacity || actioningProduct.ram.split(',')[0],
                                                        ramType || actioningProduct.ram.split(',')[1],
                                                        ramSpeed || actioningProduct.ram.split(',')[2],
                                                        newNumRamRemovableSlots,
                                                        numRamRemainingSlots || actioningProduct.ram.split(',')[4],
                                                        numRamOnBoard || actioningProduct.ram.split(',')[5],
                                                        maximumRAMSupport || actioningProduct.ram.split(',')[6]
                                                    ];
                                                    setRam(ramValues.join(','));
                                                    setRamCapacity(ramValues[0]);
                                                    setRamType(ramValues[1]);
                                                    setRamSpeed(ramValues[2]);
                                                    setNumRamRemainingSlots(ramValues[4]);
                                                    setNumRamOnBoard(ramValues[5]);
                                                    setMaximumRAMSupport(ramValues[6]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Số khe RAM còn lại:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='numRamRemainingSlots'
                                                value={numRamRemainingSlots || actioningProduct.ram.split(',')[4]}
                                                onChange={(e) => {
                                                    const newNumRamRemainingSlots = e.target.value;
                                                    setNumRamRemainingSlots(newNumRamRemainingSlots);
                                                    const ramValues = [
                                                        ramCapacity || actioningProduct.ram.split(',')[0],
                                                        ramType || actioningProduct.ram.split(',')[1],
                                                        ramSpeed || actioningProduct.ram.split(',')[2],
                                                        numRamRemovableSlots || actioningProduct.ram.split(',')[3],
                                                        newNumRamRemainingSlots,
                                                        numRamOnBoard || actioningProduct.ram.split(',')[5],
                                                        maximumRAMSupport || actioningProduct.ram.split(',')[6]
                                                    ];
                                                    setRam(ramValues.join(','));
                                                    setRamCapacity(ramValues[0]);
                                                    setRamType(ramValues[1]);
                                                    setRamSpeed(ramValues[2]);
                                                    setNumRamRemovableSlots(ramValues[3]);
                                                    setNumRamOnBoard(ramValues[5]);
                                                    setMaximumRAMSupport(ramValues[6]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Số RAM onboard:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='numRamOnBoard'
                                                value={numRamOnBoard || actioningProduct.ram.split(',')[5]}
                                                onChange={(e) => {
                                                    const newNumRamOnBoard = e.target.value;
                                                    setNumRamOnBoard(newNumRamOnBoard);
                                                    const ramValues = [
                                                        ramCapacity || actioningProduct.ram.split(',')[0],
                                                        ramType || actioningProduct.ram.split(',')[1],
                                                        ramSpeed || actioningProduct.ram.split(',')[2],
                                                        numRamRemovableSlots || actioningProduct.ram.split(',')[3],
                                                        numRamRemainingSlots || actioningProduct.ram.split(',')[4],
                                                        newNumRamOnBoard,
                                                        maximumRAMSupport || actioningProduct.ram.split(',')[6]
                                                    ];
                                                    setRam(ramValues.join(','));
                                                    setRamCapacity(ramValues[0]);
                                                    setRamType(ramValues[1]);
                                                    setRamSpeed(ramValues[2]);
                                                    setNumRamRemovableSlots(ramValues[3]);
                                                    setNumRamRemainingSlots(ramValues[4]);
                                                    setMaximumRAMSupport(ramValues[6]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Hỗ trợ RAM tối đa:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='maximumRAMSupport'
                                                value={maximumRAMSupport || actioningProduct.ram.split(',')[6]}
                                                onChange={(e) => {
                                                    const newMaximumRAMSupport = e.target.value;
                                                    setMaximumRAMSupport(newMaximumRAMSupport);
                                                    const ramValues = [
                                                        ramCapacity || actioningProduct.ram.split(',')[0],
                                                        ramType || actioningProduct.ram.split(',')[1],
                                                        ramSpeed || actioningProduct.ram.split(',')[2],
                                                        numRamRemovableSlots || actioningProduct.ram.split(',')[3],
                                                        numRamRemainingSlots || actioningProduct.ram.split(',')[4],
                                                        numRamOnBoard || actioningProduct.ram.split(',')[5],
                                                        newMaximumRAMSupport
                                                    ];
                                                    setRam(ramValues.join(','));
                                                    setRamCapacity(ramValues[0]);
                                                    setRamType(ramValues[1]);
                                                    setRamSpeed(ramValues[2]);
                                                    setNumRamRemovableSlots(ramValues[3]);
                                                    setNumRamRemainingSlots(ramValues[4]);
                                                    setNumRamOnBoard(ramValues[5]);
                                                }}></Input>
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                            <Col span={isHiddenAutoCpl ? 12 : 24} className='text-start px-[15px] pr-0'>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Thương hiệu:</h3>
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
                                            setSelectedItems(e + 1);
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
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Danh mục:</h3>
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
                                            setCategoryIDSelected(e + 1);
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
                                </div>

                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Màn hình:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='screen'
                                        value={screen || actioningProduct.screen}
                                        onChange={(e) => {
                                            setScreen(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Webcam:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='webcam'
                                        value={webcam || actioningProduct.webcam}
                                        onChange={(e) => {
                                            setWebcam(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Kết nối:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='connection'
                                        value={connection || actioningProduct.connection}
                                        onChange={(e) => {
                                            setConnection(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Trọng lượng:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='prod_weight'
                                        value={prodWeight || actioningProduct.prod_weight}
                                        onChange={(e) => {
                                            setprodWeight(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Pin:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='pin'
                                        value={pin || actioningProduct.pin}
                                        onChange={(e) => {
                                            setPin(e.target.value)
                                        }}></Input>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Ổ cứng:</h3>
                                    <Tooltip
                                        placement='topRight'
                                        title={
                                            <div>
                                                <div>- Cách 1: Nhập theo thứ tự, các thuộc tính cách nhau bởi dấu ','</div>
                                                <div>  &ensp; Ví dụ: 	SSD, M.2 NVMe,512 GB,,</div>
                                                <div>- Cách 2: Nhập từng thuộc tính theo ô phía dưới</div>
                                            </div>
                                        }
                                    >
                                        <Input
                                            className='mb-2 mt-0'
                                            name='hard_drive'
                                            value={hardDrive || actioningProduct.hard_drive}
                                            onChange={(e) => {
                                                setHardDrive(e.target.value.split(','))
                                                setHardDriveType(e.target.value.split(',')[0])
                                                setSSDOrHDD(e.target.value.split(',')[1])
                                                setHardDriveCapatity(e.target.value.split(',')[2])
                                                setTotalSSDAndHDD(e.target.value.split(',')[3])
                                                setSSDAndHDDRemaining(e.target.value.split(',')[4])
                                            }}></Input>
                                    </Tooltip>
                                </div>
                                <ul>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Kiểu ổ cứng:</h3>
                                            <Input
                                                className=' mb-2 mt-0'
                                                name='hardDriveType'
                                                value={hardDriveType || actioningProduct.hard_drive.split(',')[0]}
                                                onChange={(e) => {
                                                    const newHardDriveType = e.target.value;
                                                    setHardDriveType(newHardDriveType);
                                                    const hardDriveValues = [
                                                        newHardDriveType,
                                                        SSDOrHDD || actioningProduct.hard_drive.split(',')[1],
                                                        hardDriveCapacity || actioningProduct.hard_drive.split(',')[2],
                                                        totalSSDAndHDD || actioningProduct.hard_drive.split(',')[3],
                                                        SSDAndHDDRemaining || actioningProduct.hard_drive.split(',')[4]
                                                    ];
                                                    setHardDrive(hardDriveValues.join(','));
                                                    setSSDOrHDD(hardDriveValues[1]);
                                                    setHardDriveCapatity(hardDriveValues[2]);
                                                    setTotalSSDAndHDD(hardDriveValues[3]);
                                                    setSSDAndHDDRemaining(hardDriveValues[4]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Loại ổ cứng:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='SSDOrHDD'
                                                value={SSDOrHDD || actioningProduct.hard_drive.split(',')[1]}
                                                onChange={(e) => {
                                                    const newSSDOrHDD = e.target.value;
                                                    setSSDOrHDD(newSSDOrHDD);
                                                    const hardDriveValues = [
                                                        hardDriveType || actioningProduct.hard_drive.split(',')[0],
                                                        newSSDOrHDD,
                                                        hardDriveCapacity || actioningProduct.hard_drive.split(',')[2],
                                                        totalSSDAndHDD || actioningProduct.hard_drive.split(',')[3],
                                                        SSDAndHDDRemaining || actioningProduct.hard_drive.split(',')[4]
                                                    ];
                                                    setHardDrive(hardDriveValues.join(','));
                                                    setHardDriveType(hardDriveValues[0]);
                                                    setHardDriveCapatity(hardDriveValues[2]);
                                                    setTotalSSDAndHDD(hardDriveValues[3]);
                                                    setSSDAndHDDRemaining(hardDriveValues[4]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Dung lượng:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='hardDriveCapacity'
                                                value={hardDriveCapacity || actioningProduct.hard_drive.split(',')[2]}
                                                onChange={(e) => {
                                                    const newHardDriveCapacity = e.target.value;
                                                    setHardDriveCapatity(newHardDriveCapacity);
                                                    const hardDriveValues = [
                                                        hardDriveType || actioningProduct.hard_drive.split(',')[0],
                                                        SSDOrHDD || actioningProduct.hard_drive.split(',')[1],
                                                        newHardDriveCapacity,
                                                        totalSSDAndHDD || actioningProduct.hard_drive.split(',')[3],
                                                        SSDAndHDDRemaining || actioningProduct.hard_drive.split(',')[4]
                                                    ];
                                                    setHardDrive(hardDriveValues.join(','));
                                                    setHardDriveType(hardDriveValues[0]);
                                                    setSSDOrHDD(hardDriveValues[1]);
                                                    setTotalSSDAndHDD(hardDriveValues[3]);
                                                    setSSDAndHDDRemaining(hardDriveValues[4]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Tổng số khe cắm SSD/HDD:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='totalSSDAndHDD'
                                                value={totalSSDAndHDD || actioningProduct.hard_drive.split(',')[3]}
                                                onChange={(e) => {
                                                    const newTotalSSDAndHDD = e.target.value;
                                                    setTotalSSDAndHDD(newTotalSSDAndHDD);
                                                    const hardDriveValues = [
                                                        hardDriveType || actioningProduct.hard_drive.split(',')[0],
                                                        SSDOrHDD || actioningProduct.hard_drive.split(',')[1],
                                                        hardDriveCapacity || actioningProduct.hard_drive.split(',')[2],
                                                        newTotalSSDAndHDD,
                                                        SSDAndHDDRemaining || actioningProduct.hard_drive.split(',')[4]
                                                    ];
                                                    setHardDrive(hardDriveValues.join(','));
                                                    setHardDriveType(hardDriveValues[0]);
                                                    setSSDOrHDD(hardDriveValues[1]);
                                                    setHardDriveCapatity(hardDriveValues[2]);
                                                    setSSDAndHDDRemaining(hardDriveValues[4]);
                                                }}></Input>
                                        </div>
                                    </li>
                                    <li className='pl-6'>
                                        <div className='flex'>
                                            <h3 className='w-2/3 my-auto'><span className='text-red-500'>* </span>Số khe SSD/HDD còn lại:</h3>
                                            <Input
                                                className='mb-2 mt-0'
                                                name='SSDAndHDDRemaining'
                                                value={SSDAndHDDRemaining || actioningProduct.hard_drive.split(',')[4]}
                                                onChange={(e) => {
                                                    const newSSDAndHDDRemaining = e.target.value;
                                                    setSSDAndHDDRemaining(newSSDAndHDDRemaining);
                                                    const hardDriveValues = [
                                                        hardDriveType || actioningProduct.hard_drive.split(',')[0],
                                                        SSDOrHDD || actioningProduct.hard_drive.split(',')[1],
                                                        hardDriveCapacity || actioningProduct.hard_drive.split(',')[2],
                                                        totalSSDAndHDD || actioningProduct.hard_drive.split(',')[3],
                                                        newSSDAndHDDRemaining
                                                    ];
                                                    setHardDrive(hardDriveValues.join(','));
                                                    setHardDriveType(hardDriveValues[0]);
                                                    setSSDOrHDD(hardDriveValues[1]);
                                                    setHardDriveCapatity(hardDriveValues[2]);
                                                    setTotalSSDAndHDD(hardDriveValues[3]);
                                                }}></Input>
                                        </div>
                                    </li>
                                </ul>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Card rời:</h3>
                                    <Tooltip
                                        placement='topRight'
                                        title={
                                            <div>
                                                <div>- Nhập loại card và bộ nhớ</div>
                                                <div>- Loại card và bộ nhớ cách nhau bởi dấu ','</div>
                                                <div>- Ví dụ: GeForce MX570, 2GB</div>
                                            </div>
                                        }
                                    >
                                        <Input
                                            className='mb-2 mt-0'
                                            name='graphics'
                                            value={graphics || actioningProduct.graphics}
                                            onChange={(e) => {
                                                setGraphics(e.target.value)
                                            }}></Input>
                                    </Tooltip>
                                </div>

                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Card tích hợp:</h3>
                                    <Tooltip
                                        placement='topRight'
                                        title={
                                            <div>
                                                <div>- Nhập loại card và bộ nhớ</div>
                                                <div>- Loại card và bộ nhớ cách nhau bởi dấu ','</div>
                                                <div>- Ví dụ: GeForce MX570, 2GB</div>
                                            </div>
                                        }
                                    >
                                        <Input
                                            className='mb-2 mt-0'
                                            name='on_board'
                                            value={onBoard || actioningProduct.on_board}
                                            onChange={(e) => {
                                                setOnBoard(e.target.value)
                                            }}></Input>
                                    </Tooltip>
                                </div>
                                <div className='flex'>
                                    <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Hệ điều hành:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='operation_system'
                                        value={operationSystem || actioningProduct.operation_system}
                                        onChange={(e) => {
                                            setOperationSystem(e.target.value)
                                        }}></Input>
                                </div>
                                <h3 className=''><span className='text-red-500'>* </span>Ảnh chi tiết:</h3>
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
                        <Row className='w-full pm-row'>
                            <JoditEditor
                                className='text-start'
                                value={detailedEvaluation || actioningProduct.detailed_evaluation}
                                tabIndex={1} // tabIndex of textarea
                                ref={editor}
                                onBlur={newContent => setDetailedEvaluation(newContent)} // preferred to use only this option to update the detailedEvaluation for performance reasons
                                onChange={newContent => {
                                    console.log(newContent);
                                }}
                            />
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