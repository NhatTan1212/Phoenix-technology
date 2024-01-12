import React, { useState, useEffect, useContext } from 'react';
import { HomeOutlined, LaptopOutlined, InboxOutlined, PlusOutlined, } from '@ant-design/icons';
import {
    Breadcrumb, Input, Button, Table
} from 'antd';
import AdminHome from './adminHome';
import './productManagement.scss'
import { GetBrands, GetCategories, GetImages, GetProducts } from '../../callAPI/api';
import ModalProductManager from '../../component/management/ModalProductManager';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [brandsSelect, setBrandsSelect] = useState([])
    const [brandDefault, setBrandDefault] = useState('')
    const [categorySelect, setCategorySelect] = useState([])
    const [categoryDefault, setCategoryDefault] = useState('')
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

    const viewDetailsProduct = (product) => {
        setIsViewing(true)
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
            {editingProduct &&
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
                ></ModalProductManager>
            }
            {editingProduct &&
                <ModalProductManager
                    title={'Xem chi tiết sản phẩm - ' + editingProduct.prod_name}
                    isActioning={isViewing}
                    width={800}
                    setIsActioning={setIsViewing}
                    actioningProduct={editingProduct}
                    fileList={fileList}
                    brandDefault={brandDefault}
                    categoryDefault={categoryDefault}
                ></ModalProductManager>
            }

        </div >

    );
};
export default ProductManagement;