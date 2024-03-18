import { AddNewProduct, EditProduct, GetBrands, GetCategories, GetImages, GetProducts } from '../../../callAPI/api';
import React, { useState, useEffect, useContext } from 'react';
import {
    Input, Select, Image, Row, Col, Upload, Tooltip
} from 'antd';
import { PlusOutlined, } from '@ant-design/icons';
import './modalFPM.scss'
import Cookies from 'js-cookie';
import TextArea from 'antd/es/input/TextArea';
import Context from '../../../store/Context';


const ContentModalAddNewProduct = ({ isActioning, setIsActioning, setActioningProduct, actioningProduct, fileList, setFileList, brandDefault,
    categoryDefault, brands, categories, brandsSelect, categorySelect, setIsListProductsChanged }) => {
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
        formData.append('brand_id', selectedItems + 1);
        formData.append('category_id', categoryIDSelected + 1);
        formData.append('prod_name', productName);
        formData.append('prod_description', productDescription);
        formData.append('price', price);
        formData.append('cost', cost);
        formData.append('quantity', quantity);
        formData.append('prod_percent', productPercent);
        formData.append('cpu', cpu);
        formData.append('hard_drive', hardDrive);
        formData.append('ram', ram);
        formData.append('screen', screen);
        formData.append('webcam', webcam);
        formData.append('connection', connection);
        formData.append('prod_weight', prodWeight);
        formData.append('pin', pin);
        formData.append('operation_system', operationSystem);
        formData.append('graphics', graphics);
        formData.append('on_board', onBoard);
        formData.append('avatar', avatar);
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

        AddNewProduct(formData).then(response => {
            // console.log(response);
            if (response.success) {
                setIsActioning(false);
                context.Message("success", "Cập nhật sản phẩm thành công.")
                setIsListProductsChanged(true)
            }
        })
    };

    return (
        <div className='wrap-modal-fpm w-full'>

            <div
                className='fpm-wrap-input-file h-[450px] cursor-pointer border-dashed border-2
                relative overflow-hidden'
                onClick={() => {
                    let fpmInputFile = document.querySelector(".fpm-input-file")
                    fpmInputFile.click()
                }}
            >
                <div className='text-add-img absolute text-xl font-bold flex
                flex-col top-[40%] ' >
                    <PlusOutlined className='mb-3'></PlusOutlined>
                    Click để thêm ảnh đại diện cho sản phẩm
                </div>
                <img
                    id='image-preview'
                    className='avatar-modal-view max-w-[450px] object-contain hidden hide-image'
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
                            document.querySelector('.avatar-modal-view').style.setProperty('display', 'block', 'important');
                            document.querySelector('.text-add-img').style.setProperty('display', 'none', 'important')
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }} />
            </div>

            <div>
                <form
                    // action='http://localhost:8000/editproduct'
                    onSubmit={onFinish}
                    method="post"
                    encType="multipart/form-data"
                    className='text-end'
                >
                    {/* <Form.Item className='flex-1 mr-2'> */}

                    <Row className='mt-[15px]'>
                        <Col span={isHiddenAutoCpl ? 12 : 24}
                            className='text-start px-[15px] pl-0'>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Tên sản phẩm:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='prod_name'

                                    onChange={(e) => {
                                        setProductName(e.target.value)
                                        // console.log(productName)
                                    }}
                                    value={productName}
                                />
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Miêu tả:</h3>
                                <TextArea
                                    className='mb-2 mt-0'
                                    name='prod_description'
                                    style={{ height: 88 }}
                                    onChange={(e) => {
                                        setProductDescription(e.target.value)
                                        // console.log(productName)
                                    }}
                                    value={productDescription}
                                ></TextArea>
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
                                        value={cpu}
                                        onChange={(e) => {
                                            setCPU(e.target.value)
                                            setCPUBrand(e.target.value.split(',')[0])
                                            setCPUTech(e.target.value.split(',')[1])
                                            setCPUType(e.target.value.split(',')[2])
                                            setCPUSpeed(e.target.value.split(',')[3])
                                            setCPUMaxSpeed(e.target.value.split(',')[4])
                                            setCPUCoreNumber(e.target.value.split(',')[5])
                                            setCPUThreadNumber(e.target.value.split(',')[6])
                                            setCPUCache(e.target.value.split(',')[7])
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
                                            value={cpuBrand}
                                            onChange={(e) => {
                                                const newCPUBrand = e.target.value;
                                                setCPUBrand(newCPUBrand);
                                                const cpuValues = [
                                                    newCPUBrand,
                                                    cpuTech,
                                                    cpuType,
                                                    cpuSpeed,
                                                    cpuMaxSpeed,
                                                    cpuCoreNumber,
                                                    cpuThreadNumber,
                                                    cpuCache
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
                                            value={cpuTech}
                                            onChange={(e) => {
                                                const newCPUTech = e.target.value;
                                                setCPUTech(newCPUTech);
                                                const cpuValues = [
                                                    cpuBrand,
                                                    newCPUTech,
                                                    cpuType,
                                                    cpuSpeed,
                                                    cpuMaxSpeed,
                                                    cpuCoreNumber,
                                                    cpuThreadNumber,
                                                    cpuCache
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
                                            value={cpuType}
                                            onChange={(e) => {
                                                const newCPUType = e.target.value;
                                                setCPUType(newCPUType);
                                                const cpuValues = [
                                                    cpuBrand,
                                                    cpuTech,
                                                    newCPUType,
                                                    cpuSpeed,
                                                    cpuMaxSpeed,
                                                    cpuCoreNumber,
                                                    cpuThreadNumber,
                                                    cpuCache
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
                                            value={cpuSpeed}
                                            onChange={(e) => {
                                                const newCPUSpeed = e.target.value;
                                                setCPUSpeed(newCPUSpeed);
                                                const cpuValues = [
                                                    cpuBrand,
                                                    cpuTech,
                                                    cpuType,
                                                    newCPUSpeed,
                                                    cpuMaxSpeed,
                                                    cpuCoreNumber,
                                                    cpuThreadNumber,
                                                    cpuCache
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
                                            value={cpuMaxSpeed}
                                            onChange={(e) => {
                                                const newCPUMaxSpeed = e.target.value;
                                                setCPUMaxSpeed(newCPUMaxSpeed);
                                                const cpuValues = [
                                                    cpuBrand,
                                                    cpuTech,
                                                    cpuType,
                                                    cpuSpeed,
                                                    newCPUMaxSpeed,
                                                    cpuCoreNumber,
                                                    cpuThreadNumber,
                                                    cpuCache
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
                                            value={cpuCoreNumber}
                                            onChange={(e) => {
                                                const newCPUCoreNumber = e.target.value;
                                                setCPUCoreNumber(newCPUCoreNumber);
                                                const cpuValues = [
                                                    cpuBrand,
                                                    cpuTech,
                                                    cpuType,
                                                    cpuSpeed,
                                                    cpuMaxSpeed,
                                                    newCPUCoreNumber,
                                                    cpuThreadNumber,
                                                    cpuCache
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
                                            value={cpuThreadNumber}
                                            onChange={(e) => {
                                                const newCPUThreadNumber = e.target.value;
                                                setCPUThreadNumber(newCPUThreadNumber);
                                                const cpuValues = [
                                                    cpuBrand,
                                                    cpuTech,
                                                    cpuType,
                                                    cpuSpeed,
                                                    cpuMaxSpeed,
                                                    cpuCoreNumber,
                                                    newCPUThreadNumber,
                                                    cpuCache
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
                                            value={cpuCache}
                                            onChange={(e) => {
                                                const newCPUCache = e.target.value;
                                                setCPUCache(newCPUCache);
                                                const cpuValues = [
                                                    cpuBrand,
                                                    cpuTech,
                                                    cpuType,
                                                    cpuSpeed,
                                                    cpuMaxSpeed,
                                                    cpuCoreNumber,
                                                    cpuThreadNumber,
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
                                        value={ram}
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
                                            value={ramCapacity}
                                            onChange={(e) => {
                                                const newRamCapacity = e.target.value;
                                                setRamCapacity(newRamCapacity);
                                                const ramValues = [
                                                    newRamCapacity,
                                                    ramType,
                                                    ramSpeed,
                                                    numRamRemovableSlots,
                                                    numRamRemainingSlots,
                                                    numRamOnBoard,
                                                    maximumRAMSupport
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
                                            value={ramType}
                                            onChange={(e) => {
                                                const newRamType = e.target.value;
                                                setRamType(newRamType);
                                                const ramValues = [
                                                    ramCapacity,
                                                    newRamType,
                                                    ramSpeed,
                                                    numRamRemovableSlots,
                                                    numRamRemainingSlots,
                                                    numRamOnBoard,
                                                    maximumRAMSupport
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
                                            value={ramSpeed}
                                            onChange={(e) => {
                                                const newRamSpeed = e.target.value;
                                                setRamSpeed(newRamSpeed);
                                                const ramValues = [
                                                    ramCapacity,
                                                    ramType,
                                                    newRamSpeed,
                                                    numRamRemovableSlots,
                                                    numRamRemainingSlots,
                                                    numRamOnBoard,
                                                    maximumRAMSupport
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
                                            value={numRamRemovableSlots}
                                            onChange={(e) => {
                                                const newNumRamRemovableSlots = e.target.value;
                                                setNumRamRemovableSlots(newNumRamRemovableSlots);
                                                const ramValues = [
                                                    ramCapacity,
                                                    ramType,
                                                    ramSpeed,
                                                    newNumRamRemovableSlots,
                                                    numRamRemainingSlots,
                                                    numRamOnBoard,
                                                    maximumRAMSupport
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
                                            value={numRamRemainingSlots}
                                            onChange={(e) => {
                                                const newNumRamRemainingSlots = e.target.value;
                                                setNumRamRemainingSlots(newNumRamRemainingSlots);
                                                const ramValues = [
                                                    ramCapacity,
                                                    ramType,
                                                    ramSpeed,
                                                    numRamRemovableSlots,
                                                    newNumRamRemainingSlots,
                                                    numRamOnBoard,
                                                    maximumRAMSupport
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
                                            value={numRamOnBoard}
                                            onChange={(e) => {
                                                const newNumRamOnBoard = e.target.value;
                                                setNumRamOnBoard(newNumRamOnBoard);
                                                const ramValues = [
                                                    ramCapacity,
                                                    ramType,
                                                    ramSpeed,
                                                    numRamRemovableSlots,
                                                    numRamRemainingSlots,
                                                    newNumRamOnBoard,
                                                    maximumRAMSupport
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
                                            value={maximumRAMSupport}
                                            onChange={(e) => {
                                                const newMaximumRAMSupport = e.target.value;
                                                setMaximumRAMSupport(newMaximumRAMSupport);
                                                const ramValues = [
                                                    ramCapacity,
                                                    ramType,
                                                    ramSpeed,
                                                    numRamRemovableSlots,
                                                    numRamRemainingSlots,
                                                    numRamOnBoard,
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
                                    value={brandSelected}
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
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Danh mục:</h3>
                                <Select
                                    // mode="multiple"
                                    className='mb-2 mt-0'
                                    name='category_id'
                                    value={categorySelected}
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
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Giá bán:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='price'
                                    value={price}
                                    onChange={(e) => {
                                        setPrice(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Giá chính hãng:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='cost'
                                    value={cost}
                                    onChange={(e) => {
                                        setCost(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Số lượng còn lại:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='quantity'
                                    value={quantity}
                                    onChange={(e) => {
                                        setQuantity(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Phần trăm giảm giá:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='prod_percent'
                                    value={productPercent}
                                    onChange={(e) => {
                                        setProductPercent(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Màn hình:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='screen'
                                    value={screen}
                                    onChange={(e) => {
                                        setScreen(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Webcam:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='webcam'
                                    value={webcam}
                                    onChange={(e) => {
                                        setWebcam(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Kết nối:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='connection'
                                    value={connection}
                                    onChange={(e) => {
                                        setConnection(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Trọng lượng:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='prod_weight'
                                    value={prodWeight}
                                    onChange={(e) => {
                                        setprodWeight(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Pin:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='pin'
                                    value={pin}
                                    onChange={(e) => {
                                        setPin(e.target.value)
                                    }}></Input>
                            </div>
                            <div className='flex'>
                                <h3 className='w-1/3 my-auto'><span className='text-red-500'>* </span>Hệ điều hành:</h3>
                                <Input
                                    className='mb-2 mt-0'
                                    name='operation_system'
                                    value={operationSystem}
                                    onChange={(e) => {
                                        setOperationSystem(e.target.value)
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
                                        value={hardDrive}
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
                                            value={hardDriveType}
                                            onChange={(e) => {
                                                const newHardDriveType = e.target.value;
                                                setHardDriveType(newHardDriveType);
                                                const hardDriveValues = [
                                                    newHardDriveType,
                                                    SSDOrHDD,
                                                    hardDriveCapacity,
                                                    totalSSDAndHDD,
                                                    SSDAndHDDRemaining
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
                                            value={SSDOrHDD}
                                            onChange={(e) => {
                                                const newSSDOrHDD = e.target.value;
                                                setSSDOrHDD(newSSDOrHDD);
                                                const hardDriveValues = [
                                                    hardDriveType,
                                                    newSSDOrHDD,
                                                    hardDriveCapacity,
                                                    totalSSDAndHDD,
                                                    SSDAndHDDRemaining
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
                                            value={hardDriveCapacity}
                                            onChange={(e) => {
                                                const newHardDriveCapacity = e.target.value;
                                                setHardDriveCapatity(newHardDriveCapacity);
                                                const hardDriveValues = [
                                                    hardDriveType,
                                                    SSDOrHDD,
                                                    newHardDriveCapacity,
                                                    totalSSDAndHDD,
                                                    SSDAndHDDRemaining
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
                                            value={totalSSDAndHDD}
                                            onChange={(e) => {
                                                const newTotalSSDAndHDD = e.target.value;
                                                setTotalSSDAndHDD(newTotalSSDAndHDD);
                                                const hardDriveValues = [
                                                    hardDriveType,
                                                    SSDOrHDD,
                                                    hardDriveCapacity,
                                                    newTotalSSDAndHDD,
                                                    SSDAndHDDRemaining
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
                                            value={SSDAndHDDRemaining}
                                            onChange={(e) => {
                                                const newSSDAndHDDRemaining = e.target.value;
                                                setSSDAndHDDRemaining(newSSDAndHDDRemaining);
                                                const hardDriveValues = [
                                                    hardDriveType,
                                                    SSDOrHDD,
                                                    hardDriveCapacity,
                                                    totalSSDAndHDD,
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
                                        value={graphics}
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
                                        value={onBoard}
                                        onChange={(e) => {
                                            setOnBoard(e.target.value)
                                        }}></Input>
                                </Tooltip>
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

                    <div className='inline-block'>
                        <Input type='submit' defaultValue={"Thêm sản phẩm"}
                            className='bg-[#c8191f] text-white'>
                        </Input>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default ContentModalAddNewProduct