import React, { useState, useEffect, useContext } from 'react';
import { HomeOutlined, LaptopOutlined, InboxOutlined, PlusOutlined, } from '@ant-design/icons';
import {
    Breadcrumb, Input, Button, Table, Modal
} from 'antd';
import AdminHome from './adminHome';
import './productManagement.scss'
import { DeleteProduct, GetBrands, GetCategories, GetImages, GetProducts } from '../../callAPI/api';
import ModalProductManager from '../../component/management/ModalProductManager';
import Cookies from 'js-cookie';
import Context from '../../store/Context';

const ProductManagement = () => {
    let token = Cookies.get('token')
    const context = useContext(Context)
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isOpenedModalAddNew, setIsOpenedModalAddNew] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [brandsSelect, setBrandsSelect] = useState([])
    const [brandDefault, setBrandDefault] = useState('')
    const [categorySelect, setCategorySelect] = useState([])
    const [categoryDefault, setCategoryDefault] = useState('')
    const [fileList, setFileList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [isListProductsChanged, setIsListProductsChanged] = useState(false);
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
                    p-1 px-2'
                        onClick={(e) => {
                            // console.log(record)
                            viewDetailsProduct(record)
                        }}>
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
                    p-1 px-2 mt-2'
                        onClick={(e) => {
                            // console.log(record);
                            setProductIdToDelete(record.id)
                            setShowDeleteConfirmation(true)
                        }}>
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

    }, [isEditing, searchText, isListProductsChanged]);

    useEffect(() => {
        filterProducts();
    }, [searchText, products]);

    const getProducts = () => {
        GetProducts().then((data) => {
            setProducts(data)
        })
    };
    const getBrands = () => {
        GetBrands().then(response => {
            // console.log(response.data.map((brand) => {
            //     return brand.name
            // }, []));
            setBrands(response);

            setBrandsSelect(response.map((brand) => {
                return brand.name
            }, []))
        })
    }

    const getCategories = () => {
        GetCategories().then(response => {
            // console.log("categories: \n", response.data);
            setCategories(response);
            setCategorySelect(response.map((category) => {
                return category.name
            }, []))
        })
    }

    const getImages = () => {
        GetImages().then(response => {
            setImages(response);
        })
    }

    const updateProduct = (product) => {
        setIsEditing(true)
        setEditingProduct(product)
        const getBrand = brands.find((brand) => {
            return brand.brand_id === product.brand_id

        });
        setBrandDefault(getBrand.name)

        const getImages = images.filter((img) => {
            // console.log(img.product_id)
            return img.product_id === product.id

        });
        // console.log(product.id)
        // console.log(getImages)
        setFileList(getImages)

        const getCategory = categories.find((category) => {
            return category.category_id === product.category_id

        });
        setCategoryDefault(getCategory.name)
        // console.log(brandDefault);
        // setFormKey(formKey + 1);
    }

    const viewDetailsProduct = (product) => {
        setIsViewing(true)
        setEditingProduct(product)
        const getBrand = brands.find((brand) => {
            return brand.brand_id === product.brand_id

        });
        setBrandDefault(getBrand.name)

        const getImages = images.filter((img) => {
            // console.log(img.product_id)
            return img.product_id === product.id

        });
        // console.log(product.id)
        // console.log(getImages)
        setFileList(getImages)

        const getCategory = categories.find((category) => {
            return category.category_id === product.category_id

        });
        setCategoryDefault(getCategory.name)
    }

    const addNewProduct = () => {
        setIsOpenedModalAddNew(true)
    }

    const handleDeleteProduct = (productId) => {

        const requestData = {
            token: token,
            product_id: productId,
        };

        DeleteProduct(requestData).then(response => {
            if (response.success) {
                setIsListProductsChanged(!isListProductsChanged)
                context.Message("success", "Xóa sản phẩm thành công.")

            }
        })
    }

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
        <div className='flex-1'>
            {/* <AdminHome></AdminHome> */}
            <Modal
                title="Xác nhận xóa sản phẩm"
                open={showDeleteConfirmation}
                onOk={() => {
                    handleDeleteProduct(productIdToDelete); // Gọi hàm xóa sau khi xác nhận
                    setShowDeleteConfirmation(false); // Đóng modal
                }}
                onCancel={() => setShowDeleteConfirmation(false)} // Đóng modal khi bấm hủy
                className='model-cart'
            >
                <p>Bạn có chắc chắn muốn xóa sản phẩm khỏi cửa hàng?</p>
            </Modal>
            <div className='bg-[#f0f0f0] p-3'>
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
                    <Button
                        className='btn-add-prd bg-[#c8191f] text-white 
                    h-auto'
                        onClick={() => { addNewProduct() }}
                    >
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
            {isEditing &&
                <ModalProductManager
                    title={'Chỉnh sửa sản phẩm - ' + editingProduct.prod_name}
                    isActioning={isEditing}
                    width={1200}
                    setIsActioning={setIsEditing}
                    setActioningProduct={setEditingProduct}
                    searchText={searchText}
                    actioningProduct={editingProduct}
                    fileList={fileList}
                    setFileList={setFileList}
                    brands={brands}
                    categories={categories}
                    brandDefault={brandDefault}
                    categoryDefault={categoryDefault}
                    brandsSelect={brandsSelect}
                    categorySelect={categorySelect}
                ></ModalProductManager>
            }
            {isViewing &&
                <ModalProductManager
                    title={'Xem chi tiết sản phẩm - ' + editingProduct.prod_name}
                    isActioning={isViewing}
                    width={800}
                    setIsActioning={setIsViewing}
                    setActioningProduct={setEditingProduct}
                    actioningProduct={editingProduct}
                    fileList={fileList}
                    setFileList={setFileList}
                    brandDefault={brandDefault}
                    categoryDefault={categoryDefault}
                ></ModalProductManager>
            }
            {isOpenedModalAddNew &&
                <ModalProductManager
                    title={'Thêm sản phẩm mới'}
                    isActioning={isOpenedModalAddNew}
                    width={1200}
                    setIsActioning={setIsOpenedModalAddNew}
                    brands={brands}
                    categories={categories}
                    brandsSelect={brandsSelect}
                    categorySelect={categorySelect}
                    fileList={fileList}
                    setFileList={setFileList}
                ></ModalProductManager>
            }

        </div >

    );
};
export default ProductManagement;