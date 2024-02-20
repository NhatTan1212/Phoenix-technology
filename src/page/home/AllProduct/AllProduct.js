import React, { useState, useEffect } from 'react';
import { HomeOutlined, LaptopOutlined } from '@ant-design/icons';
import { Breadcrumb, Row, Col, Checkbox, List, Card } from 'antd';
import './AllProduct.scss';
import { useParams, Link, useNavigate, redirect } from 'react-router-dom';
import { GetBrands, GetProductsByQuery, GetCategories } from '../../../callAPI/api';
import renderListProduct from '../../../component/ListProducts';
import CheckBoxGroup from '../../../component/CheckBoxGroup'

const CheckboxGroup = Checkbox.Group;
function AllProduct() {
    let navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [nameBrands, setNameBrands] = useState([]);
    const [brandSlugs, setBrandSlugs] = useState([]);
    const [nameCategories, setNameCategories] = useState([]);
    const [checkedListBrands, setCheckedListBrands] = useState([]);
    const [checkedListCategories, setCheckedListCategories] = useState([]);
    const { query } = useParams(); // Lấy tham số từ URL
    const [isCheckedAllBrands, setIsCheckedAllBrands] = useState(false)
    const [isCheckedAllCategories, setIsCheckedAllCategories] = useState(false)
    const [sortStatus, setSortStatus] = useState(null)



    useEffect(() => {
        getBrands();
        getCategories();
        getProductsByQuery();
        getSortSelected();
        setCheckBoxSelected();
        console.log(query);
    }, [query]);
    const setCheckBoxSelected = () => {
        if (query === 'allproduct') {
            setIsCheckedAllBrands(true)
            setIsCheckedAllCategories(true)
        } else {
            setIsCheckedAllBrands(true)
            setIsCheckedAllCategories(true)
            if (query.includes('&')) {
                let arrQuerySplit = query.split('&')
                console.log(arrQuerySplit);
                arrQuerySplit.forEach((querySplit) => {
                    if (querySplit.includes('brand')) {
                        let brand = querySplit.split('=')[1].split(',')
                        console.log(brand);
                        setCheckedListBrands(brand)
                        setIsCheckedAllBrands(false)
                    }
                    if (querySplit.includes('category')) {
                        let getCategory = querySplit.split('=')[1].split(',')
                        console.log(getCategory);
                        setCheckedListCategories(getCategory)
                        setIsCheckedAllCategories(false)
                    }
                })
            } else {
                setIsCheckedAllBrands(true)
                setIsCheckedAllCategories(true)
                if (query.includes('brand')) {
                    let brand = query.split('=')[1]
                    brand = brand.split(',')
                    console.log(brand);
                    setCheckedListBrands(brand)
                    setIsCheckedAllBrands(false)
                    setIsCheckedAllCategories(true)
                } else {
                    setCheckedListBrands([])
                    setIsCheckedAllBrands(true)
                }

                if (query.includes('category')) {
                    let getCategory = query.split('=')[1]
                    getCategory = getCategory.split(',')
                    console.log(getCategory);
                    setCheckedListCategories(getCategory)
                    setIsCheckedAllCategories(false)
                    setIsCheckedAllBrands(true)
                } else {
                    setCheckedListCategories([])
                    setIsCheckedAllCategories(true)
                }

            }
        }
    }

    const getSortSelected = () => {
        // console.log(query);
        if (query.includes('sort=gia-thap-den-cao')) {
            setSortStatus('asc')
        } else if (query.includes('sort=gia-cao-den-thap')) {
            setSortStatus('desc')
        } else {
            setSortStatus(null)
        }
    }

    const getBrands = () => {
        GetBrands().then(response => {
            setBrands(response);
            setNameBrands(response.map((brand) => {
                return brand.name
            }, []))
            setBrandSlugs(response.map((brand) => {
                return brand.slug
            }, []))
        })
    }

    const getCategories = () => {
        GetCategories().then(response => {
            setCategories(response);
            setNameCategories(response.map((category) => {
                return category.name
            }, []))
        })
    }

    const getProductsByQuery = () => {
        console.log(query)
        GetProductsByQuery(query).then(response => {
            setProducts(response);
        })
    }

    const handleCheckboxChangeBrands = (e) => {
        setCheckedListBrands(e)
        console.log(e);
        let brandQuery = e.join(',')
        let categoryQuery = checkedListCategories.join(',')
        let sortQuery = query.split('sort=')[1]
        let newQuery = `/laptop/`
        if (e.length !== 0) {
            newQuery = `/laptop/brand=${brandQuery}`
        }
        console.log(brandQuery);
        console.log(categoryQuery);
        console.log(sortQuery);
        if (categoryQuery !== '' && categoryQuery !== undefined) {
            newQuery += `&category=${categoryQuery}`
        }
        if (sortQuery !== '' && sortQuery !== undefined) {
            newQuery += `&sort=${sortQuery}`
        }
        console.log(newQuery);
        navigate(newQuery)

    };

    const handleSelectAllChangeBrands = (e) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            let newQuery = '/laptop/'
            let categoryQuery = checkedListCategories.join(',')
            let sortQuery = query.split('sort=')[1]
            console.log(sortQuery);
            if (categoryQuery || sortQuery) {
                if (categoryQuery) {
                    newQuery += `category=${categoryQuery}`
                }
                if (sortQuery) {
                    newQuery += `&sort=${sortQuery}`
                }
            } else {
                newQuery += 'allproduct'
            }
            setCheckedListBrands([])
            navigate(newQuery)
        } else {

        }
    };

    const handleCheckboxChangeCategories = (e) => {

        setCheckedListCategories(e)
        console.log(e);
        let categoryQuery = e.join(',')
        let brandQuery = checkedListBrands.join(',')
        let sortQuery = query.split('sort=')[1]
        let newQuery = `/laptop/`
        if (e.length !== 0) {
            newQuery = `/laptop/category=${categoryQuery}`
        }
        console.log(brandQuery);
        console.log(categoryQuery);
        console.log(sortQuery);
        if (brandQuery !== '' && brandQuery !== undefined) {
            newQuery += `&brand=${brandQuery}`
        }
        if (sortQuery !== '' && sortQuery !== undefined) {
            newQuery += `&sort=${sortQuery}`
        }
        console.log(newQuery);
        navigate(newQuery)
    };

    const handleSelectAllChangeCategories = (e) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            let newQuery = '/laptop/'
            let brandQuery = checkedListBrands.join(',')
            let sortQuery = query.split('sort=')[1]
            console.log(sortQuery);
            if (brandQuery || sortQuery) {
                if (brandQuery) {
                    newQuery += `brand=${brandQuery}`
                }
                if (sortQuery) {
                    newQuery += `&sort=${sortQuery}`
                }
            } else {
                newQuery += 'allproduct'
            }
            setCheckedListCategories([])
            navigate(newQuery)
        } else {

        }
    };

    const handleChangeSort = (sort) => {
        console.log(query);
        let queryNotSort = query.split('&sort=')[0];
        console.log('hi123' + queryNotSort);
        if (sort === 'asc') {
            if (query.includes('allproduct')) {
                navigate('/laptop/sort=gia-thap-den-cao')
            } else if (checkedListBrands.length > 0 || checkedListCategories > 0) {
                navigate(`/laptop/${queryNotSort}&sort=gia-thap-den-cao`)

            } else {
                navigate(`/laptop/sort=gia-thap-den-cao`)

            }
        } else if (sort === 'desc') {
            if (query.includes('allproduct')) {
                navigate('/laptop/sort=gia-cao-den-thap')
            } else if (checkedListBrands.length > 0 || checkedListCategories > 0) {
                navigate(`/laptop/${queryNotSort}&sort=gia-cao-den-thap`)

            } else {
                navigate(`/laptop/sort=gia-cao-den-thap`)

            }

        } else {
            if (query.includes('&sort')) navigate(`/laptop/${queryNotSort}`)
            else navigate('/laptop/allproduct')
        }

    };

    return (
        <div className="w-10/12 m-auto">
            <Breadcrumb
                className="bc-allproduct"
                items={[
                    {
                        href: '/',
                        title: (
                            <span className="flex items-center">
                                <HomeOutlined /> Trang chủ
                            </span>
                        ),
                    },
                    {
                        title: (
                            <span className="flex items-center">
                                <LaptopOutlined className="mr-2" /> Laptop
                            </span>
                        ),
                    },
                ]}
            />

            <Row gutter={[16, 16]}>
                {/* Col for checkboxes */}
                <Col xs={24} sm={12} md={6}>
                    <CheckBoxGroup
                        tittle={'Hãng sản xuất'}
                        nameDisplay={nameBrands}
                        checkedList={checkedListBrands}
                        handleCheckboxChange={handleCheckboxChangeBrands}
                        handleSelectAllChange={handleSelectAllChangeBrands}
                        type={brands}
                        param={query}
                        isCheckedAll={isCheckedAllBrands}
                    />

                    <CheckBoxGroup

                        tittle={'Thể loại'}
                        nameDisplay={nameCategories}
                        checkedList={checkedListCategories}
                        handleCheckboxChange={handleCheckboxChangeCategories}
                        handleSelectAllChange={handleSelectAllChangeCategories}
                        type={categories}
                        isCheckedAll={isCheckedAllCategories}
                    />
                </Col>

                {/* Col for product list */}
                <Col xs={24} sm={12} md={18}>
                    <div className="product-list-section bg-white p-4 pt-0">
                        {/* Product list goes here */}
                        <div className='flex'>
                            <span className='my-4 px-3 py-1 ml-0 pl-0 '>Ưu tiên xem:</span>
                            <span
                                className={
                                    sortStatus === null
                                        ? ('my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] bg-[#cb1c22] text-white rounded-l-md')
                                        : ('my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] text-black rounded-l-md')
                                }
                                onClick={() => { handleChangeSort() }}
                            >
                                Mới nhập
                            </span>
                            <span
                                className={
                                    sortStatus === 'desc'
                                        ? ('my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] bg-[#cb1c22] text-white border-l-0')
                                        : ('my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] border-l-0')
                                }
                                onClick={() => { handleChangeSort('desc') }}
                            >
                                Giá cao
                            </span>
                            <span
                                className=
                                {
                                    sortStatus === 'asc'
                                        ? 'my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] bg-[#cb1c22] text-white border-l-0 rounded-r-md'
                                        : 'my-4 mx-0 px-3 py-1 border-[1px] border-[#bababa] border-l-0 rounded-r-md'
                                }
                                onClick={() => { handleChangeSort('asc') }}
                            >
                                Giá thấp
                            </span>
                        </div>
                        <List
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={products}
                            renderItem={(item) => (
                                <List.Item className='h-full'>
                                    <Card className=' w-[100%] h-[100%]'>
                                        {renderListProduct(item, brands)}

                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default AllProduct;
