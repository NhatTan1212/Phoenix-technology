import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HomeOutlined, LaptopOutlined, InboxOutlined, PlusOutlined, } from '@ant-design/icons';
import {
    Breadcrumb, Space, Input, Button, Table, Modal,
    Form, Select, Image, Row, Col, Upload
} from 'antd';
import AdminHome from './adminHome';
import './productManagement.scss'
import axios, { AxiosHeaders } from 'axios';
import { text } from '@fortawesome/fontawesome-svg-core';
import Cookies from 'js-cookie';
import TextArea from 'antd/es/input/TextArea';
import Context from '../../store/Context';
import { GetProducts } from '../../callAPI/api';

const ProductManagement = () => {
    let token = Cookies.get('token')

    const context = useContext(Context)
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productName, setProductName] = useState('')
    const [price, setPrice] = useState('')
    const [cost, setCost] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [quantity, setQuantity] = useState('')
    const [productPercent, setProductPercent] = useState('')
    const [cpu, setCPU] = useState('')
    const [hardDrive, setHardDrive] = useState('')
    const [muxSwitch, setMuxSwitch] = useState('')
    const [screen, setScreen] = useState('')
    const [connection, setConnection] = useState('')
    const [prodWeight, setprodWeight] = useState('')
    const [webcam, setWebcam] = useState('')
    const [operationSystem, setOperationSystem] = useState('')
    const [pin, setPin] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [formKey, setFormKey] = useState(0);
    const [selectedItems, setSelectedItems] = useState('');
    const [brandsSelect, setBrandsSelect] = useState([])
    const [brandDefault, setBrandDefault] = useState('')
    const [brandSelected, setBrandSelected] = useState('')
    const [categoryIDSelected, setCategoryIDSelected] = useState('');
    const [categorySelect, setCategorySelect] = useState([])
    const [categoryDefault, setCategoryDefault] = useState('')
    const [categorySelected, setCategorySelected] = useState('')
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (record1, record2) => { return record1.id - record2.id }
        },
        {
            title: 'Brand',
            dataIndex: 'brand_id',
            render: (dataIndex) => {
                const brand = brands.find(brand => brand.brand_id === dataIndex);
                return (brand && <img src={brand.image} className='max-h-[30px]'
                    alt="Brand Logo" />)
            },
            filters: brands.map((brand) => {
                return {
                    text: brand.name,
                    value: brand.brand_id
                }
            }),
            onFilter: (value, record) => {
                return record.brand_id === value;
            }
            // defaultFiltered
        },
        {
            title: 'Category',
            dataIndex: 'category_id',
            render: (dataIndex) => {
                const category = categories.find(category => category.category_id === dataIndex);
                // console.log(category)
                return (category && <span>{category.name}</span>)
            },
            filters: categories.map((category) => {
                return {
                    text: category.name,
                    value: category.category_id
                }
            }),
            onFilter: (value, record) => {
                return record.category_id === value;
            }
        },

        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render: (dataIndex) => {
                return <img src={dataIndex} className='max-h-[80px]'></img>
            }
        },
        {
            title: 'Name',
            dataIndex: 'prod_name'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (record1, record2) => { return record1.price - record2.price }
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            sorter: (record1, record2) => { return record1.cost - record2.cost }
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            sorter: (record1, record2) => { return record1.quantity - record2.quantity }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => {
                return (<div className='flex flex-col h-auto'>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2'>
                        Xem chi tiết
                    </button>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2'
                        onClick={(e) => {
                            // console.log(record)
                            updateProduct(record)
                        }}>
                        Chỉnh sửa
                    </button>
                    <button className=' bg-[#c8191f] text-white text-center
                    hover:text-white hover:shadow-[0_0_6px_0_#333] rounded-[30px] 
                    p-1 px-2 mt-2'>
                        Xóa
                    </button>
                </div>)
            }
        },
    ];

    useEffect(() => {
        // Hàm này chạy khi component được mount
        getProducts();
        getImages();
        getBrands();
        getCategories();

    }, [isEditing, searchText]);

    useEffect(() => {
        filterProducts();
    }, [searchText, products]);

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const getProducts = () => {
        GetProducts().then((data) => {
            setProducts(data)
        })
    };
    const getBrands = () => {
        axios.get('https://phoenixlt.azurewebsites.net/brands-list')
            .then(response => {
                // console.log(response.data.map((brand) => {
                //     return brand.name
                // }, []));
                setBrands(response.data);

                setBrandsSelect(response.data.map((brand) => {
                    return brand.name
                }, []))
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
    }

    const getCategories = () => {
        axios.get('https://phoenixlt.azurewebsites.net/categories-list')
            .then(response => {
                // console.log("categories: \n", response.data);
                setCategories(response.data);
                setCategorySelect(response.data.map((category) => {
                    return category.name
                }, []))
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
    }

    const getImages = () => {
        axios.get('https://phoenixlt.azurewebsites.net/list-image')
            .then(response => {
                // console.log("images: \n", response.data);
                setImages(response.data);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
    }

    const updateProduct = (product) => {
        setIsEditing(true)
        setEditingProduct(product)
        const getBrand = brands.find((brand) => {
            return brand.brand_id === product.brand_id

        });
        setBrandDefault(getBrand.name)

        const getImages = images.filter((img) => {
            console.log(img.product_id)
            return img.product_id === product.id

        });
        console.log(product.id)
        console.log(getImages)
        setFileList(getImages)

        const getCategory = categories.find((category) => {
            return category.category_id === product.category_id

        });
        setCategoryDefault(getCategory.name)
        // console.log(brandDefault);
        // setFormKey(formKey + 1);
    }

    const getFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
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
        console.log(newFileList)
        // console.log("flp", fileListPost)
        console.log({ fileList: newFileList })
        setFileList(newFileList)
    };

    const onFinish = (values) => {
        // if (avatar === '') 
        values.preventDefault();
        const formData = new FormData();
        formData.append('token', token);
        formData.append('IDProduct', editingProduct.id);
        formData.append('brand_id', selectedItems + 1);
        formData.append('category_id', categoryIDSelected + 1);
        formData.append('prod_name', productName || editingProduct.prod_name);
        formData.append('prod_description', productDescription || editingProduct.prod_description);
        formData.append('price', price || editingProduct.price);
        formData.append('cost', cost || editingProduct.cost);
        formData.append('quantity', quantity || editingProduct.quantity);
        formData.append('prod_percent', productPercent || editingProduct.prod_percent);
        formData.append('cpu', cpu || editingProduct.cpu);
        formData.append('hard_drive', hardDrive || editingProduct.hard_drive);
        formData.append('screen', screen || editingProduct.screen);
        formData.append('webcam', webcam || editingProduct.webcam);
        formData.append('connection', connection || editingProduct.connection);
        formData.append('prod_weight', prodWeight || editingProduct.prod_weight);
        formData.append('pin', pin || editingProduct.pin);
        formData.append('operation_system', operationSystem || editingProduct.operation_system);
        formData.append('avatar', avatar || editingProduct.avatar);
        // formData.append('images', fileList);
        fileList.forEach(image => {
            if (image.originFileObj) {
                formData.append('images', image.originFileObj);
            }
            else {
                console.log(image)
                formData.append('images', image.url);
                formData.append('image_id', image.image_id);

            }
        });
        console.log(formData.get('images'))


        // console.log(price)
        // Gửi formData tới server bằng axios
        axios.post('http://localhost:8000/editproduct', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
            // headers: {
            //     ...formData.getHeaders(),
            // }
        })
            .then(response => {
                console.log(response);
                if (response.data.success) {
                    setIsEditing(false);
                    setEditingProduct(null);
                    context.Message("success", "Cập nhật sản phẩm thành công.")

                }
            })
            .catch(error => {
                // Xử lý lỗi ở đây
                context.Message("error", "Đã có lỗi xảy ra khi cập nhật sản phẩm.")
                console.error('Error fetching data:', error);
            });
    };

    const handleChangeInputSearch = (e) => {
        setSearchText(e.target.value)

    }

    const filterProducts = () => {
        const filteredProducts = products.filter((product) => {
            const productName = product.prod_name.toLowerCase();
            const productId = product.id + '';
            return productName.includes(searchText.toLowerCase()) || productId === searchText;
        });
        setFilteredProducts(filteredProducts);
    }


    return (
        <div className='flex'>
            <AdminHome></AdminHome>
            <div className='bg-[#f0f0f0] flex-1 p-3'>
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <span className='flex items-center'>
                                <HomeOutlined />
                            </span>,
                        },
                        {
                            title: <span className='flex items-center'>
                                <LaptopOutlined className='mr-2' /> Product Management
                            </span>,
                        },
                    ]}
                />
                <div className='flex justify-between bg-white items-center p-4'>

                    <Input.Search
                        allowClear
                        className='searchPM'
                        placeholder='Nhập tên sản phẩm, từ khóa cần tìm kiếm,...'
                        onChange={(e) => { handleChangeInputSearch(e) }}
                        onSearch={(e) => { console.log('hi') }}
                        onPressEnter={(e) => { console.log('hi') }}
                        style={{ width: '20%' }}></Input.Search>
                    <Button className='btn-add-prd bg-[#c8191f] text-white 
                    h-auto'>
                        <span className='font-bold text-[18px] mr-2'>
                            +
                        </span>
                        <span>
                            Thêm sản phẩm
                        </span>
                    </Button>
                </div>
                <div className='flex flex-col bg-white p-4
                mt-[20px]'>
                    <h3>Quản lý sản phẩm</h3>
                    <Table
                        className='table-product-management'
                        columns={columns}
                        dataSource={filteredProducts.map((product) => ({
                            ...product,
                            key: product.id
                        }))}>
                    </Table>
                </div>
            </div>
            <Modal
                // className='text-s'
                title='Chỉnh sửa sản phẩm'
                open={isEditing === true}
                width={1200}
                onOk={() => {
                    // Handle save logic here
                    setIsEditing(false);
                    setEditingProduct(null); // Clear the editingProduct when closing the modal
                }}
                onCancel={() => {
                    setIsEditing(false);
                    setEditingProduct(null); // Clear the editingProduct when closing the modal
                }}
                // onOk={() => setIsEditing(false)}
                // onCancel={() => setIsEditing(false)}
                footer={null}
            >
                {/* {editingProduct &&
                    <Image width={150} src={editingProduct.avatar}
                    ></Image>
                } */}
                {editingProduct &&
                    <img
                        width={150}
                        id='image-preview'
                        src={editingProduct.avatar}></img>
                }
                {/* Render your edit form or content here */}
                {editingProduct &&
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
                                value={editingProduct.id} />
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
                                        value={productName || editingProduct.prod_name}
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
                                        value={productDescription || editingProduct.prod_description}
                                    ></TextArea>
                                    <h3><span className='text-red-500'>* </span>Giá bán:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='price'
                                        value={price || editingProduct.price}
                                        onChange={(e) => {
                                            setPrice(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Giá chính hãng:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='cost'
                                        value={cost || editingProduct.cost}
                                        onChange={(e) => {
                                            setCost(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Số lượng còn lại:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='quantity'
                                        value={quantity || editingProduct.quantity}
                                        onChange={(e) => {
                                            setQuantity(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Phần trăm giảm giá:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='prod_percent'
                                        value={productPercent || editingProduct.prod_percent}
                                        onChange={(e) => {
                                            setProductPercent(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>CPU:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='cpu'
                                        value={cpu || editingProduct.cpu}
                                        onChange={(e) => {
                                            setCPU(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Ổ cứng:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='hard_drive'
                                        value={hardDrive || editingProduct.hard_drive}
                                        onChange={(e) => {
                                            setHardDrive(e.target.value)
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
                                                // console.log(editingProduct)
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
                                                // console.log(editingProduct)
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
                                        value={screen || editingProduct.screen}
                                        onChange={(e) => {
                                            setScreen(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Webcam:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='webcam'
                                        value={webcam || editingProduct.webcam}
                                        onChange={(e) => {
                                            setWebcam(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Kết nối:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='connection'
                                        value={connection || editingProduct.connection}
                                        onChange={(e) => {
                                            setConnection(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Trọng lượng:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='prod_weight'
                                        value={prodWeight || editingProduct.prod_weight}
                                        onChange={(e) => {
                                            setprodWeight(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Pin:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='pin'
                                        value={pin || editingProduct.pin}
                                        onChange={(e) => {
                                            setPin(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Hệ điều hành:</h3>
                                    <Input
                                        className='mb-2 mt-0'
                                        name='operation_system'
                                        value={operationSystem || editingProduct.operation_system}
                                        onChange={(e) => {
                                            setOperationSystem(e.target.value)
                                        }}></Input>
                                    <h3><span className='text-red-500'>* </span>Ảnh đại diện:</h3>
                                    <Input
                                        className='mb-2 mt-0' type="file" name="avatar"
                                        onChange={(e) => {
                                            console.log(e.target.files[0])
                                            setAvatar(e.target.files[0])
                                            // Update the image preview here
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                // Set the preview image source
                                                document.getElementById('image-preview').src = event.target.result;
                                            };
                                            reader.readAsDataURL(e.target.files[0]);
                                        }} />
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
                                <Input type='submit' defaultValue={"Save"}>
                                </Input>
                            </div>
                            {/* <Form.Item type='file' name='avatar' getValueFromEvent={getFile}> */}
                            {/* <Upload.Dragger
                                        name="avatar"
                                        maxCount={1}
                                        listType="picture"
                                        fileList={fileList}

                                        beforeUpload={() => false}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                                    </Upload.Dragger> */}

                            {/* </Form.Item> */}
                        </form>
                    </div>
                }

            </Modal>
        </div >

    );
};
export default ProductManagement;